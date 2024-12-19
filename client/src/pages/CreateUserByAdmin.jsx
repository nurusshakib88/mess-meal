import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const CreateUserByAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all users and filter out the managers
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Indicate loading state
      try {
        const response = await fetch(
          "https://mess-meal-server.vercel.app/api/users/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        // Filter users who have the role of 'manager'
        const filteredManagers = data.filter((user) => user.role === "manager");
        setManagers(filteredManagers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false); // Remove loading state
      }
    };

    // Fetch managers only when creating a member
    if (role === "member") {
      fetchUsers();
    } else {
      setManagers([]); // Clear the list if role is not 'member'
    }
  }, [role, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    const requestBody = {
      name,
      email,
      password,
      role,
    };

    // If role is "member", include the selected managerId
    if (role === "member" && selectedManager) {
      requestBody.managerId = selectedManager;
    }

    try {
      const response = await fetch(
        "https://mess-meal-server.vercel.app/api/users/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message); // Display success message
        setName("");
        setEmail("");
        setPassword("");
        setRole("manager"); // Reset to default role
        setSelectedManager(""); // Reset manager selection
      } else {
        setError(data.message); // Display error message from the API
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating the user.");
    }
  };

  return (
    <div>
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="role">Select Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>

        {role === "member" && (
          <>
            <label htmlFor="managerSelect">Assign to Manager:</label>
            {loading ? (
              <p>Loading managers...</p>
            ) : managers.length > 0 ? (
              <select
                id="managerSelect"
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                required
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>No managers available.</p>
            )}
          </>
        )}

        <button type="submit">Create {role}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default CreateUserByAdmin;
