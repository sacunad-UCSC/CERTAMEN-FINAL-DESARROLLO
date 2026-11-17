import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await api.getSocialLinks();
        if (res.success) setSocials(res.links);
      } catch (err) {
        console.error('Error cargando redes', err);
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="footer" style={{ background: '#0b1322', color: '#cbd5e1', padding: '50px 24px 30px', marginTop: '60px', borderTop: '3px solid #008ecc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '36px' }}>
        
        {/* Columna 1: Branding y Redes Sociales */}
        <div>
          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', display: 'inline-block', marginBottom: '14px' }}>
            <img
              src="/logo.png"
              alt="NexoPC Logo"
              style={{ height: '42px', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#94a3b8', marginBottom: '18px' }}>
            Plataforma segura de venta, distribución y cotización de componentes de hardware para computación de alto rendimiento en Chile.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {socials.map((s) => (
              <a
                key={s._id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid #334155',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                }}
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Columna 2: Integrantes del Equipo (Requisito UCSC) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Users size={18} color="#38bdf8" />
            <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: 0 }}>
              Equipo de Desarrollo
            </h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: 1.8 }}>
            <li style={{ color: '#f1f5f9', fontWeight: 600 }}>• Marcelo Oyanedel</li>
            <li style={{ color: '#f1f5f9', fontWeight: 600 }}>• Sebastián Acuña</li>
            <li style={{ color: '#f1f5f9', fontWeight: 600 }}>• Benjamín Baeza</li>
            <li style={{ color: '#f1f5f9', fontWeight: 600 }}>• Ricardo Tapia</li>
          </ul>
          <small style={{ display: 'block', marginTop: '10px', color: '#64748b', fontSize: '11px' }}>
            Desarrollo Web Seguro & DevSecOps
          </small>
        </div>

        {/* Columna 3: Categorías Populares */}
        <div>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Categorías Populares</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: 1.8 }}>
            <li><a href="#gpus" style={{ color: '#94a3b8', textDecoration: 'none' }}>Tarjetas Gráficas (GPU)</a></li>
            <li><a href="#cpus" style={{ color: '#94a3b8', textDecoration: 'none' }}>Procesadores (CPU)</a></li>
            <li><a href="#motherboards" style={{ color: '#94a3b8', textDecoration: 'none' }}>Placas Madre AM5 / Intel</a></li>
            <li><a href="#ram" style={{ color: '#94a3b8', textDecoration: 'none' }}>Memorias RAM DDR5</a></li>
            <li><a href="#ssd" style={{ color: '#94a3b8', textDecoration: 'none' }}>Almacenamiento NVMe Gen4</a></li>
          </ul>
        </div>

        {/* Columna 4: Ubicación y Contacto */}
        <div>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Ubicación & Contacto</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            <MapPin size={14} color="#38bdf8" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Los Ángeles, Región del Biobío, Chile.<br />
            <Clock size={14} color="#38bdf8" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <strong>Atención:</strong> Lun - Vie: 09:00 a 18:00 hrs.<br />
            <Mail size={14} color="#38bdf8" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            <strong>Correo:</strong> contacto@pcnfactory.cl
          </p>
        </div>
      </div>

      {/* Barra Inferior de Copyright y Derechos */}
      <div
        style={{
          borderTop: '1px solid #1e293b',
          maxWidth: '1280px',
          margin: '36px auto 0',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        <span>© 2026 <strong>NexoPC</strong> · Plataforma Web Segura y DevSecOps.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="#10b981" />
          Universidad Católica de la Santísima Concepción (UCSC)
        </span>
      </div>
    </footer>
  );
}
