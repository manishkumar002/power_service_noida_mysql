const db = require("../config/db");

// GET ALL CATEGORIES
const getAllCategories = async () => {
  const [rows] = await db.execute(`
    SELECT
      id,
      name,
      slug,
      icon,
      description,
      categoryImage,
      isActive,
      createdAt,
      updatedAt
    FROM categories
    ORDER BY createdAt DESC
  `);

  return rows;
};

// GET ACTIVE CATEGORIES
const getActiveCategories = async () => {
  const [rows] = await db.execute(`
    SELECT
      id,
      name,
      slug,
      icon,
      description,
      categoryImage,
      isActive,
      createdAt,
      updatedAt
    FROM categories
    WHERE isActive = 1
    ORDER BY createdAt DESC
  `);

  return rows;
};

// GET CATEGORY BY ID
const getCategoryById = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      name,
      slug,
      icon,
      description,
      categoryImage,
      isActive,
      createdAt,
      updatedAt
    FROM categories
    WHERE id = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
};

// GET CATEGORY BY NAME
const getCategoryByName = async (name) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM categories
    WHERE name = ?
    LIMIT 1
    `,
    [name.trim()],
  );

  return rows[0] || null;
};

// GET CATEGORY BY SLUG
const getCategoryBySlug = async (slug) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM categories
    WHERE slug = ?
    LIMIT 1
    `,
    [slug.toLowerCase().trim()],
  );

  return rows[0] || null;
};

// CREATE CATEGORY
const createCategory = async (data) => {
  const {
    name,
    slug,
    icon = "",
    description = "",
    categoryImage = "",
    isActive = true,
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO categories
    (
      name,
      slug,
      icon,
      description,
      categoryImage,
      isActive
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, slug, icon, description, categoryImage, isActive ? 1 : 0],
  );

  return getCategoryById(result.insertId);
};

// UPDATE CATEGORY
const updateCategory = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (data.slug !== undefined) {
    fields.push("slug = ?");
    values.push(data.slug);
  }

  if (data.icon !== undefined) {
    fields.push("icon = ?");
    values.push(data.icon);
  }

  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }

  if (data.categoryImage !== undefined) {
    fields.push("categoryImage = ?");
    values.push(data.categoryImage);
  }

  if (data.isActive !== undefined) {
    fields.push("isActive = ?");
    values.push(data.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return getCategoryById(id);
  }

  values.push(id);

  await db.execute(
    `
    UPDATE categories
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values,
  );

  return getCategoryById(id);
};

// DELETE CATEGORY
const deleteCategory = async (id) => {
  const [result] = await db.execute(
    `
    DELETE FROM categories
    WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryByName,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
