const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  googleLogin,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", googleLogin);

router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ message: "Unable to load account." });
  }
});

module.exports = router;
