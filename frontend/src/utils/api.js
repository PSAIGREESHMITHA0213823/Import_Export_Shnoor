
const BASE = "http://localhost:8001";

const getToken = () => localStorage.getItem("tl_token");

const headers = (auth = true) => {
  const h = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) h["Authorization"] = `Bearer ${t}`;
  }
  return h;
};

async function req(method, path, body, auth = true) {
  const opts = { method, headers: headers(auth) };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

async function upload(path, formData) {
  const h = {};
  const t = getToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  const res = await fetch(`${BASE}${path}`, { method: "POST", headers: h, body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data;
}

export const api = {
  // Auth
  login:          (b)             => req("POST", "/api/auth/login",    b, false),
  register:       (b)             => req("POST", "/api/auth/register", b, false),
  me:             ()              => req("GET",  "/api/auth/me"),

  // Users
  listUsers:      ()              => req("GET",  "/api/users/list"),

  // HSN
  classifyHSN:    (b)             => req("POST", "/api/hsn/classify", b),
  hsnHistory:     (limit = 10, offset = 0) => req("GET", `/api/hsn/history?limit=${limit}&offset=${offset}`),

  // Duty
  calculateDuty:  (b)             => req("POST", "/api/duty/calculate", b),
  dutyHistory:    (limit = 10, offset = 0) => req("GET", `/api/duty/history?limit=${limit}&offset=${offset}`),

  // Payments
  paymentHistory: (clientId = null, limit = 20, offset = 0) => {
    let url = `/api/payment/history?limit=${limit}&offset=${offset}`;
    if (clientId) url += `&client_id=${clientId}`;
    return req("GET", url);
  },
  addPayment:     (b)             => req("POST", "/api/payment/add", b),

  // Risk
  assessRisk:     (id)            => req("GET",  `/api/risk/assess/${id}`),
  riskHistory:    (limit = 20, offset = 0) => req("GET", `/api/risk/history?limit=${limit}&offset=${offset}`),

  // Shipments
  createShipment:     (b)         => req("POST", "/api/shipments/create", b),
  trackShipment:      (id)        => req("GET",  `/api/shipments/track/${id}`),
  listShipments:      ()          => req("GET",  "/api/shipments/list"),
  shipmentHistory:    (limit = 10, offset = 0) => req("GET", `/api/shipments/history?limit=${limit}&offset=${offset}`),
  updateShipmentStatus: (id, status) => req("PUT", `/api/shipments/${id}/status`, { status }),
  deleteShipment:     (id)        => req("DELETE", `/api/shipments/${id}`),

  // Analytics
  dashboard:          ()          => req("GET",  "/api/analytics/dashboard"),
  analyticsHistory:   (months = 6) => req("GET",  `/api/analytics/history?months=${months}`),

  // Documents
  uploadDoc:          (fd)        => upload("/api/documents/upload", fd),
  listDocuments:      (limit = 20, offset = 0) => req("GET", `/api/documents/list?limit=${limit}&offset=${offset}`),
  getDocument:        (id)        => req("GET",  `/api/documents/${id}`),
  deleteDocument:     (id)        => req("DELETE", `/api/documents/${id}`),
};

export const setToken  = (t) => localStorage.setItem("tl_token", t);
export const clearAuth = ()  => { localStorage.removeItem("tl_token"); localStorage.removeItem("tl_user"); };
export const saveUser  = (u) => localStorage.setItem("tl_user", JSON.stringify(u));
export const getUser   = ()  => JSON.parse(localStorage.getItem("tl_user") || "{}");