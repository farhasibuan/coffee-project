const { modelUser } = require("../models/relasi.js");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// GET: Ambil semua data user
const getData = async (req, res) => {
    try {
        const users = await modelUser.findAll({
            attributes: ["id", "nama", "email", "jenisKelamin", "noHandphone", "tanggalLahir", "kota", "createdAt", "updatedAt"]
        });

        res.status(200).json({
            status: 200,
            message: "Data User",
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validasi input
const validasi = [
    check("nama").not().isEmpty().withMessage("Nama tidak boleh kosong"),
    check("email").isEmail().withMessage("Email tidak valid"),
    check("password")
        .isLength({ min: 6 }).withMessage("Password minimal 6 karakter")
];

// POST: Tambah user baru
const createData = async (req, res) => {
    try {
        const { nama, email, jenisKelamin, noHandphone, tanggalLahir, kota, password } = req.body;

        if (!nama || !email || !jenisKelamin || !noHandphone || !tanggalLahir || !kota || !password) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await modelUser.create({
            nama,
            email,
            jenisKelamin,
            noHandphone,
            tanggalLahir,
            kota,
            password: hashedPassword
        });

        res.status(201).json({
            status: 201,
            message: "User berhasil ditambahkan",
            data: newUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Ambil satu data user berdasarkan ID
const findData = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await modelUser.findOne({
            where: { id },
            attributes: ["id", "nama", "email", "jenisKelamin", "noHandphone", "tanggalLahir", "kota", "createdAt", "updatedAt"]
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json({
            status: 200,
            message: "Data User",
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Update data user
const updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const { nama, email, password } = req.body;

        const user = await modelUser.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await modelUser.update(
            { nama, email, password: hashedPassword },
            { where: { id } }
        );

        res.json({
            status: 200,
            message: "Data user berhasil diperbarui"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Hapus user
const deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await modelUser.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        await modelUser.destroy({ where: { id } });

        res.json({
            status: 200,
            message: "User berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getData, createData, validasi, findData, updateData, deleteData };
