// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthed } = useAuth();       // <-- use isAuthed from context
  const location = useLocation();

  // Already logged in → render protected content
  if (isAuthed) return children;

  // Not logged in → friendly message + link back to login
  return (
    <div className="max-w-xl mx-auto mt-16 p-6 text-center border border-gray-300 rounded">
      <p className="text-yellow-600 font-semibold mb-2">Access Denied</p>
      <p className="text-gray-700 mb-4">You must be logged in to view this page.</p>
      <Link
        to="/login"
        state={{ from: location }}  // keeps where user was going
        className="text-blue-600 underline"
      >
        Go to Login
      </Link>
    </div>
  );
}