// Middleware cek role pengguna
const cekAdmin = (req, res, next) => {
  if (req.user.role !== "Administrator") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

const cekProjectManager = (req, res, next) => {
  if (
    req.user.role !== "Project Manager" &&
    req.user.role !== "Administrator"
  ) {
    return res.status(403).json({
      message: "Access denied. Project Manager or Admin only.",
      currentRole: req.user.role,
    });
  }
  next();
};

module.exports = { cekAdmin, cekProjectManager };
