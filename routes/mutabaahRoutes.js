const express = require("express");
const router = express.Router();
const mutabaahController = require("../controllers/mutabaahController");
const {
  authenticateToken
} = require("../middleware/auth");

// CREATE
router.post("/", authenticateToken, mutabaahController.createMutabaah);
// READ ALL
router.get("/", authenticateToken, mutabaahController.getAllMutabaah);

// READ BY TANGGAL DAN USER ID (query: ?tanggal=YYYY-MM-DD&id_nama=USERID)
router.get(
  "/search/by-tanggal-user",
  mutabaahController.getMutabaahByTanggalAndUser
);
// READ BY ID
router.get("/:id", authenticateToken, mutabaahController.getMutabaahById);
// UPDATE
router.put("/:id", authenticateToken, mutabaahController.updateMutabaah);
// DELETE
router.delete("/:id", authenticateToken, mutabaahController.deleteMutabaah);
// UPSERT by tanggal dan user id
router.post("/upsert", authenticateToken, mutabaahController.upsertMutabaah);

module.exports = router;