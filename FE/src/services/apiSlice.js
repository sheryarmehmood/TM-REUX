import { createApi } from "@reduxjs/toolkit/query/react";

import { request } from "./api";

const baseQuery = async ({ url, method = "GET", body, params }) => {
    try {
        return { data: await request(url, { method, body, params }) };
    } catch (error) {
        return {
            error: {
                status: error.status || 0,
                data: {
                    message: error.message,
                    errors: error.errors,
                },
            },
        };
    }
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Project", "Task"],
    endpoints: () => ({}),
});
