const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  // 🔹 Ambil header Authorization
  const authHeader = req.headers.authorization;

  // 🔹 Cek apakah header ada dan berformat "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // 🔹 Ambil token dari header
  const token = authHeader.split(" ")[1];

  try {
    // 🔹 Verifikasi token pakai secret key
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // 🔹 Cek apakah user masih ada di database
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    // 🔹 Simpan data user ke request
    req.user = user;
    next(); // lanjut ke controller berikutnya
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ message: "Server error during token verification." });
  }
};

module.exports = authMiddleware;
