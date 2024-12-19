import React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { auth } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-5xl uppercase">WELCOME to mess meal</h1>

      <button className="btn btn-primary my-5">
        {auth ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </button>
    </div>
  );
};

export default Home;
