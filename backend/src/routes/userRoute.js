const express = require("express");
const router = express.Router();
const {
  getUser,
  getUserById,
  LoginUser,
  RegisterUser,
  LogOutUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

router.get("/", getUser);
router.get("/:id", getUserById);
router.post("/login", LoginUser);
router.post("/register", RegisterUser);
router.post("/logout", LogOutUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
