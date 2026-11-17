const { body } = require("express-validator");

exports.sendOtpValidator = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid 10-digit Indian mobile number"),
];

exports.verifyOtpValidator = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid 10-digit mobile number"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

exports.submitContactValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid 10-digit mobile number"),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

exports.submitEnquiryValidator = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid 10-digit mobile number"),
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("serviceType")
    .trim()
    .notEmpty()
    .withMessage("Please select Online or Offline")
    .isIn(["online", "offline"])
    .withMessage("Invalid service type"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("city").optional().trim(),
  body("productName").optional().trim(),
];
