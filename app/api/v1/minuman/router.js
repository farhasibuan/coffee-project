const express = require("express");
const { getData, createData, validasi, updateData, findData, deleteData } = require("./controller.js");
const uploadImage = require("../middleware/uploadImage.js");

const router = express.Router();

router.get("/minuman", getData);
router.post("/minuman/create", validasi, uploadImage.single("gambar"), createData);
router.put("/minuman/update/:id", validasi, uploadImage.single("gambar"), updateData);
router.get("/minuman/:id", findData);
router.delete("/minuman/:id", deleteData);

module.exports = router;
