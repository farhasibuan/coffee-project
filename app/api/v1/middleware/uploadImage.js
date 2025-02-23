// Middleware handling form-data
const multer = require("multer");
const path = require("path");

// Menentukan tipe data gambar yang diizinkan
const FILE_TYPE = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg"
};

// Menentukan direktori penyimpanan dan nama file yang disimpan
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "app/public/uploads");
    },

    filename: function (req, file, cb) {
        // Custom file name, format: sampul-tgl-RandomInt.extension
        const date = new Date();
        const format = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getSeconds()}`;
        cb(null, `${file.fieldname}-${format}.${file.mimetype.split('/')[1]}`);
    },
});

// Memeriksa ekstensi file yang diizinkan
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    // Cek ekstensi dan mimetype
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const limits = {
    fileSize: 5 * 1024 * 1024  // Maksimal ukuran file adalah 5MB
};

const uploadImage = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits: limits
});

module.exports = uploadImage;
