import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import RegisterBg from "../assets/login-bg.jpg"; // Use a suitable background image
import { Link } from "react-router-dom";

const RegisterManager = () => {
  const { registerManager } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    registerManager(name, email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      <div className="grid grid-cols-2 w-1/2 h-[400px] rounded-lg shadow-md shadow-black/50 overflow-hidden bg-white">
        <div>
          <img
            src={RegisterBg}
            className="w-full object-cover h-full"
            alt="Register"
          />
        </div>
        <div className="p-5">
          <h1 className="text-center font-bold mb-5 text-2xl">
            Register as Manager
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
            />
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterManager;
