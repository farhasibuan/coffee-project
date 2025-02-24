const express = require("express");
const { getData, createData, validasi, updateData, findData, deleteData } = require("./controller.js");
const uploadImage = require("../middleware/uploadImage.js");

const router = express.Router();

router.get("/makanan", getData);
router.post("/makanan/create", validasi, uploadImage.single("gambar"), createData);
router.put("/makanan/update/:id", validasi, uploadImage.single("gambar"), updateData);
router.get("/makanan/:id", findData);
router.delete("/makanan/:id", deleteData);

module.exports = router;
