const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserOrders,
  getUserAddresses
} = require('../controllers/userController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Tutte le routes richiedono autenticazione
router.use(authenticateToken);

// Admin routes - Lista tutti gli utenti
router.get('/', checkRole('admin'), getAllUsers);

// User routes con ownership check implementato nel controller
router.get('/:id', getUserById);                    // Self o admin
router.put('/:id', updateUser);                     // Self o admin
router.delete('/:id', deleteUser);                  // Self o admin

// User related data
router.get('/:id/orders', getUserOrders);           // Self o admin
router.get('/:id/addresses', getUserAddresses);     // Self o admin

module.exports = router;
