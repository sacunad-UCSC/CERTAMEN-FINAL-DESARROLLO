import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  ShieldCheck,
  Truck,
  CheckCircle,
  Wrench,
  Info,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose, onArmarPc }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const saveAmount = (product.originalPrice || product.price) - product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Filtrar solo especificaciones no vacías
  const rawSpecs = product.specs || {};
  const specsList = Object.entries(rawSpecs).filter(
    ([, val]) => val !== null && val !== undefined && String(val).trim() !== ''
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="modal-box-card"
        style={{
          background: '#ffffff',
          border: '2px solid var(--primary)',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px -8px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            zIndex: 10,
            transition: 'background 0.2s ease',
          }}
          title="Cerrar ventana"
        >
          <X size={20} />
        </button>

        {/* Contenido en Scroll */}
        <div className="modal-scroll-body" style={{ overflowY: 'auto', padding: '32px' }}>
          <div
            className="modal-detail-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 360px) 1fr',
              gap: '36px',
              alignItems: 'start',
            }}
          >
            {/* Lado Izquierdo: Visualizador de Imagen */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '320px',
                  position: 'relative',
                }}
              >
                {product.discountPercent > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    -{product.discountPercent}% OFF
                  </span>
                )}

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '270px',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>

              {/* Badges de Garantía y Envío */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#166534',
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={18} color="#16a34a" />
                  <span>Garantía: {product.warrantyMonths || 36} meses</span>
                </div>

                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#1e40af',
                    fontWeight: 600,
                  }}
                >
                  <Truck size={18} color="#2563eb" />
                  <span>Despacho Rápido Chile</span>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Información, Precios y Especificaciones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Marca y Categoría */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(0, 142, 204, 0.1)',
                    color: 'var(--primary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {product.brand}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {product.category}
                </span>
              </div>

              {/* Nombre Principal */}
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--navy)',
                  lineHeight: '1.3',
                  margin: 0,
                }}
              >
                {product.name}
              </h2>

              {/* SKU & Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                {product.sku && <span>SKU: <strong>{product.sku}</strong></span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700 }}>
                  <CheckCircle size={15} /> En Stock ({product.stock} unidades)
                </span>
              </div>

              {/* Caja de Precios */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)' }}>
                      ${product.price.toLocaleString('es-CL')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span style={{ fontSize: '15px', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ${product.originalPrice.toLocaleString('es-CL')}
                      </span>
                    )}
                  </div>
                  {saveAmount > 0 && (
                    <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                      ¡Ahorras ${saveAmount.toLocaleString('es-CL')} comprando hoy!
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
                  IVA incluido &bull; Boleta o Factura
                </div>
              </div>

              {/* Descripción comercial */}
              {product.description && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                    Descripción del Producto
                  </h4>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* ESPECIFICACIONES TÉCNICAS COMPLETAS */}
              <div>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: 'var(--navy)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Info size={16} color="var(--primary)" />
                  Ficha Técnica & Especificaciones
                </h4>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {specsList.length > 0 ? (
                    specsList.map(([key, val], idx) => {
                      // Formatear etiquetas de claves legibles en español
                      const labelMap = {
                        socket: 'Socket / Zócalo',
                        tipoMemoria: 'Tipo de Memoria',
                        potenciaWatts: 'Consumo / Potencia',
                        factorForma: 'Factor de Forma',
                        capacidad: 'Capacidad / Memoria',
                        interfaz: 'Interfaz de Conexión',
                        frecuenciaBoost: 'Frecuencia Boost',
                        salidasVideo: 'Salidas de Video',
                        nucleosCuda: 'Núcleos CUDA',
                        nucleosHilos: 'Núcleos e Hilos',
                        frecuenciaBase: 'Frecuencia Base',
                        litografia: 'Litografía',
                        graficosIntegrados: 'Gráficos Integrados',
                        conectividad: 'Redes y Conectividad',
                        puertosUsb: 'Puertos USB / Tipo C',
                        pantallaOled: 'Pantalla OLED Integrada',
                        latencia: 'Latencia y Tiempos',
                        perfiles: 'Perfiles de Memoria',
                        iluminacion: 'Iluminación RGB',
                        disipador: 'Disipación Térmica',
                        lecturaSecuencial: 'Lectura Secuencial',
                        escrituraSecuencial: 'Escritura Secuencial',
                        durabilidadTbw: 'Durabilidad (TBW)',
                        certificacion: 'Certificación de Eficiencia',
                        dimensiones: 'Dimensiones Físicas',
                        bomba: 'Motor de la Bomba',
                        ventiladores: 'Ventiladores Incluidos',
                        tecnologias: 'Tecnologías y Características',
                      };

                      const displayLabel = labelMap[key] || key.replace(/([A-Z])/g, ' $1').toLowerCase();

                      return (
                        <div
                          key={idx}
                          className="specs-table-row"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '170px 1fr',
                            padding: '10px 14px',
                            background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                            borderBottom: idx !== specsList.length - 1 ? '1px solid #f1f5f9' : 'none',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#64748b', textTransform: 'capitalize' }}>
                            {displayLabel}
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>
                            {String(val)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '12px 14px', fontSize: '13px', color: '#64748b' }}>
                      Componente estándar para ensamble compatible con arquitectura moderna ATX / PCIe.
                    </div>
                  )}
                </div>
              </div>

              {/* Selector de Cantidad y Botones de Compra */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '8px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                {/* Cantidad */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      background: '#f8fafc',
                      border: 'none',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 16px', fontWeight: 700, fontSize: '14px' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    style={{
                      background: '#f8fafc',
                      border: 'none',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Botón Añadir al Carro */}
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    background: added ? '#10b981' : 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {added ? (
                    <>
                      <CheckCircle size={18} /> ¡Añadido al Carro!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Añadir al Carro ({quantity})
                    </>
                  )}
                </button>

                {/* Botón Usar en Arma tu PC */}
                {onArmarPc && (
                  <button
                    onClick={() => {
                      onClose();
                      onArmarPc(product);
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: 'var(--navy)',
                      padding: '12px 18px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    title="Configurar un PC gamer con este componente"
                  >
                    <Wrench size={16} /> Arma tu PC
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
