// DepositRequests.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const DepositRequest = () => {
  const { auth, userProfile, getUserProfile } = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile if it hasn't been loaded yet
  useEffect(() => {
    if (!userProfile) {
      getUserProfile();
    }
  }, [userProfile, getUserProfile]);

  // Fetch deposits based on user role
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://mess-mealserver.vercel.app/deposits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeposits(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching deposits"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  // Handle deposit request submission
  const handleDepositRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://mess-mealserver.vercel.app/deposits",
        { amount, reference },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeposits((prev) => [...prev, response.data]); // Add new deposit to the list
      setAmount(""); // Reset the amount field
      setReference(""); // Reset the reference field
      alert("Deposit request submitted successfully");
    } catch (err) {
      alert(
        err.response
          ? err.response.data.message
          : "Error submitting deposit request"
      );
    }
  };

  // Handle deposit status update (approve/reject) for managers
  const handleStatusUpdate = async (depositId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://mess-mealserver.vercel.app/deposits/${depositId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeposits((prevDeposits) =>
        prevDeposits.map((deposit) =>
          deposit._id === depositId
            ? { ...deposit, status: newStatus }
            : deposit
        )
      );
      alert(`Deposit ${newStatus} successfully`);
    } catch (err) {
      alert(
        err.response
          ? err.response.data.message
          : "Error updating deposit status"
      );
    }
  };

  // Render deposit request form
  const renderRequestForm = () => (
    <form onSubmit={handleDepositRequest} className="flex flex-col w-80 gap-3">
      <h3 className="font-bold text-lg mb-5">Request Deposit</h3>
      {userProfile && (
        <h1 className="btn bg-slate-300 justify-between">
          My Balance
          <span className="text-primary font-bold text-2xl">
            {userProfile.balance}
          </span>
        </h1>
      )}
      <div className=" bg-slate-300 p-5 rounded-lg">
        <div>
          <h2 className="font-medium mb-2">Amount:</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="input w-full"
          />
        </div>
        <div>
          <h2 className="font-medium my-2">Reference:</h2>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            className="input w-full"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit Request
      </button>
    </form>
  );

  // Render deposit list for managers
  const renderDepositListForManager = () => (
    <div>
      <h3 className="font-bold text-lg mb-5">Deposit Requests</h3>
      {loading ? (
        <p>Loading deposits...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : deposits.length === 0 ? (
        <p>No deposit requests found.</p>
      ) : (
        <table className="table w-full table-fixed rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit._id}>
                <td>{deposit.userId ? deposit.userId.name : "Unknown User"}</td>{" "}
                {/* Check if userId exists */}
                <td>{deposit.amount}</td>
                <td>{deposit.reference}</td>
                <td>{deposit.status}</td>
                <td className="flex gap-3">
                  {deposit.status === "pending" ? (
                    <>
                      <button
                        className="btn btn-success text-white"
                        onClick={() =>
                          handleStatusUpdate(deposit._id, "approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-error text-white"
                        onClick={() =>
                          handleStatusUpdate(deposit._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button disabled className="btn text-white">
                        Approve
                      </button>
                      <button disabled className="btn text-white">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render deposit list for members
  const renderDepositListForMember = () => (
    <div>
      <h3 className="font-bold text-lg mb-5 mt-10">My Deposit Requests</h3>
      {loading ? (
        <p>Loading deposits...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : deposits.length === 0 ? (
        <p>No deposit requests found.</p>
      ) : (
        <table className="table table-fixed rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th>Amount</th>
              <th>Reference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit._id}>
                <td>{deposit.amount}</td>
                <td>{deposit.reference}</td>
                <td>{deposit.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      {auth.user.role === "member" ? renderRequestForm() : null}
      {auth.user.role === "manager"
        ? renderDepositListForManager()
        : renderDepositListForMember()}
    </div>
  );
};

export default DepositRequest;
