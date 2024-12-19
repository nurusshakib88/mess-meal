const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const { type, amount, month } = req.body;

    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "Only managers can add expenses." });
    }

    const expense = new Expense({
      type,
      amount,
      month,
      manager: req.user._id,
    });

    await expense.save();
    res.status(201).json({ message: "Expense added successfully.", expense });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.errors });
    }
    res
      .status(500)
      .json({ message: "Failed to add expense", error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { manager: req.user._id } }, // Match expenses for the logged-in user
      {
        $group: {
          _id: "$month", // Group by the month field
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $project: {
          month: "$_id",
          totalExpense: 1,
          _id: 0,
        },
      },
      { $sort: { month: -1 } }, // Sort by month descending
    ]);

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error in getExpenses:", error.message); // Log error for debugging
    res.status(500).json({ message: "Failed to retrieve expenses" });
  }
};

const calculatePerMealCost = async (req, res) => {
  try {
    const { month } = req.params;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required." });
    }

    const totalExpense = await Expense.aggregate([
      { $match: { manager: req.user._id, month } },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const numberOfMeals = await Order.countDocuments({
      manager: req.user._id,
      month,
    });

    if (!numberOfMeals || numberOfMeals === 0) {
      return res
        .status(400)
        .json({ message: "No meals found for the specified month." });
    }

    const perMealCost = totalExpense[0].totalExpense / numberOfMeals;

    res.status(200).json({ perMealCost });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to calculate per meal cost",
      error: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  calculatePerMealCost,
};
