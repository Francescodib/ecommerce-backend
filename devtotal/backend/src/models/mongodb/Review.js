/**
 * Review Model - MongoDB/Mongoose
 * Gestisce le recensioni dei prodotti
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // FK a Products (MySQL)
  productId: {
    type: Number,
    required: true,
    index: true
  },

  // FK a Users (MySQL)
  userId: {
    type: Number,
    required: true,
    index: true
  },

  // FK a Orders (MySQL) - verifica acquisto
  orderId: {
    type: Number,
    required: false,
    index: true
  },

  // Rating 1-5 stelle
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  // Titolo recensione
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },

  // Commento esteso
  comment: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },

  // Punti di forza (array)
  pros: [{
    type: String,
    maxlength: 200
  }],

  // Punti deboli (array)
  cons: [{
    type: String,
    maxlength: 200
  }],

  // Acquisto verificato
  verifiedPurchase: {
    type: Boolean,
    default: false
  },

  // Contatore utilità (quante persone hanno trovato utile)
  helpful: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true  // Aggiunge createdAt e updatedAt automaticamente
});

// Indice composto per query efficienti
reviewSchema.index({ productId: 1, createdAt: -1 });

// Indice per full-text search
reviewSchema.index({ title: 'text', comment: 'text' });

// Metodo virtuale per ottenere età recensione in giorni
reviewSchema.virtual('daysAgo').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Metodo per incrementare helpful counter
reviewSchema.methods.incrementHelpful = function() {
  this.helpful += 1;
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);
