import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ApiError, fetchCsrfCookie, request } from "../../services/api";

const initialState = {
    user: null,
    status: "idle",
    error: null,
    initialized: false,
};

function errorPayload(error) {
    return {
        message: error.message,
        status: error.status,
        errors: error.errors,
    };
}

export const initializeAuth = createAsyncThunk(
    "auth/initialize",
    async (_, { rejectWithValue }) => {
        try {
            const response = await request("/user");
            return response.data.user;
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                return null;
            }

            return rejectWithValue(errorPayload(error));
        }
    },
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            await fetchCsrfCookie();
            const response = await request("/login", {
                method: "POST",
                body: credentials,
            });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    },
);

export const register = createAsyncThunk(
    "auth/register",
    async (details, { rejectWithValue }) => {
        try {
            await fetchCsrfCookie();
            const response = await request("/register", {
                method: "POST",
                body: details,
            });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    },
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await request("/logout", { method: "POST" });
        } catch (error) {
            return rejectWithValue(errorPayload(error));
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeAuth.pending, (state) => {
                state.status = "loading";
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || { message: "Unable to initialize authentication." };
                state.initialized = true;
            })
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || { message: "Login failed." };
                state.initialized = true;
            })
            .addCase(register.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || { message: "Registration failed." };
                state.initialized = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = "idle";
                state.user = null;
            });
    },
});

export const { clearAuthError } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectAuthInitialized = (state) => state.auth.initialized;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
