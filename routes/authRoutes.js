const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP, addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/authController');
// Jab koi naya account banayega
router.post('/register', registerUser);

// NAYA: Jab koi apna OTP verify karega
router.post('/verify-otp', verifyOTP);

// Jab koi login karega
router.post('/login', loginUser);

// --- WISHLIST KE NAYE RASTE ---
// 1. Wishlist mein daalne ke liye
router.post('/wishlist/add', addToWishlist);

// 2. Wishlist se nikalne ke liye
router.post('/wishlist/remove', removeFromWishlist);

// 3. Apni Wishlist dekhne ke liye
router.get('/wishlist/:userId', getWishlist);

module.exports = router;