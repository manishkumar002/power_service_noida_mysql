const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/errorHandler");

const {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct: createProductModel,
  updateProductById,
  deleteProductById,
} = require("../models/product");

const {
  parseProductBody,
  mapUploadedFiles,
} = require("../utils/parseProductBody");

// ==========================================
// BUILD PRODUCT PAYLOAD
// ==========================================
const buildProductPayload = (parsed, files = []) => {
  const uploadedImages = (files || [])
    .filter((file) => file.fieldname === "images")
    .map((file) => `/uploads/products/${file.filename}`);

  return {
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description || "",
    price: parsed.price,
    priceUnit: parsed.priceUnit || "Piece",

    // MongoDB category -> MySQL category_id
    category_id: parsed.category,

    specs: parsed.specs || [],

    technicalDetails: parsed.technicalDetails || "",

    minOrderQuantity: parsed.minOrderQuantity || 1,

    images: uploadedImages,

    brochure: parsed.brochure || "",

    isActive: parsed.isActive !== undefined ? parsed.isActive : true,

    isFeatured: parsed.isFeatured !== undefined ? parsed.isFeatured : false,
  };
};

// ==========================================
// GET ACTIVE PRODUCTS
// ==========================================
exports.getProducts = async (req, res, next) => {
  try {
    const filter = {
      isActive: true,
    };

    // Category filter
    if (req.query.category) {
      filter.category_id = req.query.category;
    }

    // Featured filter
    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    // Search
    if (req.query.search) {
      filter.search = req.query.search.trim();
    }

    const products = await getAllProducts(filter);

    return res.status(200).json({
      status: "success",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// GET ALL PRODUCTS - ADMIN
// ==========================================
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await getAllProducts({});

    return res.status(200).json({
      status: "success",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get All Products Admin Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// GET PRODUCT DETAILS
// ==========================================
exports.getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;

    // MySQL ID
    if (/^\d+$/.test(id)) {
      product = await getProductById(Number(id));
    }

    // If not found by ID, search by slug
    if (!product) {
      product = await getProductBySlug(id);
    }

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Public API should only show active products
    if (!product.isActive) {
      return next(new ErrorHandler("Product not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error("Get Product Details Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// CREATE PRODUCT
// ==========================================
exports.createProduct = async (req, res, next) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = {};

      errors.array().forEach((err) => {
        if (!errorObj[err.path]) {
          errorObj[err.path] = err.msg;
        }
      });

      return res.status(422).json({
        status: "error",
        errors: errorObj,
      });
    }

    // Parse body
    const parsed = parseProductBody(req.body);

    // Required fields
    if (
      !parsed.name ||
      !parsed.slug ||
      !parsed.category ||
      Number.isNaN(parsed.price)
    ) {
      return next(
        new ErrorHandler("Name, slug, category and price are required", 400),
      );
    }

    // Check slug
    const existing = await getProductBySlug(parsed.slug);

    if (existing) {
      return next(new ErrorHandler("Product slug already exists", 400));
    }

    // Build payload
    const payload = buildProductPayload(parsed, req.files);

    // Create
    const product = await createProductModel(payload);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================
exports.updateProduct = async (req, res, next) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = {};

      errors.array().forEach((err) => {
        if (!errorObj[err.path]) {
          errorObj[err.path] = err.msg;
        }
      });

      return res.status(422).json({
        status: "error",
        errors: errorObj,
      });
    }

    const { id } = req.params;

    // MySQL ID
    if (!/^\d+$/.test(id)) {
      return next(new ErrorHandler("Invalid product ID", 400));
    }

    const product = await getProductById(Number(id));

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Parse body
    const parsed = parseProductBody({
      ...req.body,

      existingImages: req.body.existingImages || product.images || [],

      existingBrochure:
        req.body.removeBrochure === "true" ? "" : product.brochure || "",
    });

    // Check slug
    if (parsed.slug && parsed.slug !== product.slug) {
      const existing = await getProductBySlug(parsed.slug);

      if (existing && Number(existing.id) !== Number(id)) {
        return next(new ErrorHandler("Product slug already exists", 400));
      }
    }

    // ========================================
    // IMAGES
    // ========================================

    const uploadedImages = (req.files || [])
      .filter((file) => file.fieldname === "images")
      .map((file) => `/uploads/products/${file.filename}`);

    let existingImages = product.images || [];

    // existingImages can come as JSON string
    if (typeof existingImages === "string") {
      try {
        existingImages = JSON.parse(existingImages);
      } catch {
        existingImages = [];
      }
    }

    if (typeof req.body.existingImages === "string") {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch {
        existingImages = req.body.existingImages
          ? [req.body.existingImages]
          : [];
      }
    }

    // New images + existing images
    const finalImages = [...existingImages, ...uploadedImages];

    // ========================================
    // BROCHURE
    // ========================================

    let brochure = product.brochure || "";

    if (req.body.removeBrochure === "true") {
      brochure = "";
    }

    const uploadedFiles = mapUploadedFiles(req.files || []);

    if (uploadedFiles.brochure) {
      brochure = uploadedFiles.brochure;
    }

    // ========================================
    // UPDATE DATA
    // ========================================

    const updateData = {
      name: parsed.name || product.name,

      slug: parsed.slug || product.slug,

      description: parsed.description ?? product.description ?? "",

      price: Number.isNaN(parsed.price) ? product.price : parsed.price,

      priceUnit: parsed.priceUnit || product.priceUnit || "Piece",

      category_id: parsed.category || product.category_id,

      technicalDetails:
        parsed.technicalDetails ?? product.technicalDetails ?? "",

      minOrderQuantity:
        parsed.minOrderQuantity || product.minOrderQuantity || 1,

      images: finalImages,

      brochure,

      isActive:
        req.body.isActive !== undefined ? parsed.isActive : product.isActive,

      isFeatured:
        req.body.isFeatured !== undefined
          ? parsed.isFeatured
          : product.isFeatured,

      specs:
        parsed.specs && parsed.specs.length
          ? parsed.specs
          : product.specs || [],
    };

    // Update MySQL
    const updated = await updateProductById(Number(id), updateData);

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return next(new ErrorHandler("Invalid product ID", 400));
    }

    const product = await getProductById(Number(id));

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await deleteProductById(Number(id));

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
