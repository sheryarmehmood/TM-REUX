import { useState } from "react";
import { Link } from "react-router-dom";

import {
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectsQuery,
    useUpdateProjectMutation,
} from "../../features/projects/projectApi";

function Projects() {
    const { data: response, isLoading, isError, refetch } = useGetProjectsQuery();
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const projects = response?.data || [];

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError("");

        try {
            await createProject({ name, description }).unwrap();
            setName("");
            setDescription("");
        } catch (error) {
            setFormError(error?.data?.message || "Unable to create project.");
        }
    }

    async function handleDelete(projectId) {
        if (window.confirm("Delete this project and its tasks?")) {
            await deleteProject(projectId);
        }
    }

    function startEditing(project) {
        setEditingId(project.id);
        setEditName(project.name);
        setFormError("");
    }

    async function handleUpdate(projectId) {
        if (!editName.trim()) {
            setFormError("Project name is required.");
            return;
        }

        try {
            await updateProject({ projectId, name: editName.trim() }).unwrap();
            setEditingId(null);
        } catch (error) {
            setFormError(error?.data?.message || "Unable to update project.");
        }
    }

    return (
        <div className="page-stack">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Workspace</p>
                    <h1>Projects</h1>
                    <p className="muted">Create a project and keep its work moving.</p>
                </div>
            </div>

            <section className="card create-project-card">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Start something new</p>
                        <h2>New project</h2>
                    </div>
                    <span className="create-project-icon" aria-hidden="true">+</span>
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="project-name">Name</label>
                        <input id="project-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} />
                    </div>
                    <div>
                        <label htmlFor="project-description">Description</label>
                        <input id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} />
                    </div>
                    <button className="button-primary" type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create project"}
                    </button>
                </form>
            </section>

            <section>
                <div className="section-heading">
                    <h2>Your projects</h2>
                    <span className="muted">{projects.length} total</span>
                </div>

                {isLoading && <p className="status-message">Loading projects...</p>}
                {isError && (
                    <div className="status-message">
                        <p>Projects could not be loaded.</p>
                        <button onClick={refetch}>Try again</button>
                    </div>
                )}
                {!isLoading && !isError && projects.length === 0 && (
                    <div className="empty-state">Your first project will appear here.</div>
                )}
                <div className="project-grid">
                    {projects.map((project) => (
                        <article className="project-card" key={project.id}>
                            <div>
                                <span className="status-pill">{project.status}</span>
                                {editingId === project.id ? (
                                    <input value={editName} onChange={(event) => setEditName(event.target.value)} aria-label="Project name" />
                                ) : <h3>{project.name}</h3>}
                                <p className="muted">{project.description || "No description yet."}</p>
                            </div>
                            <div className="project-card-footer">
                                <span>{project.tasks_count || 0} tasks</span>
                                <div>
                                    <Link className="button-link" to={`/projects/${project.id}`}>Open</Link>
                                    {editingId === project.id ? (
                                        <button disabled={isUpdating} onClick={() => handleUpdate(project.id)}>{isUpdating ? "Saving..." : "Save"}</button>
                                    ) : <button onClick={() => startEditing(project)}>Edit</button>}
                                                    <button className="button-danger" onClick={() => handleDelete(project.id)}>Delete</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Projects;
