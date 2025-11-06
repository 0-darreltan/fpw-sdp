const express = require("express");
const router = express.Router();
const {
  getRAB,
  getRABById,
  createRAB,
  updateRAB,
  deleteRAB,
} = require("../controllers/rabController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin, cekProjectManager } = require("../middlewares/roleMiddleware");

// Semua RAB hanya bisa diakses oleh user login
router.get("/", authMiddleware, getRAB);
router.get("/:id", authMiddleware, getRABById);

// Buat dan ubah RAB hanya oleh Project Manager atau Admin
router.post("/", authMiddleware, cekProjectManager, createRAB);
router.put("/:id", authMiddleware, cekProjectManager, updateRAB);

// Hapus RAB hanya oleh Admin
router.delete("/:id", authMiddleware, cekAdmin, deleteRAB);

module.exports = router;
