const express = require("express");
const { getData,createData,findData } = require("./controller.js");
const uploadImage = require("../middleware/uploadImage.js");

const router = express.Router();

router.get("/brand", getData);
router.post("/brand/create", validasi, uploadImage.single("gambar"), createData);
router.get("/brand/:id", findData);

module.exports = router;