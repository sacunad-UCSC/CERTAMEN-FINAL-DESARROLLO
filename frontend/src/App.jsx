import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import HeroBanner from './components/HeroBanner';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PcBuilderPage from './pages/PcBuilderPage';
import ProductDetailModal from './components/ProductDetailModal';
import UserProfileModal from './components/UserProfileModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import CartModal from './components/CartModal';
import LogoLoader from './components/LogoLoader';
import ProductDetailPage from './pages/ProductDetailPage';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { api } from './services/api';
import {
  Cpu,
  Monitor,
  HardDrive,
  Layers,
  Zap,
  Box,
  Wind,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  CheckCircle,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Tarjetas Gráficas (GPU)', icon: Monitor },
  { name: 'Procesadores (CPU)', icon: Cpu },
  { name: 'Placas Madre', icon: Layers },
  { name: 'Memorias RAM', icon: Zap },
  { name: 'Almacenamiento (SSD/NVMe)', icon: HardDrive },
  { name: 'Fuentes de Poder (PSU)', icon: Zap },
  { name: 'Gabinetes', icon: Box },
  { name: 'Refrigeración', icon: Wind },
];

export default function App() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'contact', 'admin', 'cart', 'builder'
  const [products, setProducts] = useState([]);
  const [totalCatalogCount, setTotalCatalogCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [detailProduct, setDetailProduct] = useState(null);
  const [initialBuilderProduct, setInitialBuilderProduct] = useState(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState('orders');
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [productViewId, setProductViewId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('producto') || params.get('id') || params.get('sku') || null;
    }
    return null;
  });
  const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useCart();

  // Abrir producto en nueva pestaña con loader animado tal como en el video
  const openProductInNewTab = (p) => {
    if (!p) return;
    const identifier = p.sku || p._id || p.id || p.codigoSku;
    const targetUrl = `/?producto=${encodeURIComponent(identifier)}`;
    window.open(targetUrl, '_blank');
  };

  const handleOpenProductDetail = (prodOrItem) => {
    if (!prodOrItem) return;
    openProductInNewTab(prodOrItem);
  };

  // Cargar productos del catálogo
  const loadProducts = async () => {
    try {
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchFilter) filters.search = searchFilter;
      const res = await api.getProducts(filters);
      if (res.success) {
        setProducts(res.products);
        // Si no hay filtro activo de categoría ni búsqueda, actualizamos el total general del catálogo
        if (!selectedCategory && !searchFilter) {
          setTotalCatalogCount(res.count || res.products.length);
        }
      }
    } catch (err) {
      console.error('Error cargando productos', err);
    }
  };

  // Cargar catálogo inicial sin filtros para tener el conteo total siempre exacto
  useEffect(() => {
    if (user) {
      api.getProducts().then((res) => {
        if (res && res.success) {
          setTotalCatalogCount(res.count || res.products.length);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) loadProducts();
  }, [user, selectedCategory, searchFilter]);

  const handleNavigate = (tab) => {
    if (productViewId) {
      setProductViewId(null);
      window.history.pushState({}, '', '/');
    }
    setCurrentTab(tab);
  };

  const handleSearch = (term) => {
    setSearchFilter(term);
    if (productViewId) {
      setProductViewId(null);
      window.history.pushState({}, '', '/');
    }
    setCurrentTab('home');
  };

  if (loading) {
    return <LogoLoader fullPage={true} message="Cargando portal seguro NexoPC..." />;
  }

  // Si el usuario no ha iniciado sesión, se muestra la pantalla de login/registro
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuth={() => {}}
        onSearch={handleSearch}
        onOpenProfile={(tab = 'orders') => {
          setProfileInitialTab(tab);
          setIsProfileOpen(true);
        }}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onOpenCart={() => setIsCartModalOpen(true)}
      />

      <main className="main-content-area" style={{ flex: 1 }}>
        {/* VISTA DEDICADA DE PRODUCTO (ABIERTA EN NUEVA PESTAÑA CON LOADER ANIMADO) */}
        {productViewId ? (
          <ProductDetailPage
            productId={productViewId}
            onNavigateHome={() => {
              setProductViewId(null);
              window.history.pushState({}, '', '/');
              setCurrentTab('home');
            }}
            onArmarPc={(p) => {
              setInitialBuilderProduct(p);
              setProductViewId(null);
              window.history.pushState({}, '', '/');
              setCurrentTab('builder');
            }}
            onOpenCart={() => setIsCartModalOpen(true)}
          />
        ) : (
          <>
            {/* VISTA: INICIO / TIENDA */}
            {currentTab === 'home' && (
              <>
                {/* Hero Banner dinámico con rotación de componentes e imágenes */}
                <HeroBanner
                  products={products}
                  onSelectCategory={setSelectedCategory}
                  onNavigate={handleNavigate}
                  onOpenDetail={openProductInNewTab}
                />

            {/* Categorías Circulares */}
            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">Explorar Categorías de Hardware</h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Ver todas ({totalCatalogCount})
                  </button>
                )}
              </div>
              <div className="categories-grid">
                {CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <div
                      key={i}
                      className={`category-card ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(isActive ? null : cat.name)}
                    >
                      <div className="category-icon">
                        <Icon size={24} />
                      </div>
                      <div className="category-name">{cat.name.split(' ')[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grilla de Productos Destacados */}
            <div className="section-container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">
                    {selectedCategory ? selectedCategory : 'Componentes Destacados en Catálogo'}
                  </h2>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {selectedCategory
                      ? `${products.length} de ${totalCatalogCount} productos en catálogo`
                      : `${products.length} productos en catálogo oficial`}
                  </span>
                </div>
              </div>

              <div className="products-grid">
                {products.map((p) => {
                  const saveAmount = (p.originalPrice || p.price) - p.price;
                  return (
                    <div key={p._id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      {p.discountPercent > 0 && <span className="discount-tag">-{p.discountPercent}% OFF</span>}

                      {/* Imagen con cursor pointer para abrir en nueva pestaña con animación loader */}
                      <div
                        onClick={() => openProductInNewTab(p)}
                        style={{ cursor: 'pointer', textAlign: 'center', position: 'relative' }}
                        title="Haz clic para ver fotos a detalle y ficha técnica en una nueva pestaña"
                      >
                        <img src={p.imageUrl} alt={p.name} className="product-img" />
                      </div>

                      <span
                        className="product-brand"
                        onClick={() => openProductInNewTab(p)}
                        style={{ cursor: 'pointer' }}
                      >
                        {p.brand}
                      </span>
                      <h3
                        className="product-name"
                        title={p.name}
                        onClick={() => openProductInNewTab(p)}
                        style={{ cursor: 'pointer' }}
                      >
                        {p.name}
                      </h3>

                      <div className="product-price-box" style={{ marginTop: 'auto' }}>
                        <span className="current-price">${p.price.toLocaleString('es-CL')}</span>
                        {p.originalPrice > p.price && (
                          <span className="original-price">${p.originalPrice.toLocaleString('es-CL')}</span>
                        )}
                      </div>

                      {saveAmount > 0 && (
                        <span className="save-price">Ahorras ${saveAmount.toLocaleString('es-CL')}</span>
                      )}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          className="btn-primary"
                          style={{ flex: 1 }}
                          onClick={() => addToCart(p)}
                        >
                          Añadir al Carro
                        </button>
                        <button
                          onClick={() => openProductInNewTab(p)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--navy)',
                            cursor: 'pointer',
                          }}
                          title="Ver ficha técnica en una nueva pestaña"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* VISTA: ARMA TU PC (COMPATIBILITY ENGINE) */}
        {currentTab === 'builder' && (
          <PcBuilderPage
            initialProduct={initialBuilderProduct}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {/* VISTA: CONTACTO & COTIZACIÓN */}
        {currentTab === 'contact' && <ContactPage />}

        {/* VISTA: PANEL ADMINISTRATIVO */}
        {currentTab === 'admin' && <AdminPage />}

        {/* VISTA: CARRITO DE COMPRAS */}
        {currentTab === 'cart' && (
          <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)', marginBottom: '20px' }}>
              Carro de Compras
            </h1>

            {cart.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                <ShoppingCart size={48} style={{ color: '#94a3b8', margin: '0 auto 16px' }} />
                <h3>Tu carro está vacío</h3>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>
                  Explora nuestro catálogo con los componentes más potentes del mercado.
                </p>
                <button className="btn-primary" onClick={() => setCurrentTab('home')}>
                  Ir a la Tienda
                </button>
              </div>
            ) : (
              <div className="cart-layout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        background: '#ffffff',
                        padding: '16px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0' }}>{item.name}</h4>
                        <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>
                          ${item.price.toLocaleString('es-CL')} &times; {item.quantity}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    height: 'fit-content',
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Resumen de Compra</h3>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>Subtotal</span>
                    <strong>${totalPrice.toLocaleString('es-CL')}</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: '#10b981',
                    }}
                  >
                    <span>Despacho</span>
                    <strong>Gratis</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '14px 0' }} />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                      fontSize: '18px',
                    }}
                  >
                    <strong>Total</strong>
                    <strong style={{ color: 'var(--navy)' }}>${totalPrice.toLocaleString('es-CL')}</strong>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ width: '100%' }}
                    onClick={async () => {
                      try {
                        const orderData = {
                          items: cart.map(item => ({
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
                            name: user.name,
                            nombre: user.name,
                            email: user.email,
                            correo: user.email,
                            phone: '+56987654321',
                          },
                          shippingAddress: {
                            calle: 'Av. Paicaví 3280',
                            ciudad: 'Concepción',
                            region: 'Biobío',
                          },
                          paymentMethod: 'Webpay Plus (Débito/Crédito)'
                        };
                        const authToken = localStorage.getItem('token');
                        const res = await api.createOrder(orderData, authToken);
                        clearCart();
                        const orderNum = res?.orderNumber || res?.numeroPedido || 'Reciente';
                        setNewOrderAlert(orderNum);
                        setProfileInitialTab('orders');
                        setIsProfileOpen(true);
                        setCurrentTab('home');
                      } catch (e) {
                        console.error('Error guardando pedido:', e);
                        clearCart();
                        setProfileInitialTab('orders');
                        setIsProfileOpen(true);
                        setCurrentTab('home');
                      }
                    }}
                  >
                    Finalizar Pedido
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    )}
  </main>

  <Footer onNavigate={handleNavigate} />

      {/* Modal de Carro de Compras en Modo Ventana */}
      <CartModal
        isOpen={isCartModalOpen || currentTab === 'cart'}
        onClose={() => {
          setIsCartModalOpen(false);
          if (currentTab === 'cart') setCurrentTab('home');
        }}
        onCheckoutSuccess={(orderNum) => {
          setNewOrderAlert(orderNum);
          setProfileInitialTab('orders');
          setIsProfileOpen(true);
          setCurrentTab('home');
        }}
        onOpenProductDetail={handleOpenProductDetail}
      />

      {/* Modal de Detalle y Especificaciones Técnicas de Producto */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onArmarPc={(p) => {
            setInitialBuilderProduct(p);
            setDetailProduct(null);
            setCurrentTab('builder');
          }}
          onOpenCart={() => {
            setDetailProduct(null);
            setIsCartModalOpen(true);
          }}
        />
      )}

      {/* Modal de Perfil de Usuario y Mis Compras */}
      {isProfileOpen && (
        <UserProfileModal
          initialTab={profileInitialTab}
          newOrderAlert={newOrderAlert}
          onClose={() => {
            setIsProfileOpen(false);
            setNewOrderAlert(null);
          }}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onNavigateAdmin={() => setCurrentTab('admin')}
          onOpenProductDetail={handleOpenProductDetail}
          onExploreProducts={() => {
            setIsProfileOpen(false);
            setCurrentTab('home');
          }}
        />
      )}

      {/* Modal de Cambio de Contraseña Argon2id */}
      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}

      {/* Chatbot flotante interactivo */}
      <ChatbotWidget onNavigateToContact={() => setCurrentTab('contact')} />

      {/* Modal de Pedido Exitoso */}
      {orderSuccessModal && (
        <div
          onClick={() => {
            setOrderSuccessModal(false);
            setCurrentTab('home');
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px 32px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              animation: 'scaleUp 0.25s ease',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#10b981',
              }}
            >
              <CheckCircle size={44} strokeWidth={2.3} />
            </div>

            <h3
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--navy)',
                marginBottom: '10px',
              }}
            >
              ¡Pedido Simulado con Éxito!
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                lineHeight: '1.6',
                marginBottom: '26px',
              }}
            >
              Tu solicitud ha sido procesada correctamente en la plataforma de NexoPC.
            </p>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px 24px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '10px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setOrderSuccessModal(false);
                setCurrentTab('home');
              }}
            >
              Aceptar y Volver a la Tienda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
