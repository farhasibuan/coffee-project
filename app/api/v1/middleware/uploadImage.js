const multer = require("multer");
const path = require("path");

// Tentukan tempat penyimpanan file dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./app/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter file untuk memastikan hanya gambar yang dapat diupload
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya gambar yang diperbolehkan"), false);
  }
};

// Inisialisasi Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
