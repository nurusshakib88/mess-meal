// controllers/orderControllers.js

const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  const { meals, date } = req.body;

  try {
    const order = new Order({
      user: req.user._id, // Set the user from the authenticated request
      meals,
      date,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Get all orders (for managers only)
const getAllOrders = async (req, res) => {
  try {
    // Only allow if user is a manager
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find().populate("user", "name email"); // Populate user details
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get own orders (for both managers and members)
const getOwnOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching your orders" });
  }
};

// Update order status (for managers only)
// const updateMealStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { mealType, status } = req.body; // Extract mealType and status from the request body

//   try {
//     // Validate status
//     if (!["pending", "accepted", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     // Find the order
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Only allow managers to update meal status
//     if (req.user.role !== "manager") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     // Find the specific meal and update its status
//     const meal = order.meals.find((m) => m.mealType === mealType);
//     if (!meal) {
//       return res.status(404).json({ message: "Meal not found in order" });
//     }

//     meal.status = status; // Update meal status
//     await order.save(); // Save the order with updated meal status

//     res.status(200).json(order); // Return the updated order
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating meal status" });
//   }
// };

// Update order status (for managers only)
const updateMealStatus = async (req, res) => {
  const { orderId } = req.params;
  const { mealType, status } = req.body;

  try {
    // Log input for debugging
    console.log(
      `Updating meal status for order: ${orderId}, mealType: ${mealType}, status: ${status}`
    );

    // Validate status
    if (!["pending", "accepted", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow managers to update meal status
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Find the specific meal and update its status
    const meal = order.meals.find((m) => m.mealType === mealType);
    if (!meal) {
      console.log("Meal not found in order");
      return res.status(404).json({ message: "Meal not found in order" });
    }

    // Log the current meal status before update
    console.log(`Current meal status: ${meal.status}`);

    meal.status = status; // Update the meal status
    await order.save(); // Save the updated order

    // Log successful status update
    console.log(`Updated meal status: ${meal.status}`);

    res.status(200).json(order); // Return the updated order
  } catch (error) {
    console.error("Error updating meal status:", error);
    res.status(500).json({ message: "Error updating meal status" });
  }
};

// Delete a specific meal type from an order
const deleteMealFromOrder = async (req, res) => {
  const { orderId } = req.params;
  const { mealType } = req.body; // The meal type to be deleted

  try {
    // Find the order
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check user role and ownership
    if (
      req.user.role !== "manager" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this meal type" });
    }

    // Find the index of the meal type to delete
    const mealIndex = order.meals.findIndex(
      (meal) => meal.mealType === mealType
    );

    // If the meal type does not exist, return an error
    if (mealIndex === -1) {
      return res.status(404).json({ message: "Meal type not found in order" });
    }

    // Remove the meal type from the order
    order.meals.splice(mealIndex, 1);

    // Save the updated order
    await order.save();

    return res
      .status(200)
      .json({ message: "Meal type deleted successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting meal type" });
  }
};
// controllers/orderController.js
// 1st
// Update the quantity of a specific meal type in an order
// const updateMealQuantity = async (req, res) => {
//   const { orderId } = req.params;
//   const { mealType, quantity } = req.body; // The meal type and new quantity

//   try {
//     // Find the order
//     const order = await Order.findById(orderId);

//     // Check if the order exists
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Check user role and ownership
//     if (
//       req.user.role !== "manager" &&
//       order.user.toString() !== req.user._id.toString()
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden: You cannot update this meal type" });
//     }

//     // Find the meal type to update
//     const mealIndex = order.meals.findIndex(
//       (meal) => meal.mealType === mealType
//     );

//     // If the meal type does not exist, return an error
//     if (mealIndex === -1) {
//       return res.status(404).json({ message: "Meal type not found in order" });
//     }

//     // Update the meal quantity
//     order.meals[mealIndex].quantity = quantity;

//     // Save the updated order
//     await order.save();

//     return res
//       .status(200)
//       .json({ message: "Meal quantity updated successfully", order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating meal quantity" });
//   }
// };
// 2nd
// Update the quantity of a specific meal type in an order
// const updateMealQuantity = async (req, res) => {
//   const { orderId } = req.params;
//   const { mealType, quantity } = req.body; // The meal type and new quantity

//   try {
//     // Find the order
//     const order = await Order.findById(orderId);

//     // Check if the order exists
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Check user role and ownership
//     if (
//       req.user.role !== "manager" &&
//       order.user.toString() !== req.user._id.toString()
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden: You cannot update this meal type" });
//     }

//     // Find the meal type to update
//     const mealIndex = order.meals.findIndex(
//       (meal) => meal.mealType === mealType
//     );

//     // If the meal type does not exist, return an error
//     if (mealIndex === -1) {
//       return res.status(404).json({ message: "Meal type not found in order" });
//     }

//     // Update the meal quantity
//     order.meals[mealIndex].quantity = quantity;

//     // Save the updated order
//     await order.save();

//     // After updating the quantity, update the due for the user
//     await updateUserDue(order.user);

//     return res
//       .status(200)
//       .json({ message: "Meal quantity updated successfully", order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating meal quantity" });
//   }
// };

//3rd
// Update the quantity of a specific meal type in an order
const updateMealQuantity = async (req, res) => {
  const { orderId } = req.params;
  const { mealType, quantity } = req.body; // The meal type and new quantity

  try {
    // Find the order
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check user role and ownership
    if (
      req.user.role !== "manager" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot update this meal type" });
    }

    // Find the meal type to update
    const mealIndex = order.meals.findIndex(
      (meal) => meal.mealType === mealType
    );

    // If the meal type does not exist, return an error
    if (mealIndex === -1) {
      return res.status(404).json({ message: "Meal type not found in order" });
    }

    // Update the meal quantity
    order.meals[mealIndex].quantity = quantity;

    // Save the updated order
    await order.save();

    return res
      .status(200)
      .json({ message: "Meal quantity updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating meal quantity" });
  }
};

const getMonthlyMealSummary = async (req, res) => {
  try {
    // Get the current user's role
    const { role, _id: userId } = req.user;

    // Base query: Allow managers to see all orders, members only their own
    const baseQuery = role === "manager" ? {} : { user: userId };

    // Aggregate meals by month
    const mealSummary = await Order.aggregate([
      { $match: { ...baseQuery, "meals.status": "accepted" } }, // Match only accepted meals
      { $unwind: "$meals" }, // Deconstruct the meals array
      { $match: { "meals.status": "accepted" } }, // Filter for accepted meals
      {
        $group: {
          _id: {
            year: { $year: "$date" }, // Extract the year from the order date
            month: { $month: "$date" }, // Extract the month from the order date
          },
          totalMeals: { $sum: "$meals.quantity" }, // Sum the quantities of accepted meals
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
    ]);

    res.status(200).json(mealSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching meal summary" });
  }
};

// Export your functions...
module.exports = {
  createOrder,
  getAllOrders,
  getOwnOrders,
  updateMealStatus,
  deleteMealFromOrder,
  updateMealQuantity,
  getMonthlyMealSummary,
};
