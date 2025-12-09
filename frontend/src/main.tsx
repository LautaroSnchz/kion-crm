import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <Protected />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "clients", element: <ClientsPage /> },
          { path: "projects", element: <ProjectsPage /> },
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