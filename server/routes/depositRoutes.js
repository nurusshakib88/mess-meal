// routes/depositRoutes.js
const express = require("express");
const {
  createDeposit,
  getDeposits,
  updateDepositStatus,
} = require("../controllers/depositController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to create a deposit request
router.post("/", authenticate, createDeposit);

// Route to get deposits (for members and managers)
router.get("/", authenticate, getDeposits);

// Route to update deposit status (for managers)
router.patch("/:depositId/status", authenticate, updateDepositStatus);

module.exports = router;
