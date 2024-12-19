// models/Deposit.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const depositSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Default status is pending
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);
