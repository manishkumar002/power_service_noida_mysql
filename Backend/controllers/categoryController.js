const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/errorHandler");

const {
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryByName,
  getCategoryBySlug,
  createCategory: createCategoryModel,
  updateCategory: updateCategoryModel,
  deleteCategory: deleteCategoryModel,
} = require("../models/category");

// ========================================
// GET ACTIVE CATEGORIES
// ========================================
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await getActiveCategories();

    return res.status(200).json({
      status: "success",
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ========================================
// GET ALL CATEGORIES - ADMIN
// ========================================
exports.getAdminCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      status: "success",
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get Admin Categories Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ========================================
// GET CATEGORY DETAILS
// ========================================
exports.getCategoryDetails = async (req, res, next) => {
  try {
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

    const category = await getCategoryById(id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.error("Get Category Details Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ========================================
// CREATE CATEGORY - ADMIN
// ========================================
exports.createCategory = async (req, res, next) => {
  try {
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

    const { name, slug, icon, description, isActive } = req.body;

    // CHECK NAME
    const existingName = await getCategoryByName(name);

    if (existingName) {
      return next(new ErrorHandler("Category name already exists", 400));
    }

    // CHECK SLUG
    const existingSlug = await getCategoryBySlug(slug);

    if (existingSlug) {
      return next(new ErrorHandler("Category slug already exists", 400));
    }

    // CATEGORY IMAGE
    let categoryImage = "";

    if (req.file) {
      categoryImage = `/uploads/categories/${req.file.filename}`;
    }

    console.log("CATEGORY IMAGE:", categoryImage);

    // CREATE
    const category = await createCategoryModel({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      icon: icon || "",
      description: description || "",
      categoryImage,
      isActive:
        isActive !== undefined
          ? isActive === "true" || isActive === true
          : true,
    });

    return res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ========================================
// UPDATE CATEGORY
// ========================================
exports.updateCategory = async (req, res, next) => {
  try {
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

    const { name, slug, icon, description, isActive } = req.body;

    // FIND CATEGORY
    const category = await getCategoryById(id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    // CHECK NAME
    if (name && name.trim() !== category.name) {
      const existingName = await getCategoryByName(name);

      if (existingName && Number(existingName.id) !== Number(id)) {
        return next(new ErrorHandler("Category name already exists", 400));
      }
    }

    // CHECK SLUG
    if (slug && slug.toLowerCase().trim() !== category.slug) {
      const existingSlug = await getCategoryBySlug(slug);

      if (existingSlug && Number(existingSlug.id) !== Number(id)) {
        return next(new ErrorHandler("Category slug already exists", 400));
      }
    }

    // UPDATE DATA
    const updateData = {};

    if (name) {
      updateData.name = name.trim();
    }

    if (slug) {
      updateData.slug = slug.toLowerCase().trim();
    }

    if (icon !== undefined) {
      updateData.icon = icon;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }

    // NEW IMAGE
    if (req.file) {
      updateData.categoryImage = `/uploads/categories/${req.file.filename}`;
    }

    // UPDATE
    const updatedCategory = await updateCategoryModel(id, updateData);

    return res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ========================================
// DELETE CATEGORY - ADMIN
// ========================================
exports.deleteCategory = async (req, res, next) => {
  try {
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

    const category = await getCategoryById(id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    await deleteCategoryModel(id);

    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
