// Get mutabaah by tanggal dan user id
const getMutabaahByTanggalAndUser = (req, res) => {
  const {
    tanggal,
    id_nama
  } = req.query;
  if (!tanggal || !id_nama) {
    return res
      .status(400)
      .json({
        message: "Parameter tanggal dan id_nama diperlukan"
      });
  }
  Mutabaah.findByTanggalAndUser(tanggal, id_nama, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Gagal mengambil data",
          error: err
        });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan"
      });
    }
    res.json(results);
  });
};
const Mutabaah = require("../models/mutabaahModel");

// Create mutabaah
const createMutabaah = (req, res) => {
  Mutabaah.create(req.body, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Gagal menambah data",
          error: err
        });
    }
    res
      .status(201)
      .json({
        message: "Data berhasil ditambah",
        id: results.insertId
      });
  });
};

// Get all mutabaah
const getAllMutabaah = (req, res) => {
  Mutabaah.findAll((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Gagal mengambil data",
          error: err
        });
    }
    res.json(results);
  });
};

// Get mutabaah by id
const getMutabaahById = (req, res) => {
  Mutabaah.findById(req.params.id, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Gagal mengambil data",
          error: err
        });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan"
      });
    }
    res.json(results[0]);
  });
};

// Update mutabaah
const updateMutabaah = (req, res) => {
  Mutabaah.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Gagal mengupdate data",
          error: err
        });
    }
    res.json({
      message: "Data berhasil diupdate"
    });
  });
};

// Delete mutabaah
const deleteMutabaah = (req, res) => {
  Mutabaah.delete(req.params.id, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Gagal menghapus data",
          error: err
        });
    }
    res.json({
      message: "Data berhasil dihapus"
    });
  });
};

// Upsert mutabaah by tanggal dan user id
const upsertMutabaah = (req, res) => {
  Mutabaah.upsertByTanggalAndUser(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menyimpan data",
        error: err
      });
    }
    if (result.created) {
      res.status(201).json({
        message: "Data berhasil ditambah",
        id: result.id
      });
    } else if (result.updated) {
      res.json({
        message: "Data berhasil diupdate",
        id: result.id
      });
    } else {
      res.json({
        message: "Operasi selesai",
        id: result.id
      });
    }
  });
};

module.exports = {
  createMutabaah,
  getAllMutabaah,
  getMutabaahById,
  updateMutabaah,
  deleteMutabaah,
  getMutabaahByTanggalAndUser,
  upsertMutabaah,
};