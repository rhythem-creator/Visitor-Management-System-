// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import VisitorsAdd from './pages/VisitorsAdd';
import VisitorsList from './pages/VisitorsList'; // ok if this exists; otherwise remove this line + route

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default -> /visitors/new */}
        <Route path="/" element={<Navigate to="/visitors/new" replace />} />

        {/* Protected */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/visitors/new"
          element={
            <PrivateRoute>
              <VisitorsAdd />
            </PrivateRoute>
          }
        />

        {/* Optional list page (VM‑9). Remove if you don’t have it yet. */}
        <Route
          path="/visitors"
          element={
            <PrivateRoute>
              <VisitorsList />
            </PrivateRoute>
          }
        />

        {/* Catch‑all -> login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
