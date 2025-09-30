const cron = require("node-cron");
const db = require("../config/database");

// Cek apakah lingkungan adalah PRODUCTION
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {  // Jangan aktifkan cron di Railway dulu
  cron.schedule("0 3 * * *", () => {
    const query = "DELETE FROM blacklisted_tokens WHERE expires_at < NOW()";
    db.execute(query, (err, results) => {
      if (err) {
        console.error("Gagal membersihkan blacklist token:", err);
      } else {
        console.log(`[${new Date().toISOString()}] Blacklist token expired yang dihapus: ${results.affectedRows}`);
      }
    });
  });

  console.log("Cron job pembersihan blacklist token aktif (local only)");
} else {
  console.log("Cron job dinonaktifkan di production");
}
