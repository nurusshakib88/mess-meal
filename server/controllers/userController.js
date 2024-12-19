const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register Manager
const registerManager = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = new User({
      name,
      email,
      password: hashedPassword,
      role: "manager",
    });

    await newManager.save();
    res.status(201).json({ message: "Manager registered successfully" });
  } catch (error) {
    console.error("Error in registerManager:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for user: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        due: user.due,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new member under a manager
const createMember = async (req, res) => {
  try {
    const manager = req.user; // This should contain the authenticated manager's information

    // Check if the user making the request is a manager
    if (manager.role !== "manager") {
      return res
        .status(403)
        .json({ message: "Only managers can create members." });
    }

    const { name, email, password } = req.body;

    // Check if the member email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new member with the managerId
    const newMember = new User({
      name,
      email,
      password: hashedPassword,
      role: "member", // Explicitly set the role as 'member'
      managerId: manager._id, // Associate the member with the manager
    });

    // Save the member in the database
    await newMember.save();

    res
      .status(201)
      .json({ message: "Member created successfully", member: newMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Create a new manager and member
const createUserByAdmin = async (req, res) => {
  try {
    const admin = req.user; // This should contain the authenticated admin's information

    // Check if the user making the request is an admin
    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create managers or members." });
    }

    const { name, email, password, role, managerId } = req.body;

    // Check if the role is valid (either "manager" or "member")
    if (!["manager", "member"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Only 'manager' or 'member' roles are allowed.",
      });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // Set the role based on the request (manager or member)
      managerId: role === "member" && managerId ? managerId : null, // Only assign managerId for members
    });

    // Save the user in the database
    await newUser.save();

    res
      .status(201)
      .json({ message: `${role} created successfully`, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Get all users for admin or specific members for manager
const getUsers = async (req, res) => {
  try {
    const { role } = req.user;

    let users;
    if (role === "admin") {
      users = await User.find().populate("managerId", "name email");
    } else if (role === "manager") {
      users = await User.find({ managerId: req.user._id }).populate(
        "managerId",
        "name email"
      );
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user by ID and populate manager info
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("managerId", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerManager,
  login,
  createMember,
  getUsers,
  getUserById,
  createUserByAdmin,
};
