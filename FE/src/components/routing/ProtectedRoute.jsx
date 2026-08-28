import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    selectAuthInitialized,
    selectIsAuthenticated,
} from "../../features/auth/authSlice";

function ProtectedRoute() {
    const initialized = useSelector(selectAuthInitialized);
    const authenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!initialized) {
        return <div className="auth-loading">Checking your session...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
