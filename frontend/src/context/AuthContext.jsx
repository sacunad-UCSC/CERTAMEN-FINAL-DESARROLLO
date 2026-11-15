import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe(token);
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res?.message || 'Credenciales inválidas' };
    } catch (err) {
      return { success: false, message: 'Error al conectar con el servidor.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.register(name, email, password);
      if (res && res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res?.message || 'Error al registrarse' };
    } catch (err) {
      return { success: false, message: 'Error al conectar con el servidor.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
