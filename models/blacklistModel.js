// Model untuk blacklist access token
const db = require("../config/database");

const Blacklist = {
  // Simpan token ke blacklist
  add: (token, expiresAt, callback) => {
    const query =
      "INSERT INTO blacklisted_tokens (token, expires_at) VALUES (?, ?)";
    db.execute(query, [token, expiresAt], callback);
  },

  // Cek apakah token ada di blacklist
  isBlacklisted: (token, callback) => {
    const query =
      "SELECT id FROM blacklisted_tokens WHERE token = ? AND expires_at > NOW()";
    db.execute(query, [token], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });
  },
};

module.exports = Blacklist;
