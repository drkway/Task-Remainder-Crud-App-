const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTP = async (to, code) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Your OTP code',
    text: `Your OTP code is: ${code}. It expires soon.`
  });
  return info;
};

module.exports = { sendOTP };
