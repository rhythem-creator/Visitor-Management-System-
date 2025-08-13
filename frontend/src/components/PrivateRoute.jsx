// src/components/PrivateRoute.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.token) return children;

  // Not logged in → show message + link that remembers the intended page
  return (
    <div className="max-w-xl mx-auto mt-16 p-6 text-center border rounded">
      <p className="text-yellow-600 font-semibold mb-2"> Access Denied</p>
      <p className="text-gray-700 mb-4">You must be logged in to view this page.</p>
      <Link
        to="/login"
        state={{ from: location }}   // pass where the user was trying to go
        className="text-blue-600 underline"
      >
        Go to Login
      </Link>
    </div>
  );
}
