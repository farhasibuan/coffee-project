const { check, validationResult } = require("express-validator");
const Order = require("./model.js");
const path = require("path");
const fs = require("fs/promises");

// Base URL untuk menyimpan gambar
const baseUrl = "https://ahmad.rikpetik.site/uploads";

// Validasi input
const validasi = [
  check("nama").not().isEmpty().withMessage("Nama tidak boleh kosong"),
];

// Mendapatkan semua data order
const getData = async (req, res) => {
  try {
    const orders = await Order.findAll();

    const ordersWithImageUrl = orders.map((item) => ({
      ...item.toJSON(),
      gambar: item.gambar ? `${baseUrl}/${item.gambar}` : null,
    }));

    res.status(200).json({
      status: 200,
      message: "Data Order",
      data: ordersWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan data order
const createData = async (req, res) => {
  try {
    const { nama } = req.body;
    const gambarOrder = req.file ? req.file.filename : null;

    if (!gambarOrder) {
      return res.status(400).json({ message: "Gambar tidak boleh kosong" });
    }

    const order = await Order.create({
      nama,
      gambar: gambarOrder,
    });

    res.status(201).json({
      status: 201,
      message: "Data Order berhasil ditambahkan",
      data: {
        ...order.toJSON(),
        gambar: `${baseUrl}/${gambarOrder}`,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mendapatkan data order berdasarkan ID
const findData = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data Order",
      data: {
        ...order.toJSON(),
        gambar: order.gambar ? `${baseUrl}/${order.gambar}` : null,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate data order
const updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    let gambar = order.gambar;
    if (req.file) {
      const oldImagePath = path.resolve("./app/public/uploads/" + order.gambar);
      if (order.gambar) {
        await fs.unlink(oldImagePath);
      }
      gambar = req.file.filename;
    }

    const { nama } = req.body;
    await Order.update({ nama, gambar }, { where: { id } });

    res.status(200).json({
      status: 200,
      message: "Data berhasil diperbarui",
      data: {
        id,
        nama,
        gambar: gambar ? `${baseUrl}/${gambar}` : null,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus data order
const deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    if (order.gambar) {
      const filePath = path.resolve("./app/public/uploads/" + order.gambar);
      await fs.unlink(filePath);
    }

    await Order.destroy({ where: { id } });

    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getData,
  createData,
  validasi,
  findData,
  updateData,
  deleteData,
};
