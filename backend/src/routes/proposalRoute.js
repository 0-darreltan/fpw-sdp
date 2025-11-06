const express = require("express");
const router = express.Router();
const {
  getProposal,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
} = require("../controllers/proposalController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin, cekProjectManager } = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, getProposal);
router.get("/:id", authMiddleware, getProposalById);
router.post("/", authMiddleware, cekProjectManager, createProposal);
router.put("/:id", authMiddleware, cekProjectManager, updateProposal);
router.delete("/:id", authMiddleware, cekAdmin, deleteProposal);

module.exports = router;
