import { useDispatch, useSelector } from "react-redux";

import {
    toggleSidebar,
    setTheme,
} from "../../features/app/appSlice";
import { logout, selectCurrentUser } from "../../features/auth/authSlice";

function Navbar() {
    const dispatch = useDispatch();

    const sidebarOpen = useSelector(
        (state) => state.app.sidebarOpen
    );

    const theme = useSelector(
        (state) => state.app.theme
    );

    const user = useSelector(selectCurrentUser);

    return (
        <header className="navbar">
            <div className="brand-lockup">
                <div className="brand-mark">T</div>
                <div>
                    <h2>TM-REUX</h2>
                    <span className="brand-subtitle">Team workspace</span>
                </div>
            </div>

            <div className="navbar-actions">
                <div className="user-chip">
                    <span className="avatar">{user?.name?.charAt(0) || "U"}</span>
                    <span>{user?.name}</span>
                </div>
                <button
                    className="button-quiet"
                    aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    onClick={() =>
                        dispatch(toggleSidebar())
                    }
                >
                    {sidebarOpen
                        ? "Hide Sidebar"
                        : "Show Sidebar"}
                </button>

                <button
                    className="button-quiet"
                    onClick={() =>
                        dispatch(
                            setTheme(
                                theme === "light"
                                    ? "dark"
                                    : "light"
                            )
                        )
                    }
                >
                    {theme === "light"
                        ? "Dark Mode"
                        : "Light Mode"}
                </button>

                <button className="button-quiet" onClick={() => dispatch(logout())}>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;