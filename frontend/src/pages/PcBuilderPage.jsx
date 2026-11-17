import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Monitor,
  HardDrive,
  Layers,
  Zap,
  Box,
  Wind,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  RotateCcw,
  ShoppingCart,
  Gauge,
  Check,
  Sparkles,
  RefreshCw,
  ArrowRightLeft,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { checkCompatibility } from '../services/compatibilityEngine';
import { useCart } from '../context/CartContext';

// Ranuras configurables para el armado
const BUILD_SLOTS = [
  { id: 'cpu', name: 'Procesador (CPU)', category: 'Procesadores (CPU)', icon: Cpu, required: true },
  { id: 'motherboard', name: 'Placa Madre', category: 'Placas Madre', icon: Layers, required: true },
  { id: 'ram', name: 'Memoria RAM', category: 'Memorias RAM', icon: Zap, required: true },
  { id: 'gpu', name: 'Tarjeta Gráfica (GPU)', category: 'Tarjetas Gráficas (GPU)', icon: Monitor, required: false },
  { id: 'storage', name: 'Almacenamiento (SSD NVMe)', category: 'Almacenamiento (SSD/NVMe)', icon: HardDrive, required: true },
  { id: 'psu', name: 'Fuente de Poder (PSU)', category: 'Fuentes de Poder (PSU)', icon: Zap, required: true },
  { id: 'cooler', name: 'Refrigeración Líquida / Aire', category: 'Refrigeración', icon: Wind, required: false },
  { id: 'caseComp', name: 'Gabinete Gamer', category: 'Gabinetes', icon: Box, required: true },
];

export default function PcBuilderPage({ onNavigate, initialProduct, onClearInitialProduct }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParts, setSelectedParts] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    cooler: null,
    caseComp: null,
  });

  const [activeModalSlot, setActiveModalSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addedToast, setAddedToast] = useState('');

  const { addToCart } = useCart();

  // Si viene un producto seleccionado desde el modal de detalles, agregarlo automáticamente a su ranura correspondiente
  useEffect(() => {
    if (initialProduct) {
      const categoryToSlot = {
        'Procesadores (CPU)': 'cpu',
        'Placas Madre': 'motherboard',
        'Memorias RAM': 'ram',
        'Tarjetas Gráficas (GPU)': 'gpu',
        'Almacenamiento (SSD/NVMe)': 'storage',
        'Fuentes de Poder (PSU)': 'psu',
        'Refrigeración': 'cooler',
        'Gabinetes': 'caseComp',
      };

      const slotId = categoryToSlot[initialProduct.category];
      if (slotId) {
        setSelectedParts((prev) => ({
          ...prev,
          [slotId]: initialProduct,
        }));
        setAddedToast(`¡${initialProduct.name} agregado a tu armado!`);
        setTimeout(() => setAddedToast(''), 4500);
      }
      if (onClearInitialProduct) {
        onClearInitialProduct();
      }
    }
  }, [initialProduct]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.getProducts();
        if (res.success) {
          setAllProducts(res.products);
        }
      } catch (err) {
        console.error('Error al cargar catálogo para el armador', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Ejecución del motor con catálogo completo para obtener sugerencias de reemplazo
  const analysis = checkCompatibility(selectedParts, allProducts);

  const selectedCount = Object.values(selectedParts).filter(Boolean).length;
  const totalPrice = Object.values(selectedParts).reduce((acc, part) => (part ? acc + part.price : acc), 0);

  const handleSelectProduct = (slotId, product) => {
    setSelectedParts((prev) => ({
      ...prev,
      [slotId]: product,
    }));
    setActiveModalSlot(null);
    setSearchTerm('');
  };

  const handleSwapProduct = (slotId, newProduct) => {
    setSelectedParts((prev) => ({
      ...prev,
      [slotId]: newProduct,
    }));
    setAddedToast(`¡Componente cambiado con éxito por ${newProduct.name}!`);
    setTimeout(() => setAddedToast(''), 4000);
  };

  const handleRemoveProduct = (slotId) => {
    setSelectedParts((prev) => ({
      ...prev,
      [slotId]: null,
    }));
  };

  const handleResetBuild = () => {
    if (window.confirm('¿Deseas reiniciar la configuración actual y comenzar de nuevo?')) {
      setSelectedParts({
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        cooler: null,
        caseComp: null,
      });
    }
  };

  const handleAddAllToCart = () => {
    const partsToAdd = Object.values(selectedParts).filter(Boolean);
    if (partsToAdd.length === 0) return;

    partsToAdd.forEach((part) => {
      addToCart(part);
    });

    setAddedToast('¡Todos los componentes de tu build fueron agregados al carro!');
    setTimeout(() => setAddedToast(''), 3500);
  };

  const activeSlotConfig = BUILD_SLOTS.find((s) => s.id === activeModalSlot);
  const availableModalProducts = activeSlotConfig
    ? allProducts
        .filter((p) => p.category === activeSlotConfig.category)
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="builder-layout-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px', minHeight: '80vh' }}>
      {/* Cabecera del Módulo */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span
            style={{
              background: 'rgba(0, 142, 204, 0.1)',
              color: 'var(--primary)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} /> ASESOR INTELIGENTE DE HARDWARE
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {selectedCount} de {BUILD_SLOTS.length} partes seleccionadas
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
          Arma tu Computador Gamer a Medida
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '850px', marginTop: '6px' }}>
          Configura tus componentes con diagnóstico de hardware en vivo. Si un componente es incompatible, defectuoso o provoca cuello de botella, el sistema te recomendará <strong>por cuáles alternativas exactas puedes cambiarlo</strong> con un solo clic.
        </p>
      </div>

      {/* Notificación flotante de confirmación */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#10b981',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600,
          }}
        >
          <Check size={20} /> {addedToast}
        </div>
      )}

      {/* SECCIÓN DESTACADA: ASISTENTE DE REEMPLAZO SI HAY INCOMPATIBILIDADES O ADVERTENCIAS */}
      {analysis.replacementSuggestions.length > 0 && (
        <div
          style={{
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                background: '#3b82f6',
                color: '#fff',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RefreshCw size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>
                Opciones Recomendadas para Resolver Incompatibilidades o Cuello de Botella
              </h3>
              <p style={{ fontSize: '13px', color: '#3b82f6', margin: '2px 0 0 0' }}>
                Detectamos problemas con componentes actuales. Puedes cambiarlos inmediatamente por estas opciones garantizadas:
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analysis.replacementSuggestions.map((sugg, sIdx) => {
              const currentComp = selectedParts[sugg.targetSlot];

              return (
                <div
                  key={sIdx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <ArrowRightLeft size={16} color="#2563eb" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>
                      {sugg.reason}
                    </span>
                  </div>

                  {/* Tarjetas de componentes alternativos recomendados */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {sugg.options.map((opt) => {
                      const priceDiff = currentComp ? opt.price - currentComp.price : opt.price;

                      return (
                        <div
                          key={opt._id}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '10px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img
                              src={opt.imageUrl}
                              alt={opt.name}
                              style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '6px', background: '#fff', border: '1px solid #e2e8f0' }}
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                                {opt.brand}
                              </span>
                              <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {opt.name}
                              </h5>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
                                ${opt.price.toLocaleString('es-CL')}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '11px', color: priceDiff > 0 ? '#b45309' : priceDiff < 0 ? '#15803d' : '#64748b', fontWeight: 700 }}>
                              {currentComp ? (priceDiff > 0 ? `+ $${priceDiff.toLocaleString('es-CL')}` : priceDiff < 0 ? `- $${Math.abs(priceDiff).toLocaleString('es-CL')}` : 'Mismo precio') : 'Nuevo componente'}
                            </span>
                            <button
                              onClick={() => handleSwapProduct(sugg.targetSlot, opt)}
                              style={{
                                background: '#2563eb',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <Check size={14} /> Cambiar por este
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenido en 2 Columnas (Responsivo para Móviles y Escritorio) */}
      <div className="builder-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
        {/* Columna Izquierda: Lista de Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {BUILD_SLOTS.map((slot) => {
            const Icon = slot.icon;
            const currentPart = selectedParts[slot.id];

            return (
              <div
                key={slot.id}
                className="builder-slot-item"
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: currentPart ? '1.5px solid #008ecc' : '1px solid var(--border)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: currentPart ? '0 4px 15px rgba(0,142,204,0.06)' : '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Info del slot y componente */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1 }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      background: currentPart ? 'rgba(0, 142, 204, 0.1)' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentPart ? 'var(--primary)' : '#64748b',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  {currentPart ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                      <img
                        src={currentPart.imageUrl}
                        alt={currentPart.name}
                        style={{
                          width: '54px',
                          height: '54px',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          background: '#fff',
                          border: '1px solid #f1f5f9',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          {slot.name}
                        </div>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--navy)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            margin: '2px 0',
                          }}
                          title={currentPart.name}
                        >
                          {currentPart.name}
                        </h4>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Marca: <strong>{currentPart.brand}</strong> &bull; Stock: {currentPart.stock} unid.
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: '12px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                          ${currentPart.price.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)' }}>
                        {slot.name} {slot.required && <span style={{ color: '#ef4444' }}>*</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Categoría: {slot.category}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {currentPart ? (
                    <>
                      <button
                        onClick={() => setActiveModalSlot(slot.id)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: 'var(--navy)',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Cambiar componente por otro de la tienda"
                      >
                        <ArrowRightLeft size={14} /> Cambiar
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(slot.id)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          padding: '8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Quitar componente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveModalSlot(slot.id)}
                      style={{
                        background: 'var(--primary)',
                        border: 'none',
                        color: '#fff',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Plus size={16} /> Elegir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Motor de Análisis, Cuello de Botella y Resumen */}
        <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Diagnóstico de Compatibilidad */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: analysis.isCompatible ? '1.5px solid #10b981' : '1.5px solid #ef4444',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              {analysis.isCompatible ? (
                <CheckCircle2 size={24} color="#10b981" />
              ) : (
                <XCircle size={24} color="#ef4444" />
              )}
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                {analysis.isCompatible ? 'Hardware 100% Compatible' : 'Incompatibilidad Detectada'}
              </h3>
            </div>

            {/* Listado de Errores Críticos */}
            {analysis.issues.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={14} /> Problemas de Hardware:
                </div>
                {analysis.issues.map((issue, idx) => (
                  <p key={idx} style={{ fontSize: '12px', color: '#7f1d1d', margin: '4px 0' }}>
                    &bull; {issue}
                  </p>
                ))}
              </div>
            )}

            {/* Listado de Advertencias */}
            {analysis.warnings.length > 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Sugerencias técnicas:
                </div>
                {analysis.warnings.map((warn, idx) => (
                  <p key={idx} style={{ fontSize: '12px', color: '#92400e', margin: '4px 0' }}>
                    &bull; {warn}
                  </p>
                ))}
              </div>
            )}

            {analysis.isCompatible && analysis.issues.length === 0 && (
              <p style={{ fontSize: '13px', color: '#047857' }}>
                Todos los componentes seleccionados poseen sockets, ranuras de memoria y voltajes coordinados para encender sin inconvenientes.
              </p>
            )}
          </div>

          {/* Card 2: Análisis de Cuello de Botella (Bottleneck Engine) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)' }}>
                  Cuello de Botella (CPU vs GPU)
                </h3>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: analysis.bottleneck.percentage <= 10 ? '#10b981' : analysis.bottleneck.percentage <= 20 ? '#f59e0b' : '#ef4444',
                  background: analysis.bottleneck.percentage <= 10 ? '#ecfdf5' : analysis.bottleneck.percentage <= 20 ? '#fffbeb' : '#fef2f2',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {selectedParts.cpu && selectedParts.gpu ? `${analysis.bottleneck.percentage}% de impacto` : 'Pendiente'}
              </span>
            </div>

            {selectedParts.cpu && selectedParts.gpu ? (
              <>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: `${100 - analysis.bottleneck.percentage}%`,
                      height: '100%',
                      background: analysis.bottleneck.percentage <= 10 ? '#10b981' : analysis.bottleneck.percentage <= 20 ? '#f59e0b' : '#ef4444',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                  {analysis.bottleneck.type}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {analysis.bottleneck.description}
                </p>
                {analysis.bottleneck.recommendation && (
                  <p style={{ fontSize: '11px', color: 'var(--primary-dark)', marginTop: '6px', background: 'rgba(0,142,204,0.06)', padding: '6px 8px', borderRadius: '6px' }}>
                    💡 <strong>Tip NexoPC:</strong> {analysis.bottleneck.recommendation}
                  </p>
                )}
              </>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Selecciona tanto un Procesador como una Tarjeta Gráfica para calcular la sincronización de cuadros por segundo (FPS).
              </p>
            )}

            {/* Consumo Eléctrico Estimado */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Consumo Estimado (TDP):</span>
                <strong style={{ color: 'var(--navy)' }}>~{analysis.estimatedWatts} Watts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fuente Recomendada:</span>
                <strong style={{ color: 'var(--primary)' }}>&ge; {analysis.recommendedPsuWatts} Watts</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Total y Botón de Compra */}
          <div
            style={{
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 8px 24px rgba(15,23,42,0.18)',
            }}
          >
            <div style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Presupuesto Total Build
            </div>
            <div style={{ fontSize: '30px', fontWeight: 800, margin: '8px 0 18px 0', color: '#38bdf8' }}>
              ${totalPrice.toLocaleString('es-CL')} <span style={{ fontSize: '14px', color: '#94a3b8' }}>CLP</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleAddAllToCart}
                disabled={selectedCount === 0 || !analysis.isCompatible}
                style={{
                  background: selectedCount === 0 || !analysis.isCompatible ? '#475569' : '#008ecc',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: selectedCount === 0 || !analysis.isCompatible ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease',
                }}
              >
                <ShoppingCart size={18} /> Añadir Configuración al Carro
              </button>

              <button
                onClick={handleResetBuild}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <RotateCcw size={14} /> Reiniciar Selección
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Selector de Componente */}
      {activeModalSlot && (
        <div
          className="builder-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setActiveModalSlot(null)}
        >
          <div
            className="builder-modal-box"
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>
                  Seleccionar {activeSlotConfig?.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Mostrando componentes verificados en stock para la categoría: {activeSlotConfig?.category}
                </p>
              </div>
              <button
                onClick={() => setActiveModalSlot(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            {/* Buscador interno */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
              <input
                type="text"
                placeholder={`Buscar en ${activeSlotConfig?.name}... (ej. modelo, marca)`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                }}
                autoFocus
              />
            </div>

            {/* Lista de productos para seleccionar */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableModalProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No se encontraron productos disponibles en esta categoría con el filtro actual.
                </div>
              ) : (
                availableModalProducts.map((p) => {
                  const isAlreadySelected = selectedParts[activeModalSlot]?._id === p._id;

                  return (
                    <div
                      key={p._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: isAlreadySelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: isAlreadySelected ? 'rgba(0,142,204,0.03)' : '#fff',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '1px solid #f1f5f9',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                            {p.brand}
                          </span>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', margin: '2px 0' }}>
                            {p.name}
                          </h4>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {p.specs?.socket && <span>Socket: <strong>{p.specs.socket}</strong> &bull; </span>}
                            {p.specs?.tipoMemoria && <span>RAM: <strong>{p.specs.tipoMemoria}</strong> &bull; </span>}
                            {p.specs?.potenciaWatts && <span>TDP: <strong>{p.specs.potenciaWatts}</strong> &bull; </span>}
                            <span>Stock: <strong>{p.stock} unid.</strong></span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy)' }}>
                            ${p.price.toLocaleString('es-CL')}
                          </div>
                          {p.originalPrice && (
                            <div style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                              ${p.originalPrice.toLocaleString('es-CL')}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleSelectProduct(activeModalSlot, p)}
                          style={{
                            background: isAlreadySelected ? '#10b981' : 'var(--primary)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {isAlreadySelected ? (
                            <>
                              <Check size={16} /> Seleccionado
                            </>
                          ) : (
                            'Elegir'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
