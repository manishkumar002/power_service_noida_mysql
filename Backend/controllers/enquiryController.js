const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/errorHandler");

const db = require("../config/db");

const {
  getAllEnquiries,
  createEnquiry,
  getEnquiryById,
  updateEnquiryById,
  deleteEnquiryById,
} = require("../models/enquiry");

const {
  sendEnquiryEmails,
  sendContactEmails,
} = require("../service/emailService");

/* =========================================================
   SUBMIT ENQUIRY
========================================================= */
exports.submitEnquiry = async (req, res, next) => {
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

    const {
      name,
      phone,
      email,
      city,
      message,
      product,
      category,
      product_id,
      category_id,
      productName,
      serviceType,
    } = req.body;

    // Support both old frontend fields and MySQL fields
    const finalProductId = product_id ?? product ?? null;
    const finalCategoryId = category_id ?? category ?? null;

    // Validate service type
    if (!["online", "offline"].includes(serviceType)) {
      return next(new ErrorHandler("Invalid service type", 400));
    }

    const enquiry = await createEnquiry({
      name: (name || "Customer").trim(),
      phone: (phone || "").trim(),
      email: email?.trim().toLowerCase() || "",
      city: city?.trim() || "",
      message: message?.trim() || "",
      product_id: finalProductId || null,
      category_id: finalCategoryId || null,
      productName: productName?.trim() || "",
      serviceType,
      isVerified: false,
      status: "new",
    });

    // Send email asynchronously
    sendEnquiryEmails(
      {
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        city: enquiry.city,
        message: enquiry.message,
        serviceType: enquiry.serviceType,
        productName: enquiry.productName,
      },
      enquiry.productName,
    ).catch((err) => console.error("Enquiry email error:", err.message));

    return res.status(201).json({
      status: "success",
      message:
        "Enquiry submitted successfully! Our team will contact you soon.",
      data: {
        id: enquiry.id,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

/* =========================================================
   GET ALL ENQUIRIES
========================================================= */
exports.getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await getAllEnquiries();

    return res.status(200).json({
      status: "success",
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

/* =========================================================
   UPDATE ENQUIRY STATUS
========================================================= */
exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // MySQL ID validation
    if (!/^\d+$/.test(String(id))) {
      return next(new ErrorHandler("Invalid enquiry ID", 400));
    }

    // Status validation
    if (!["new", "contacted", "closed"].includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }

    // Check enquiry exists
    const existingEnquiry = await getEnquiryById(Number(id));

    if (!existingEnquiry) {
      return next(new ErrorHandler("Enquiry not found", 404));
    }

    const enquiry = await updateEnquiryById(Number(id), {
      status,
    });

    return res.status(200).json({
      status: "success",
      message: "Enquiry status updated",
      data: enquiry,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

/* =========================================================
   DELETE ENQUIRY
========================================================= */
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    // MySQL ID validation
    if (!/^\d+$/.test(String(id))) {
      return next(new ErrorHandler("Invalid enquiry ID", 400));
    }

    const deleted = await deleteEnquiryById(Number(id));

    if (!deleted) {
      return next(new ErrorHandler("Enquiry not found", 404));
    }

    return res.status(200).json({
      status: "success",
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to delete enquiry", 500),
    );
  }
};

/* =========================================================
   SUBMIT CONTACT FORM
========================================================= */
exports.submitContact = async (req, res, next) => {
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

    const { name, phone, email, message } = req.body;

    const finalName = (name || "Customer").trim();
    const finalPhone = (phone || "").trim();
    const finalEmail = email?.trim().toLowerCase() || "";
    const finalMessage = (message || "").trim();

    await createEnquiry({
      name: finalName,
      phone: finalPhone,
      email: finalEmail,
      city: "",
      message: finalMessage,
      product_id: null,
      category_id: null,
      productName: "Website Contact Form",
      serviceType: "online",
      isVerified: false,
      status: "new",
    });

    sendContactEmails({
      name: finalName,
      phone: finalPhone,
      email: finalEmail,
      message: finalMessage,
    }).catch((err) => console.error("Contact email error:", err.message));

    return res.status(201).json({
      status: "success",
      message: "Your message has been received. We will contact you soon.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

/* =========================================================
   DASHBOARD STATS
========================================================= */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [[productRows], [categoryRows], [enquiryRows], [newEnquiryRows]] =
      await Promise.all([
        db.execute(
          `SELECT COUNT(*) AS count
         FROM products
         WHERE isActive = TRUE`,
        ),

        db.execute(
          `SELECT COUNT(*) AS count
         FROM categories
         WHERE isActive = TRUE`,
        ),

        db.execute(
          `SELECT COUNT(*) AS count
         FROM enquiries`,
        ),

        db.execute(
          `SELECT COUNT(*) AS count
         FROM enquiries
         WHERE status = 'new'`,
        ),
      ]);

    const totalProducts = Number(productRows[0]?.count || 0);
    const totalCategories = Number(categoryRows[0]?.count || 0);
    const totalEnquiries = Number(enquiryRows[0]?.count || 0);
    const newEnquiries = Number(newEnquiryRows[0]?.count || 0);

    return res.status(200).json({
      status: "success",
      data: {
        totalProducts,
        totalCategories,
        totalEnquiries,
        newEnquiries,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
