const multer = require("multer");
const path = require("path");
const fs = require("fs");

const categoryPath = path.join(__dirname, "../uploads/categories");
const productPath = path.join(__dirname, "../uploads/products");

fs.mkdirSync(categoryPath, { recursive: true });
fs.mkdirSync(productPath, { recursive: true });

const generateFileName = (file) => {
  return (
    Date.now() +
    "-" +
    Math.round(Math.random() * 1e9) +
    path.extname(file.originalname)
  );
};

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
  }
};

// CATEGORY
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryPath);
  },

  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  },
});

// PRODUCT
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productPath);
  },

  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  },
});

const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadProductImage = multer({
  storage: productStorage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadCategoryImage,
  uploadProductImage,
};
