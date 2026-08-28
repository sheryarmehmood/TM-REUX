import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import GuestRoute from "../components/routing/GuestRoute";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProjectDetails from "../pages/ProjectDetails/ProjectDetails";
import Projects from "../pages/Projects/Projects";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NotFound from "../pages/NotFound/NotFound";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                errorElement: <NotFound />,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />,
                    },
                    {
                        path: "/projects",
                        element: <Projects />,
                    },
                    {
                        path: "/projects/:projectId",
                        element: <ProjectDetails />,
                    },
                ],
            },
        ],
    },

    {
        element: <GuestRoute />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
]);

export default router;