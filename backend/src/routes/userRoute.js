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
  acceptProposal,
} = require("../controllers/UserController");

// 🔐 Middleware
const authMiddleware = require("../middleware/authMiddleware");
const { cekAdmin, cekProjectManager } = require("../middleware/roleMiddleware");

// ✅ Public routes (tidak butuh token)
router.post("/login", LoginUser);
router.post("/register", RegisterUser);
router.post("/logout", LogOutUser);

// ✅ Protected routes (butuh token)
router.get("/", authMiddleware, cekAdmin, getUser); // hanya Admin yang boleh lihat semua user
router.get("/:id", authMiddleware, getUserById); // semua user login bisa lihat profil sendiri

// 🔧 Create user (hanya Admin)
router.post("/", authMiddleware, cekAdmin, createUser);

// ✏️ Update user (Project Manager dan Admin)
router.put("/:id", authMiddleware, cekProjectManager, updateUser);

// ❌ Delete user (hanya Admin)
router.delete("/:id", authMiddleware, cekAdmin, deleteUser);

router.post("/accept-proposal", authMiddleware, acceptProposal);

module.exports = router;
