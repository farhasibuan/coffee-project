const express = require("express");
const { getData,createData,findData } = require("./controller.js");
const uploadImage = require("../middleware/uploadImage.js");

const router = express.Router();

router.get("/order", getData);
router.post("/order/create", validasi, uploadImage.single("gambar"), createData);
router.get("/order/:id", findData);

module.exports = router;