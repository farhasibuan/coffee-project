const express = require("express");
const { getData, createData, validasi, updateData, findData, deleteData } = require("./controller.js");

const router = express.Router();

router.get("/user", getData);
router.post("/user/create", validasi, createData);
router.put("/user/update/:id", validasi, updateData);
router.get("/user/:id", findData);
router.delete("/user/:id", deleteData);

module.exports = router;
