// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);

      // go back to the page the guard blocked, else default to /visitors/new
      const redirectTo = location.state?.from?.pathname || '/visitors/new';
      navigate(redirectTo, { replace: true });
    } catch {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={onSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{' '}
          <Link className="text-blue-600" to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
