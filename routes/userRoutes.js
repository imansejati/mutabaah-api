const express = require("express");
const router = express.Router();
const { getProfile, getUserById } = require("../controllers/userController");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Get current user profile (protected)
router.get("/profile", authenticateToken, getProfile);

// Get user by ID (public with optional auth)
router.get("/:id", optionalAuth, getUserById);

module.exports = router;
