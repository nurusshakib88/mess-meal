import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, redirectTo }) => {
  const { auth } = useContext(AuthContext);

  // Redirect to the target route if the user is authenticated
  return auth ? <Navigate to={redirectTo} /> : children;
};

export default ProtectedRoute;
