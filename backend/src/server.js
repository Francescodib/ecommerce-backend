/**
 * ShopSphere Backend Server
 * Express API per gestione e-commerce
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import configurazioni
const { testConnection: testMySQL, closePool } = require('./config/database');
const { connectMongoDB, disconnectMongoDB } = require('./config/mongodb');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
// const userRoutes = require('./routes/users');

// Inizializza Express
const app = express();
const PORT = process.env.PORT || 3000;

// ====================
// MIDDLEWARES
// ====================

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ====================
// ROUTES
// ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ShopSphere API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'ShopSphere API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      reviews: '/api/reviews'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);

// ====================
// ERROR HANDLING
// ====================

// 404 handler
app.use(notFound);

// Error handler (deve essere l'ultimo)
app.use(errorHandler);

// ====================
// SERVER STARTUP
// ====================

async function startServer() {
  try {
    // Test connessioni database
    console.log('🔌 Testing database connections...\n');

    const mysqlOk = await testMySQL();
    const mongoOk = await connectMongoDB();

    if (!mysqlOk || !mongoOk) {
      console.error('\n❌ Database connection failed. Exiting...');
      process.exit(1);
    }

    console.log('');

    // Avvia server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API available at: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown - Chiude connessioni pulitamente
 */
async function gracefulShutdown(server) {
  console.log('\n⚠️  Shutting down gracefully...');

  // Chiudi server HTTP
  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  // Chiudi database connections
  try {
    await closePool();
    await disconnectMongoDB();
    console.log('✅ All database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Avvia server
startServer();

module.exports = app;
