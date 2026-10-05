const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

const getDashboard = async (_req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    monthStart.setUTCMonth(monthStart.getUTCMonth() - 11);
    const [products, orders, customers, revenue, lowStock, outOfStock, statusCounts, monthlySales, bestSellingProducts, popularCategories, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: { $ne: "admin" } }),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      Product.countDocuments({ stock: 0 }),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, status: { $ne: "cancelled" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", name: { $first: "$items.name" }, image: { $first: "$items.image" }, quantity: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        { $lookup: { from: Product.collection.name, localField: "items.productId", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $group: { _id: "$product.category", quantity: { $sum: "$items.quantity" }, orders: { $sum: 1 } } },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(8).populate("user", "name email"),
    ]);
    const salesByMonth = new Map(monthlySales.map((entry) => [entry._id, entry.revenue]));
    const salesOverTime = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(monthStart);
      month.setUTCMonth(month.getUTCMonth() + index);
      const key = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, "0")}`;
      return { month: key, revenue: salesByMonth.get(key) || 0 };
    });
    const orderStatuses = Object.fromEntries(statusCounts.map(({ _id, count }) => [_id, count]));
    res.json({
      stats: {
        products,
        orders,
        customers,
        revenue: revenue[0]?.total || 0,
        lowStock,
        outOfStock,
        orderStatuses,
        salesOverTime,
        bestSellingProducts,
        popularCategories,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Unable to load dashboard." });
  }
};

const updateOrderStatus = async (req, res) => {
  const allowedStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid order ID." });
  }
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Choose a valid order status." });
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    console.info("Admin audit: order status changed", {
      adminId: req.user.id,
      orderId: order.id,
      status: order.status,
    });
    res.json({ order });
  } catch (error) {
    console.error("Admin order update error:", error);
    res.status(500).json({ message: "Unable to update order." });
  }
};

const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100).populate("user", "name email");
    res.json({ orders });
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Unable to load orders." });
  }
};

const getCustomers = async (_req, res) => {
  try {
    const customers = await User.aggregate([
      { $match: { role: { $ne: "admin" } } },
      { $lookup: { from: Order.collection.name, localField: "_id", foreignField: "user", as: "orders" } },
      { $project: { name: 1, email: 1, role: 1, createdAt: 1, orderCount: { $size: "$orders" } } },
      { $sort: { createdAt: -1 } },
      { $limit: 250 },
    ]);
    res.json({ customers });
  } catch (error) {
    console.error("Admin customer list error:", error);
    res.status(500).json({ message: "Unable to load customers." });
  }
};

module.exports = { getDashboard, getOrders, getCustomers, updateOrderStatus };
