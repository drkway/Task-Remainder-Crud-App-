const db = require('../models');
const { sendOTP } = require('../utils/mail');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.requestOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = await db.User.findOne({ where: { email } });
    if (!user) user = await db.User.create({ email });

    const code = generateCode();
    const ttlMin = Number(process.env.OTP_TTL_MIN || 5);
    const otp = await db.OTP.create({
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + ttlMin * 60 * 1000)
    });
    await sendOTP(email, code);
    await db.ActivityLog.create({ userId: user.id, type: 'auth:otp_requested', message: `OTP sent to ${email}` });
    res.json({ ok: true });
  } catch (err) { next(err); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or code' });

    const otp = await db.OTP.findOne({ where: { userId: user.id, code, used: false, expiresAt: { [Op.gt]: new Date() } } });
    if (!otp) return res.status(400).json({ error: 'Invalid or expired code' });

    otp.used = true; await otp.save();

    const access = signAccess({ id: user.id, email: user.email });
    const refreshPlain = crypto.randomBytes(48).toString('hex');
    const tokenHash = await bcrypt.hash(refreshPlain, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await db.RefreshToken.create({ userId: user.id, tokenHash, expiresAt });
    await db.ActivityLog.create({ userId: user.id, type: 'auth:login', message: 'User logged in via OTP' });
    res.json({ access, refresh: refreshPlain });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refresh } = req.body;
    if (!refresh) return res.status(400).json({ error: 'Missing refresh token' });
    const tokens = await db.RefreshToken.findAll({ where: { revoked: false } });
    // naive: search for matching hash
    let found = null;
    for (const t of tokens) {
      const match = await bcrypt.compare(refresh, t.tokenHash);
      if (match && t.expiresAt > new Date()) { found = t; break; }
    }
    if (!found) return res.status(401).json({ error: 'Invalid refresh' });
    const user = await db.User.findByPk(found.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    const access = signAccess({ id: user.id, email: user.email });
    res.json({ access });
  } catch (err) { next(err); }
};

exports.revoke = async (req, res, next) => {
  try {
    const { refresh } = req.body;
    if (!refresh) return res.status(400).json({ error: 'Missing refresh token' });
    const tokens = await db.RefreshToken.findAll({ where: { revoked: false } });
    for (const t of tokens) {
      const match = await bcrypt.compare(refresh, t.tokenHash);
      if (match) { t.revoked = true; await t.save(); }
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
};
