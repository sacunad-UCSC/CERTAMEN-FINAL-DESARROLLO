import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, ArrowRight, CheckCircle, ShieldCheck, Truck, CreditCard, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CartModal({ isOpen, onClose, onCheckoutSuccess, onOpenProductDetail }) {
  const { cart, removeFromCart, addToCart, clearCart, totalPrice, totalItems } = useCart();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUpdateQty = (item, delta) => {
    if (delta > 0) {
      addToCart(item);
    } else if (delta < 0) {
      removeFromCart(item._id);
    }
  };

  const handleFinalizarPedido = async () => {
    if (cart.length === 0) return;
    setError('');
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          nombre: item.name,
          price: item.price,
          precio: item.price,
          quantity: item.quantity,
          cantidad: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        total: totalPrice,
        customer: {
          name: user ? user.name : 'Cliente NexoPC',
          nombre: user ? user.name : 'Cliente NexoPC',
          email: user ? user.email : 'cliente@pcnfactory.cl',
          correo: user ? user.email : 'cliente@pcnfactory.cl',
          phone: '+56987654321',
        },
        shippingAddress: {
          calle: 'Av. Paicaví 3280',
          ciudad: 'Concepción',
          region: 'Biobío',
        },
        paymentMethod: 'Webpay Plus (Débito/Crédito)',
      };

      const authToken = token || localStorage.getItem('token');
      const res = await api.createOrder(orderData, authToken);

      if (res && res.success) {
        clearCart();
        onClose();
        if (onCheckoutSuccess) {
          onCheckoutSuccess(res.orderNumber || res.numeroPedido || 'Reciente');
        }
      } else {
        setError(res?.message || 'Error al procesar el pedido. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error al finalizar pedido:', err);
      setError('Error de conexión al procesar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal de Carro */}
        <div
          style={{
            background: 'linear-gradient(135deg, #09152b 0%, #0d284f 60%, #004b75 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0, 142, 204, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <ShoppingCart size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Carro de Compras
              </h2>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                {totalItems === 1 ? '1 producto seleccionado' : `${totalItems} productos seleccionados`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
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
              transition: 'background 0.2s ease',
            }}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              borderBottom: '1px solid #fecaca',
              padding: '10px 20px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Contenido en Scroll */}
        <div style={{ overflowY: 'auto', padding: '20px', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <ShoppingCart size={54} style={{ color: '#cbd5e1', margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px 0' }}>
                Tu carro está vacío
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
                Explora los productos de nuestro catálogo gamer para agregar componentes.
              </p>
              <button
                className="btn-primary"
                onClick={onClose}
                style={{ padding: '10px 24px', fontSize: '13.5px' }}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      objectFit: 'contain',
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '4px',
                      border: '1px solid #e2e8f0',
                      cursor: onOpenProductDetail ? 'pointer' : 'default',
                    }}
                    onClick={() => onOpenProductDetail && onOpenProductDetail(item)}
                    title="Haz clic para ver especificaciones técnicas en ventana"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        margin: '0 0 4px 0',
                        color: 'var(--navy)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: onOpenProductDetail ? 'pointer' : 'default',
                      }}
                      onClick={() => onOpenProductDetail && onOpenProductDetail(item)}
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800 }}>
                      ${item.price.toLocaleString('es-CL')}
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      background: '#ffffff',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => handleUpdateQty(item, -1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#64748b',
                      }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '13px' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item, 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#64748b',
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal del item */}
                  <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 800, fontSize: '13.5px', color: 'var(--navy)' }}>
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con Resumen y Finalizar Pedido */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 600 }}>
                <Truck size={15} /> Despacho Chilexpress Gratis
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 600, justifyContent: 'flex-end' }}>
                <ShieldCheck size={15} color="var(--primary)" /> Compra 100% Protegida
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '14px',
                paddingTop: '6px',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>Total a Pagar</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>
                ${totalPrice.toLocaleString('es-CL')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: '0 0 auto',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Seguir Comprando
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleFinalizarPedido}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? '#94a3b8' : 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 142, 204, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                {loading ? (
                  'Procesando Pedido...'
                ) : (
                  <>
                    Finalizar Pedido <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
