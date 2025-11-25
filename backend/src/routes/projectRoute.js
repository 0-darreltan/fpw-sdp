const express = require("express");
const router = express.Router();
const {
  getProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
} = require("../controllers/projectController");

const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin, cekProjectManager } = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, getProject);
router.get("/:id", authMiddleware, getProjectById);
router.post("/", authMiddleware, cekProjectManager, createProject);
router.put("/:id", authMiddleware, cekProjectManager, updateProject);
router.put("/:id/progress", authMiddleware, cekProjectManager, updateProjectProgress);
router.delete("/:id", authMiddleware, cekAdmin, deleteProject);

module.exports = router;
