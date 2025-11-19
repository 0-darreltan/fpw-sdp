const { ActivityLog } = require("../models");

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10, type } = req.query;
    const query = {};

    if (type) query.type = type;

    const activities = await ActivityLog.find(query)
      .populate("userId", "name email role")
      .populate("projectId", "name")
      .populate("productId", "name")
      .populate("materialRequestId", "projectName")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get activity statistics
const getActivityStats = async (req, res) => {
  try {
    const stats = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create activity log (helper function)
const createActivityLog = async (activityData) => {
  try {
    const activity = new ActivityLog(activityData);
    await activity.save();
    return activity;
  } catch (error) {
    console.error("Error creating activity log:", error);
    throw error;
  }
};

module.exports = {
  getRecentActivities,
  getActivityStats,
  createActivityLog,
};
