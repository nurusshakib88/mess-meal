// controllers/depositController.js
const Deposit = require("../models/Deposit");
const User = require("../models/User");

// Create a deposit request
const createDeposit = async (req, res) => {
  try {
    const { amount, reference } = req.body;
    const deposit = new Deposit({
      userId: req.user._id, // This should point to the currently authenticated user's ID
      amount,
      reference,
    });
    await deposit.save();
    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ message: "Error creating deposit", error });
  }
};

// controllers/depositController.js

// Get deposits for manager or member
const getDeposits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role === "manager") {
      // Get all deposits for members under this manager
      const deposits = await Deposit.find({
        userId: { $in: await User.find({ managerId: user._id }).select("_id") },
      }).populate("userId", "name");
      return res.status(200).json(deposits);
    } else {
      // Get only the deposits for the logged-in member
      const deposits = await Deposit.find({ userId: req.user._id }).populate(
        "userId",
        "name"
      );
      return res.status(200).json(deposits);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching deposits", error });
  }
};

// Update deposit status (approve/reject)
// const updateDepositStatus = async (req, res) => {
//   const { depositId } = req.params;
//   const { status } = req.body;

//   try {
//     const deposit = await Deposit.findById(depositId);

//     if (!deposit) {
//       return res.status(404).json({ message: "Deposit not found" });
//     }

//     deposit.status = status;
//     await deposit.save();
//     res.status(200).json(deposit);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating deposit status", error });
//   }
// };
// Update deposit status (approve/reject)
const updateDepositStatus = async (req, res) => {
  const { depositId } = req.params;
  const { status } = req.body;

  try {
    const deposit = await Deposit.findById(depositId);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    // Update status
    deposit.status = status;
    await deposit.save();

    // If approved, update user's balance
    if (status === "approved") {
      const user = await User.findById(deposit.userId);
      if (user) {
        user.balance += deposit.amount;
        await user.save();
      }
    }

    res.status(200).json(deposit);
  } catch (error) {
    res.status(500).json({ message: "Error updating deposit status", error });
  }
};
module.exports = {
  createDeposit,
  getDeposits,
  updateDepositStatus,
};
