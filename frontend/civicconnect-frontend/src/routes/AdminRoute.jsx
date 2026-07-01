import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AdminRoute = ({ children }) => {
  const { role } = useAuth();

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
