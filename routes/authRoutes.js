const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP } = require('../controllers/authController');

// Jab koi naya account banayega
router.post('/register', registerUser);

// NAYA: Jab koi apna OTP verify karega
router.post('/verify-otp', verifyOTP);

// Jab koi login karega
router.post('/login', loginUser);

module.exports = router;