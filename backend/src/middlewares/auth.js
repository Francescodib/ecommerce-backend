/**
 * Authentication Middleware
 * Verifica JWT token e autorizzazioni
 */

const { verifyToken } = require('../config/jwt');
const { AppError } = require('./errorHandler');

/**
 * Middleware per verificare JWT token
 * Estrae il token dall'header Authorization e verifica validità
 */
function authenticateToken(req, res, next) {
  try {
    // Estrai token dall'header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Verifica token
    const decoded = verifyToken(token);

    // Aggiungi dati user alla request per uso nei controller
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.message === 'Token expired') {
      return next(new AppError('Token expired', 401));
    }
    if (error.message === 'Invalid token') {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
}

/**
 * Middleware per verificare ruoli utente
 * @param {...string} allowedRoles - Ruoli autorizzati (es. 'admin', 'seller')
 * @returns {function} Middleware function
 *
 * Uso:
 * router.delete('/products/:id', authenticateToken, checkRole('admin'), deleteProduct);
 */
function checkRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware per verificare che l'utente sia proprietario della risorsa
 * Controlla che req.user.id === parametro userId
 * @param {string} userIdParam - Nome del parametro nella request (default: 'userId')
 */
function checkOwnership(userIdParam = 'userId') {
  return (req, res, next) => {
    try {
      const resourceUserId = parseInt(req.params[userIdParam] || req.body[userIdParam]);

      if (!resourceUserId) {
        throw new AppError('User ID not found in request', 400);
      }

      // Admin può accedere a tutto
      if (req.user.role === 'admin') {
        return next();
      }

      // Altrimenti deve essere il proprietario
      if (req.user.id !== resourceUserId) {
        throw new AppError('Access denied. You can only access your own resources', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware opzionale per auth (non richiede token ma lo verifica se presente)
 * Utile per endpoint pubblici che hanno funzionalità extra per utenti loggati
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Nessun token, continua senza autenticazione
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    // Token non valido, ignora e continua
    console.warn('Invalid token in optional auth:', error.message);
  }

  next();
}

module.exports = {
  authenticateToken,
  checkRole,
  checkOwnership,
  optionalAuth
};
