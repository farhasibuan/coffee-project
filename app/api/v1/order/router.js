const express = require("express");
const {
  getData,
  createData,
  validasi,
  updateData,
  findData,
  deleteData,
} = require("./controller.js");
const uploadImage = require("../middleware/uploadImage.js");

const router = express.Router();

router.get("/order", getData);
router.post("/order/create", validasi, uploadImage.single("gambar"), createData);
router.put("/order/update/:id", validasi, uploadImage.single("gambar"), updateData);
router.get("/order/:id", findData);
router.delete("/order/:id", deleteData);

module.exports = router;
