const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getAllOrders, updateOrderToDelivered } = require('../controllers/orderController');

// User ke liye
router.post('/', addOrderItems);
router.get('/myorders/:userId', getMyOrders);

// 👑 ADMIN ke liye naye routes
router.get('/', getAllOrders); // Saare orders dekhne ke liye
router.put('/:id/deliver', updateOrderToDelivered); // Delivered mark karne ke liye

module.exports = router;