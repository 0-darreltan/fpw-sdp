// Middleware cek role pengguna
const cekAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      message: "Access denied. Admin only.",
      currentRole: req.user.role 
    });
  }
  next();
};

const cekProjectManager = (req, res, next) => {
  if (
    req.user.role !== "project_manager" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Access denied. Project Manager or Admin only.",
      currentRole: req.user.role,
    });
  }
  next();
};

module.exports = { cekAdmin, cekProjectManager };
