import React, { useState, useEffect } from 'react';
import { X, User, ShoppingBag, ShieldCheck, Key, LogOut, Package, Calendar, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function UserProfileModal({ onClose, onOpenChangePassword, onNavigateAdmin }) {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && token) {
      loadMyOrders();
    }
  }, [activeTab, token]);

  const loadMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.getMyOrders(token);
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
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          border: '2px solid var(--primary)',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px -8px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '24px 28px',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            <X size={18} />
          </button>

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
                fontSize: '24px',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(0, 142, 204, 0.4)',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{user.name}</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 6px 0' }}>{user.email}</p>
              <span
                style={{
                  background: user.role === 'Administrador' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 142, 204, 0.2)',
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

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              color: activeTab === 'profile' ? 'var(--primary)' : '#64748b',
              borderBottom: activeTab === 'profile' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <User size={16} /> Mi Cuenta & Seguridad
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              color: activeTab === 'orders' ? 'var(--primary)' : '#64748b',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={16} /> Mis Compras & Pedidos
          </button>
        </div>

        {/* Contenido en Scroll */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Datos del Usuario
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Nombre:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.name}</span>

                  <span style={{ color: '#64748b', fontWeight: 600 }}>Correo:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.email}</span>

                  <span style={{ color: '#64748b', fontWeight: 600 }}>Rol:</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{user.role}</span>
                </div>
              </div>

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
                    fontSize: '14px',
                    color: 'var(--navy)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Key size={18} color="var(--primary)" />
                    Cambiar Contraseña
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Actualizar Argon2id &rarr;</span>
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
                      fontSize: '14px',
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
                    fontSize: '14px',
                    color: '#64748b',
                    marginTop: '8px',
                  }}
                >
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Cargando tus compras...
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <Package size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 700, margin: '0 0 6px 0' }}>No tienes pedidos registrados aún.</p>
                  <p style={{ fontSize: '12px', margin: 0 }}>¡Explora el catálogo o arma tu PC gamer para comenzar!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '16px',
                        background: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>
                            {ord.numeroPedido || ord.orderNumber || 'Pedido'}
                          </strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('es-CL') : 'Reciente'}
                          </div>
                        </div>
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {ord.estadoPedido || ord.orderStatus || 'En Preparación'}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                        <strong>Seguimiento:</strong> {ord.numeroSeguimiento || 'CHX-654321'} ({ord.empresaTransporte || 'Chilexpress'})
                      </div>

                      {ord.items && ord.items.length > 0 && (
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', fontSize: '12px', marginBottom: '10px' }}>
                          {ord.items.map((it, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                              <span>{it.nombre || it.name} &times; {it.cantidad || it.quantity || 1}</span>
                              <strong>${((it.subtotal || it.precio || 0)).toLocaleString('es-CL')}</strong>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Total Pagado</span>
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
        </div>
      </div>
    </div>
  );
}
