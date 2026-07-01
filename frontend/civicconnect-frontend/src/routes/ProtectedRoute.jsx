import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
/*
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

*/
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRole && role !== allowedRole)
    return <Navigate to="/dashboard" />;

  return children;
};
export default ProtectedRoute;

