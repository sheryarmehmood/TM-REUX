import { apiSlice } from "../../services/apiSlice";

export const taskApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjectTasks: builder.query({
            query: ({ projectId, ...params }) => ({ url: `projects/${projectId}/tasks`, params }),
            providesTags: (_result, _error, { projectId }) => [{ type: "Task", id: `PROJECT-${projectId}` }],
        }),
        createTask: builder.mutation({
            query: ({ projectId, ...body }) => ({ url: `projects/${projectId}/tasks`, method: "POST", body }),
            invalidatesTags: (_result, _error, { projectId }) => ["Project", { type: "Task", id: `PROJECT-${projectId}` }],
        }),
        updateTask: builder.mutation({
            query: ({ taskId, ...body }) => ({ url: `tasks/${taskId}`, method: "PUT", body }),
            invalidatesTags: ["Project", "Task"],
        }),
        deleteTask: builder.mutation({
            query: (taskId) => ({ url: `tasks/${taskId}`, method: "DELETE" }),
            invalidatesTags: ["Project", "Task"],
        }),
    }),
});

export const {
    useGetProjectTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = taskApi;
