const express = require("express");
const router = express.Router();
const {
  getMaterialRequests,
  getMaterialRequestById,
  createMaterialRequest,
  updateMaterialRequest,
  deleteMaterialRequest,
} = require("../controllers/materialRequestController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekProjectManager, cekAdmin } = require("../middlewares/roleMiddleware");

// Project Manager can create and view their requests
router.get("/", authMiddleware, getMaterialRequests);
router.get("/:id", authMiddleware, getMaterialRequestById);
router.post("/", authMiddleware, cekProjectManager, createMaterialRequest);

// Admin can update (approve/reject) and delete requests
router.put("/:id", authMiddleware, cekAdmin, updateMaterialRequest);
router.delete("/:id", authMiddleware, cekAdmin, deleteMaterialRequest);

module.exports = router;
