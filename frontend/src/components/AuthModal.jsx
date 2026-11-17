import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Error en la autenticación');
    }
  };

  const glassInputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    fontSize: '13px',
    outline: 'none',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    boxSizing: 'border-box',
  };

  const handleInputFocus = (e) => {
    e.target.style.boxShadow = '0 0 0 3px rgba(0,142,204,0.3)';
    e.target.style.borderColor = 'rgba(0,142,204,0.5)';
  };

  const handleInputBlur = (e) => {
    e.target.style.boxShadow = 'none';
    e.target.style.borderColor = 'rgba(255,255,255,0.7)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(22px) saturate(190%)',
          WebkitBackdropFilter: 'blur(22px) saturate(190%)',
          borderRadius: '24px',
          border: '1.5px solid rgba(255,255,255,0.9)',
          width: '100%',
          maxWidth: '400px',
          padding: '30px',
          position: 'relative',
          boxShadow:
            '0 24px 50px rgba(15,23,42,0.18), inset 0 1px 2px rgba(255,255,255,0.7)',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          {isLogin
            ? 'Accede con tus credenciales seguras protegidas con JWT.'
            : 'Regístrate para comprar componentes y gestionar pedidos.'}
        </p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(254,242,242,0.80)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#991b1b',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(254,202,202,0.8)',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcelo Silva"
                style={glassInputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.cl"
              style={glassInputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={glassInputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              marginTop: '8px',
              background: 'linear-gradient(135deg, #008ecc, #0072a3)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 24px rgba(0,142,204,0.4)',
              borderRadius: '12px',
            }}
          >
            {loading ? 'Validando...' : isLogin ? 'Ingresar a la Plataforma' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px' }}>
          {isLogin ? (
            <span>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setIsLogin(false)}
                style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Regístrate aquí
              </button>
            </span>
          ) : (
            <span>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setIsLogin(true)}
                style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Inicia sesión
              </button>
            </span>
          )}
        </div>

        {/* Credenciales de demostración rápidas para defensa */}
        <div
          style={{
            marginTop: '18px',
            padding: '12px 14px',
            background: 'rgba(248,250,252,0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.75)',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          <strong>Demostración rápida de Roles en NexoPC:</strong><br />
          • Admin: <code>admin@pcnfactory.cl</code> / <code>AdminPassword2026!</code><br />
          • Cliente: <code>cliente@ucsc.cl</code> / <code>UserPassword2026!</code>
        </div>
      </div>
    </div>
  );
}
