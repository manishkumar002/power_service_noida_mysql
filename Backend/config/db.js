const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || "admin",
  password:
    process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "password",
  database:
    process.env.MYSQL_DATABASE || process.env.DB_NAME || "product_service",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await db.getConnection();

    console.log("✅ MySQL Connected Successfully");

    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    process.exit(1);
  }
})();

module.exports = db;
