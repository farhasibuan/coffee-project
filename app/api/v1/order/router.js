const express = require("express");
const { getAllOrders, createOrder, deleteOrder } = require("./controller");
const multer = require("multer");

const upload = multer({ dest: "app/public/uploads/" });

const router = express.Router();

router.get("/order", getAllOrders);
router.post("/order/create", upload.single("logo"), createOrder);
router.delete("/order/delete/:id", deleteOrder);

module.exports = router;
