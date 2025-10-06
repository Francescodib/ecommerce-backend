/**
 * Category Controller
 * Gestisce CRUD categorie
 */

const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Get tutte le categorie
 * GET /api/categories
 */
async function getAllCategories(req, res, next) {
  try {
    const categories = await query(
      'SELECT * FROM categories ORDER BY name ASC'
    );

    res.json({
      success: true,
      count: categories.length,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get categoria per ID
 * GET /api/categories/:id
 */
async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;

    const [category] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Conta prodotti nella categoria
    const [{ count }] = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = TRUE',
      [id]
    );

    res.json({
      success: true,
      data: {
        category,
        product_count: count
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Crea nuova categoria
 * POST /api/categories
 * Access: Admin only
 */
async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new AppError('Category name is required', 400);
    }

    // Verifica se categoria esiste già
    const existing = await query(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      throw new AppError('Category already exists', 409);
    }

    const result = await query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    const [newCategory] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category: newCategory }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Aggiorna categoria
 * PUT /api/categories/:id
 * Access: Admin only
 */
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Verifica se categoria esiste
    const [existing] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (!existing) {
      throw new AppError('Category not found', 404);
    }

    // Aggiorna solo campi forniti
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    values.push(id);

    await query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updated }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Elimina categoria
 * DELETE /api/categories/:id
 * Access: Admin only
 */
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    // Verifica se categoria esiste
    const [category] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Verifica se ci sono prodotti in questa categoria
    const [{ count }] = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if (count > 0) {
      throw new AppError(
        `Cannot delete category. ${count} products are still in this category`,
        409
      );
    }

    await query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
