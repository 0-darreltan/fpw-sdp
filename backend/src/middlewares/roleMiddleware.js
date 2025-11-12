// Middleware cek role pengguna
const cekAdmin = (req, res, next) => {
  console.log("cekAdmin - User role:", req.user.role, "| User:", req.user.username);
  // Support both old and new role formats
  const isAdmin = req.user.role === "admin" || req.user.role === "Administrator";
  
  if (!isAdmin) {
    return res.status(403).json({ 
      message: "Access denied. Admin only.",
      currentRole: req.user.role 
    });
  }
  next();
};

const cekProjectManager = (req, res, next) => {
  console.log("cekProjectManager - User role:", req.user.role, "| User:", req.user.username);
  // Support both old and new role formats
  const isProjectManager = 
    req.user.role === "project_manager" || 
    req.user.role === "Project Manager";
  const isAdmin = 
    req.user.role === "admin" || 
    req.user.role === "Administrator";
  
  if (!isProjectManager && !isAdmin) {
    return res
      .status(403)
      .json({ 
        message: "Access denied. Project Manager or Admin only.",
        currentRole: req.user.role 
      });
  }
  next();
};

module.exports = { cekAdmin, cekProjectManager };
