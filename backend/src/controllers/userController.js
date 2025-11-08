const jwt = require("jsonwebtoken");
const { User } = require("../models");
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
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    console.log(user);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Buat token
    const token = jwt.sign(
      { _id: user._id, role: user.role, username: user.username },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({
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
    if (
      req.user.role !== "Administrator" &&
      req.user._id.toString() !== targetId
    ) {
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

const acceptProposal = async (req, res) => {};

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
};
