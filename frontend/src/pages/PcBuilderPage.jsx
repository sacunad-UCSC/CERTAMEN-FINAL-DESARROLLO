import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Monitor,
  HardDrive,
  Layers,
  Zap,
  Box,
  Wind,
  Plus,
  Trash2,
  RotateCcw,
  ShoppingCart,
  Check,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { api } from '../services/api';
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
            <Sparkles size={16} /> CONFIGURADOR DE HARDWARE
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {selectedCount} de {BUILD_SLOTS.length} partes seleccionadas
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
          Arma tu Computador Gamer a Medida
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '850px', marginTop: '6px' }}>
          Selecciona tus componentes favoritos y calcula el presupuesto total de tu equipo en tiempo real.
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

        {/* Columna Derecha: Resumen de Presupuesto */}
        <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card: Total y Botón de Compra */}
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
                disabled={selectedCount === 0}
                style={{
                  background: selectedCount === 0 ? '#475569' : '#008ecc',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
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
