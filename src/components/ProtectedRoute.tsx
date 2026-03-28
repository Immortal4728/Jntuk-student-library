import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login/student" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
