// routes/orderRoutes.js

const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getOwnOrders,
  updateMealStatus,
  deleteMealFromOrder,
  updateMealQuantity,
  getMonthlyMealSummary,
} = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post("/", authenticate, createOrder);

// Get all orders (for managers only)
router.get("/all", authenticate, getAllOrders);

// Get own orders (for both managers and members)
router.get("/", authenticate, getOwnOrders);

// Update order status (for managers only)
router.patch("/:orderId/meal/status", authenticate, updateMealStatus);

// Delete a specific meal type from an order
router.delete("/:orderId/meal", authenticate, deleteMealFromOrder); // Add the DELETE route for specific meal type

// Update the quantity of a specific meal type in an order
router.put("/:orderId/meal", authenticate, updateMealQuantity); // Add the PUT route for updating meal quantity

// Get total meals per month (accepted only)
router.get("/summary/monthly-meals", authenticate, getMonthlyMealSummary);

module.exports = router;
