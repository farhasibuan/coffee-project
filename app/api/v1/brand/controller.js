const { modelBrand } = require("./model.js");
const path = require("path");
const fs = require("fs/promises");

const baseUrl = "https://ahmad.rikpetik.site/uploads";


const createData = async (req, res) => {
  try {
    const { nama } = req.body;
    const logoBrand = req.file ? req.file.filename : null;

    if (!nama) {
      return res.status(400).json({ message: "Nama tidak boleh kosong" });
    }

    if (!logoBrand) {
      return res.status(400).json({ message: "Gambar tidak boleh kosong" });
    }


    const existingBrand = await modelBrand.findOne({ where: { nama } });
    if (existingBrand) {
      return res.status(400).json({ message: "Nama sudah digunakan" });
    }

    const brand = await modelBrand.create({
      nama,
      logo: logoBrand,
    });

    res.status(201).json({
      status: 201,
      message: "Data brand berhasil ditambahkan",
      data: {
        ...brand.toJSON(),
        logo: `${baseUrl}/${logoBrand}`,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getData = async (req, res) => {
  try {
    const brands = await modelBrand.findAll();

    if (brands.length === 0) {
      return res.json({
        status: 200,
        message: "Data brand masih kosong",
        data: [],
      });
    }

    
    const brandWithImageUrl = brands.map((item) => ({
      ...item.toJSON(),
      logo: item.logo ? `${baseUrl}/${item.logo}` : null,
    }));

    res.json({
      status: 200,
      message: "Data brand berhasil diambil",
      data: brandWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const findData = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await modelBrand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data brand ditemukan",
      data: {
        ...brand.toJSON(),
        logo: brand.logo ? `${baseUrl}/${brand.logo}` : null,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await modelBrand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    
    if (brand.logo) {
      const imagePath = path.join(__dirname, "../../../public/uploads", brand.logo);
      await fs.unlink(imagePath).catch(() => {});
    }

    await brand.destroy();

    res.status(200).json({ message: "Data brand berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = {
  createData,
  getData,
  findData,
  deleteData,
};
