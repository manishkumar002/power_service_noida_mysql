const { body, param } = require("express-validator");

exports.createProductValidator = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must be lowercase letters, numbers, and hyphens"),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("priceUnit")
    .optional()
    .isIn(["Piece", "Month", "Unit", "Set"])
    .withMessage("Invalid price unit"),
];

exports.updateProductValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product ID"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must be lowercase letters, numbers, and hyphens"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Valid price required"),
  body("category").optional().notEmpty().withMessage("Category cannot be empty"),
];

exports.productIdValidator = [
  param("id").notEmpty().withMessage("Product ID is required"),
];
