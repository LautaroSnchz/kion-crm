import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AppProviders } from "@/lib/providers";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ClientsPage from "@/features/clients/ClientsPage";
import ProjectsPage from "@/features/projects/ProjectsPage";
import SignIn from "@/features/auth/SignIn";
import Protected from "@/components/Protected";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/signin" replace />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/dashboard",
    element: <Protected />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
        ],
      },
    ],
  },
  {
    path: "/clients",
    element: <Protected />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <ClientsPage /> },
        ],
      },
    ],
  },
  {
    path: "/projects",
    element: <Protected />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <ProjectsPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
);