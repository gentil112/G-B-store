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

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", googleLogin);

router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated!",
    user: req.user,
  });
});

module.exports = router;
