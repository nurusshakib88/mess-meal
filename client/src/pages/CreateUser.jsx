import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const CreateUser = () => {
  const { auth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/create-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the member.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-80 flex flex-col gap-3">
      <h1 className="font-bold text-lg mb-5">Add a Member</h1>
      <div className="flex gap-3 flex-col bg-slate-300 p-5 rounded-lg">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Create Member
      </button>
    </form>
  );
};

export default CreateUser;
