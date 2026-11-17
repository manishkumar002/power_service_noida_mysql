const express = require("express");
const router = express.Router();
const {
  uploadCategoryImage,
  uploadProductImage,
} = require("../middleware/multer");
const { login, getMyProfile } = require("../controllers/authController");
const {
  getCategories,
  getAdminCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  getProducts,
  getAllProductsAdmin,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  sendOtp,
  verifyOtp,
  submitEnquiry,
  submitContact,
  getEnquiries,
  updateEnquiryStatus,
  getDashboardStats,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const { isAuthenticatedUser, checkRole } = require("../middleware/verifyToken");
const { loginValidator } = require("../validators/authValidator");
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} = require("../validators/categoryValidator");
const {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} = require("../validators/productValidator");
const {
  // sendOtpValidator,
  // verifyOtpValidator,
  submitEnquiryValidator,
  submitContactValidator,
} = require("../validators/enquiryValidator");

// —— Public ——
router.post("/login", loginValidator, login);
router.get("/profile", isAuthenticatedUser, checkRole("admin"), getMyProfile);
router.get("/categories", getCategories);
router.get("/categories/:id", categoryIdValidator, getCategoryDetails);
router.get("/products", getProducts);
router.get("/products/:id", productIdValidator, getProductDetails);
// router.post("/enquiry/send-otp", sendOtpValidator, sendOtp);
// router.post("/enquiry/verify-otp", verifyOtpValidator, verifyOtp);
router.post("/enquiry/submit", submitEnquiryValidator, submitEnquiry);
router.post("/contact/submit", submitContactValidator, submitContact);

// —— Admin ——
router.get(
  "/admin/categories",
  isAuthenticatedUser,
  checkRole("admin"),
  getAdminCategories,
);
router.post(
  "/categories",
  isAuthenticatedUser,
  checkRole("admin"),
  uploadCategoryImage.single("categoryImage"),
  createCategoryValidator,
  createCategory,
);

router.put(
  "/categories/:id",
  isAuthenticatedUser,
  checkRole("admin"),
  uploadCategoryImage.single("categoryImage"),
  updateCategoryValidator,
  updateCategory,
);

router.delete(
  "/categories/:id",
  isAuthenticatedUser,
  checkRole("admin"),
  categoryIdValidator,
  deleteCategory,
);

router.get(
  "/admin/products",
  isAuthenticatedUser,
  checkRole("admin"),
  getAllProductsAdmin,
);
router.post(
  "/admin/products",
  isAuthenticatedUser,
  checkRole("admin"),
  uploadProductImage.array("images", 10),
  createProductValidator,
  createProduct,
);
router.put(
  "/admin/products/:id",
  isAuthenticatedUser,
  checkRole("admin"),
  uploadProductImage.array("images", 10),
  updateProductValidator,
  updateProduct,
);
router.delete(
  "/admin/products/:id",
  isAuthenticatedUser,
  checkRole("admin"),
  productIdValidator,
  deleteProduct,
);

router.get(
  "/admin/enquiries",
  isAuthenticatedUser,
  checkRole("admin"),
  getEnquiries,
);

router.delete(
  "/admin/enquiries/:id",
  isAuthenticatedUser,
  checkRole("admin"),
  deleteEnquiry,
);

router.put(
  "/admin/enquiries/:id/status",
  isAuthenticatedUser,
  checkRole("admin"),
  updateEnquiryStatus,
);
router.get(
  "/admin/dashboard",
  isAuthenticatedUser,
  checkRole("admin"),
  getDashboardStats,
);

module.exports = router;
