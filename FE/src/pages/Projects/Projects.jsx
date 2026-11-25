import { useState } from "react";
import { Link } from "react-router-dom";

import {
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectsQuery,
    useUpdateProjectMutation,
} from "../../features/projects/projectApi";

function Projects() {
    const [page, setPage] = useState(1);
    const { data: response, isLoading, isError, refetch } = useGetProjectsQuery({ page, per_page: 10 });
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [form, setForm] = useState({ name: "", description: "" });
    const [formError, setFormError] = useState("");
    const [modalMode, setModalMode] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const projects = response?.data || [];
    const meta = response?.meta || {};
    const totalPages = meta.last_page || 1;

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError("");

        try {
            if (modalMode === "edit") {
                await updateProject({ projectId: editingId, ...form }).unwrap();
            } else {
                await createProject(form).unwrap();
            }
            closeModal();
        } catch (error) {
            setFormError(error?.data?.message || `Unable to ${modalMode === "edit" ? "update" : "create"} project.`);
        }
    }

    async function handleDelete(projectId) {
        if (window.confirm("Delete this project and its tasks?")) {
            await deleteProject(projectId);
        }
    }

    function openCreateModal() {
        setForm({ name: "", description: "" });
        setFormError("");
        setEditingId(null);
        setModalMode("create");
    }

    function startEditing(project) {
        setEditingId(project.id);
        setForm({ name: project.name, description: project.description || "" });
        setFormError("");
        setModalMode("edit");
    }

    function closeModal() {
        setModalMode(null);
        setEditingId(null);
        setFormError("");
    }

    return (
        <div className="page-stack">
            <div className="page-heading projects-heading">
                <div>
                    <p className="eyebrow">Workspace</p>
                    <h1>Projects</h1>
                    <p className="muted">Create a project and keep its work moving.</p>
                </div>
                <button className="button-primary" onClick={openCreateModal}>Create project</button>
            </div>

            <section className="projects-section">
                <div className="section-heading">
                    <h2>Your projects</h2>
                    <span className="muted">{meta.total || 0} total</span>
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
                {projects.length > 0 && <div className="table-wrap">
                    <table className="projects-table">
                        <thead>
                            <tr><th>Project</th><th>Status</th><th>Tasks</th><th>Last updated</th><th className="actions-header">Actions</th></tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td data-label="Project"><div className="project-name-cell"><strong>{project.name}</strong><span>{project.description || "No description"}</span></div></td>
                                    <td data-label="Status"><span className="status-pill">{project.status}</span></td>
                                    <td data-label="Tasks">{project.tasks_count || 0}</td>
                                    <td data-label="Last updated" className="muted">{new Date(project.updated_at).toLocaleDateString()}</td>
                                    <td data-label="Actions"><div className="table-actions">
                                        <Link className="button-link button-small" to={`/projects/${project.id}`}>Open</Link>
                                        <button className="button-small" onClick={() => startEditing(project)}>Edit</button>
                                        <button className="button-danger button-small" onClick={() => handleDelete(project.id)}>Delete</button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
                {projects.length > 0 && <div className="pagination" aria-label="Project pages">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>}
            </section>

            {modalMode && <div className="modal-backdrop" role="presentation" onMouseDown={closeModal}>
                <section className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="modal-header"><div><p className="eyebrow">Workspace</p><h2 id="project-modal-title">{modalMode === "edit" ? "Edit project" : "Create project"}</h2></div><button className="modal-close" onClick={closeModal} aria-label="Close dialog">×</button></div>
                    {formError && <p className="form-error" role="alert">{formError}</p>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="project-name">Name</label>
                        <input id="project-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={120} autoFocus />
                        <label htmlFor="project-description">Description</label>
                        <textarea id="project-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" />
                        <div className="modal-actions"><button type="button" onClick={closeModal}>Cancel</button><button className="button-primary" type="submit" disabled={isCreating || isUpdating}>{isCreating || isUpdating ? "Saving..." : modalMode === "edit" ? "Save changes" : "Create project"}</button></div>
                    </form>
                </section>
            </div>}
        </div>
    );
}

export default Projects;
