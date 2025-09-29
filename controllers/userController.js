const User = require("../models/userModel");

// Get user profile
const getProfile = (req, res) => {
  const userId = req.user.id;

  User.findById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error server internal" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const user = results[0];
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    });
  });
};

// Get user by ID (public)
const getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error server internal" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const user = results[0];

    // If the request is authenticated and the user is viewing their own profile
    if (req.user && req.user.id === parseInt(userId)) {
      return res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      });
    }

    // Public profile (without email)
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.created_at,
    });
  });
};

module.exports = {
  getProfile,
  getUserById,
};
