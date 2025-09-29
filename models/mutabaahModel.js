const db = require("../config/database");

const Mutabaah = {
  // Read by tanggal dan user id
  findByTanggalAndUser: (tanggal, id_nama, callback) => {
    db.execute(
      "SELECT * FROM mutabaah WHERE Tanggal = ? AND id_nama = ?",
      [tanggal, id_nama],
      callback
    );
  },
  // Create
  create: (data, callback) => {
    const query = `INSERT INTO mutabaah (Tanggal, id_nama, SholatFardu, SholatSunnah, ShaumSunnah, Tilawah, Dzikir, Zis, Olahraga, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.execute(
      query,
      [
        data.Tanggal,
        data.id_nama,
        data.SholatFardu,
        data.SholatSunnah,
        data.ShaumSunnah,
        data.Tilawah,
        data.Dzikir,
        data.Zis,
        data.Olahraga,
        data.created_at || new Date(),
      ],
      callback
    );
  },

  // Read all
  findAll: (callback) => {
    db.execute("SELECT * FROM mutabaah", [], callback);
  },

  // Read by id
  findById: (id, callback) => {
    db.execute("SELECT * FROM mutabaah WHERE id = ?", [id], callback);
  },

  // Update
  update: (id, data, callback) => {
    const query = `UPDATE mutabaah SET Tanggal=?, id_nama=?, SholatFardu=?, SholatSunnah=?, ShaumSunnah=?, Tilawah=?, Dzikir=?, Zis=?, Olahraga=? WHERE id=?`;
    db.execute(
      query,
      [
        data.Tanggal,
        data.id_nama,
        data.SholatFardu,
        data.SholatSunnah,
        data.ShaumSunnah,
        data.Tilawah,
        data.Dzikir,
        data.Zis,
        data.Olahraga,
        id,
      ],
      callback
    );
  },

  // Delete
  delete: (id, callback) => {
    db.execute("DELETE FROM mutabaah WHERE id = ?", [id], callback);
  },

  // Upsert by tanggal dan user id
  upsertByTanggalAndUser: (data, callback) => {
    // Cek apakah sudah ada data untuk tanggal dan user ini
    const selectQuery = "SELECT id FROM mutabaah WHERE Tanggal = ? AND id_nama = ?";
    db.execute(selectQuery, [data.Tanggal, data.id_nama], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) {
        // Sudah ada, update
        const id = results[0].id;
        const updateQuery = `UPDATE mutabaah SET SholatFardu=?, SholatSunnah=?, ShaumSunnah=?, Tilawah=?, Dzikir=?, Zis=?, Olahraga=? WHERE id=?`;
        db.execute(
          updateQuery,
          [
            data.SholatFardu,
            data.SholatSunnah,
            data.ShaumSunnah,
            data.Tilawah,
            data.Dzikir,
            data.Zis,
            data.Olahraga,
            id
          ],
          (err2, updateResult) => {
            if (err2) return callback(err2);
            callback(null, {
              updated: true,
              id
            });
          }
        );
      } else {
        // Belum ada, insert
        const insertQuery = `INSERT INTO mutabaah (Tanggal, id_nama, SholatFardu, SholatSunnah, ShaumSunnah, Tilawah, Dzikir, Zis, Olahraga, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.execute(
          insertQuery,
          [
            data.Tanggal,
            data.id_nama,
            data.SholatFardu,
            data.SholatSunnah,
            data.ShaumSunnah,
            data.Tilawah,
            data.Dzikir,
            data.Zis,
            data.Olahraga,
            data.created_at || new Date()
          ],
          (err3, insertResult) => {
            if (err3) return callback(err3);
            callback(null, {
              created: true,
              id: insertResult.insertId
            });
          }
        );
      }
    });
  },
};

module.exports = Mutabaah;