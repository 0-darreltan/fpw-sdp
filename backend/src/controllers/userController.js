const jwt = require("jsonwebtoken");
const { User, Proposal, RAB, Project } = require("../models");
const bcrypt = require("bcryptjs");

// ✅ GET semua user (Admin only)
const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ GET user by ID (kalau tidak ada ID, ambil dari token)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error: " + error });
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

    // Simpan token di database (optional, untuk tracking atau revocation)
    user.access_token = token;
    await user.save();

    // ✅ Kirim token di response body DAN cookie (double protection)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token, // ✅ kirim token di body
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
    res.status(500).json({ message: "Internal Server Error: " + error });
  }
};
// ✅ REGISTER user baru
const RegisterUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // hash password with bcryptjs before saving
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashed,
      role,
      name,
      email,
      phone,
      access_token: "",
      refresh_token: "",
    });
    await user.save();

    // return user data without password
    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    };

    res
      .status(201)
      .json({ message: "User registered successfully", user: userSafe });
  } catch (error) {
    console.error("RegisterUser error:", error);
    res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ CREATE user (hanya Admin) - mirip dengan RegisterUser tapi dapat dipanggil oleh Admin
const createUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const user = new User({ username, password, role, name, email, phone });
    await user.save();

    res.status(201).json({
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
    res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ UPDATE user (user sendiri atau admin)
const updateUser = async (req, res) => {
  try {
    const targetId = req.params.id || req.user._id;
    const updates = req.body;

    // Hanya admin atau user sendiri yang bisa update
    if (req.user.role !== "admin" && req.user._id.toString() !== targetId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndUpdate(targetId, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ DELETE user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error: " + error });
  }
};

// ✅ Logout (stateless)
const LogOutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};

const acceptProposal = async (req, res) => {
  try {
    const { proposalId } = req.body;
    if (!proposalId)
      return res
        .status(400)
        .json({ message: "proposalId is required in request body" });

    const proposal = await Proposal.findById(proposalId);
    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });

    // Only the customer who owns the proposal or an Administrator can accept
    if (
      req.user.role !== "Administrator" &&
      proposal.customerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent re-approving
    if (proposal.status === "approved")
      return res.status(400).json({ message: "Proposal already approved" });

    // Mark proposal as approved
    proposal.status = "approved";
    // optional: mark sentAt if not set
    if (!proposal.sentAt) proposal.sentAt = new Date();

    // Ensure related RAB exists and, if there's no project yet, create one
    const rab = await RAB.findById(proposal.rabId);
    if (rab && !rab.projectId) {
      const project = new Project({
        name: rab.title || `Project from RAB ${rab._id}`,
        location: "",
        description: rab.title || "",
        projectManagerId: proposal.projectManagerId,
        status: "active",
        startDate: new Date(),
        budget: proposal.total || 0,
      });
      await project.save();

      rab.projectId = project._id;
      await rab.save();
    }

    await proposal.save();

    res
      .status(200)
      .json({ message: "Proposal accepted successfully", data: proposal });
  } catch (error) {
    console.error("acceptProposal error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

const rejectProposal = async (req, res) => {
  try {
    const { proposalId } = req.body;
    if (!proposalId)
      return res
        .status(400)
        .json({ message: "proposalId is required in request body" });

    const proposal = await Proposal.findById(proposalId);
    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });

    // Only the customer who owns the proposal or an Administrator can reject
    if (
      req.user.role !== "Administrator" &&
      proposal.customerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent re-rejecting
    if (proposal.status === "rejected")
      return res.status(400).json({ message: "Proposal already rejected" });

    proposal.status = "rejected";
    if (!proposal.sentAt) proposal.sentAt = new Date();

    await proposal.save();

    res
      .status(200)
      .json({ message: "Proposal rejected successfully", data: proposal });
  } catch (error) {
    console.error("rejectProposal error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
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
  acceptProposal,
  rejectProposal,
};
