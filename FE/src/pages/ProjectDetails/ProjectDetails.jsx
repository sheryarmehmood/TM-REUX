import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGetProjectQuery } from "../../features/projects/projectApi";
import {
    useCreateTaskMutation,
    useDeleteTaskMutation,
    useGetProjectTasksQuery,
    useUpdateTaskMutation,
} from "../../features/tasks/taskApi";

function ProjectDetails() {
    const { projectId } = useParams();
    const { data: projectResponse, isLoading: projectLoading } = useGetProjectQuery(projectId);
    const [page, setPage] = useState(1);
    const { data: tasksResponse, isLoading: tasksLoading, isError, refetch } = useGetProjectTasksQuery({ projectId, page, per_page: 10 });
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [form, setForm] = useState({ title: "", priority: "medium" });
    const [formError, setFormError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const project = projectResponse?.data;
    const tasks = tasksResponse?.data || [];
    const totalPages = tasksResponse?.meta?.last_page || 1;

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError("");

        try {
            await createTask({ projectId, ...form }).unwrap();
            closeModal();
        } catch (error) {
            setFormError(error?.data?.message || "Unable to create task.");
        }
    }

    async function handleStatusChange(task, status) {
        await updateTask({ taskId: task.id, status });
    }

    function openCreateModal() {
        setForm({ title: "", priority: "medium" });
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setFormError("");
    }

    async function handleDelete(taskId) {
        if (window.confirm("Delete this task?")) {
            await deleteTask(taskId);
        }
    }

    if (projectLoading) return <p className="status-message">Loading project...</p>;
    if (!project) return <p className="status-message">Project not found.</p>;

    return (
        <div className="page-stack">
            <Link className="back-link" to="/projects">Back to projects</Link>
            <div className="page-heading project-detail-heading">
                <div>
                    <p className="eyebrow">Project</p>
                    <h1>{project.name}</h1>
                    <p className="muted">{project.description || "No description yet."}</p>
                </div>
                <div className="project-heading-actions">
                    <span className="status-pill">{project.status}</span>
                    <button className="button-primary" onClick={openCreateModal}>Create task</button>
                </div>
            </div>

            <section className="tasks-section">
                <div className="section-heading">
                    <h2>Tasks</h2>
                    <span className="muted">{tasksResponse?.meta?.total || 0} total</span>
                </div>
                {tasksLoading && <p className="status-message">Loading tasks...</p>}
                {isError && <div className="status-message"><p>Tasks could not be loaded.</p><button onClick={refetch}>Try again</button></div>}
                {!tasksLoading && !isError && tasks.length === 0 && <div className="empty-state">No tasks yet. Create the first one above.</div>}
                {tasks.length > 0 && <div className="table-wrap">
                    <table className="projects-table tasks-table">
                        <thead><tr><th>Task</th><th>Priority</th><th>Status</th><th>Created</th><th className="actions-header">Actions</th></tr></thead>
                        <tbody>{tasks.map((task) => (
                            <tr key={task.id}>
                                <td data-label="Task"><strong className={task.status === "done" ? "task-complete" : ""}>{task.title}</strong></td>
                                <td data-label="Priority"><span className={`priority-${task.priority}`}>{task.priority}</span></td>
                                <td data-label="Status"><select className="status-select" disabled={isUpdating} value={task.status} onChange={(event) => handleStatusChange(task, event.target.value)} aria-label={`Status for ${task.title}`}>
                                    <option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option>
                                </select></td>
                                <td data-label="Created" className="muted">{new Date(task.created_at).toLocaleDateString()}</td>
                                <td data-label="Actions"><div className="table-actions"><button className="button-danger button-small" onClick={() => handleDelete(task.id)}>Delete</button></div></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>}
                {tasks.length > 0 && <div className="pagination" aria-label="Task pages"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></div>}
            </section>

            {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={closeModal}>
                <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="modal-header"><div><p className="eyebrow">{project.name}</p><h2 id="task-modal-title">Create task</h2></div><button className="modal-close" onClick={closeModal} aria-label="Close dialog">×</button></div>
                    {formError && <p className="form-error" role="alert">{formError}</p>}
                    <form onSubmit={handleSubmit}><label htmlFor="task-title">Task title</label><input id="task-title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What needs to be done?" required maxLength={180} autoFocus />
                        <label htmlFor="task-priority">Priority</label><select id="task-priority" className="modal-select" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select>
                        <div className="modal-actions"><button type="button" onClick={closeModal}>Cancel</button><button className="button-primary" type="submit" disabled={isCreating}>{isCreating ? "Creating..." : "Create task"}</button></div>
                    </form>
                </section>
            </div>}
        </div>
    );
}

export default ProjectDetails;
