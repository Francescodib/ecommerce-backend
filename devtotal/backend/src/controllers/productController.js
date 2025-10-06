/**
 * Product Controller
 * Gestisce CRUD prodotti con filtri e query complesse
 */

const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Get tutti i prodotti con filtri opzionali
 * GET /api/products?category=1&minPrice=100&maxPrice=500&search=iphone&limit=10&offset=0
 */
async function getAllProducts(req, res, next) {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      isActive,
      limit = 20,
      offset = 0
    } = req.query;

    // Build query dinamica
    let sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filtro categoria
    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }

    // Filtro prezzo minimo
    if (minPrice) {
      sql += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }

    // Filtro prezzo massimo
    if (maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Search in nome e descrizione
    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Filtro attivi/disattivi
    if (isActive !== undefined) {
      sql += ' AND p.is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }

    // Count totale (prima di limit/offset)
    const countSql = sql.replace(
      'SELECT p.*, c.name as category_name',
      'SELECT COUNT(*) as total'
    );
    const [{ total }] = await query(countSql, params);

    // Ordinamento e paginazione
    // IMPORTANTE: LIMIT e OFFSET non possono essere parametri preparati in mysql2
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20)); // Min 1, Max 100
    const safeOffset = Math.max(0, parseInt(offset) || 0);
    sql += ` ORDER BY p.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const products = await query(sql, params);

    res.json({
      success: true,
      count: products.length,
      total,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get prodotto per ID
 * GET /api/products/:id
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    const [product] = await query(
      `SELECT p.*, c.name as category_name, c.description as category_description
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crea nuovo prodotto
 * POST /api/products
 * Access: Admin only
 */
async function createProduct(req, res, next) {
  try {
    const {
      category_id,
      name,
      description,
      price,
      stock_quantity,
      img_url,
      is_active
    } = req.body;

    // Validazioni
    if (!category_id || !name || !description || !price) {
      throw new AppError('Missing required fields: category_id, name, description, price', 400);
    }

    // Verifica che categoria esista
    const [category] = await query(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Validazione prezzo
    if (price < 0) {
      throw new AppError('Price must be positive', 400);
    }

    // Insert prodotto
    const result = await query(
      `INSERT INTO products
       (category_id, name, description, price, stock_quantity, img_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        description,
        parseFloat(price),
        stock_quantity || 0,
        img_url || null,
        is_active !== undefined ? is_active : true
      ]
    );

    const [newProduct] = await query(
      `SELECT p.*, c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: newProduct }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Aggiorna prodotto
 * PUT /api/products/:id
 * Access: Admin only
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      description,
      price,
      stock_quantity,
      img_url,
      is_active
    } = req.body;

    // Verifica esistenza prodotto
    const [existing] = await query('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    // Build update query dinamica
    const updates = [];
    const values = [];

    if (category_id) {
      // Verifica categoria esista
      const [category] = await query('SELECT id FROM categories WHERE id = ?', [category_id]);
      if (!category) throw new AppError('Category not found', 404);
      updates.push('category_id = ?');
      values.push(category_id);
    }
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description) {
      updates.push('description = ?');
      values.push(description);
    }
    if (price !== undefined) {
      if (price < 0) throw new AppError('Price must be positive', 400);
      updates.push('price = ?');
      values.push(parseFloat(price));
    }
    if (stock_quantity !== undefined) {
      updates.push('stock_quantity = ?');
      values.push(parseInt(stock_quantity));
    }
    if (img_url !== undefined) {
      updates.push('img_url = ?');
      values.push(img_url);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id);

    await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await query(
      `SELECT p.*, c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updated }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Elimina prodotto
 * DELETE /api/products/:id
 * Access: Admin only
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const [product] = await query('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Verifica se prodotto è in ordini
    const [{ count }] = await query(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
      [id]
    );

    if (count > 0) {
      throw new AppError(
        `Cannot delete product. It is referenced in ${count} orders. Consider setting is_active to false instead.`,
        409
      );
    }

    await query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get prodotti più venduti (Query complessa SQL)
 * GET /api/products/top-selling?limit=10
 */
async function getTopSellingProducts(req, res, next) {
  try {
    const { limit = 10 } = req.query;

    // IMPORTANTE: LIMIT non può essere parametro preparato in mysql2
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Min 1, Max 100

    // Query complessa con JOIN e GROUP BY
    const products = await query(
      `SELECT
        p.id,
        p.name,
        p.price,
        p.img_url,
        c.name as category_name,
        SUM(oi.quantity) as total_sold,
        COUNT(DISTINCT oi.order_id) as total_orders,
        SUM(oi.subtotal) as total_revenue
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN order_items oi ON p.id = oi.product_id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT ${safeLimit}`
    );

    res.json({
      success: true,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get prodotti per categoria
 * GET /api/products/category/:categoryId
 */
async function getProductsByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Verifica categoria esista
    const [category] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // IMPORTANTE: LIMIT e OFFSET non possono essere parametri preparati in mysql2
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const safeOffset = Math.max(0, parseInt(offset) || 0);

    const products = await query(
      `SELECT p.*, c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.is_active = TRUE
       ORDER BY p.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      [categoryId]
    );

    res.json({
      success: true,
      category,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopSellingProducts,
  getProductsByCategory
};
