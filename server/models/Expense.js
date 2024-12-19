const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["utility", "food", "other"],
      required: [true, "Expense type is required."],
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required."],
      min: [0, "Amount must be greater than or equal to 0."],
    },
    month: {
      type: String, // Format: YYYY-MM
      required: [true, "Expense month is required."],
      validate: {
        validator: function (value) {
          return /^\d{4}-(0[1-9]|1[0-2])$/.test(value); // Regex for YYYY-MM
        },
        message: (props) =>
          `${props.value} is not a valid month format. Use YYYY-MM.`,
      },
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the manager is a user document
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexing for performance
expenseSchema.index({ month: 1, manager: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
