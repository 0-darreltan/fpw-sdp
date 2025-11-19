const express = require("express");
const router = express.Router();
const {
  getRecentActivities,
  getActivityStats,
} = require("../controllers/activityController");
const authMiddleware = require("../middlewares/authMiddleware");
const { cekAdmin } = require("../middlewares/roleMiddleware");

// Get recent activities (admin only)
router.get(
  "/",
  authMiddleware,
  cekAdmin,
  getRecentActivities
);

// Get activity statistics (admin only)
router.get(
  "/stats",
  authMiddleware,
  cekAdmin,
  getActivityStats
);

module.exports = router;
