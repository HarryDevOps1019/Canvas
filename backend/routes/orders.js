const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  checkout,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');

// Checkout - Create order (Protected)
router.post('/checkout', auth, checkout);

// Get all orders of logged-in user (Protected)
router.get('/my-orders', auth, getMyOrders);

// Get single order by ID (Protected)
router.get('/:id', auth, getOrderById);

module.exports = router;
