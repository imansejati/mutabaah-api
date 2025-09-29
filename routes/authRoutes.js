const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validation");

// Register route
router.post("/register", registerValidation, register);

// Login route
router.post("/login", loginValidation, login);

// Refresh token route
router.post("/refresh-token", refreshToken);

// Logout route
router.post("/logout", logout);

module.exports = router;
