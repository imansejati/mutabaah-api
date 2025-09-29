// Aktifkan cron job pembersihan blacklist token expired
require("./scripts/blacklistCron");
const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mutabaahRoutes = require("./routes/mutabaahRoutes");

const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mutabaah", mutabaahRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "REST API dengan Autentikasi JWT" });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Terjadi kesalahan server" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
