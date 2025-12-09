import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

export default function Protected() {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  return <Outlet />;
}