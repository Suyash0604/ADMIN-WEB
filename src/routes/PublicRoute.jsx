import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, defaultRoute } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
