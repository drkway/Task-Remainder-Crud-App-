const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/authController');

router.post('/request-otp', authLimiter, [body('email').isEmail()], validate, ctrl.requestOTP);
router.post('/verify-otp', authLimiter, [body('email').isEmail(), body('code').isLength({ min: 6, max: 6 })], validate, ctrl.verifyOTP);
router.post('/refresh', ctrl.refresh);
router.post('/revoke', ctrl.revoke);

module.exports = router;
