const jwt = require("jsonwebtoken");
const { User, RAB, Project } = require("../models");
const bcrypt = require("bcryptjs");

// ✅ GET semua user (Admin only)
const getUser = async (req, res) => {
  try {
    const { role } = req.query;
    console.log("📋 getUser called - role filter:", role);
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password");
    console.log("✅ Found users:", users.length);
    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ getUser error:", error);
    return res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ GET user by ID (kalau tidak ada ID, ambil dari token)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ LOGIN user (kirim token JWT)
const LoginUser = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id, role: user.role, username: user.username },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    user.access_token = token;
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

const RegisterUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const roleMapping = {
      Customer: "customer",
      "Project Manager": "project_manager",
      Administrator: "admin",
    };
    const dbRole = roleMapping[role] || "customer";

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashed,
      role: dbRole,
      name,
      email,
      phone,
      access_token: "",
      refresh_token: "",
    });
    await user.save();

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    };

    return res
      .status(201)
      .json({ message: "User registered successfully", user: userSafe });
  } catch (error) {
    console.error("RegisterUser error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `${field} already exists. Please use a different ${field}.`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An error occurred",
    });
  }
};

// ✅ CREATE user (hanya Admin) - mirip dengan RegisterUser tapi dapat dipanggil oleh Admin
const createUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // Convert role from frontend format to database format
    const roleMapping = {
      Customer: "customer",
      "Project Manager": "project_manager",
      Administrator: "admin",
    };
    const dbRole = roleMapping[role] || role;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: dbRole,
      name,
      email,
      phone,
      access_token: "",
      refresh_token: "",
    });
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("createUser error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `${field} already exists. Please use a different ${field}.`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An error occurred",
    });
  }
};

// ✅ UPDATE user (user sendiri atau admin)
const updateUser = async (req, res) => {
  try {
    console.log(
      "updateUser called by:",
      req.user.username,
      "| role:",
      req.user.role
    );
    console.log("Target user ID:", req.params.id);
    console.log("Current user ID:", req.user._id);

    const targetId = req.params.id || req.user._id;
    const updates = { ...req.body };

    // Hanya admin atau user sendiri yang bisa update
    if (req.user.role !== "admin" && req.user._id.toString() !== targetId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Hash password jika ada di request body
    if (updates.password) {
      console.log("Password update detected, hashing...");
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    console.log("✅ Authorization passed, updating user...");
    const user = await User.findByIdAndUpdate(targetId, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ DELETE user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ Logout (stateless)
const LogOutUser = (req, res) => {
  return res.status(200).json({ message: "User logged out successfully" });
};

// ✅ Get User Activity Report
const getUserActivityReport = async (req, res) => {
  try {
    const { startDate, endDate, role } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;

    // Fetch all users
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    // Date filter for createdAt
    let filteredUsers = users;
    if (startDate || endDate) {
      filteredUsers = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        if (startDate && userDate < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (userDate > end) return false;
        }
        return true;
      });
    }

    // Import ActivityLog model
    const { ActivityLog } = require("../models");

    // Build activity log query
    const activityQuery = {};
    if (startDate || endDate) {
      activityQuery.timestamp = {};
      if (startDate) activityQuery.timestamp.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        activityQuery.timestamp.$lte = end;
      }
    }

    // Fetch activity logs
    const activityLogs = await ActivityLog.find(activityQuery)
      .populate("userId", "name email role username")
      .sort({ timestamp: -1 });

    // Aggregate user statistics
    const userStats = {};
    const roleStats = {};
    const activityByDate = {};

    filteredUsers.forEach((user) => {
      const userId = user._id.toString();
      userStats[userId] = {
        userId,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        registeredAt: user.createdAt,
        lastActive: null,
        activityCount: 0,
        actions: {
          CREATE: 0,
          UPDATE: 0,
          DELETE: 0,
          VIEW: 0,
          LOGIN: 0,
        },
      };

      // Role statistics
      if (!roleStats[user.role]) {
        roleStats[user.role] = {
          role: user.role,
          userCount: 0,
          activeUsers: 0,
          totalActivities: 0,
        };
      }
      roleStats[user.role].userCount++;
    });

    // Process activity logs
    activityLogs.forEach((log) => {
      if (!log.userId) return;

      const userId = log.userId._id.toString();
      const dateKey = new Date(log.timestamp).toISOString().split("T")[0];
      const action = log.action || "VIEW";

      // Update user stats
      if (userStats[userId]) {
        userStats[userId].activityCount++;
        if (!userStats[userId].lastActive || log.timestamp > userStats[userId].lastActive) {
          userStats[userId].lastActive = log.timestamp;
        }
        if (userStats[userId].actions[action] !== undefined) {
          userStats[userId].actions[action]++;
        }

        // Update role stats
        const userRole = userStats[userId].role;
        if (roleStats[userRole]) {
          roleStats[userRole].totalActivities++;
        }
      }

      // Activity by date
      if (!activityByDate[dateKey]) {
        activityByDate[dateKey] = {
          date: dateKey,
          totalActivities: 0,
          uniqueUsers: new Set(),
          actions: {
            CREATE: 0,
            UPDATE: 0,
            DELETE: 0,
            VIEW: 0,
            LOGIN: 0,
          },
        };
      }
      activityByDate[dateKey].totalActivities++;
      activityByDate[dateKey].uniqueUsers.add(userId);
      if (activityByDate[dateKey].actions[action] !== undefined) {
        activityByDate[dateKey].actions[action]++;
      }
    });

    // Count active users per role
    Object.values(userStats).forEach((user) => {
      if (user.activityCount > 0 && roleStats[user.role]) {
        roleStats[user.role].activeUsers++;
      }
    });

    // Convert to arrays and sort
    const userList = Object.values(userStats).sort((a, b) => b.activityCount - a.activityCount);
    const roleList = Object.values(roleStats);
    const activityTimeline = Object.values(activityByDate)
      .map((day) => ({
        ...day,
        uniqueUsers: day.uniqueUsers.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate statistics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeUsers30d = userList.filter(
      (u) => u.lastActive && new Date(u.lastActive) >= thirtyDaysAgo
    ).length;
    const activeUsers7d = userList.filter(
      (u) => u.lastActive && new Date(u.lastActive) >= sevenDaysAgo
    ).length;
    const newUsers30d = filteredUsers.filter(
      (u) => new Date(u.createdAt) >= thirtyDaysAgo
    ).length;

    const stats = {
      totalUsers: filteredUsers.length,
      activeUsers30d,
      activeUsers7d,
      inactiveUsers: filteredUsers.length - activeUsers30d,
      newUsers30d,
      totalActivities: activityLogs.length,
      averageActivitiesPerUser:
        filteredUsers.length > 0 ? activityLogs.length / filteredUsers.length : 0,
      mostActiveUser: userList[0] || null,
    };

    return res.status(200).json({
      success: true,
      data: {
        stats,
        users: userList,
        roleDistribution: roleList,
        activityTimeline,
        recentActivities: activityLogs.slice(0, 50),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUser,
  getUserById,
  LoginUser,
  RegisterUser,
  LogOutUser,
  createUser,
  updateUser,
  deleteUser,
  getUserActivityReport,
};
