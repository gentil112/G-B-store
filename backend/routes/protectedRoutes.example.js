// Protected Routes Examples
// Add these routes to backend/routes/protectedRoutes.js
// Then import and use in server.js: app.use("/api/protected", protectedRoutes);

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// Example: Get user profile (protected)
router.get("/profile", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      message: "User profile retrieved",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Example: Update user profile (protected)
router.put("/profile", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "User profile updated",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Example: Get user's orders (protected)
router.get("/orders", protect, async (req, res) => {
  try {
    // Assuming you have an Order model
    // const Order = require("../models/Order");
    // const orders = await Order.find({ userId: req.user.id });

    res.status(200).json({
      message: "User orders retrieved",
      userId: req.user.id,
      orders: [], // Replace with actual orders from database
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Example: Create new order (protected)
router.post("/orders", protect, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    // Validate request
    if (!items || !totalPrice) {
      return res.status(400).json({
        message: "Please provide items and totalPrice",
      });
    }

    // Save order to database
    // const order = await Order.create({
    //   userId: req.user.id,
    //   items,
    //   totalPrice,
    // });

    res.status(201).json({
      message: "Order created successfully",
      order: {
        userId: req.user.id,
        items,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
