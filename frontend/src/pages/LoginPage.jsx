import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, User, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import MFAChallenge from '../components/MFAChallenge';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !agreeTerms) {
      setError('Debes aceptar los términos y condiciones de seguridad.');
      return;
    }

    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await login(email, password);
      } else {
        res = await register(name, email, password);
      }

      setLoading(false);
      if (res?.mfaRequired) {
        setMfaChallenge(res);
        return;
      }
      if (!res.success) {
        setError(res.message || 'Error en la autenticación. Verifica tus credenciales.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error al procesar la solicitud.');
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setIsLogin(true);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(0,142,204,0.18) 0%, transparent 60%), ' +
          'radial-gradient(ellipse at 80% 20%, rgba(0,200,255,0.14) 0%, transparent 55%), ' +
          'radial-gradient(ellipse at 60% 80%, rgba(16,185,129,0.10) 0%, transparent 50%), ' +
          'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #e8f4fd 70%, #d1fae5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Tarjeta Split estilo maqueta y responsiva para celulares y tablets */}
      <div
        className="login-card-container"
        style={{
          width: '100%',
          maxWidth: '920px',
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px) saturate(190%)',
          WebkitBackdropFilter: 'blur(20px) saturate(190%)',
          borderRadius: '28px',
          boxShadow:
            '0 24px 50px rgba(15,23,42,0.15), inset 0 1px 2px rgba(255,255,255,0.7)',
          border: '1.5px solid rgba(255,255,255,0.85)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decoración geométrica en las esquinas con el color primario de NexoPC (#008ecc) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '24px',
            height: '80px',
            background: 'var(--primary)',
            borderBottomRightRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,142,204,0.45)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100px',
            height: '24px',
            background: 'var(--primary)',
            borderTopRightRadius: '12px',
            boxShadow: '0 -4px 16px rgba(0,142,204,0.45)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '24px',
            background: 'var(--primary)',
            borderBottomLeftRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,142,204,0.45)',
          }}
        />

        {/* Lado Izquierdo: Banner completo con el logo de NexoPC */}
        <div
          style={{
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderRadius: '20px 140px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow:
                '0 10px 30px rgba(0,142,204,0.10), inset 0 1px 2px rgba(255,255,255,0.7)',
              border: '1.5px solid rgba(255,255,255,0.75)',
            }}
          >
            {/* Imagen del nuevo logo horizontal ocupando el espacio principal */}
            <div
              style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
              }}
            >
              <img
                src="/logo.png"
                alt="NexoPC Logo Oficial"
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Credenciales de Acceso Rápido para Defensa */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '14px',
                padding: '12px 14px',
                border: '1px solid rgba(255,255,255,0.7)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <strong style={{ fontSize: '11px', color: 'var(--navy)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Acceso Rápido:
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@pcnfactory.cl', 'AdminPassword2026!')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid rgba(254,202,202,0.9)',
                    background: 'rgba(254,242,242,0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#b91c1c',
                    transition: 'all 0.2s',
                  }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('cliente@ucsc.cl', 'UserPassword2026!')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid rgba(191,219,254,0.9)',
                    background: 'rgba(239,246,255,0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#1d4ed8',
                    transition: 'all 0.2s',
                  }}
                >
                  Cliente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario idéntico a la maqueta */}
        <div
          style={{
            padding: '48px 42px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', margin: '0 0 8px' }}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
            {isLogin
              ? 'Ingresa tus credenciales para acceder a tu cuenta protegida con JWT.'
              : 'Completa tus datos para crear tu cuenta y cotizar componentes de hardware.'}
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
              <span>{error}</span>
            </div>
          )}

          {mfaChallenge ? (
            <MFAChallenge
              challenge={mfaChallenge}
              onCancel={() => setMfaChallenge(null)}
              onSuccess={() => setMfaChallenge(null)}
            />
          ) : (
            <>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="Nombre Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 16px',
                    borderRadius: '30px',
                    border: '1px solid rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,142,204,0.3)';
                    e.target.style.borderColor = 'rgba(0,142,204,0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = 'rgba(255,255,255,0.7)';
                  }}
                />
                <User
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 16px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,142,204,0.3)';
                  e.target.style.borderColor = 'rgba(0,142,204,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255,255,255,0.7)';
                }}
              />
              <Mail
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 16px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,142,204,0.3)';
                  e.target.style.borderColor = 'rgba(0,142,204,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255,255,255,0.7)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '28px',
                  height: '28px',
                  display: 'grid',
                  placeItems: 'center',
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Acepto los Términos y Condiciones
              </label>
            )}

            {/* Botón Principal redondeado con sombra suave como en la maqueta */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '13px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'linear-gradient(135deg, #008ecc, #0072a3)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,142,204,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Siguiente y Continuar'}
            </button>
          </form>

          {/* Botón Alternativo de cambio entre Login y Registro */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '30px',
                border: '1.5px solid var(--primary)',
                background: 'transparent',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,142,204,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {isLogin ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
