import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user && location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
