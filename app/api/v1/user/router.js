const express = require("express");
const { getUsers, getUserById, createUser, updateUser, deleteUser, validasiUser } = require("../controllers/userController");

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users/create", validasiUser, createUser);
router.put("/users/update/:id", validasiUser, updateUser);
router.delete("/users/delete/:id", deleteUser);

module.exports = router;