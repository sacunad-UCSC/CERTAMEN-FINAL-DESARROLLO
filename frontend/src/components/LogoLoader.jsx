import React from 'react';

/**
 * Componente LogoLoader
 * Utiliza el logo oficial de NexoPC con animación de elevación vertical y sombra dinámica.
 */
export default function LogoLoader({
  message = '',
  fullPage = true,
  minHeight = 'calc(100vh - 140px)',
}) {
  return (
    <div
      className="pcn-loader-overlay"
      style={{
        width: '100%',
        minHeight: fullPage ? minHeight : '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        padding: '40px 20px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        className="pcn-loader-box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src="/logo.png"
          alt="NexoPC"
          className="pcn-logo-floating"
          style={{
            width: '290px',
            maxWidth: '85vw',
            height: 'auto',
            objectFit: 'contain',
            willChange: 'transform, filter',
          }}
        />

        <div className="pcn-logo-shadow" />
      </div>

      {message && (
        <span
          style={{
            marginTop: '22px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#64748b',
            letterSpacing: '0.4px',
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
}
