import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  CheckCircle,
  Wrench,
  ArrowLeft,
  Store,
  Clock,
  Share2,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { getSpecLabel } from '../services/specLabels';
import LogoLoader from '../components/LogoLoader';

export default function ProductDetailPage({
  productId,
  initialProduct = null,
  onNavigateHome,
  onArmarPc,
  onOpenCart,
}) {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'description', 'warranty'
  const [copiedLink, setCopiedLink] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        let found = initialProduct;

        // Si no tenemos el producto completo o necesitamos buscarlo por SKU / ID
        if (!found && productId) {
          const res = await api.getProducts();
          if (res && res.success && res.products) {
            const queryClean = String(productId).trim().toLowerCase();
            found = res.products.find(
              (p) =>
                String(p.sku || '').toLowerCase() === queryClean ||
                String(p._id || '').toLowerCase() === queryClean ||
                String(p.id || '').toLowerCase() === queryClean ||
                String(p.name || '').toLowerCase() === queryClean
            );
          }
        }

        // Mantener la animación del logo visible al menos 1000ms como en el video oficial
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 1100 - elapsed);

        setTimeout(() => {
          if (isMounted) {
            if (found) {
              setProduct(found);
              // Actualizar el título de la pestaña del navegador con el nombre del producto
              document.title = `${found.name} | PcÑactory`;
            }
            setLoading(false);
          }
        }, remainingDelay);
      } catch (err) {
        console.error('Error cargando producto en detalle:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
      document.title = 'PcÑactory | Venta de Componentes de PC & Hardware Seguro';
    };
  }, [productId, initialProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return <LogoLoader fullPage={true} />;
  }

  if (!product) {
    return (
      <div
        style={{
          maxWidth: '800px',
          margin: '60px auto',
          padding: '40px 20px',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
          Producto no encontrado
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          El componente seleccionado no se encuentra en el catálogo o ha sido modificado.
        </p>
        <button
          className="btn-primary"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            else window.location.href = '/';
          }}
        >
          Volver al Catálogo Principal
        </button>
      </div>
    );
  }

  const saveAmount = (product.originalPrice || product.price) - product.price;
  const rawSpecs = product.specs || {};
  const specsList = Object.entries(rawSpecs).filter(
    ([, val]) => val !== null && val !== undefined && String(val).trim() !== ''
  );

  return (
    <div className="product-detail-view-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Barra Superior de Navegación y Migas de Pan */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
            <span
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.location.href = '/';
              }}
              style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}
            >
              Inicio
            </span>
            <span>&rsaquo;</span>
            <span style={{ fontWeight: 600, color: '#334155' }}>{product.category || 'Componentes'}</span>
            <span>&rsaquo;</span>
            <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px' }}>
              {product.name}
            </span>
          </div>

          {/* Botón Volver y Compartir */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleShare}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Copiar enlace directo"
            >
              {copiedLink ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              {copiedLink ? '¡Enlace Copiado!' : 'Compartir'}
            </button>

            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.location.href = '/';
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={14} /> Volver a la Tienda
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div style={{ maxWidth: '1200px', margin: '28px auto 0', padding: '0 20px' }}>
        {/* Tarjeta Principal: Galería + Compra */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            padding: '36px',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) 1fr',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* COLUMNA IZQUIERDA: Imagen y Disponibilidad */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Contenedor de Imagen */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '380px',
                position: 'relative',
              }}
            >
              {product.discountPercent > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: '#008ecc',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '8px',
                    letterSpacing: '0.3px',
                  }}
                >
                  -{product.discountPercent}% OFF
                </span>
              )}

              <img
                src={product.imageUrl || '/logo.png'}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '320px',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>

            {/* Badges de Garantía y Despacho */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#166534',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={20} color="#16a34a" />
                <span>Garantía: {product.warrantyMonths || 36} meses</span>
              </div>

              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#1e40af',
                  fontWeight: 600,
                }}
              >
                <Truck size={20} color="#2563eb" />
                <span>Despacho Rápido Chile</span>
              </div>
            </div>

            {/* Cuadro de Disponibilidad por Región / Tienda (Idéntico al video) */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#f8fafc',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Store size={14} /> Disponibilidad en Tiendas
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                  Stock en Tiempo Real
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span>Internet / Despacho Inmediato</span>
                  <strong style={{ color: '#10b981' }}>{product.stock || 10} unid.</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Santiago (Las Condes / Mall Plaza)</span>
                  <span>4 unid.</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Concepción (Mall Plaza Trébol)</span>
                  <span>2 unid.</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Viña del Mar</span>
                  <span>3 unid.</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Información, Precios y Acciones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Categoría y Marca */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  background: 'rgba(0, 142, 204, 0.1)',
                  color: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {product.brand}
              </span>
              <span style={{ color: '#64748b', fontSize: '13px' }}>{product.category}</span>
            </div>

            {/* Nombre del Producto */}
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--navy)',
                lineHeight: '1.3',
              }}
            >
              {product.name}
            </h1>

            {/* SKU y Estado de Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>
                SKU: <strong style={{ color: '#334155' }}>{product.sku || 'HW-OFICIAL'}</strong>
              </span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <CheckCircle size={15} /> En Stock ({product.stock || 10} unidades)
              </span>
            </div>

            {/* Tarjeta de Precios */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '34px',
                    fontWeight: 900,
                    color: 'var(--navy)',
                  }}
                >
                  ${product.price.toLocaleString('es-CL')}
                </span>

                {product.originalPrice > product.price && (
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#94a3b8',
                      textDecoration: 'line-through',
                      fontWeight: 600,
                    }}
                  >
                    ${product.originalPrice.toLocaleString('es-CL')}
                  </span>
                )}

                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: 'auto' }}>
                  IVA incluido • Boleta o Factura
                </span>
              </div>

              {saveAmount > 0 && (
                <div style={{ marginTop: '6px', fontSize: '14px', color: '#10b981', fontWeight: 700 }}>
                  ¡Ahorras ${saveAmount.toLocaleString('es-CL')} comprando hoy!
                </div>
              )}

              <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', display: 'flex', gap: '16px' }}>
                <span>Transferencia / Débito: <strong>${product.price.toLocaleString('es-CL')}</strong></span>
                <span>Otros medios de pago: <strong>${(product.originalPrice || product.price).toLocaleString('es-CL')}</strong></span>
              </div>
            </div>

            {/* Acciones de Compra */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '8px',
              }}
            >
              {/* Selector de Cantidad */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    background: '#f8fafc',
                    border: 'none',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#334155',
                  }}
                  title="Disminuir cantidad"
                >
                  -
                </button>
                <span style={{ padding: '0 16px', fontWeight: 800, fontSize: '15px', color: 'var(--navy)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                  style={{
                    background: '#f8fafc',
                    border: 'none',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#334155',
                  }}
                  title="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              {/* Botón Añadir al Carro */}
              <button
                className="btn-primary"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '14px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontSize: '15px',
                  fontWeight: 800,
                  borderRadius: '10px',
                  background: added ? '#10b981' : 'var(--primary)',
                  transition: 'background 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                {added ? (
                  <>
                    <CheckCircle size={20} /> ¡Añadido ({quantity})!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Añadir al Carro
                  </>
                )}
              </button>

              {/* Botón Arma tu PC */}
              {onArmarPc && (
                <button
                  onClick={() => onArmarPc(product)}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    cursor: 'pointer',
                  }}
                  title="Verificar compatibilidad con Arma tu PC"
                >
                  <Wrench size={18} color="var(--primary)" /> Arma tu PC
                </button>
              )}
            </div>

            {/* Métodos de Entrega (Idéntico a pcFactory) */}
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '16px',
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Métodos de entrega</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#008ecc" /> Despacho a domicilio
                </span>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                  Disponible
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={16} color="#008ecc" /> Retiro en tienda
                </span>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                  Disponible
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: Pestañas de Especificaciones, Descripción y Garantía */}
        <div
          style={{
            marginTop: '36px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Barra de Pestañas */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '16px 28px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                background: activeTab === 'specs' ? '#ffffff' : 'transparent',
                color: activeTab === 'specs' ? 'var(--primary)' : '#64748b',
                borderBottom: activeTab === 'specs' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Layers size={17} /> Ficha Técnica & Especificaciones ({specsList.length})
            </button>

            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '16px 28px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                background: activeTab === 'description' ? '#ffffff' : 'transparent',
                color: activeTab === 'description' ? 'var(--primary)' : '#64748b',
                borderBottom: activeTab === 'description' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              Sobre este producto
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              style={{
                padding: '16px 28px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                background: activeTab === 'warranty' ? '#ffffff' : 'transparent',
                color: activeTab === 'warranty' ? 'var(--primary)' : '#64748b',
                borderBottom: activeTab === 'warranty' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              Garantía & Devoluciones
            </button>
          </div>

          {/* Contenido de la Pestaña Activa */}
          <div style={{ padding: '32px' }}>
            {/* Pestaña: Especificaciones */}
            {activeTab === 'specs' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
                  Especificaciones Técnicas Detalladas
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  Datos oficiales y parámetros de rendimiento verificados por el laboratorio técnico de PcÑactory.
                </p>

                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  {specsList.length > 0 ? (
                    specsList.map(([key, val], idx) => {
                      const displayLabel = getSpecLabel(key);
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(180px, 260px) 1fr',
                            padding: '12px 18px',
                            background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                            borderBottom: idx !== specsList.length - 1 ? '1px solid #f1f5f9' : 'none',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#475569' }}>{displayLabel}</span>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{String(val)}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '20px', fontSize: '13px', color: '#64748b' }}>
                      Componente estándar para ensamble compatible con arquitectura moderna ATX / PCIe.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pestaña: Descripción */}
            {activeTab === 'description' && (
              <div style={{ maxWidth: '850px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', marginBottom: '14px' }}>
                  Descripción de Fábrica
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155' }}>
                  {product.description ||
                    `${product.name} fabricado por ${product.brand}. Diseñado para alto rendimiento y durabilidad en estaciones de trabajo y gaming.`}
                </p>
              </div>
            )}

            {/* Pestaña: Garantía */}
            {activeTab === 'warranty' && (
              <div style={{ maxWidth: '850px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', marginBottom: '14px' }}>
                  Garantía y Respaldo PcÑactory
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155', lineHeight: '1.7' }}>
                  <p>
                    &bull; <strong>Garantía de Fábrica:</strong> {product.warrantyMonths || 36} meses oficial del fabricante ante defectos de manufactura.
                  </p>
                  <p>
                    &bull; <strong>Sello de Calidad:</strong> Todo componente es nuevo, sellado en caja y verificado bajo estándares de compatibilidad ATX / PCIe.
                  </p>
                  <p>
                    &bull; <strong>Derecho a Retracto y Garantía Legal:</strong> 6 meses de garantía legal según la Ley del Consumidor de Chile (SERNAC).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
