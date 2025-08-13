import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user?.token) {
    // Save the path so you can come back after login if needed
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2 style={{ color: "red" }}>⚠ Access Denied</h2>
        <p>You must be logged in to view this page.</p>
        <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Go to Login
        </a>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;