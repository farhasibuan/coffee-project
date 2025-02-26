const { modelMakanan } = require("../models/relasi.js");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs/promises");

// Ambil semua data makanan
// Ambil semua data makanan
const getData = async (req, res) => {
    try {
        const makanan = await modelMakanan.findAll();

        // Cek apakah data kosong
        if (makanan.length === 0) {
            return res.status(200).json({
                status: 200,
                message: "Data makanan tidak tersedia",
                data: []
            });
        }

        // Ambil BASE_URL dari environment variable atau gunakan default
        const baseUrl = process.env.BASE_URL || "https://ahmad.rikpetik.site/uploads";

        // Tambahkan URL gambar ke setiap item makanan
        const makananWithImageUrl = makanan.map(item => ({
            ...item.toJSON(),
            gambar: item.gambar ? `${baseUrl}/${item.gambar}` : null
        }));

        res.status(200).json({
            status: 200,
            message: "Data makanan berhasil diambil",
            data: makananWithImageUrl
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan: " + error.message });
    }
};

// Validasi input
const validasi = [
    check("nama")
        .not().isEmpty().withMessage("Nama makanan tidak boleh kosong")
        .isLength({ min: 3 }).withMessage("Nama makanan minimal 3 karakter")
        .custom(async (value) => {
            const makanan = await modelMakanan.findOne({ where: { nama: value } });
            if (makanan) {
                return Promise.reject("Nama makanan sudah ada, gunakan yang lain");
            }
        }),
    check("harga")
        .not().isEmpty().withMessage("Harga tidak boleh kosong")
        .isNumeric().withMessage("Harga harus berupa angka"),
    check("gambar").custom((value, { req }) => {
        if (!req.file) {
            throw new Error("Gambar tidak boleh kosong");
        }
    })
];

    
const createData = async (req, res) => {
    try {
        const { nama, harga_baru, harga_lama, deskripsi, user_id } = req.body;
        const gambarMakanan = req.file ? req.file.filename : null;

        if (!gambarMakanan) {
            return res.status(400).json({ message: "Gambar tidak boleh kosong" });
        }

       
        const baseUrl = "https://ahmad.rikpetik.site/uploads";

        const makananBaru = await modelMakanan.create({
            nama,
            harga_baru,
            harga_lama,
            deskripsi,
            gambar: gambarMakanan, // Simpan nama file saja di database
            user_id
        });

        res.status(201).json({
            status: 201,
            message: "Data makanan berhasil ditambahkan",
            data: {
                ...makananBaru.toJSON(),
                gambar: `${baseUrl}/${gambarMakanan}` // Gambar otomatis berisi URL
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findData = async (req, res) => {
    try {
        const { id } = req.params;
        const makanan = await modelMakanan.findOne({ where: { id } });

        if (!makanan) {
            return res.status(404).json({ 
                status: 404,
                message: "Data makanan tidak ditemukan",
                data: null
            });
        }

        // Ambil BASE_URL dari environment variable atau gunakan default
        const baseUrl = process.env.BASE_URL || "https://ahmad.rikpetik.site/uploads";

        // Tambahkan URL gambar jika ada
        const makananWithImageUrl = {
            ...makanan.toJSON(),
            gambar: makanan.gambar ? `${baseUrl}/${makanan.gambar}` : null
        };

        res.status(200).json({
            status: 200,
            message: "Data makanan berhasil ditemukan",
            data: makananWithImageUrl
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Terjadi kesalahan: " + error.message 
        });
    }
};


// Update data makanan
const updateData = async (req, res) => {
    try {
        const { id } = req.params;
        const makanan = await modelMakanan.findByPk(id);

        if (!makanan) {
            return res.status(404).json({
                status: 404,
                message: "Data makanan tidak ditemukan",
                data: null
            });
        }

        let gambar = makanan.gambar;
        
        // Cek apakah ada file baru yang diunggah
        if (req.file) {
            const oldImagePath = path.resolve("./app/public/uploads/", makanan.gambar);
            
            // Hapus gambar lama jika ada
            if (makanan.gambar) {
                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.warn("Gagal menghapus gambar lama:", err.message);
                }
            }

            gambar = req.file.filename;
        }

        const { nama, harga_baru, harga_lama, deskripsi } = req.body;

        await modelMakanan.update(
            { nama, harga_baru, harga_lama, deskripsi, gambar },
            { where: { id } }
        );

        // Ambil kembali data terbaru setelah diupdate
        const updatedMakanan = await modelMakanan.findByPk(id);

        // Gunakan BASE_URL dari environment atau default
        const baseUrl = process.env.BASE_URL || "https://ahmad.rikpetik.site/uploads";

        res.status(200).json({
            status: 200,
            message: "Data makanan berhasil diperbarui",
            data: {
                ...updatedMakanan.toJSON(),
                gambar: updatedMakanan.gambar ? `${baseUrl}/${updatedMakanan.gambar}` : null
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Terjadi kesalahan: " + error.message
        });
    }
};

// Hapus data makanan
const deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const makanan = await modelMakanan.findByPk(id);

        if (!makanan) {
            return res.status(404).json({ message: "Data makanan tidak ditemukan" });
        }

        const filePath = path.resolve('./app/public/uploads/' + makanan.gambar);
        if (makanan.gambar) {
            await fs.unlink(filePath);
        }

        await modelMakanan.destroy({ where: { id } });

        res.status(200).json({ message: "Data makanan berhasil dihapus" });
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
    deleteData
};
