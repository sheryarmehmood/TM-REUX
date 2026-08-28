import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    selectAuthInitialized,
    selectIsAuthenticated,
} from "../../features/auth/authSlice";

function GuestRoute() {
    const initialized = useSelector(selectAuthInitialized);
    const authenticated = useSelector(selectIsAuthenticated);

    if (!initialized) {
        return <div className="auth-loading">Checking your session...</div>;
    }

    if (authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default GuestRoute;
