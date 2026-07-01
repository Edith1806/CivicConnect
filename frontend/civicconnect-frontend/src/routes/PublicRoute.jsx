import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
