const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member", // By default, a user is a member
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // If the user is a member, this will point to their manager's ID
    },
    notices: [
      {
        title: String,
        message: String,
        date: { type: Date, default: Date.now },
      },
    ],
    depositRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deposit", // Reference to the Deposit model
      },
    ],
    balance: {
      type: Number,
      default: 0,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    due: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
