const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Not authorized. Please login again.",
      });
    }

    const { customer, items } = req.body;

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

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your order must contain at least one product",
      });
    }

    const quantities = new Map();
    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !/^[a-f\d]{24}$/i.test(item.productId) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Each item must have a valid product ID and a positive whole-number quantity",
        });
      }

      const productId = new mongoose.Types.ObjectId(item.productId).toString();
      quantities.set(productId, (quantities.get(productId) || 0) + item.quantity);
      if (!Number.isSafeInteger(quantities.get(productId))) {
        return res.status(400).json({ message: "Requested quantity is too large" });
      }
    }

    const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
    const productsById = new Map(products.map((product) => [product.id, product]));
    if (productsById.size !== quantities.size) {
      return res.status(400).json({
        message: "One or more products are no longer available",
      });
    }

    const orderItems = [...quantities.entries()].map(([productId, quantity]) => {
      const product = productsById.get(productId);
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      };
    });
    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // A conditional update makes the stock check and decrement one atomic operation.
    const decremented = [];
    try {
      for (const [productId, quantity] of quantities) {
        const product = await Product.findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true },
        );
        if (!product) {
          const currentProduct = productsById.get(productId);
          const error = new Error(
            currentProduct.stock === 0
              ? `${currentProduct.name} is out of stock`
              : `Only ${currentProduct.stock} ${currentProduct.name} available`,
          );
          error.statusCode = 409;
          throw error;
        }
        decremented.push({ productId, quantity });
      }

      const order = await Order.create({
        user: req.user.id,
        customer,
        items: orderItems,
        totalPrice,
      });

      return res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      await Promise.all(
        decremented.map(({ productId, quantity }) =>
          Product.updateOne({ _id: productId }, { $inc: { stock: quantity } }),
        ),
      );
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      throw error;
    }
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Not authorized. Please login again.",
      });
    }

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
