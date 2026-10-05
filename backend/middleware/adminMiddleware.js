const User = require("../models/User");

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select("role");
    if (!user || user.role !== "admin") {
      console.warn("Admin access denied", { userId: req.user?.id, path: req.originalUrl });
      return res.status(403).json({ message: "Administrator access required." });
    }
    req.admin = user;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    res.status(500).json({ message: "Unable to verify administrator access." });
  }
};

module.exports = requireAdmin;
