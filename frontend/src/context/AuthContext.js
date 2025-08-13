// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const saved = localStorage.getItem('user');
  const [user, setUser] = useState(saved ? JSON.parse(saved) : null);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const packed = { name: data.name, email: data.email, token: data.token };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(packed));
    setUser(packed);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data; // keep flow simple: page redirects to /login after success
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
