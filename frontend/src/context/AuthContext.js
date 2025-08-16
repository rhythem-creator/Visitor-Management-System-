// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Rehydrate once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  // Centralized login used by pages
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Normalize user object
    const packed = { id: data.id, name: data.name, email: data.email, token: data.token };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(packed));
    setUser(packed);
    return packed;
  };

  // Optional: used by Register page
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!ready) return null; // avoid flash before we know auth state

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user?.token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}