// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // Auth will store token and user info
  const [userProfile, setUserProfile] = useState(null); // Store user profile data
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch user data from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
  }, [navigate]);

  const login = async (email, password) => {
    setLoading(true); // Start loading
    try {
      const res = await axios.post(
        "https://mess-mealserver.vercel.app/users/login",
        {
          email,
          password,
        }
      );

      const { token, user } = res.data; // Assuming response contains token and user details

      // Store the token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth state
      setAuth({ token, user });

      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert("Invalid credentials");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const registerManager = async (name, email, password) => {
    try {
      await axios.post("/api/users/register-manager", {
        name,
        email,
        password,
      });
      alert("Manager registered successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error registering manager");
    }
  };

  const logout = () => {
    // Clear localStorage and reset auth state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(null);
    setUserProfile(null); // Clear user profile on logout
    navigate("/login");
  };

  const getUserProfile = async () => {
    try {
      // Extract user ID from auth object
      const userId = auth.user.id;
      console.log("Fetching profile for user ID:", userId);

      // Make the API request to fetch user profile data
      const res = await axios.get(`/api/users/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Set auth token in headers
        },
      });

      // Store the profile data directly as an object in the userProfile state
      setUserProfile(res.data); // Directly store the object
      console.log("User profile data:", res.data); // Log for verification
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Failed to fetch user profile");
    }
  };

  // Fetch profile data whenever the auth state changes (e.g., on login)
  useEffect(() => {
    if (auth) {
      getUserProfile();
    }
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        registerManager,
        logout,
        userProfile,
        getUserProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
