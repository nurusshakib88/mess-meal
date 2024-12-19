// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const depositRoutes = require("./routes/depositRoutes");
// const expenseRoutes = require("./routes/expenseRoutes");
// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(express.json());

// // Enable CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace this with your frontend origin
//     credentials: true, // Enable sending credentials like cookies or authorization headers
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
//   })
// );

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((error) => console.error("MongoDB connection error:", error));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/deposits", depositRoutes);
// app.use("/api/expenses", expenseRoutes);

// // Global error handling (optional but useful)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const depositRoutes = require("./routes/depositRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow credentials (like cookies and authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Explicitly allow PATCH
  allowedHeaders: ["Content-Type", "Authorization"], // Allow headers
};

// Use CORS with the specified options
app.use(cors(corsOptions));

// Handle pre-flight OPTIONS request
app.options("*", cors(corsOptions)); // Ensure OPTIONS requests are handled correctly

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/expenses", expenseRoutes);

// Global error handling (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});