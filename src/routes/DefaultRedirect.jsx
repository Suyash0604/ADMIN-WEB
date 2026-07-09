import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../lib/accessControl";

const DefaultRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={getDefaultRoute(user)} replace />;
};

export default DefaultRedirect;
