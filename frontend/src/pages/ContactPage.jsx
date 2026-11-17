import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { api } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { success: boolean, message: string }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.sendContact(formData);
      if (res.success) {
        setStatus({
          success: true,
          message:
            '¡Mensaje enviado con éxito! Se ha registrado en la base de datos y se ha despachado el correo institucional y la confirmación al cliente.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus({
          success: false,
          message: res.message || 'Error al enviar la consulta. Revisa los campos.',
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Error de conexión con el servidor. Por favor intenta más tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  const glassInputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    outline: 'none',
    fontSize: '13px',
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
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div
        className="contact-card-box"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          borderRadius: '24px',
          padding: '36px',
          border: '1.5px solid rgba(255,255,255,0.85)',
          boxShadow:
            '0 24px 50px rgba(15,23,42,0.15), inset 0 1px 2px rgba(255,255,255,0.7)',
        }}
      >
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
          Contacto y Cotización de Hardware
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>
          Envíanos tus requerimientos a <strong>NexoPC</strong> para cotizar componentes, armado de PCs gamer o soporte técnico. Nuestro sistema
          te enviará un correo automático de confirmación de forma inmediata.
        </p>

        {status && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: status.success
                ? 'rgba(236,253,245,0.80)'
                : 'rgba(254,242,242,0.80)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: status.success ? '#065f46' : '#991b1b',
              border: `1px solid ${status.success ? 'rgba(167,243,208,0.8)' : 'rgba(254,202,202,0.8)'}`,
            }}
          >
            {status.success ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Marcelo Silva"
              style={glassInputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.cl"
              style={glassInputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Teléfono (Opcional)
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
              style={glassInputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Asunto de la Solicitud *
            </label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Cotización RTX 4070 / Soporte"
              style={glassInputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Mensaje o Requerimientos *
            </label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Detalla los componentes o dudas de tu cotización..."
              style={{
                ...glassInputStyle,
                resize: 'vertical',
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #008ecc, #0072a3)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 24px rgba(0,142,204,0.4)',
                borderRadius: '12px',
              }}
            >
              <Send size={18} />
              {loading ? 'Enviando y notificando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
