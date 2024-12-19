import React, { useState, useEffect } from "react";
import axios from "axios";

const AddExpense = () => {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [totalExpenses, setTotalExpenses] = useState([]);
  const [monthlyMeals, setMonthlyMeals] = useState([]);
  const [perMealCost, setPerMealCost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTotalExpenses();
    fetchMonthlyMeals(); // Fetch the monthly meals data when the component mounts
  }, []);

  // Fetch total expenses
  const fetchTotalExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://mess-meal-server.vercel.app/api/expenses/get-expenses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  // Fetch monthly meals data
  const fetchMonthlyMeals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://mess-meal-server.vercel.app/api/orders/summary/monthly-meals",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMonthlyMeals(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !amount || !month) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://mess-meal-server.vercel.app/api/expenses/add-expense",
        { type, amount: parseFloat(amount), month },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTotalExpenses();
      alert("Expense added successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense.");
    }
  };

  // Calculate per meal cost for a selected month
  const calculateCost = (selectedMonth) => {
    // Find the monthly meal count for the selected month
    const mealData = monthlyMeals.find(
      (meal) =>
        `${meal._id.year}-${String(meal._id.month).padStart(2, "0")}` ===
        selectedMonth
    );

    if (!mealData) {
      setError("No meal data found for this month.");
      return;
    }

    const totalMeals = mealData.totalMeals;

    // Find the total expenses for the selected month
    const expenseData = totalExpenses.find(
      (expense) => expense.month === selectedMonth
    );

    if (!expenseData) {
      setError("No expenses found for this month.");
      return;
    }

    const totalExpensesForMonth = expenseData.totalExpense;

    // Calculate the per meal cost
    const perMealCost = totalMeals > 0 ? totalExpensesForMonth / totalMeals : 0;
    setPerMealCost(perMealCost);
  };

  return (
    <div className="grid grid-cols-2 gap-10">
      <div>
        <h2 className="font-bold text-lg mb-5">Add Expense</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full bg-slate-300 p-5 rounded-lg"
        >
          <div className="space-y-2">
            <label>Expense Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Type</option>
              <option value="utility">Utility</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="input w-full"
            />
          </div>
          <div className="space-y-2">
            <label>Month (YYYY-MM):</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="input w-full"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-5">
          Total Expenses for Each Month
        </h3>
        {totalExpenses.length > 0 ? (
          <table className="table table-fixed rounded-lg overflow-hidden">
            <thead className="bg-primary text-white">
              <th>Month</th>
              <th>Expenses</th>
              <th>Calculate(Per meal cost)</th>
            </thead>
            {totalExpenses.map((expense) => (
              <tr key={expense.month}>
                <td>{expense.month}</td>

                <td>${expense.totalExpense.toFixed(2)}</td>

                <td className="text-right">
                  <button
                    onClick={() => calculateCost(expense.month)}
                    className="btn bg-slate-300  w-20"
                  >
                    Calculate
                  </button>
                </td>
              </tr>
            ))}
          </table>
        ) : (
          <p>No expenses found.</p>
        )}
        {perMealCost !== null && (
          <div className="flex items-center justify-between">
            <h1 className="font-bold my-3">Per Meal Cost Result</h1>
            <p className="font-bold text-2xl text-primary">
              {perMealCost.toFixed(2)} BDT
            </p>
          </div>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
};

export default AddExpense;
