import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectCurrentUser } from "../../features/auth/authSlice";
import { useGetProjectsQuery } from "../../features/projects/projectApi";

function Dashboard() {
    const user = useSelector(selectCurrentUser);
    const { data: response, isLoading, isError } = useGetProjectsQuery();
    const projects = response?.data || [];
    const taskCount = projects.reduce((total, project) => total + (project.tasks_count || 0), 0);

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h1>Good to see you, {user?.name}</h1>
                  
                </div>
            </div>

            {isLoading && <p className="status-message">Loading your workspace...</p>}
            {isError && <p className="status-message">Your workspace summary is unavailable.</p>}
            <div className="stats-grid">
                <div className="stat-card"><span className="muted">Projects</span><strong>{projects.length}</strong></div>
                <div className="stat-card"><span className="muted">Tasks</span><strong>{taskCount}</strong></div>
            </div>

            <section className="card recent-projects">
                <div className="section-heading"><h2>Recent projects</h2><Link to="/projects">View all</Link></div>
                {projects.length === 0 && !isLoading && <p className="muted">Create a project to start organizing work.</p>}
                {projects.slice(0, 5).map((project) => (
                    <div className="list-row" key={project.id}>
                        <Link to={`/projects/${project.id}`}>{project.name}</Link>
                        <span className="muted">{project.tasks_count || 0} tasks</span>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Dashboard;