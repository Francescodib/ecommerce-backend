const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');
const bcrypt = require('bcrypt');

/**
 * Get user profile by ID
 * GET /api/users/:id
 * Utente può vedere solo il proprio profilo, admin può vedere tutti
 */
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Ownership check: user può vedere solo se stesso, admin può vedere tutti
    if (requesterRole !== 'admin' && parseInt(id) !== requesterId) {
      throw new AppError('You can only view your own profile', 403);
    }

    const [user] = await query(
      `SELECT id, first_name, last_name, email, phone, role, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * PUT /api/users/:id
 * Utente può aggiornare solo il proprio profilo (escluso role)
 * Admin può aggiornare tutto incluso role
 */
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    const { first_name, last_name, email, phone, password, role } = req.body;

    // Ownership check
    if (requesterRole !== 'admin' && parseInt(id) !== requesterId) {
      throw new AppError('You can only update your own profile', 403);
    }

    // Solo admin può cambiare role
    if (role && requesterRole !== 'admin') {
      throw new AppError('Only admins can change user roles', 403);
    }

    // Verifica utente esista
    const [existingUser] = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Costruisci update dinamico
    const updates = [];
    const params = [];

    if (first_name) {
      updates.push('first_name = ?');
      params.push(first_name);
    }
    if (last_name) {
      updates.push('last_name = ?');
      params.push(last_name);
    }
    if (email) {
      // Verifica email non già in uso da altro utente
      const [emailExists] = await query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (emailExists) {
        throw new AppError('Email already in use', 400);
      }
      updates.push('email = ?');
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (password) {
      // Hash nuova password
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      params.push(hashedPassword);
    }
    if (role && requesterRole === 'admin') {
      if (!['customer', 'admin', 'seller'].includes(role)) {
        throw new AppError('Invalid role. Must be: customer, admin, or seller', 400);
      }
      updates.push('role = ?');
      params.push(role);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    params.push(id);

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Recupera utente aggiornato (senza password_hash)
    const [updatedUser] = await query(
      `SELECT id, first_name, last_name, email, phone, role, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users (Admin only)
 * GET /api/users?role=customer&limit=20&offset=0
 */
async function getAllUsers(req, res, next) {
  try {
    const { role, limit = 20, offset = 0 } = req.query;

    let sql = 'SELECT id, first_name, last_name, email, phone, role, created_at FROM users';
    const params = [];

    if (role) {
      if (!['customer', 'admin', 'seller'].includes(role)) {
        throw new AppError('Invalid role filter', 400);
      }
      sql += ' WHERE role = ?';
      params.push(role);
    }

    // Count totale
    const countSql = sql.replace('SELECT id, first_name, last_name, email, phone, role, created_at FROM users', 'SELECT COUNT(*) as total FROM users');
    const [{ total }] = await query(countSql, params);

    // LIMIT e OFFSET - safe interpolation
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const safeOffset = Math.max(0, parseInt(offset) || 0);

    sql += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const users = await query(sql, params);

    res.json({
      success: true,
      count: users.length,
      total,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user (Admin only o self-delete)
 * DELETE /api/users/:id
 * Verifica che l'utente non abbia ordini pendenti
 */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Solo admin o l'utente stesso può eliminare
    if (requesterRole !== 'admin' && parseInt(id) !== requesterId) {
      throw new AppError('You can only delete your own account', 403);
    }

    // Verifica utente esista
    const [user] = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verifica ordini pendenti
    const [orderCount] = await query(
      `SELECT COUNT(*) as count FROM orders
       WHERE user_id = ? AND status IN ('pending', 'confirmed', 'processing')`,
      [id]
    );

    if (orderCount.count > 0) {
      throw new AppError(
        `Cannot delete user. User has ${orderCount.count} pending orders. Please complete or cancel them first.`,
        409
      );
    }

    // Elimina utente (CASCADE eliminerà addresses, wishlists, ecc.)
    await query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's orders (Query complessa)
 * GET /api/users/:id/orders
 * Utente può vedere solo i propri ordini, admin può vedere tutti
 */
async function getUserOrders(req, res, next) {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Ownership check
    if (requesterRole !== 'admin' && parseInt(id) !== requesterId) {
      throw new AppError('You can only view your own orders', 403);
    }

    // Query complessa con JOIN per ottenere ordini completi
    const orders = await query(
      `SELECT
        o.id,
        o.status,
        o.total_amount,
        o.order_date,
        o.notes,
        p.payment_method,
        p.status as payment_status,
        p.payment_date,
        p.transaction_id,
        s.tracking_number,
        s.carrier,
        s.shipping_method,
        s.status as shipping_status,
        s.shipped_date,
        s.delivery_date,
        COUNT(oi.id) as items_count,
        SUM(oi.quantity) as total_items
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       LEFT JOIN shippings s ON o.id = s.order_id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id, p.id, s.id
       ORDER BY o.order_date DESC`,
      [id]
    );

    // Per ogni ordine, recupera i dettagli items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await query(
          `SELECT
            oi.id,
            oi.product_id,
            oi.quantity,
            oi.unit_price,
            oi.subtotal,
            p.name as product_name,
            p.img_url as product_image
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );

        return {
          ...order,
          items
        };
      })
    );

    res.json({
      success: true,
      count: ordersWithItems.length,
      data: { orders: ordersWithItems }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's addresses
 * GET /api/users/:id/addresses
 */
async function getUserAddresses(req, res, next) {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Ownership check
    if (requesterRole !== 'admin' && parseInt(id) !== requesterId) {
      throw new AppError('You can only view your own addresses', 403);
    }

    const addresses = await query(
      `SELECT * FROM addresses
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      count: addresses.length,
      data: { addresses }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserOrders,
  getUserAddresses
};
