/**
 * Category Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @route   GET /api/categories
 * @desc    Get tutte le categorie
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get categoria per ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Crea nuova categoria
 * @access  Private/Admin
 */
router.post('/', authenticateToken, checkRole('admin'), createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Aggiorna categoria
 * @access  Private/Admin
 */
router.put('/:id', authenticateToken, checkRole('admin'), updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Elimina categoria
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, checkRole('admin'), deleteCategory);

module.exports = router;
