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

  const finishLogin = (sessionToken, sessionUser) => {
    localStorage.setItem('token', sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  };

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.mfaRequired) {
        return res;
      }
      if (res && res.success) {
        finishLogin(res.token, res.user);
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
      if (res && res.mfaRequired) {
        return res;
      }
      if (res && res.success) {
        finishLogin(res.token, res.user);
        return { success: true };
      }
      return { success: false, message: res?.message || 'Error al registrarse' };
    } catch (err) {
      return { success: false, message: 'Error al conectar con el servidor.' };
    }
  };

  const mfaSetup = async (challengeToken) => {
    return await api.mfaSetup(challengeToken);
  };

  const mfaConfirm = async (challengeToken, code) => {
    const res = await api.mfaConfirm(challengeToken, code);
    if (res && res.success && res.token) {
      finishLogin(res.token, res.user);
    }
    return res;
  };

  const mfaVerify = async (challengeToken, code) => {
    const res = await api.mfaVerify(challengeToken, code);
    if (res && res.success && res.token) {
      finishLogin(res.token, res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        finishLogin,
        mfaSetup,
        mfaConfirm,
        mfaVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
