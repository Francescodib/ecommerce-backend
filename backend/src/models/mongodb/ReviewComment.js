/**
 * ReviewComment Model - MongoDB/Mongoose
 * Gestisce i commenti alle recensioni
 */

const mongoose = require('mongoose');

const reviewCommentSchema = new mongoose.Schema({
  // FK a Review (MongoDB)
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
    index: true
  },

  // FK a Users (MySQL)
  userId: {
    type: Number,
    required: true,
    index: true
  },

  // Testo commento
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  }
}, {
  timestamps: true
});

// Indice per recuperare commenti di una recensione
reviewCommentSchema.index({ reviewId: 1, createdAt: 1 });

module.exports = mongoose.model('ReviewComment', reviewCommentSchema);
