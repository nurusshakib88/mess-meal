import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { UserRoleContext } from "../contexts/UserRoleContext";

const AllOrder = () => {
  const { auth } = useContext(AuthContext);
  const { isManager, isAdmin, isMember } = useContext(UserRoleContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedMeal, setUpdatedMeal] = useState({
    orderId: "",
    mealType: "",
    quantity: 1,
  });
  const [mealStatus, setMealStatus] = useState({
    orderId: "",
    mealType: "",
    status: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        let response;

        if (auth.user.role === "manager") {
          response = await axios.get(
            "https://mess-mealserver.vercel.app/orders/all",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          response = await axios.get(
            "https://mess-mealserver.vercel.app/orders",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        setOrders(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.user.role]);

  const updateMealQuantity = async (mealType, orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://mess-mealserver.vercel.app/orders/${orderId}/meal`,
        {
          mealType,
          quantity: parseInt(updatedMeal.quantity, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              meals: order.meals.map((meal) =>
                meal.mealType === mealType
                  ? { ...meal, quantity: parseInt(updatedMeal.quantity, 10) }
                  : meal
              ),
            };
          }
          return order;
        })
      );

      // Reset the updatedMeal state
      setUpdatedMeal({ orderId: "", mealType: "", quantity: 1 });
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Error updating meal quantity"
      );
    }
  };

  const handleQuantityChange = (e, mealType, orderId) => {
    const quantity = e.target.value;
    setUpdatedMeal({ orderId, mealType, quantity });
  };

  const updateMealStatus = async (mealType, orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://mess-mealserver.vercel.app/orders/${orderId}/meal/status`,
        {
          mealType,
          status: mealStatus.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              meals: order.meals.map((meal) =>
                meal.mealType === mealType
                  ? { ...meal, status: mealStatus.status } // Update meal status
                  : meal
              ),
            };
          }
          return order;
        })
      );

      // Reset the mealStatus state
      setMealStatus({ orderId: "", mealType: "", status: "" });
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Error updating meal status"
      );
    }
  };

  const handleMealStatusChange = (e, orderId, mealType) => {
    setMealStatus({ ...mealStatus, orderId, mealType, status: e.target.value });
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="w-full flex flex-col">
      <h2 className="font-bold text-lg mb-5">
        {auth.user.role === "manager" ? "All Orders" : "Your Orders"}
      </h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table w-full table-fixed rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th>Date</th>
              <th>Meal Type</th>
              <th>Quantity</th>
              <th>Ordered By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                {order.meals.map((meal) => (
                  <tr key={`${order._id}-${meal.mealType}`}>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>{meal.mealType}</td>
                    <td>{meal.quantity}</td>
                    <td>{order.user.name}</td>
                    <td>{meal.status}</td>
                    <td>
                      {meal.status === "accepted" ? (
                        <span>Actions Disabled</span>
                      ) : (
                        <>
                          <input
                            type="number"
                            min="1"
                            value={
                              updatedMeal.mealType === meal.mealType &&
                              updatedMeal.orderId === order._id
                                ? updatedMeal.quantity
                                : meal.quantity
                            }
                            onChange={(e) =>
                              handleQuantityChange(e, meal.mealType, order._id)
                            }
                            placeholder="New Quantity"
                          />
                          <button
                            onClick={() =>
                              updateMealQuantity(meal.mealType, order._id)
                            }
                          >
                            Update Quantity
                          </button>
                          <select
                            value={
                              mealStatus.mealType === meal.mealType &&
                              mealStatus.orderId === order._id
                                ? mealStatus.status
                                : meal.status
                            }
                            onChange={(e) =>
                              handleMealStatusChange(
                                e,
                                order._id,
                                meal.mealType
                              )
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() =>
                              updateMealStatus(meal.mealType, order._id)
                            }
                          >
                            Update Meal Status
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllOrder;
