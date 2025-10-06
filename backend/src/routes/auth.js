/**
 * Auth Routes
 * Endpoints per autenticazione
 */

const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Registra nuovo utente
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login utente
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get profilo utente corrente
 * @access  Private
 */
router.get('/me', authenticateToken, getProfile);

module.exports = router;
