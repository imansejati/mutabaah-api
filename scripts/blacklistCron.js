// Cron job untuk menghapus blacklist token yang sudah expired setiap hari jam 03:00
const cron = require("node-cron");
const db = require("../config/database");

cron.schedule("0 3 * * *", () => {
  const query = "DELETE FROM blacklisted_tokens WHERE expires_at < NOW()";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Gagal membersihkan blacklist token:", err);
    } else {
      console.log(
        `[${new Date().toISOString()}] Blacklist token expired yang dihapus: ${
          results.affectedRows
        }`
      );
    }
  });
});

console.log(
  "Cron job pembersihan blacklist token aktif (setiap hari jam 03:00)"
);
