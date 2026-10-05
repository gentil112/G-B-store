const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

router.post("/", protect, requireAdmin, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
