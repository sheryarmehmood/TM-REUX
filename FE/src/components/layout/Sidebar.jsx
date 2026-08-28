import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const sidebarOpen = useSelector(
        (state) => state.app.sidebarOpen
    );

    if (!sidebarOpen) {
        return null;
    }

    return (
        <aside className="sidebar">
            <p className="sidebar-label">Workspace</p>

            <nav>
                <NavLink to="/"><span aria-hidden="true">◈</span> Dashboard</NavLink>
                <NavLink to="/projects"><span aria-hidden="true">▦</span> Projects</NavLink>
            </nav>

            <p className="sidebar-footer">Personal workspace</p>
        </aside>
    );
}

export default Sidebar;