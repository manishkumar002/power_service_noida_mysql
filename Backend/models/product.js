const db = require("../config/db");

const parseImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }
  return [];
};

const mapProductRow = (row, specs = []) => {
  const category =
    row.category_id != null
      ? {
          id: row.category_id,
          name: row.category_name || "",
          slug: row.category_slug || "",
          icon: row.category_icon || "",
          description: row.category_description || "",
        }
      : null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    priceUnit: row.priceUnit,
    category_id: row.category_id,
    category,
    technicalDetails: row.technicalDetails,
    minOrderQuantity: row.minOrderQuantity,
    images: parseImages(row.images),
    brochure: row.brochure || "",
    isActive: Boolean(row.isActive),
    isFeatured: Boolean(row.isFeatured),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    specs,
  };
};

const attachSpecsToProducts = async (products) => {
  if (!products.length) return products;

  const ids = products.map((p) => p.id);
  const placeholders = ids.map(() => "?").join(", ");

  const [specRows] = await db.execute(
    `
    SELECT
      id,
      product_id,
      \`key\`,
      \`value\`
    FROM product_specs
    WHERE product_id IN (${placeholders})
    ORDER BY id ASC
    `,
    ids,
  );

  const specsByProduct = {};

  for (const spec of specRows) {
    if (!specsByProduct[spec.product_id]) {
      specsByProduct[spec.product_id] = [];
    }

    specsByProduct[spec.product_id].push({
      id: spec.id,
      key: spec.key,
      value: spec.value,
    });
  }

  return products.map((product) =>
    mapProductRow(product, specsByProduct[product.id] || []),
  );
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getAllProducts = async (filter = {}) => {
  let query = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.priceUnit,
      p.category_id,
      p.technicalDetails,
      p.minOrderQuantity,
      p.images,
      p.brochure,
      p.isActive,
      p.isFeatured,
      p.createdAt,
      p.updatedAt,

      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      c.icon AS category_icon,
      c.description AS category_description

    FROM products p

    LEFT JOIN categories c
      ON p.category_id = c.id

    WHERE 1 = 1
  `;

  const params = [];

  // Filter by category
  if (filter.category_id) {
    query += ` AND p.category_id = ?`;
    params.push(filter.category_id);
  }

  // Filter active
  if (filter.isActive !== undefined) {
    query += ` AND p.isActive = ?`;
    params.push(filter.isActive ? 1 : 0);
  }

  // Filter featured
  if (filter.isFeatured !== undefined) {
    query += ` AND p.isFeatured = ?`;
    params.push(filter.isFeatured ? 1 : 0);
  }

  if (filter.search) {
    const term = `%${filter.search}%`;
    query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.slug LIKE ?)`;
    params.push(term, term, term);
  }

  query += ` ORDER BY p.createdAt DESC`;

  const [rows] = await db.execute(query, params);

  return attachSpecsToProducts(rows);
};

// ==========================================
// GET PRODUCT BY ID
// ==========================================
const getProductById = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.priceUnit,
      p.category_id,
      p.technicalDetails,
      p.minOrderQuantity,
      p.images,
      p.brochure,
      p.isActive,
      p.isFeatured,
      p.createdAt,
      p.updatedAt,

      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      c.icon AS category_icon,
      c.description AS category_description

    FROM products p

    LEFT JOIN categories c
      ON p.category_id = c.id

    WHERE p.id = ?

    LIMIT 1
    `,
    [id],
  );

  if (!rows.length) {
    return null;
  }

  const product = rows[0];

  // Get specs
  const [specs] = await db.execute(
    `
    SELECT
      id,
      \`key\`,
      \`value\`
    FROM product_specs
    WHERE product_id = ?
    ORDER BY id ASC
    `,
    [id],
  );

  return mapProductRow(product, specs);
};

// ==========================================
// GET PRODUCT BY SLUG
// ==========================================
const getProductBySlug = async (slug) => {
  const [rows] = await db.execute(
    `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.priceUnit,
      p.category_id,
      p.technicalDetails,
      p.minOrderQuantity,
      p.images,
      p.brochure,
      p.isActive,
      p.isFeatured,
      p.createdAt,
      p.updatedAt,

      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      c.icon AS category_icon,
      c.description AS category_description

    FROM products p

    LEFT JOIN categories c
      ON p.category_id = c.id

    WHERE p.slug = ?

    LIMIT 1
    `,
    [slug.toLowerCase().trim()],
  );

  if (!rows.length) {
    return null;
  }

  const product = rows[0];

  // Get specs
  const [specs] = await db.execute(
    `
    SELECT
      id,
      \`key\`,
      \`value\`
    FROM product_specs
    WHERE product_id = ?
    ORDER BY id ASC
    `,
    [product.id],
  );

  return mapProductRow(product, specs);
};

// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async ({
  name,
  slug,
  description = "",
  price,
  priceUnit = "Piece",
  category_id,
  specs = [],
  technicalDetails = "",
  minOrderQuantity = 1,
  images = [],
  brochure = "",
  isActive = true,
  isFeatured = false,
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO products
    (
      name,
      slug,
      description,
      price,
      priceUnit,
      category_id,
      technicalDetails,
      minOrderQuantity,
      images,
      brochure,
      isActive,
      isFeatured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name.trim(),
      slug.toLowerCase().trim(),
      description,
      price,
      priceUnit,
      category_id,
      technicalDetails,
      minOrderQuantity,
      JSON.stringify(images),
      brochure,
      isActive ? 1 : 0,
      isFeatured ? 1 : 0,
    ],
  );

  const productId = result.insertId;

  // Insert specs
  if (Array.isArray(specs) && specs.length > 0) {
    for (const spec of specs) {
      if (!spec.key || !spec.value) continue;

      await db.execute(
        `
        INSERT INTO product_specs
        (
          product_id,
          \`key\`,
          \`value\`
        )
        VALUES (?, ?, ?)
        `,
        [productId, spec.key.trim(), spec.value.trim()],
      );
    }
  }

  return getProductById(productId);
};

// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProductById = async (id, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.name !== undefined) {
    fields.push("name = ?");
    values.push(updateData.name.trim());
  }

  if (updateData.slug !== undefined) {
    fields.push("slug = ?");
    values.push(updateData.slug.toLowerCase().trim());
  }

  if (updateData.description !== undefined) {
    fields.push("description = ?");
    values.push(updateData.description);
  }

  if (updateData.price !== undefined) {
    fields.push("price = ?");
    values.push(updateData.price);
  }

  if (updateData.priceUnit !== undefined) {
    fields.push("priceUnit = ?");
    values.push(updateData.priceUnit);
  }

  if (updateData.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(updateData.category_id);
  }

  if (updateData.technicalDetails !== undefined) {
    fields.push("technicalDetails = ?");
    values.push(updateData.technicalDetails);
  }

  if (updateData.minOrderQuantity !== undefined) {
    fields.push("minOrderQuantity = ?");
    values.push(updateData.minOrderQuantity);
  }

  if (updateData.images !== undefined) {
    fields.push("images = ?");
    values.push(JSON.stringify(updateData.images));
  }

  if (updateData.brochure !== undefined) {
    fields.push("brochure = ?");
    values.push(updateData.brochure);
  }

  if (updateData.isActive !== undefined) {
    fields.push("isActive = ?");
    values.push(updateData.isActive ? 1 : 0);
  }

  if (updateData.isFeatured !== undefined) {
    fields.push("isFeatured = ?");
    values.push(updateData.isFeatured ? 1 : 0);
  }

  if (fields.length > 0) {
    values.push(id);

    await db.execute(
      `
      UPDATE products
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      values,
    );
  }

  // Update specs
  if (updateData.specs !== undefined) {
    await db.execute(
      `
      DELETE FROM product_specs
      WHERE product_id = ?
      `,
      [id],
    );

    if (Array.isArray(updateData.specs) && updateData.specs.length > 0) {
      for (const spec of updateData.specs) {
        if (!spec.key || !spec.value) continue;

        await db.execute(
          `
          INSERT INTO product_specs
          (
            product_id,
            \`key\`,
            \`value\`
          )
          VALUES (?, ?, ?)
          `,
          [id, spec.key.trim(), spec.value.trim()],
        );
      }
    }
  }

  return getProductById(id);
};

// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProductById = async (id) => {
  const [result] = await db.execute(
    `
    DELETE FROM products
    WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProductById,
  deleteProductById,
};
