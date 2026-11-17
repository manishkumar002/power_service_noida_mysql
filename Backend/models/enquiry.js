const db = require("../config/db");

// ==========================================
// GET ALL ENQUIRIES
// ==========================================
const getAllEnquiries = async () => {
  const [rows] = await db.execute(`
    SELECT
      e.id,
      e.name,
      e.phone,
      e.email,
      e.city,
      e.message,
      e.product_id,
      e.category_id,
      e.productName,
      e.serviceType,
      e.isVerified,
      e.status,
      e.createdAt,
      e.updatedAt,

      -- Product
      p.id AS productId,
      p.name AS product_name,
      p.description AS product_description,
      p.price AS product_price,
      p.priceUnit AS product_priceUnit,
      p.images AS product_images,

      -- Category
      c.id AS categoryId,
      c.name AS category_name

    FROM enquiries e

    LEFT JOIN products p
      ON e.product_id = p.id

    LEFT JOIN categories c
      ON e.category_id = c.id

    ORDER BY e.createdAt DESC
  `);

  return rows.map((row) => {
    let images = [];

    if (row.product_images) {
      try {
        images =
          typeof row.product_images === "string"
            ? JSON.parse(row.product_images)
            : row.product_images;
      } catch {
        images = [];
      }
    }

    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      city: row.city,
      message: row.message,

      product: row.productId
        ? {
            id: row.productId,
            name: row.product_name,
            description: row.product_description,
            price: row.product_price,
            priceUnit: row.product_priceUnit,
            images,
          }
        : null,

      category: row.categoryId
        ? {
            id: row.categoryId,
            name: row.category_name,
          }
        : null,

      productName: row.productName,
      serviceType: row.serviceType,
      isVerified: Boolean(row.isVerified),
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
};

// ==========================================
// GET ENQUIRY BY ID
// ==========================================
const getEnquiryById = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT
      e.*
    FROM enquiries e
    WHERE e.id = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
};

// ==========================================
// CREATE ENQUIRY
// ==========================================
const createEnquiry = async ({
  name,
  phone,
  email = "",
  city = "",
  message = "",
  product_id = null,
  category_id = null,
  productName = "",
  serviceType,
  isVerified = false,
  status = "new",
}) => {
  const [result] = await db.execute(
    `
    INSERT INTO enquiries
    (
      name,
      phone,
      email,
      city,
      message,
      product_id,
      category_id,
      productName,
      serviceType,
      isVerified,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name.trim(),
      phone.trim(),
      email.toLowerCase().trim(),
      city.trim(),
      message.trim(),
      product_id,
      category_id,
      productName,
      serviceType,
      isVerified ? 1 : 0,
      status,
    ],
  );

  return getEnquiryById(result.insertId);
};

// ==========================================
// UPDATE ENQUIRY
// ==========================================
const updateEnquiryById = async (id, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.name !== undefined) {
    fields.push("name = ?");
    values.push(updateData.name.trim());
  }

  if (updateData.phone !== undefined) {
    fields.push("phone = ?");
    values.push(updateData.phone.trim());
  }

  if (updateData.email !== undefined) {
    fields.push("email = ?");
    values.push(updateData.email.toLowerCase().trim());
  }

  if (updateData.city !== undefined) {
    fields.push("city = ?");
    values.push(updateData.city.trim());
  }

  if (updateData.message !== undefined) {
    fields.push("message = ?");
    values.push(updateData.message.trim());
  }

  if (updateData.product_id !== undefined) {
    fields.push("product_id = ?");
    values.push(updateData.product_id);
  }

  if (updateData.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(updateData.category_id);
  }

  if (updateData.productName !== undefined) {
    fields.push("productName = ?");
    values.push(updateData.productName);
  }

  if (updateData.serviceType !== undefined) {
    fields.push("serviceType = ?");
    values.push(updateData.serviceType);
  }

  if (updateData.isVerified !== undefined) {
    fields.push("isVerified = ?");
    values.push(updateData.isVerified ? 1 : 0);
  }

  if (updateData.status !== undefined) {
    fields.push("status = ?");
    values.push(updateData.status);
  }

  if (fields.length === 0) {
    return getEnquiryById(id);
  }

  values.push(id);

  await db.execute(
    `
    UPDATE enquiries
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values,
  );

  return getEnquiryById(id);
};

// ==========================================
// DELETE ENQUIRY
// ==========================================
const deleteEnquiryById = async (id) => {
  const [result] = await db.execute(
    `
    DELETE FROM enquiries
    WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiryById,
  deleteEnquiryById,
};
