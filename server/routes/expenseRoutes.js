const express = require("express");
const { authenticate } = require("../middleware/authMiddleware"); // Ensure this middleware is correctly implemented
const {
  addExpense,
  getExpenses,
  calculatePerMealCost, // Include if this functionality exists
} = require("../controllers/expenseController"); // Ensure the controllers are correctly implemented and exported

const router = express.Router();

// Routes for expense management
// Add a new expense
router.post("/add-expense", authenticate, addExpense);

// Get all expenses for the authenticated user
router.get("/get-expenses", authenticate, getExpenses);

// Calculate per meal cost for a specific month (optional)
router.get(
  "/calculate-per-meal-cost/:month",
  authenticate,
  calculatePerMealCost
);

module.exports = router;
