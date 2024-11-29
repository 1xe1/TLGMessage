import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user && location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
