import React, { useState } from "react";
import axios from "axios";

const CreateOrder = () => {
  const [meals, setMeals] = useState([]);
  const [date, setDate] = useState("");
  const [quantities, setQuantities] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  const handleMealChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMeals((prev) => [...prev, value]);
    } else {
      setMeals((prev) => prev.filter((meal) => meal !== value));
    }
  };

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    setQuantities((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      meals: meals.map((meal) => ({
        mealType: meal,
        quantity: quantities[meal],
      })),
      date,
    };

    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in local storage
      const response = await axios.post(
        "https://mess-meal-server.vercel.app/api/orders", // Replace with your API endpoint
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Order created:", response.data);
      // Optionally reset the form
      setMeals([]);
      setQuantities({ breakfast: 0, lunch: 0, dinner: 0 });
      setDate("");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" w-60 ">
      <h2 className="font-bold text-lg mb-5">Create Order</h2>
      <div>
        <h1 className="font-semibold mb-3">Select Date</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="input w-full "
        />
      </div>
      <h1 className="font-semibold mb-3 mt-5">Select Meal Type and Quantity</h1>
      <div className="p-5 shadow-lg rounded-lg bg-slate-300 space-y-3">
        <div className="flex gap-3 justify-between items-center">
          <label className="flex gap-3 items-center">
            <input
              type="checkbox"
              value="breakfast"
              checked={meals.includes("breakfast")}
              onChange={handleMealChange}
              className="checkbox checkbox-primary checkbox-sm"
            />
            Breakfast
          </label>
          {meals.includes("breakfast") && (
            <input
              type="number"
              name="breakfast"
              value={quantities.breakfast}
              min="1"
              onChange={handleQuantityChange}
              placeholder="Quantity"
              required
              className="px-3 rounded w-20"
            />
          )}
        </div>
        <div className="flex gap-3 justify-between items-center">
          <label className="flex gap-3 items-center">
            <input
              type="checkbox"
              value="lunch"
              checked={meals.includes("lunch")}
              onChange={handleMealChange}
              className="checkbox checkbox-primary checkbox-sm"
            />
            Lunch
          </label>
          {meals.includes("lunch") && (
            <input
              type="number"
              name="lunch"
              value={quantities.lunch}
              min="1"
              onChange={handleQuantityChange}
              placeholder="Quantity"
              required
              className="px-3 rounded w-20"
            />
          )}
        </div>
        <div className="flex gap-3 justify-between items-center">
          <label className="flex gap-3 items-center">
            <input
              type="checkbox"
              value="dinner"
              checked={meals.includes("dinner")}
              onChange={handleMealChange}
              className="checkbox checkbox-primary checkbox-sm"
            />
            Dinner
          </label>
          {meals.includes("dinner") && (
            <input
              type="number"
              name="dinner"
              value={quantities.dinner}
              min="1"
              onChange={handleQuantityChange}
              placeholder="Quantity"
              required
              className="px-3 rounded w-20"
            />
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full mt-5">
        Submit Order
      </button>
    </form>
  );
};

export default CreateOrder;
