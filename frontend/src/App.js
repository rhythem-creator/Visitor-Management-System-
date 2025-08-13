// src/App.js (minimal for VM‑8)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import VisitorsAdd from './pages/VisitorsAdd';
import Profile from './pages/Profile';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected */}
        <Route
          path="/visitors/new"
          element={
            <PrivateRoute>
              <VisitorsAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* default / catch‑all */}
        <Route
          path="/"
          element={user?.token ? <Navigate to="/visitors/new" replace /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={user?.token ? <Navigate to="/visitors/new" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}
export default App;