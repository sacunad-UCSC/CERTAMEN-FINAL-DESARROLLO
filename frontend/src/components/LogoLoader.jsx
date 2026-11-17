import React from 'react';

/**
 * Componente LogoLoader
 * Replica exacta de la animación de carga oficial mostrada en el video de pcFactory,
 * con los glifos superiores e inferiores en movimiento vertical coordinado.
 */
export default function LogoLoader({
  message = '',
  fullPage = true,
  minHeight = 'calc(100vh - 140px)',
}) {
  return (
    <div
      className="pcf-loader-overlay"
      style={{
        width: '100%',
        minHeight: fullPage ? minHeight : '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        padding: '30px 20px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        className="pcf-loader-animation"
        style={{
          position: 'relative',
          width: '96px',
          height: '96px',
        }}
      >
        {/* P (Glifo Superior Verde) */}
        <svg
          className="pcf-glyph-p"
          viewBox="40 30 110 110"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50px',
            height: '50px',
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <path
            fill="#43d87e"
            d="M141.59,63.99c-2.15-5.32-5.12-10.05-8.89-14.18-3.77-4.13-8.29-7.47-13.55-10.05-5.27-2.57-11.01-3.86-17.23-3.86h-41.9c-7.19,0-13.02,5.83-13.02,13.02v12.29c0,2.87,2.33,5.2,5.2,5.2h43.08c7.39,0,14.01,5.53,14.39,12.91.41,7.87-5.85,14.38-13.62,14.38h-35.99c-7.21,0-13.05,5.84-13.05,13.05v31.79c0,8.7,10.74,12.8,16.53,6.32l18.46-20.65h20.82c6.22,0,11.94-1.23,17.14-3.68,5.21-2.45,9.63-5.75,13.28-9.87,3.65-4.13,6.49-8.85,8.53-14.18,2.03-5.32,3.05-10.8,3.05-16.42s-1.08-10.74-3.23-16.07"
          />
        </svg>

        {/* C (Glifo Inferior Verde) */}
        <svg
          className="pcf-glyph-c"
          viewBox="105 105 105 105"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '50px',
            height: '50px',
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <path
            fill="#43d87e"
            d="M117.25,179.44c2.15,5.32,5.12,10.05,8.89,14.18,3.77,4.13,8.29,7.47,13.55,10.05,5.27,2.57,11.01,3.86,17.23,3.86h41.9c7.19,0,13.02-5.83,13.02-13.02v-12.29c0-2.87-2.33-5.2-5.2-5.2h-43.07c-7.39,0-14.01-5.53-14.39-12.91-.41-7.87,5.85-14.38,13.62-14.38h35.99c7.21,0,13.05-5.84,13.05-13.05v-31.79c0-8.69-10.74-12.8-16.53-6.31l-18.46,20.65h-20.82c-6.22,0-11.94,1.23-17.14,3.68-5.21,2.45-9.63,5.75-13.28,9.87-3.65,4.13-6.49,8.85-8.53,14.18-2.03,5.32-3.05,10.8-3.05,16.42s1.07,10.74,3.23,16.07"
          />
        </svg>
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
