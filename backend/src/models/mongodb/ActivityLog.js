/**
 * ActivityLog Model - MongoDB/Mongoose
 * Gestisce i log delle attività utenti
 */

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  // FK a Users (MySQL)
  userId: {
    type: Number,
    required: false,  // Può essere null per utenti anonimi
    index: true
  },

  // Tipo di azione
  action: {
    type: String,
    required: true,
    enum: [
      'view_product',
      'add_to_cart',
      'remove_from_cart',
      'add_to_wishlist',
      'remove_from_wishlist',
      'search',
      'create_order',
      'view_order',
      'login',
      'logout',
      'register',
      'update_profile',
      'add_review',
      'view_category'
    ],
    index: true
  },

  // Tipo di entità coinvolta
  entityType: {
    type: String,
    enum: ['product', 'order', 'review', 'category', 'user', 'other'],
    default: 'other'
  },

  // ID dell'entità
  entityId: {
    type: Number,
    required: false
  },

  // Metadati flessibili (oggetto libero)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // IP address
  ipAddress: {
    type: String,
    required: false
  },

  // User Agent
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false  // I log non vengono modificati
  }
});

// Indici per query efficienti
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

// Indice TTL per auto-eliminazione log vecchi (30 giorni)
// Decommentare se si vuole pulizia automatica
// activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
