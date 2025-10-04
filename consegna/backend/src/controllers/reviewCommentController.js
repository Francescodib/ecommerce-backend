const ReviewComment = require('../models/mongodb/ReviewComment');
const Review = require('../models/mongodb/Review');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Get all comments for a review
 * GET /api/reviews/:reviewId/comments
 */
async function getReviewComments(req, res, next) {
  try {
    const { reviewId } = req.params;

    // Verifica review esista
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const comments = await ReviewComment.find({ reviewId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: { comments }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a comment on a review
 * POST /api/reviews/:reviewId/comments
 */
async function createComment(req, res, next) {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      throw new AppError('Comment text is required', 400);
    }

    // Verifica review esista
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    const newComment = new ReviewComment({
      reviewId,
      userId: parseInt(userId),
      comment: comment.trim()
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: { comment: newComment }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a comment
 * PUT /api/comments/:id
 */
async function updateComment(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      throw new AppError('Comment text is required', 400);
    }

    const existingComment = await ReviewComment.findById(id);
    if (!existingComment) {
      throw new AppError('Comment not found', 404);
    }

    // Ownership check
    if (existingComment.userId !== userId && req.user.role !== 'admin') {
      throw new AppError('You can only update your own comments', 403);
    }

    existingComment.comment = comment.trim();
    await existingComment.save();

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: existingComment }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await ReviewComment.findById(id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Ownership check
    if (comment.userId !== userId && req.user.role !== 'admin') {
      throw new AppError('You can only delete your own comments', 403);
    }

    await ReviewComment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReviewComments,
  createComment,
  updateComment,
  deleteComment
};
