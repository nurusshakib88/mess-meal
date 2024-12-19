// routes/userRoutes.js
const express = require("express");
const {
  registerManager,
  login,
  createMember,
  getUserById,
  getUsers,
  createUserByAdmin,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Register Manager Route
router.post("/register-manager", registerManager);
router.post("/create-member", authenticate, createMember);
router.post("/create", authenticate, createUserByAdmin);

// Login Route
router.post("/login", login);

// New Route to Get User by ID
router.get("/user/:id", authenticate, getUserById);

// Route to Get All Users
router.get("/users", authenticate, getUsers);
module.exports = router;