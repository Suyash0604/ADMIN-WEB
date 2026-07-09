import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessRoute, getDefaultRoute } from "../lib/accessControl";

const AccessRoute = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!canAccessRoute(pathname, user)) {
    return <Navigate to={getDefaultRoute(user)} replace />;
  }

  return <Outlet />;
};

export default AccessRoute;
