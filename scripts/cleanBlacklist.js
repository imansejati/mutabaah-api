// Script untuk menghapus blacklist token yang sudah expired
const db = require("../config/database");

function cleanExpiredBlacklistedTokens() {
  const query = "DELETE FROM blacklisted_tokens WHERE expires_at < NOW()";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Gagal membersihkan blacklist token:", err);
    } else {
      console.log(
        `Blacklist token expired yang dihapus: ${results.affectedRows}`
      );
    }
    process.exit();
  });
}

cleanExpiredBlacklistedTokens();
