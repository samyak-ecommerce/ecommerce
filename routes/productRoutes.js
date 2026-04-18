const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, seedProducts } = require('../controllers/productController');

// 🌟 NAYA: Seed route (Is route ko hamesha upar rakhna chahiye)
router.get('/seed', seedProducts);

// Jab koi GET request karega
router.get('/', getProducts);

// Jab koi POST request karega
router.post('/', createProduct);

// Jab koi PUT request karega (Saman Edit/Update karne ke liye)
router.put('/:id', updateProduct);

module.exports = router;