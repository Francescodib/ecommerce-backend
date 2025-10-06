const Review = require('../models/mongodb/Review');
const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Get all reviews for a product
 * GET /api/products/:productId/reviews?limit=20&offset=0&sort=recent
 */
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;
    const {
      limit = 20,
      offset = 0,
      sort = 'recent',
      minRating,
      maxRating
    } = req.query;

    // Verifica prodotto esista
    const [product] = await query('SELECT id, name FROM products WHERE id = ?', [productId]);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Build query
    const filter = { productId: parseInt(productId) };

    if (minRating) filter.rating = { $gte: parseInt(minRating) };
    if (maxRating) filter.rating = { ...filter.rating, $lte: parseInt(maxRating) };

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOption = { helpful: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const safeOffset = Math.max(0, parseInt(offset) || 0);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort(sortOption)
        .limit(safeLimit)
        .skip(safeOffset),
      Review.countDocuments(filter)
    ]);

    // Calcola statistiche reviews
    const stats = await Review.aggregate([
      { $match: { productId: parseInt(productId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      product: {
        id: product.id,
        name: product.name
      },
      count: reviews.length,
      total,
      stats: stats[0] || {
        avgRating: 0,
        totalReviews: 0,
        rating5: 0,
        rating4: 0,
        rating3: 0,
        rating2: 0,
        rating1: 0
      },
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single review by ID
 * GET /api/reviews/:id
 */
async function getReviewById(req, res, next) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new review
 * POST /api/products/:productId/reviews
 * User deve aver acquistato il prodotto (verifiedPurchase)
 */
async function createReview(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const { rating, title, comment, pros, cons, orderId } = req.body;

    // Validazioni
    if (!rating || !title || !comment) {
      throw new AppError('Rating, title and comment are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    // Verifica prodotto esista
    const [product] = await query('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Verifica se user ha già recensito questo prodotto
    const existingReview = await Review.findOne({
      productId: parseInt(productId),
      userId: parseInt(userId)
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this product', 409);
    }

    // Se orderId fornito, verifica che l'ordine sia dell'utente e contenga il prodotto
    let verifiedPurchase = false;
    if (orderId) {
      const [orderItem] = await query(
        `SELECT oi.* FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ?`,
        [orderId, userId, productId]
      );

      if (orderItem) {
        verifiedPurchase = true;
      }
    }

    // Crea review
    const review = new Review({
      productId: parseInt(productId),
      userId: parseInt(userId),
      orderId: orderId ? parseInt(orderId) : null,
      rating: parseInt(rating),
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      verifiedPurchase,
      helpful: 0
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update review
 * PUT /api/reviews/:id
 * Solo l'autore può aggiornare
 */
async function updateReview(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, title, comment, pros, cons } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Ownership check
    if (review.userId !== userId && req.user.role !== 'admin') {
      throw new AppError('You can only update your own reviews', 403);
    }

    // Update campi
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }
      review.rating = rating;
    }
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;

    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete review
 * DELETE /api/reviews/:id
 * Solo l'autore o admin
 */
async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Ownership check
    if (review.userId !== userId && req.user.role !== 'admin') {
      throw new AppError('You can only delete your own reviews', 403);
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mark review as helpful
 * POST /api/reviews/:id/helpful
 */
async function markHelpful(req, res, next) {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Search reviews (Full-text search)
 * GET /api/reviews/search?q=excellent&productId=1&limit=20
 */
async function searchReviews(req, res, next) {
  try {
    const { q, productId, limit = 20, offset = 0 } = req.query;

    if (!q || q.trim().length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    const filter = {
      $text: { $search: q }
    };

    if (productId) {
      filter.productId = parseInt(productId);
    }

    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const safeOffset = Math.max(0, parseInt(offset) || 0);

    const [reviews, total] = await Promise.all([
      Review.find(filter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(safeLimit)
        .skip(safeOffset),
      Review.countDocuments(filter)
    ]);

    res.json({
      success: true,
      query: q,
      count: reviews.length,
      total,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's reviews
 * GET /api/users/:userId/reviews
 */
async function getUserReviews(req, res, next) {
  try {
    const { userId } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Ownership check
    if (requesterRole !== 'admin' && parseInt(userId) !== requesterId) {
      throw new AppError('You can only view your own reviews', 403);
    }

    const reviews = await Review.find({ userId: parseInt(userId) })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProductReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  searchReviews,
  getUserReviews
};
