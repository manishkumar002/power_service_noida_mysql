const db = require("../config/db");

// GET USER BY ID
const getUserById = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      role,
      name,
      email,
      phone
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId],
  );

  return rows[0] || null;
};

// GET USER BY EMAIL
const getUserByEmail = async (email) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      role,
      name,
      email,
      phone
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email.toLowerCase().trim()],
  );

  return rows[0] || null;
};

// GET USER WITH PASSWORD
const getUser = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      role,
      name,
      email,
      phone,
      password
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId],
  );

  return rows[0] || null;
};

// GET USER BY EMAIL OR PHONE
const getUserByLogin = async ({ email, phone }) => {
  let query;
  let params;

  if (email) {
    query = `
      SELECT
        id,
        role,
        name,
        email,
        phone,
        password
      FROM users
      WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))
      LIMIT 1
    `;

    params = [email];
  } else if (phone) {
    query = `
      SELECT
        id,
        role,
        name,
        email,
        phone,
        password
      FROM users
      WHERE TRIM(phone) = TRIM(?)
      LIMIT 1
    `;

    params = [phone];
  } else {
    return null;
  }

  const [rows] = await db.execute(query, params);

  return rows.length > 0 ? rows[0] : null;
};

// CREATE USER
const createUser = async ({ role, name, email, phone, password }) => {
  const [result] = await db.execute(
    `
    INSERT INTO users
    (
      role,
      name,
      email,
      phone,
      password
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [role, name.trim(), email.toLowerCase().trim(), phone.trim(), password],
  );

  return getUserById(result.insertId);
};

// CHECK EMAIL
const isEmail = async (email, userId = null) => {
  let query = `
    SELECT id
    FROM users
    WHERE email = ?
  `;

  const params = [email.toLowerCase().trim()];

  if (userId) {
    query += " AND id != ?";
    params.push(userId);
  }

  query += " LIMIT 1";

  const [rows] = await db.execute(query, params);

  return rows.length > 0;
};

// CHECK PHONE
const isPhone = async (phone, userId = null) => {
  let query = `
    SELECT id
    FROM users
    WHERE phone = ?
  `;

  const params = [phone.trim()];

  if (userId) {
    query += " AND id != ?";
    params.push(userId);
  }

  query += " LIMIT 1";

  const [rows] = await db.execute(query, params);

  return rows.length > 0;
};

// UPDATE USER
const updateUserById = async (userId, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.role !== undefined) {
    fields.push("role = ?");
    values.push(updateData.role);
  }

  if (updateData.name !== undefined) {
    fields.push("name = ?");
    values.push(updateData.name);
  }

  if (updateData.email !== undefined) {
    fields.push("email = ?");
    values.push(updateData.email);
  }

  if (updateData.phone !== undefined) {
    fields.push("phone = ?");
    values.push(updateData.phone);
  }

  if (updateData.password !== undefined) {
    fields.push("password = ?");
    values.push(updateData.password);
  }

  if (fields.length === 0) {
    return getUserById(userId);
  }

  values.push(userId);

  await db.execute(
    `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values,
  );

  return getUserById(userId);
};

module.exports = {
  getUserById,
  getUser,
  getUserByEmail,
  getUserByLogin,
  createUser,
  isEmail,
  isPhone,
  updateUserById,
};
