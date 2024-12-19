import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginBg from "../assets/login-bg.jpg";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      <div className="grid grid-cols-2 w-1/2  h-[400px] rounded-lg shadow-md shadow-black/50 overflow-hidden bg-white">
        <div>
          <img
            src={LoginBg}
            className="w-full object-cover h-full"
            alt="Login"
          />
        </div>
        <div className="p-5">
          <h1 className="text-center font-bold mb-5 text-2xl">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-4">
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
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register-manager"
              className="text-blue-500 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
