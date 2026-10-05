import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Skeleton from "./Skeleton";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><Skeleton className="h-12 w-64" /></div>;
  if (!isAuthenticated) return <Navigate to="/#login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
