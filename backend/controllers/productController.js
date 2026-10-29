const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const isNumericValue = (value) =>
  (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) &&
  Number.isFinite(Number(value));

const validateProductInput = (body) => {
  const { name, description, price, image, category, stock } = body || {};
  if (
    typeof name !== "string" || !name.trim() || name.trim().length > 120 ||
    typeof description !== "string" || !description.trim() || description.length > 5000 ||
    typeof image !== "string" || !image.trim() || image.length > 2048 ||
    typeof category !== "string" || !category.trim() || category.trim().length > 80 ||
    !isNumericValue(price) || Number(price) < 0 ||
    (stock !== undefined && (!isNumericValue(stock) || !Number.isSafeInteger(Number(stock)) || Number(stock) < 0))
  ) return null;

  return {
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    image: image.trim(),
    category: category.trim(),
    stock: stock === undefined ? 0 : Number(stock),
  };
};

const isValidProductId = (id) => mongoose.isValidObjectId(id);

// Create a new product
const createProduct = async (req, res) => {
  try {
    const productData = validateProductInput(req.body);
    if (!productData) {
      return res.status(400).json({
        message: "Provide a name, description, image, category, non-negative price, and whole-number stock.",
      });
    }

    // Create product
    const product = await Product.create(productData);
    console.info("Admin audit: product created", { adminId: req.user.id, productId: product.id });

    // Send created product back
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          unitsSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { unitsSold: -1, "_id": 1 } },
    ]);

    const rankedSales = sales.filter(({ _id }) =>
      mongoose.isValidObjectId(_id),
    );
    const productsById = new Map(
      (await Product.find({
        _id: { $in: rankedSales.map(({ _id }) => _id) },
      })).map((product) => [product.id, product]),
    );

    const products = rankedSales
      .map(({ _id, unitsSold }) => {
        const product = productsById.get(_id.toString());
        return product ? { ...product.toObject(), unitsSold } : null;
      })
      .filter(Boolean)
      .slice(0, 3);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Get top products error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    const productData = validateProductInput(req.body);
    if (!productData) {
      return res.status(400).json({
        message: "Provide a name, description, image, category, non-negative price, and whole-number stock.",
      });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
    console.info("Admin audit: product updated", { adminId: req.user.id, productId: product.id });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    if (!isValidProductId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
    console.info("Admin audit: product deleted", { adminId: req.user.id, productId: product.id });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getTopProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
