const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { customer, items, totalPrice } = req.body;

    // Check required information
    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      return res.status(400).json({
        message: "Please provide all customer information",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Your order must contain at least one product",
      });
    }

    if (totalPrice === undefined || totalPrice < 0) {
      return res.status(400).json({
        message: "Please provide a valid total price",
      });
    }

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      customer,
      items,
      totalPrice,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Failed to retrieve your orders" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
