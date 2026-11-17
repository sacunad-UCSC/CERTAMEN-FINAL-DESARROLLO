import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Users,
  Package,
  MessageSquare,
  Globe,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  Share2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  // Datos
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [socials, setSocials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Formulario nuevo producto
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Tarjetas Gráficas (GPU)',
    brand: '',
    price: '',
    originalPrice: '',
    stock: 10,
    imageUrl: '',
  });

  // Formulario nuevo usuario
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Administrador',
  });

  // Formulario nueva FAQ de Chatbot
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'Garantía & Devoluciones',
  });

  const loadAll = async () => {
    try {
      const prodRes = await api.getProducts();
      if (prodRes.success) setProducts(prodRes.products || []);

      const contRes = await api.getContacts(token);
      if (contRes.success) setContacts(contRes.contacts || []);

      const userRes = await api.getUsers(token);
      if (userRes.success) setUsers(userRes.users || []);

      const socRes = await api.getAllSocialLinksAdmin(token);
      if (socRes.success) setSocials(socRes.links || []);

      const ordRes = await api.getOrders(token);
      if (ordRes.success) setOrders(ordRes.orders || []);

      const faqRes = await api.getAllFaqsAdmin(token);
      if (faqRes.success) setFaqs(faqRes.faqs || []);
    } catch (e) {
      console.error('Error cargando datos del panel admin', e);
    }
  };

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createUser(newUser, token);
      if (res.success) {
        alert('Cuenta creada exitosamente con permisos de ' + newUser.role);
        setNewUser({ name: '', email: '', password: '', role: 'Administrador' });
        loadAll();
      } else {
        alert(res.message || 'Error al crear la cuenta');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createProduct(
        {
          ...newProd,
          price: Number(newProd.price),
          originalPrice: Number(newProd.originalPrice || newProd.price),
        },
        token
      );
      if (res.success) {
        alert('Producto creado exitosamente en inventario');
        setNewProd({
          name: '',
          category: 'Tarjetas Gráficas (GPU)',
          brand: '',
          price: '',
          originalPrice: '',
          stock: 10,
          imageUrl: '',
        });
        loadAll();
      }
    } catch (err) {
      alert('Error creando producto');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto del catálogo?')) {
      await api.deleteProduct(id, token);
      loadAll();
    }
  };

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    try {
      const res = await api.upsertFaq(newFaq, token);
      if (res.success) {
        alert('Respuesta del chatbot agregada exitosamente');
        setNewFaq({ question: '', answer: '', category: 'Garantía & Devoluciones' });
        loadAll();
      }
    } catch (e) {
      alert('Error agregando pregunta frecuente');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('¿Deseas eliminar esta respuesta del chatbot?')) {
      await api.deleteFaq(id, token);
      loadAll();
    }
  };

  const handleToggleSocial = async (item) => {
    try {
      await api.updateSocialLink(
        { platform: item.platform, url: item.url, isActive: !item.isActive },
        token
      );
      loadAll();
    } catch (e) {
      alert('Error actualizando red social');
    }
  };

  const handleUpdateSocialUrl = async (platform, newUrl, isActive) => {
    try {
      await api.updateSocialLink({ platform, url: newUrl, isActive }, token);
      alert('Enlace de ' + platform + ' actualizado.');
      loadAll();
    } catch (e) {
      alert('Error actualizando enlace');
    }
  };

  if (!user || user.role !== 'Administrador') {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444' }}>Acceso Denegado (403)</h2>
        <p>Debes contar con el rol de Administrador para ver este módulo.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)' }}>Panel Administrativo Central</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Gestión completa de hardware, usuarios, cotizaciones, respuestas del chatbot y redes sociales.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-scroll" style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'products' ? 'var(--primary)' : '#64748b',
            whiteSpace: 'nowrap',
          }}
        >
          <Package size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Productos ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'orders' ? 'var(--primary)' : '#64748b',
            whiteSpace: 'nowrap',
          }}
        >
          <Package size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Pedidos ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'contacts' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'contacts' ? 'var(--primary)' : '#64748b',
            whiteSpace: 'nowrap',
          }}
        >
          <MessageSquare size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Cotizaciones ({contacts.length})
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'faqs' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'faqs' ? 'var(--primary)' : '#64748b',
            whiteSpace: 'nowrap',
          }}
        >
          <HelpCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Chatbot FAQs ({faqs.length})
        </button>

        <button
          onClick={() => setActiveTab('socials')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'socials' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'socials' ? 'var(--primary)' : '#64748b',
            whiteSpace: 'nowrap',
          }}
        >
          <Share2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Redes Sociales ({socials.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'users' ? 'var(--primary)' : '#64748b',
            whiteSpace: 'nowrap',
          }}
        >
          <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Usuarios & Roles ({users.length})
        </button>
      </div>

      {/* Contenido de Productos */}
      {activeTab === 'products' && (
        <div className="admin-tab-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Formulario nuevo producto */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Agregar Componente</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Nombre del Componente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: RTX 4080 Super 16GB"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Categoría</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Tarjetas Gráficas (GPU)">Tarjetas Gráficas (GPU)</option>
                  <option value="Procesadores (CPU)">Procesadores (CPU)</option>
                  <option value="Placas Madre">Placas Madre</option>
                  <option value="Memorias RAM">Memorias RAM</option>
                  <option value="Almacenamiento (SSD/NVMe)">Almacenamiento (SSD/NVMe)</option>
                  <option value="Fuentes de Poder (PSU)">Fuentes de Poder (PSU)</option>
                  <option value="Gabinetes">Gabinetes</option>
                  <option value="Refrigeración">Refrigeración</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Marca</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ASUS, AMD, Intel, Corsair"
                  value={newProd.brand}
                  onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Precio Oferta ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="499990"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Precio Lista ($)</label>
                  <input
                    type="number"
                    placeholder="549990"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>URL de Imagen Web</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Guardar en MongoDB
              </button>
            </form>
          </div>

          {/* Listado de Productos */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Catálogo Activo ({products.length})</h3>
            <div className="admin-table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px' }}>Imagen</th>
                    <th style={{ padding: '10px' }}>Componente</th>
                    <th style={{ padding: '10px' }}>Categoría</th>
                    <th style={{ padding: '10px' }}>Precio</th>
                    <th style={{ padding: '10px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>
                        <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      </td>
                      <td style={{ padding: '10px', maxWidth: '240px' }}>
                        <strong>{p.name}</strong><br />
                        <small style={{ color: '#64748b' }}>{p.brand} | SKU: {p.sku}</small>
                      </td>
                      <td style={{ padding: '10px' }}>{p.category}</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: 'var(--navy)' }}>
                        ${p.price.toLocaleString('es-CL')}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Pedidos */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Registro de Pedidos y Despachos</h3>
          <div className="admin-table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px' }}>N° Pedido</th>
                  <th style={{ padding: '10px' }}>Cliente</th>
                  <th style={{ padding: '10px' }}>Dirección</th>
                  <th style={{ padding: '10px' }}>Estado Despacho</th>
                  <th style={{ padding: '10px' }}>Total</th>
                  <th style={{ padding: '10px' }}>Seguimiento</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}><strong>{o.orderNumber || o.numeroPedido}</strong></td>
                    <td style={{ padding: '10px' }}>
                      {o.customer ? o.customer.name : 'Cliente Anónimo'}<br />
                      <small style={{ color: '#64748b' }}>{o.customer ? o.customer.email : ''}</small>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {o.shippingAddress ? `${o.shippingAddress.address}, ${o.shippingAddress.city}` : 'Concepción'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                        {o.orderStatus || 'En Preparación'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700 }}>${(o.total || 0).toLocaleString('es-CL')}</td>
                    <td style={{ padding: '10px' }}>
                      <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {o.trackingNumber || 'CHX-654321'}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido de Cotizaciones */}
      {activeTab === 'contacts' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Bandeja de Cotizaciones y Contactos</h3>
          <div className="admin-table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px' }}>Cliente</th>
                  <th style={{ padding: '10px' }}>Asunto</th>
                  <th style={{ padding: '10px' }}>Mensaje</th>
                  <th style={{ padding: '10px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>
                      <strong>{c.name}</strong><br />
                      <small style={{ color: '#64748b' }}>{c.email}</small>
                    </td>
                    <td style={{ padding: '10px' }}>{c.subject}</td>
                    <td style={{ padding: '10px', maxWidth: '300px' }}>{c.message}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                        Registrado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido: Chatbot FAQs */}
      {activeTab === 'faqs' && (
        <div className="admin-tab-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Nueva Pregunta Frecuente</h3>
            <form onSubmit={handleCreateFaq} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Categoría</label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Garantía & Devoluciones">Garantía & Devoluciones</option>
                  <option value="Compatibilidad de Hardware">Compatibilidad de Hardware</option>
                  <option value="Despachos & Envíos">Despachos & Envíos</option>
                  <option value="Métodos de Pago">Métodos de Pago</option>
                  <option value="Soporte Técnico">Soporte Técnico</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Pregunta del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¿Qué fuente necesito para una RTX 4080?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Respuesta Automática del Bot</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Respuesta explicativa técnica..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Agregar Respuesta al Bot
              </button>
            </form>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
              Base de Conocimiento del Chatbot ({faqs.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((f) => (
                <div
                  key={f._id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                      {f.category}
                    </span>
                    <button
                      onClick={() => handleDeleteFaq(f._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Eliminar FAQ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <strong style={{ fontSize: '14px', color: 'var(--navy)', display: 'block', marginBottom: '6px' }}>
                    {f.question}
                  </strong>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido: Redes Sociales */}
      {activeTab === 'socials' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Gestión de Enlaces a Redes Sociales</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Modifica las URLs públicas que aparecen en el pie de página de NexoPC en tiempo real sin reiniciar el servidor.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {socials.map((s) => (
              <div
                key={s._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: '140px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--navy)' }}>{s.platform}</strong>
                  <div style={{ fontSize: '12px', color: s.isActive ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>
                    {s.isActive ? '● Visible en Footer' : '○ Oculto'}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '260px' }}>
                  <input
                    type="url"
                    defaultValue={s.url}
                    id={`url-${s.platform}`}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const inp = document.getElementById(`url-${s.platform}`);
                      handleUpdateSocialUrl(s.platform, inp.value, s.isActive);
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    Guardar URL
                  </button>
                  <button
                    onClick={() => handleToggleSocial(s)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {s.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Usuarios */}
      {activeTab === 'users' && (
        <div className="admin-tab-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Crear Cuenta de Usuario / Admin</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              Registra nuevos administradores o clientes con encriptación Argon2id.
            </p>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ignacio Valenzuela"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="admin2@pcnfactory.cl"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Contraseña Segura</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Rol Asignado</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Administrador">Administrador (Control total)</option>
                  <option value="Usuario registrado">Usuario registrado (Cliente estándar)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Crear Cuenta en MongoDB
              </button>
            </form>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Control de Acceso y Roles (RBAC)</h3>
            <div className="admin-table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px' }}>Nombre</th>
                    <th style={{ padding: '10px' }}>Email</th>
                    <th style={{ padding: '10px' }}>Rol Asignado</th>
                    <th style={{ padding: '10px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}><strong>{u.name}</strong></td>
                      <td style={{ padding: '10px' }}>{u.email}</td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            background: u.role === 'Administrador' ? '#fee2e2' : '#e0f2fe',
                            color: u.role === 'Administrador' ? '#b91c1c' : '#0369a1',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>Activo</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
