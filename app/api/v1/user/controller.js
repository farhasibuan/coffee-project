const { validationResult, check } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Validasi input
const validasiUser = [
    check("nama").notEmpty().withMessage("Nama tidak boleh kosong"),
    check("email").isEmail().withMessage("Email tidak valid"),
    check("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
    check("jenisKelamin").notEmpty().withMessage("Jenis Kelamin tidak boleh kosong"),
    check("noHandphone").notEmpty().withMessage("No Handphone tidak boleh kosong"),
    check("tanggalLahir").isDate().withMessage("Format tanggal lahir tidak valid"),
    check("kota").notEmpty().withMessage("Kota tidak boleh kosong"),
];

// GET: Ambil semua data user
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
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

// GET: Ambil user berdasarkan ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ["id", "nama", "email", "jenisKelamin", "noHandphone", "tanggalLahir", "kota", "createdAt", "updatedAt"]
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.status(200).json({
            status: 200,
            message: "Data User",
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Tambah user baru
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nama, email, jenisKelamin, noHandphone, tanggalLahir, kota, password } = req.body;

        // Cek apakah email sudah digunakan
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
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

// PUT: Update user berdasarkan ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, jenisKelamin, noHandphone, tanggalLahir, kota, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const [updated] = await User.update({
            nama,
            email,
            jenisKelamin,
            noHandphone,
            tanggalLahir,
            kota,
            password: hashedPassword
        }, {
            where: { id }
        });

        if (updated === 0) {
            return res.status(400).json({ message: "Harap update data terlebih dahulu" });
        }

        const updatedUser = await User.findOne({
            where: { id },
            attributes: ["id", "nama", "email", "jenisKelamin", "noHandphone", "tanggalLahir", "kota", "createdAt", "updatedAt"]
        });

        res.status(200).json({
            status: 200,
            message: "User berhasil diperbarui",
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Hapus user berdasarkan ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        await User.destroy({ where: { id } });

        res.status(200).json({
            status: 200,
            message: "User berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, validasiUser };
