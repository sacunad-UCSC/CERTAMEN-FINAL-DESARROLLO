import React, { useState, useEffect } from 'react';
import { X, User, ShoppingBag, ShieldCheck, Key, LogOut, Package, Calendar, Clock, CreditCard, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function UserProfileModal({
  onClose,
  onOpenChangePassword,
  onNavigateAdmin,
  initialTab = 'orders',
  onOpenProductDetail,
  onExploreProducts,
  newOrderAlert = null,
  embedded = false,
}) {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab || 'orders'); // 'orders', 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadMyOrders();
    }
  }, [activeTab, token, newOrderAlert]);

  const loadMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const authToken = token || localStorage.getItem('token');
      const res = await api.getMyOrders(authToken);
      if (res && res.success) {
        setOrders(res.orders || []);
      }
    } catch (e) {
      console.error('Error cargando pedidos', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!user) return null;

  const content = (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: embedded ? '100%' : '640px',
        maxHeight: embedded ? 'none' : '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: embedded ? '0 4px 16px rgba(0,0,0,0.04)' : '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #e2e8f0',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cabecera de Usuario */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d284f 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '24px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, #38bdf8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(0, 142, 204, 0.4)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>{user.name}</h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '2px 0 6px 0' }}>{user.email}</p>
            <span
              style={{
                background: user.role === 'Administrador' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 142, 204, 0.25)',
                color: user.role === 'Administrador' ? '#fca5a5' : '#7dd3fc',
                border: user.role === 'Administrador' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(0, 142, 204, 0.4)',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldCheck size={12} /> {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Modal */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: 1,
              padding: '13px 16px',
              border: 'none',
              background: activeTab === 'orders' ? '#ffffff' : 'transparent',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: 700,
              fontSize: '13.5px',
              color: activeTab === 'orders' ? 'var(--primary)' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <ShoppingBag size={17} />
            Mis Compras & Pedidos {orders.length > 0 && `(${orders.length})`}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '13px 16px',
              border: 'none',
              background: activeTab === 'profile' ? '#ffffff' : 'transparent',
              borderBottom: activeTab === 'profile' ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: 700,
              fontSize: '13.5px',
              color: activeTab === 'profile' ? 'var(--primary)' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={17} />
            Mi Cuenta & Seguridad
          </button>
        </div>

        {/* Contenido en Scroll */}
        <div style={{ overflowY: 'auto', padding: '22px', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {activeTab === 'orders' && (
            <div>
              {/* Notificación de Pedido Recién Creado */}
              {newOrderAlert && (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    animation: 'fadeIn 0.3s ease',
                  }}
                >
                  <CheckCircle2 size={24} color="#16a34a" />
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#166534' }}>
                      ¡Pedido {newOrderAlert} generado con éxito!
                    </strong>
                    <div style={{ fontSize: '12px', color: '#15803d' }}>
                      Ya se encuentra en preparación para despacho vía Chilexpress.
                    </div>
                  </div>
                </div>
              )}

              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Cargando tus compras y pedidos...</div>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <Package size={52} style={{ margin: '0 auto 12px', opacity: 0.4, color: 'var(--primary)' }} />
                  <p style={{ fontWeight: 800, fontSize: '15px', margin: '0 0 6px 0', color: 'var(--navy)' }}>
                    No tienes pedidos registrados aún.
                  </p>
                  <p style={{ fontSize: '13px', margin: '0 0 16px 0', color: '#64748b' }}>
                    ¡Explora el catálogo o arma tu PC gamer para comenzar!
                  </p>
                  {onExploreProducts && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        onClose();
                        onExploreProducts();
                      }}
                      style={{ padding: '8px 20px', fontSize: '13px' }}
                    >
                      Ver Productos del Catálogo
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Historial de Compras ({orders.length} pedidos)
                    </span>
                    <button
                      onClick={loadMyOrders}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Actualizar lista
                    </button>
                  </div>

                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px',
                        background: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '14.5px', color: 'var(--navy)' }}>
                            {ord.numeroPedido || ord.orderNumber || 'Pedido NexoPC'}
                          </strong>
                          <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                          </div>
                        </div>
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {ord.estadoPedido || ord.orderStatus || 'En Preparación'}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          <strong>Envío:</strong> {ord.empresaTransporte || 'Chilexpress'} &bull; Seguimiento: <strong>{ord.numeroSeguimiento || ord.trackingNumber || 'CHX-654321'}</strong>
                        </span>
                      </div>

                      {ord.items && ord.items.length > 0 && (
                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                            Artículos incluidos:
                          </div>
                          {ord.items.map((it, i) => (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '5px 0',
                                borderBottom: i !== ord.items.length - 1 ? '1px dashed #e2e8f0' : 'none',
                              }}
                            >
                              <span
                                style={{
                                  color: onOpenProductDetail ? 'var(--primary)' : 'var(--navy)',
                                  fontWeight: 600,
                                  cursor: onOpenProductDetail ? 'pointer' : 'default',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                onClick={() => onOpenProductDetail && onOpenProductDetail(it)}
                                title={onOpenProductDetail ? 'Ver especificaciones en ventana' : ''}
                              >
                                {it.nombre || it.name} &times; <strong>{it.cantidad || it.quantity || 1}</strong>
                                {onOpenProductDetail && <ExternalLink size={12} />}
                              </span>
                              <strong style={{ color: 'var(--navy)' }}>
                                ${((it.subtotal || it.precio || it.price || 0)).toLocaleString('es-CL')}
                              </strong>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Total Pagado</span>
                        <strong style={{ fontSize: '16px', color: 'var(--navy)' }}>
                          ${(ord.total || 0).toLocaleString('es-CL')}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Datos del Usuario
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nombre:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.name}</span>

                  <span style={{ color: '#64748b', fontWeight: 600 }}>Correo:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.email}</span>

                  <span style={{ color: '#64748b', fontWeight: 600 }}>Rol:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.role}</span>
                </div>
              </div>

              {/* Botón rápido a mis compras */}
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(0, 142, 204, 0.3)',
                  background: 'rgba(0, 142, 204, 0.05)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  color: 'var(--primary)',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShoppingBag size={18} />
                  Ver Mis Compras & Pedidos ({orders.length})
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Abrir &rarr;</span>
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    onClose();
                    onOpenChangePassword();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    color: 'var(--navy)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Key size={18} color="var(--primary)" />
                    Cambiar Contraseña
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Cifrado Argon2id &rarr;</span>
                </button>

                {user.role === 'Administrador' && onNavigateAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateAdmin();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid #fca5a5',
                      background: '#fef2f2',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      color: '#b91c1c',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={18} color="#b91c1c" />
                      Ir al Panel Administrador
                    </span>
                    <span style={{ fontSize: '12px', color: '#b91c1c' }}>Abrir &rarr;</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#f1f5f9',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    color: '#64748b',
                    marginTop: '4px',
                  }}
                >
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  if (embedded) {
    return content;
  }

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
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      {content}
    </div>
  );
}
