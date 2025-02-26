const { modelBrand } = require("./model.js");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs/promises");
const { get } = require("http");

const createData = async (req, res) => {
  try {
    const { nama, logo } = req.body;
    const logoBrand = req.file ? req.file.filename : null;

    if (!logoBrand) {
      return res.status(400).json({ message: "Gambar tidak boleh kosong" });
    }

    const baseUrl = "https://ahmad.rikpetik.site/uploads";

    const brand = await modelBrand.create({
      nama,
      logo,
    });

    res.status(201).json({
      status: 201,
      message: "Data logo di tambahkan",
      data: {
        ...brand.toJSON(),
        gambar: `${baseUrl}/${logoBrand}`,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getData = async (req, res) => {
  try {
    const brand = await modelBrand.findAll();

    // Tambahkan URL untuk gambar
    const brandWithImageUrl = brand.map((item) => {
      return {
        ...item.toJSON(),
        gambar: item.gambar ? `${baseUrl}/${item.gambar}` : null,
      };
    });

    res.json({
      status: 200,
      message: "Data brand masih kosong",
      data: brandWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findData = async (req, res) => {
  try {
    const id = req.params.id;
    const hasil = await modelBrand.findByPk(id);

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

module.exports = {
    createData,
    getData,
    findData
}
