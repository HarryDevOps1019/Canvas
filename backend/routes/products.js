const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
} = require('../controllers/productController');

// Get all products with filters and pagination
router.get('/', getAllProducts);

// Get featured products
router.get('/featured', getFeaturedProducts);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get single product by ID
router.get('/:id', getProductById);

module.exports = router;
