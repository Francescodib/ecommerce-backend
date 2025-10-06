/**
 * Auth Controller
 * Gestisce registrazione e login utenti
 */

const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { generateToken } = require('../config/jwt');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Registrazione nuovo utente
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { first_name, last_name, email, password, phone, role } = req.body;

    // Validazione input
    if (!first_name || !last_name || !email || !password) {
      throw new AppError('Missing required fields: first_name, last_name, email, password', 400);
    }

    // Valida formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    // Valida lunghezza password
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // Verifica se email esiste già
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Inserisci utente (default role: customer)
    const userRole = role && ['customer', 'admin', 'seller'].includes(role) ? role : 'customer';

    const result = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password_hash, phone || null, userRole]
    );

    const userId = result.insertId;

    // Recupera utente creato (senza password)
    const [newUser] = await query(
      `SELECT id, first_name, last_name, email, phone, role, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    // Genera JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login utente
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validazione input
    if (!email || !password) {
      throw new AppError('Email and password required', 400);
    }

    // Trova utente per email
    const [user] = await query(
      `SELECT id, first_name, last_name, email, password_hash, phone, role, created_at
       FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verifica password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Genera JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Rimuovi password_hash dalla risposta
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get profilo utente corrente (richiede auth)
 * GET /api/auth/me
 */
async function getProfile(req, res, next) {
  try {
    // req.user viene popolato dal middleware authenticateToken
    const [user] = await query(
      `SELECT id, first_name, last_name, email, phone, role, created_at, updated_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile
};
