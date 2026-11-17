import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Wrench,
  Home,
  PhoneCall,
  Key,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({
  onNavigate,
  currentTab,
  onOpenAuth,
  onSearch,
  onOpenProfile,
  onOpenChangePassword,
  onOpenCart,
}) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDesktopUserMenu, setShowDesktopUserMenu] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <>
      {/* HEADER SUPERIOR */}
      <header className="top-header">
        <div className="top-bar-container">
          {/* Logo oficial de NexoPC */}
          <div
            className="logo"
            onClick={() => onNavigate('home')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <img
              src="/logo.png"
              alt="NexoPC Logo"
              className="navbar-brand-logo"
            />
          </div>

          {/* Buscador central */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar: RTX 4070, Ryzen 7, DDR5..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Acciones de escritorio (Botones mejorados visualmente) */}
          <div className="header-actions desktop-nav-actions">
            {/* Botón Destacado: Arma tu PC */}
            <button
              className={`header-btn-pill ${currentTab === 'builder' ? 'active-pill' : ''}`}
              onClick={() => onNavigate('builder')}
            >
              <Wrench size={16} />
              Arma tu PC
            </button>

            {/* Botón Contacto */}
            <button
              className={`header-btn-text ${currentTab === 'contact' ? 'active-text' : ''}`}
              onClick={() => onNavigate('contact')}
            >
              Contacto & Cotización
            </button>

            {/* Botón Admin (si tiene rol Administrador) */}
            {user && user.role === 'Administrador' && (
              <button
                className={`header-btn-admin ${currentTab === 'admin' ? 'active-admin' : ''}`}
                onClick={() => onNavigate('admin')}
              >
                <ShieldCheck size={17} />
                Panel Admin
              </button>
            )}

            {/* Menú de Perfil de Usuario */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="header-user-btn"
                  onClick={() => setShowDesktopUserMenu(!showDesktopUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown flotante de perfil */}
                {showDesktopUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 15px 35px rgba(15, 23, 42, 0.15)',
                      border: '1px solid #e2e8f0',
                      width: '240px',
                      padding: '10px 0',
                      zIndex: 1000,
                    }}
                    onMouseLeave={() => setShowDesktopUserMenu(false)}
                  >
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '14px' }}>
                        {user.name}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>{user.email}</div>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '4px',
                          background: user.role === 'Administrador' ? '#fee2e2' : '#e0f2fe',
                          color: user.role === 'Administrador' ? '#b91c1c' : '#0369a1',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowDesktopUserMenu(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="dropdown-menu-item"
                    >
                      <ShoppingBag size={16} color="var(--primary)" /> Mis Compras & Pedidos
                    </button>

                    <button
                      onClick={() => {
                        setShowDesktopUserMenu(false);
                        if (onOpenChangePassword) onOpenChangePassword();
                      }}
                      className="dropdown-menu-item"
                    >
                      <Key size={16} color="#475569" /> Cambiar Contraseña
                    </button>

                    {user.role === 'Administrador' && (
                      <button
                        onClick={() => {
                          setShowDesktopUserMenu(false);
                          onNavigate('admin');
                        }}
                        className="dropdown-menu-item"
                      >
                        <ShieldCheck size={16} color="#c8102e" /> Panel Administrador
                      </button>
                    )}

                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />

                    <button
                      onClick={() => {
                        setShowDesktopUserMenu(false);
                        logout();
                      }}
                      className="dropdown-menu-item dropdown-logout"
                    >
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="header-btn" onClick={onOpenAuth}>
                <UserIcon size={18} />
                Iniciar Sesión
              </button>
            )}

            {/* Carrito de Compras */}
            <button
              className={`header-btn cart-btn ${currentTab === 'cart' ? 'active-cart' : ''}`}
              onClick={() => onOpenCart ? onOpenCart() : onNavigate('cart')}
              title="Carrito de compras"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>

          {/* Acciones Rápidas en Móviles */}
          <div className="mobile-top-quick-actions">
            <button
              className="mobile-quick-btn"
              onClick={() => onOpenCart ? onOpenCart() : onNavigate('cart')}
              title="Ver Carro"
            >
              <ShoppingCart size={22} color="var(--navy)" />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {user && (
              <button
                className="mobile-quick-btn"
                onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                title="Usuario"
              >
                <div className="mobile-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Menú flotante móvil para usuario */}
        {showMobileUserMenu && user && (
          <div className="mobile-user-dropdown">
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '14px' }}>{user.name}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>{user.email}</div>
              <span className="user-role-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                {user.role}
              </span>
            </div>

            <button
              onClick={() => {
                setShowMobileUserMenu(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="dropdown-item"
            >
              <ShoppingBag size={16} color="var(--primary)" /> Mis Compras & Pedidos
            </button>

            <button
              onClick={() => {
                setShowMobileUserMenu(false);
                if (onOpenChangePassword) onOpenChangePassword();
              }}
              className="dropdown-item"
            >
              <Key size={16} color="#475569" /> Cambiar Contraseña
            </button>

            {user.role === 'Administrador' && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setShowMobileUserMenu(false);
                }}
                className="dropdown-item"
              >
                <ShieldCheck size={16} color="#c8102e" /> Panel Administrador
              </button>
            )}

            <button
              onClick={() => {
                logout();
                setShowMobileUserMenu(false);
              }}
              className="dropdown-item logout"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        )}
      </header>

      {/* ==============================================================
          BARRA DE NAVEGACIÓN MÓVIL INFERIOR
          ============================================================== */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <Home size={20} />
          <span>Inicio</span>
        </button>

        <button
          className={`mobile-nav-item ${currentTab === 'builder' ? 'active' : ''}`}
          onClick={() => onNavigate('builder')}
        >
          <Wrench size={20} />
          <span>Arma tu PC</span>
        </button>

        <button
          className={`mobile-nav-item cart-item ${currentTab === 'cart' ? 'active' : ''}`}
          onClick={() => onOpenCart ? onOpenCart() : onNavigate('cart')}
        >
          <div className="mobile-nav-icon-wrap">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="mobile-cart-badge">{totalItems}</span>}
          </div>
          <span>Carro</span>
        </button>

        <button
          className={`mobile-nav-item ${currentTab === 'contact' ? 'active' : ''}`}
          onClick={() => onNavigate('contact')}
        >
          <PhoneCall size={20} />
          <span>Contacto</span>
        </button>

        {user && user.role === 'Administrador' ? (
          <button
            className={`mobile-nav-item ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            <ShieldCheck size={20} color={currentTab === 'admin' ? 'var(--primary)' : '#c8102e'} />
            <span style={{ color: currentTab === 'admin' ? 'var(--primary)' : '#c8102e' }}>Admin</span>
          </button>
        ) : (
          <button
            className="mobile-nav-item"
            onClick={() => {
              if (onOpenProfile) onOpenProfile();
            }}
          >
            <UserIcon size={20} />
            <span>Perfil</span>
          </button>
        )}
      </nav>
    </>
  );
}
