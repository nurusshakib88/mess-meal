// src/pages/Members.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Members = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold any errors

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`, // Include the token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data); // Set users to state
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false regardless of outcome
      }
    };

    fetchUsers();
  }, [auth.token]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>; // Display error message if there is an error
  }

  return (
    <div>
      <h1>Members Dashboard</h1>
      <h2>Members Under You:</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {auth.user.role === "admin" && <th>Manager</th>}
          </tr>
        </thead>
        {users.length === 0 ? ( // Check if users array is empty
          <p>No members found.</p>
        ) : (
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                {auth.user.role === "admin" && (
                  <td>{user.managerId ? user.managerId.name : "N/A"}</td>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Members;
