// src/services/api.js

// ============================================
// API Configuration - Relative URLs for CRA Proxy
// ============================================

const getToken = () => localStorage.getItem('access_token');

// Unified request helper with better error handling
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, options);   // endpoint already includes /api/...

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.detail || data.message || `HTTP Error ${response.status}`);
    }

    return { success: true, data };
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    return { 
      success: false, 
      error: err.message 
    };
  }
};

// Auth headers for protected routes
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken() || ''}`,
});

// ============================================
// PUBLIC APIs (No authentication required)
// ============================================
export const authAPI = {
  register: (userData) =>
    request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  me: () =>
    request('/api/auth/me', {
      headers: authHeaders(),
    }),
};

export const hsnAPI = {
  classify: (productDescription, country = 'IN') =>
    request('/api/hsn/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        product_description: productDescription, 
        country 
      }),
    }),
};

export const dutyAPI = {
  calculate: (data) =>
    request('/api/duty/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

export const riskAPI = {
  assess: (clientId) =>
    request(`/api/risk/assess/${clientId}`),
};

// ============================================
// PROTECTED APIs (Require valid token)
// ============================================
export const shipmentAPI = {
  create: (data) =>
    request('/api/shipments/create', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  track: (trackingId) =>
    request(`/api/shipments/track/${trackingId}`),

  list: () =>
    request('/api/shipments/list', {
      headers: authHeaders(),
    }),
};

export const analyticsAPI = {
  dashboard: () =>
    request('/api/analytics/dashboard', {
      headers: authHeaders(),
    }),
};

export const documentAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/documents/upload', {   // ← relative path
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken() || ''}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed');
      }

      return { success: true, data };
    } catch (err) {
      console.error('Document upload error:', err);
      return { success: false, error: err.message };
    }
  },
};

// ============================================
// Legacy compatibility layer (for old imports)
// ============================================
export const api = {
  register: authAPI.register,
  login: authAPI.login,
  classifyHSN: (desc, country = 'IN') => hsnAPI.classify(desc, country),
  calculateDuty: dutyAPI.calculate,
  getRisk: riskAPI.assess,
  getDashboard: analyticsAPI.dashboard,
};

export default api;