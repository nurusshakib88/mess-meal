import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AuthenticatedRoute = ({ redirectTo }) => {
  const { auth } = useContext(AuthContext);

  // Redirect to login if the user is not authenticated
  return auth ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default AuthenticatedRoute;
