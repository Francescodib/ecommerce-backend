/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopSellingProducts,
  getProductsByCategory
} = require('../controllers/productController');
const {
  getProductReviews,
  createReview
} = require('../controllers/reviewController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @route   GET /api/products/top-selling
 * @desc    Get prodotti più venduti (Query complessa SQL)
 * @access  Public
 * IMPORTANTE: Questa route deve essere PRIMA di /:id per evitare conflitti
 */
router.get('/top-selling', getTopSellingProducts);

/**
 * @route   GET /api/products
 * @desc    Get tutti i prodotti con filtri opzionali
 * @query   category, minPrice, maxPrice, search, isActive, limit, offset
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Get prodotti per categoria
 * @access  Public
 */
router.get('/category/:categoryId', getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get prodotto per ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   GET /api/products/:productId/reviews
 * @desc    Get recensioni prodotto
 * @access  Public
 */
router.get('/:productId/reviews', getProductReviews);

/**
 * @route   POST /api/products/:productId/reviews
 * @desc    Crea recensione per prodotto
 * @access  Private
 */
router.post('/:productId/reviews', authenticateToken, createReview);

/**
 * @route   POST /api/products
 * @desc    Crea nuovo prodotto
 * @access  Private/Admin
 */
router.post('/', authenticateToken, checkRole('admin'), createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Aggiorna prodotto
 * @access  Private/Admin
 */
router.put('/:id', authenticateToken, checkRole('admin'), updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Elimina prodotto
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, checkRole('admin'), deleteProduct);

module.exports = router;
