import { apiSlice } from "../../services/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: (params) => ({ url: "projects", params }),
            providesTags: ["Project"],
        }),
        getProject: builder.query({
            query: (projectId) => ({ url: `projects/${projectId}` }),
            providesTags: (_result, _error, projectId) => [{ type: "Project", id: projectId }],
        }),
        createProject: builder.mutation({
            query: (body) => ({ url: "projects", method: "POST", body }),
            invalidatesTags: ["Project"],
        }),
        updateProject: builder.mutation({
            query: ({ projectId, ...body }) => ({ url: `projects/${projectId}`, method: "PUT", body }),
            invalidatesTags: ["Project"],
        }),
        deleteProject: builder.mutation({
            query: (projectId) => ({ url: `projects/${projectId}`, method: "DELETE" }),
            invalidatesTags: ["Project"],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectApi;
