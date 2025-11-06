const express = require("express");
const router = express.Router();
const {
  getRAB,
  getRABById,
  createRAB,
  updateRAB,
  deleteRAB,
} = require("../controllers/rabController");

router.get("/", getRAB);
router.get("/:id", getRABById);
router.post("/", createRAB);
router.put("/:id", updateRAB);
router.delete("/:id", deleteRAB);

module.exports = router;
