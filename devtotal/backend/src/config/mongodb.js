/**
 * Configurazione MongoDB Connection
 * Connessione Mongoose per gestione NoSQL
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';

/**
 * Connetti a MongoDB
 */
async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      // Opzioni consigliate per Mongoose 7+
      serverSelectionTimeoutMS: 5000,  // Timeout dopo 5 secondi
    });

    console.log('✅ MongoDB connected successfully');

    // Event listeners per monitoraggio connessione
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

/**
 * Disconnetti MongoDB (graceful shutdown)
 */
async function disconnectMongoDB() {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error.message);
  }
}

/**
 * Verifica stato connessione
 */
function isConnected() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  isConnected,
  mongoose
};
