const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const { getDashboard, getOrders, getCustomers, updateOrderStatus } = require("../controllers/adminController");

const router = express.Router();
router.use(protect, requireAdmin);
router.get("/dashboard", getDashboard);
router.get("/orders", getOrders);
router.get("/customers", getCustomers);
router.patch("/orders/:id", updateOrderStatus);
module.exports = router;
