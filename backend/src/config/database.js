/**
 * Configurazione MySQL Database
 * Connection pool per performance ottimali
 */

const mysql = require('mysql2/promise');

// Configurazione connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'shopsphere_user',
  password: process.env.DB_PASSWORD || 'shopsphere_pass',
  database: process.env.DB_NAME || 'shopsphere',
  waitForConnections: true,
  connectionLimit: 10,        // Massimo 10 connessioni simultanee
  queueLimit: 0,              // Nessun limite sulla coda
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test connessione MySQL
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    return false;
  }
}

/**
 * Query helper con error handling
 * @param {string} sql - Query SQL
 * @param {array} params - Parametri per query preparata
 * @returns {Promise} Risultato query
 */
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('MySQL Query Error:', error.message);
    throw error;
  }
}

/**
 * Chiudi tutte le connessioni (per graceful shutdown)
 */
async function closePool() {
  try {
    await pool.end();
    console.log('✅ MySQL pool closed');
  } catch (error) {
    console.error('❌ Error closing MySQL pool:', error.message);
  }
}

module.exports = {
  pool,
  query,
  testConnection,
  closePool
};
