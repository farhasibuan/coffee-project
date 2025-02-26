const { modelMinuman } = require("../models/relasi.js");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs/promises");

// Base URL untuk gambar
const baseUrl = "http://localhost:3000/uploads";

// Mendapatkan semua data minuman
const getData = async (req, res) => {
  try {
    const minuman = await modelMinuman.findAll();
    const minumanWithImageUrl = minuman.map((item) => ({
      ...item.toJSON(),
      gambar: item.gambar ? `${baseUrl}/${item.gambar}` : null,
    }));
    res.json({ status: 200, message: "Data Minuman", data: minumanWithImageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validasi input
const validasi = [
  check("nama").not().isEmpty().withMessage("Nama tidak boleh kosong"),
  check("harga_baru").isNumeric().withMessage("Harga baru harus berupa angka"),
  check("harga_lama").isNumeric().withMessage("Harga lama harus berupa angka"),
  check("deskripsi").not().isEmpty().withMessage("Deskripsi tidak boleh kosong"),
];

// Menambahkan data minuman
const createData = async (req, res) => {
  try {
    const { nama, harga_baru, harga_lama, deskripsi, user_id } = req.body;
    const gambarMinuman = req.file ? req.file.filename : null;

    if (!gambarMinuman) {
      return res.status(400).json({ message: "Gambar tidak boleh kosong" });
    }

    const minuman = await modelMinuman.create({
      nama,
      harga_baru,
      harga_lama,
      deskripsi,
      gambar: gambarMinuman,
      user_id,
    });

    res.status(201).json({
      status: 201,
      message: "Data minuman berhasil ditambahkan",
      data: {
        ...minuman.toJSON(),
        gambar: `${baseUrl}/${gambarMinuman}`,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mendapatkan data berdasarkan ID
const findData = async (req, res) => {
  try {
    const id = req.params.id;
    const hasil = await modelMinuman.findByPk(id);

    if (!hasil) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data Minuman",
      data: {
        ...hasil.toJSON(),
        gambar: hasil.gambar ? `${baseUrl}/${hasil.gambar}` : null,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate data minuman
const updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const updateId = await modelMinuman.findByPk(id);

    if (!updateId) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    let gambar = updateId.gambar;
    if (req.file) {
      if (updateId.gambar) {
        await fs.unlink(path.resolve("./app/public/uploads/" + updateId.gambar));
      }
      gambar = req.file.filename;
    }

    const { nama, harga_baru, harga_lama, deskripsi } = req.body;
    await modelMinuman.update(
      { nama, harga_baru, harga_lama, deskripsi, gambar },
      { where: { id } }
    );

    res.json({
      status: 200,
      message: "Data berhasil diperbarui",
      data: {
        id,
        nama,
        harga_baru,
        harga_lama,
        deskripsi,
        gambar: gambar ? `${baseUrl}/${gambar}` : null,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus data minuman
const deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    const minuman = await modelMinuman.findByPk(id);

    if (!minuman) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    if (minuman.gambar) {
      await fs.unlink(path.resolve("./app/public/uploads/" + minuman.gambar));
    }

    await modelMinuman.destroy({ where: { id } });
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getData, createData, validasi, findData, updateData, deleteData };
