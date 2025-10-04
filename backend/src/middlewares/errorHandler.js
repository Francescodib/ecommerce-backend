/**
 * Error Handler Middleware
 * Gestione centralizzata degli errori
 */

/**
 * Middleware per gestione errori
 * Deve essere l'ultimo middleware registrato
 */
function errorHandler(err, req, res, next) {
  // Log errore per debugging
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // Determina status code (default 500)
  const statusCode = err.statusCode || 500;

  // Prepara risposta errore
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  // Invia risposta
  res.status(statusCode).json(response);
}

/**
 * Middleware per route non trovate (404)
 */
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Helper per creare errori custom
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFound,
  AppError
};
