const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/errorHandler");

const {
  getUserByEmail,
  getUserById,
  getUserByLogin,
  createUser,
  updateUserById,
  isEmail,
  isPhone,
} = require("../models/users");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================
exports.register = async (req, res, next) => {
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

    const { role, name, email, phone, password } = req.body;

    // Check required fields
    if (!role || !name || !email || !phone || !password) {
      return next(
        new ErrorHandler(
          "Role, name, email, phone and password are required",
          400,
        ),
      );
    }

    // Check email already exists
    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    // Check phone already exists
    const existingPhone = await isPhone(phone);

    if (existingPhone) {
      return next(new ErrorHandler("Phone already exists", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      role,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    return res.status(201).json({
      status: "success",
      message: `${role} registered successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// LOGIN
// ==========================================
exports.login = async (req, res, next) => {
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

    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return next(
        new ErrorHandler("Email/Phone and password are required", 400),
      );
    }

    // Find user
    const user = await getUserByLogin({
      email,
      phone,
    });

    if (!user) {
      return next(new ErrorHandler("Invalid email/phone", 401));
    }

    // Check password (bcrypt hash or legacy plain text in DB)
    const storedPassword = user.password || "";
    const isPasswordMatched = storedPassword.startsWith("$2")
      ? await bcrypt.compare(password, storedPassword)
      : password === storedPassword;

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid password", 401));
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "7d",
      },
    );

    // Get public user data
    const userData = await getUserById(user.id);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      role: user.role,
      data: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// GET MY PROFILE
// ==========================================
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// ==========================================
// UPDATE MY PROFILE
// ==========================================
exports.updateMyProfile = async (req, res, next) => {
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

    const userId = req.user.id;

    // Find current user
    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    const { name, email, phone } = req.body;

    // Check email
    if (email && email.toLowerCase().trim() !== existingUser.email) {
      const emailTaken = await isEmail(email, userId);

      if (emailTaken) {
        return next(new ErrorHandler("Email already exists", 400));
      }
    }

    // Check phone
    if (phone && phone.trim() !== existingUser.phone) {
      const phoneTaken = await isPhone(phone, userId);

      if (phoneTaken) {
        return next(new ErrorHandler("Phone already exists", 400));
      }
    }

    // Prepare update data
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.toLowerCase().trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }

    // Update user
    const updatedUser = await updateUserById(userId, updateData);

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
