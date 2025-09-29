const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Blacklist = require("../models/blacklistModel");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token diperlukan" });
  }

  // Cek blacklist sebelum verifikasi JWT
  Blacklist.isBlacklisted(token, (err, isBlacklisted) => {
    if (err) {
      return res.status(500).json({ message: "Error server internal" });
    }
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token sudah di-blacklist" });
    }
    jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
      (err, user) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Token tidak valid atau telah kedaluwarsa" });
        }
        req.user = user;
        next();
      }
    );
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
      (err, user) => {
        if (!err) {
          req.user = user;
        }
      }
    );
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };
