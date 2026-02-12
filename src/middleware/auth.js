const { verifyAccess } = require('../utils/jwt');
const db = require('../models');

module.exports = async (req, res, next) => {
  try {
    const auth = req.header('authorization');
    if (!auth) return res.status(401).json({ error: 'Missing auth token' });
    const parts = auth.split(' ');
    if (parts.length !== 2) return res.status(401).json({ error: 'Invalid auth header' });
    const token = parts[1];
    const payload = verifyAccess(token);
    const user = await db.User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', details: err.message });
  }
};
