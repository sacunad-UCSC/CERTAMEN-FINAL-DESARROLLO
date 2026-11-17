// Detección automática y dinámica de la URL base de la API
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.port === '5173') {
      return 'http://localhost:5000/api';
    }
    return '/api';
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    let data = {};
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }

    if (!res.ok) {
      return {
        success: false,
        message: data.message || data.detail || `Error del servidor (${res.status})`,
      };
    }

    if (data.success === undefined) {
      data.success = true;
    }
    return data;
  } catch (err) {
    console.error(`[Error de Conexión en ${url}]:`, err.message);
    return {
      success: false,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión de red.',
    };
  }
};

export const api = {
  // Autenticación
  login: async (email, password) => {
    return await safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    return await safeFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe: async (token) => {
    return await safeFetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(token),
    });
  },

  // MFA Google Authenticator
  mfaSetup: async (challengeToken) => {
    return await safeFetch(`${API_BASE_URL}/auth/mfa/setup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ challengeToken }),
    });
  },

  mfaConfirm: async (challengeToken, code) => {
    return await safeFetch(`${API_BASE_URL}/auth/mfa/confirm`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ challengeToken, code }),
    });
  },

  mfaVerify: async (challengeToken, code) => {
    return await safeFetch(`${API_BASE_URL}/auth/mfa/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ challengeToken, code }),
    });
  },

  changePassword: async (data, token) => {
    return await safeFetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  // Productos
  getProducts: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return await safeFetch(`${API_BASE_URL}/products?${query}`);
  },

  createProduct: async (productData, token) => {
    return await safeFetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id, token) => {
    return await safeFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  },

  // Formulario de Contacto
  sendContact: async (data) => {
    return await safeFetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  getContacts: async (token) => {
    return await safeFetch(`${API_BASE_URL}/contact`, {
      headers: getHeaders(token),
    });
  },

  // Chatbot
  getFaqs: async () => {
    return await safeFetch(`${API_BASE_URL}/chatbot/faqs`);
  },

  getAllFaqsAdmin: async (token) => {
    return await safeFetch(`${API_BASE_URL}/admin/faqs`, {
      headers: getHeaders(token),
    });
  },

  upsertFaq: async (data, token) => {
    return await safeFetch(`${API_BASE_URL}/admin/faqs`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  deleteFaq: async (id, token) => {
    return await safeFetch(`${API_BASE_URL}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  },

  askBot: async (query) => {
    return await safeFetch(`${API_BASE_URL}/chatbot/ask`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query }),
    });
  },

  // Redes Sociales y Admin
  getSocialLinks: async () => {
    return await safeFetch(`${API_BASE_URL}/social-links/public`);
  },

  getAllSocialLinksAdmin: async (token) => {
    return await safeFetch(`${API_BASE_URL}/admin/social-links`, {
      headers: getHeaders(token),
    });
  },

  updateSocialLink: async (data, token) => {
    return await safeFetch(`${API_BASE_URL}/admin/social-links`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  getUsers: async (token) => {
    return await safeFetch(`${API_BASE_URL}/admin/users`, {
      headers: getHeaders(token),
    });
  },

  createUser: async (userData, token) => {
    return await safeFetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(userData),
    });
  },

  // Órdenes de Compra
  createOrder: async (orderData, token) => {
    return await safeFetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData),
    });
  },

  getOrders: async (token) => {
    return await safeFetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(token),
    });
  },

  getMyOrders: async (token) => {
    return await safeFetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getHeaders(token),
    });
  },
};
