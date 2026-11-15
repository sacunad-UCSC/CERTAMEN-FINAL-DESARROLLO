import React, { useState } from 'react';
import { X, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ChangePasswordModal({ onClose }) {
  const { token, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword }, token);
      if (res && res.success) {
        setSuccess('¡Contraseña actualizada exitosamente con Argon2id!');
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setError(res?.message || 'Error al cambiar la contraseña.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px 28px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0, 142, 204, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Lock size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
              Cambiar Contraseña
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Protegida con hashing robusto Argon2id
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Contraseña Actual
            </label>
            <input
              type="password"
              required
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Nueva Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1, padding: '10px 16px' }}
            >
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
