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
    const { data: tasksResponse, isLoading: tasksLoading, isError, refetch } = useGetProjectTasksQuery({ projectId });
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [formError, setFormError] = useState("");

    const project = projectResponse?.data;
    const tasks = tasksResponse?.data || [];

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError("");

        try {
            await createTask({ projectId, title, priority }).unwrap();
            setTitle("");
        } catch (error) {
            setFormError(error?.data?.message || "Unable to create task.");
        }
    }

    async function handleStatusChange(task, status) {
        await updateTask({ taskId: task.id, status });
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
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Project</p>
                    <h1>{project.name}</h1>
                    <p className="muted">{project.description || "No description yet."}</p>
                </div>
                <span className="status-pill">{project.status}</span>
            </div>

            <section className="card">
                <h2>New task</h2>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <form className="inline-form" onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="task-title">Task title</label>
                    <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to be done?" required maxLength={180} />
                    <label className="sr-only" htmlFor="task-priority">Priority</label>
                    <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                    </select>
                    <button type="submit" disabled={isCreating}>{isCreating ? "Adding..." : "Add task"}</button>
                </form>
            </section>

            <section>
                <div className="section-heading">
                    <h2>Tasks</h2>
                    <span className="muted">{tasks.length} total</span>
                </div>
                {tasksLoading && <p className="status-message">Loading tasks...</p>}
                {isError && <div className="status-message"><p>Tasks could not be loaded.</p><button onClick={refetch}>Try again</button></div>}
                {!tasksLoading && !isError && tasks.length === 0 && <div className="empty-state">No tasks yet. Add the first one above.</div>}
                <div className="task-list">
                    {tasks.map((task) => (
                        <article className="task-row" key={task.id}>
                            <div>
                                <h3>{task.title}</h3>
                                <span className={`priority-${task.priority}`}>{task.priority} priority</span>
                            </div>
                            <div className="task-actions">
                                <select value={task.status} onChange={(event) => handleStatusChange(task, event.target.value)} aria-label={`Status for ${task.title}`}>
                                    <option value="todo">To do</option>
                                    <option value="in_progress">In progress</option>
                                    <option value="done">Done</option>
                                </select>
                                <button className="button-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default ProjectDetails;
