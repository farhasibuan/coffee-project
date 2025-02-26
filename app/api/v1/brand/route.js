const express = require("express");
const { getData,createData,findData, deleteData } = require("./controller.js");
const uploadImage = require("../middleware/uploadImage.js");

const router = express.Router();

router.get("/brand", getData);
router.post("/brand/create", uploadImage.single("logo"), createData);
router.get("/brand/:id", findData);
router.delete("/brand/delete/:id", deleteData);

module.exports = router;