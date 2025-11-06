const express = require("express");
const router = express.Router();
const {
  getProposal,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
} = require("../controllers/proposalController");

router.get("/", getProposal);
router.get("/:id", getProposalById);
router.post("/", createProposal);
router.put("/:id", updateProposal);
router.delete("/:id", deleteProposal);

module.exports = router;
