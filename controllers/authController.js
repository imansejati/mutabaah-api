const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({
      id: user.id,
      username: user.username
    },
    process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "15m"
    }
  );

  const refreshToken = jwt.sign({
      id: user.id
    },
    process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret", {
      expiresIn: "7d"
    }
  );

  return {
    accessToken,
    refreshToken
  };
};

// Register controller
const register = (req, res) => {
  const {
    username,
    name,
    email,
    password
  } = req.body;

  // Check if user already exists
  User.findByUsername(username, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error server internal"
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        message: "Username sudah digunakan"
      });
    }

    // Create new user
    User.create({
      username,
      name,
      email,
      password
    }, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal membuat pengguna"
        });
      }

      res.status(201).json({
        message: "Pengguna berhasil dibuat",
        userId: results.insertId,
      });
    });
  });
};

// Login controller
const login = (req, res) => {
  const {
    username,
    password
  } = req.body;

  User.findByUsername(username, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error server internal"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Username atau password salah"
      });
    }

    const user = results[0];

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res
          .status(401)
          .json({
            message: "Username atau password salah"
          });
      }

      // Generate tokens
      const {
        accessToken,
        refreshToken
      } = generateTokens(user);

      // Save refresh token to database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      User.saveRefreshToken(user.id, refreshToken, expiresAt, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Error server internal"
          });
        }

        res.json({
          message: "Login berhasil",
          user_id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          accessToken,
          refreshToken,
          expiresIn: 15 * 60, // 15 minutes in seconds
        });
      });
    });
  });
};

// Refresh token controller
const refreshToken = (req, res) => {
  const {
    refreshToken
  } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token diperlukan"
    });
  }

  // Verify refresh token
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Refresh token tidak valid"
        });
      }

      // Check if refresh token exists in database
      User.findRefreshToken(refreshToken, (err, results) => {
        if (err || results.length === 0) {
          return res.status(403).json({
            message: "Refresh token tidak valid"
          });
        }

        const userId = decoded.id;

        // Generate new access token
        const accessToken = jwt.sign({
            id: userId,
            username: decoded.username
          },
          process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "15m"
          }
        );

        res.json({
          accessToken,
          expiresIn: 15 * 60,
        });
      });
    }
  );
};

// Logout controller
const Blacklist = require("../models/blacklistModel");
const logout = (req, res) => {
  const {
    refreshToken
  } = req.body;
  // Ambil access token dari header Authorization
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token diperlukan"
    });
  }

  // Hapus refresh token dari database
  User.deleteRefreshToken(refreshToken, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Error server internal"
      });
    }

    // Jika ada access token, masukkan ke blacklist
    if (accessToken) {
      // Decode token untuk ambil expiry
      let expiresAt = new Date();
      try {
        const decoded = jwt.decode(accessToken);
        if (decoded && decoded.exp) {
          expiresAt = new Date(decoded.exp * 1000);
        }
      } catch (e) {}
      Blacklist.add(accessToken, expiresAt, (err) => {
        // Tidak perlu gagal jika blacklist gagal, tetap logout
        return res.json({
          message: "Logout berhasil"
        });
      });
    } else {
      res.json({
        message: "Logout berhasil"
      });
    }
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
