import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebarOpen: true,
    theme: "light",
    notification: "Welcome to TM-REUX!",
};

const appSlice = createSlice({
    name: "app",

    initialState,

    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },

        setTheme: (state, action) => {
            state.theme = action.payload;
        },

        setNotification: (state, action) => {
            state.notification = action.payload;
        },

        clearNotification: (state) => {
            state.notification = "";
        },
    },
});

export const {
    toggleSidebar,
    setTheme,
    setNotification,
    clearNotification,
} = appSlice.actions;

export default appSlice.reducer;