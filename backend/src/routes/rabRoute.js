const express = require("express");
const router = express.Router();
const {
  getRAB,
  getRABById,
  createRAB,
  updateRAB,
  updateRABStatus,
  deleteRAB,
  createRABRequest,
  assignRABToMe,
  assignRABToPM,
  sendRABQuotation,
  acceptRABQuotation,
  rejectRABQuotation,
  rejectRABByPM,
} = require("../controllers/rabController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin, cekProjectManager } = require("../middlewares/roleMiddleware");

// Semua RAB hanya bisa diakses oleh user login
router.get("/", authMiddleware, getRAB);
router.get("/:id", authMiddleware, getRABById);

// Customer: Create RAB request
router.post("/request", authMiddleware, createRABRequest);

// Customer: Accept/Reject RAB quotation
router.post("/:id/accept", authMiddleware, acceptRABQuotation);
router.post("/:id/reject", authMiddleware, rejectRABQuotation);

// PM/Admin: Reject RAB request
router.post("/:id/reject-by-pm", authMiddleware, rejectRABByPM);

// PM: Assign RAB to self
router.post("/:id/assign", authMiddleware, cekProjectManager, assignRABToMe);

// Admin: Assign RAB to specific PM
router.put("/:id/assign", authMiddleware, cekAdmin, assignRABToPM);

// Admin: Update RAB status
router.put("/:id/status", authMiddleware, cekAdmin, updateRABStatus);

// PM: Send RAB quotation
router.post("/:id/quotation", authMiddleware, cekProjectManager, sendRABQuotation);

// Legacy routes (keep for backward compatibility)
router.post("/", authMiddleware, createRAB);
router.put("/:id", authMiddleware, cekProjectManager, updateRAB);

// Hapus RAB hanya oleh Admin
router.delete("/:id", authMiddleware, cekAdmin, deleteRAB);

module.exports = router;
