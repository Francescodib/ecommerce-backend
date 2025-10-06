const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  searchReviews,
  getUserReviews
} = require('../controllers/reviewController');
const {
  getReviewComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/reviewCommentController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

// Public routes (no auth required)
router.get('/search', searchReviews);

// Review routes
router.get('/:id', getReviewById);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);
router.post('/:id/helpful', markHelpful);

// Comments routes
router.get('/:reviewId/comments', getReviewComments);
router.post('/:reviewId/comments', authenticateToken, createComment);

// Comment update/delete (con :id del comment, non reviewId)
router.put('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;
