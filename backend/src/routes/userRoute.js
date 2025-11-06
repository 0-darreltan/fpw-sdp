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
const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin, cekProjectManager } = require("../middlewares/roleMiddleware");

// Debug: check imported types to catch any non-function exports
console.log("[userRoute] imports:", {
  authMiddleware: typeof authMiddleware,
  cekAdmin: typeof cekAdmin,
  cekProjectManager: typeof cekProjectManager,
  getUser: typeof getUser,
  getUserById: typeof getUserById,
  LoginUser: typeof LoginUser,
  RegisterUser: typeof RegisterUser,
  LogOutUser: typeof LogOutUser,
  createUser: typeof createUser,
  updateUser: typeof updateUser,
  deleteUser: typeof deleteUser,
  acceptProposal: typeof acceptProposal,
});

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
