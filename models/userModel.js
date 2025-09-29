const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  // Membuat user baru
  create: (userData, callback) => {
    bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      const query =
        "INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)";
      db.execute(
        query,
        [userData.username, userData.name, userData.email, hashedPassword],
        callback
      );
    });
  },

  // Mencari user berdasarkan username
  findByUsername: (username, callback) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.execute(query, [username], callback);
  },

  // Mencari user berdasarkan ID
  findById: (id, callback) => {
    const query =
      "SELECT id, username, name, email, created_at FROM users WHERE id = ?";
    db.execute(query, [id], callback);
  },

  // Menyimpan refresh token
  saveRefreshToken: (userId, token, expiresAt, callback) => {
    const query =
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
    db.execute(query, [userId, token, expiresAt], callback);
  },

  // Mencari refresh token
  findRefreshToken: (token, callback) => {
    const query =
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()";
    db.execute(query, [token], callback);
  },

  // Menghapus refresh token
  deleteRefreshToken: (token, callback) => {
    const query = "DELETE FROM refresh_tokens WHERE token = ?";
    db.execute(query, [token], callback);
  },
};

module.exports = User;
