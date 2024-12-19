const mongoose = require("mongoose");
const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meals: [
      {
        mealType: {
          type: String,
          enum: ["breakfast", "lunch", "dinner"],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "cancelled"],
          default: "pending",
        }, // Add meal-level status
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    overallStatus: {
      type: String,
      enum: ["pending", "accepted", "cancelled"],
      default: "pending",
    }, // Add overall status for the order
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
