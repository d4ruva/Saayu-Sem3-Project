import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "/api";
console.info("[SmartChoice] API_BASE =", API_BASE);

async function withRetries(fn, attempts = 2, delayMs = 500) {
  let lastErr;
  for (let i = 0; i <= attempts; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      if (i < attempts) await new Promise(r => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem("sc_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, e => Promise.reject(e));

instance.interceptors.response.use(r => r, err => { console.error('[API] response error:', err && err.response ? err.response.status : err.message); return Promise.reject(err); });

export async function fetchMobiles(brand = "All", sort = null, order = "desc") {
  return withRetries(async () => {
    const params = {};
    if (brand && brand !== "All") params.brand = brand;
    if (sort) params.sort = sort;
    if (order) params.order = order;
    const r = await instance.get("/mobiles/", { params });
    return r.data || [];
  }, 1);
}

export async function fetchLive(q) {
  return withRetries(async () => {
    const r = await instance.get(`/live`, { params: { q } });
    return r.data || { image: null, price: "N/A", local_image: "/placeholder.png" };
  }, 2);
}

export async function fetchLiveBatch(queries = []) {
  if (!queries || queries.length === 0) return {};
  return withRetries(async () => {
    const r = await instance.post("/live_batch/", { queries }, { timeout: 30000 });
    return r.data || {};
  }, 2, 700);
}

export async function fetchPreferences(type) {
  return withRetries(async () => {
    const r = await instance.get("/preferences/", { params: { type } });
    return r.data || [];
  }, 1);
}

export async function fetchCompare(m1, m2) {
  if (!m1 || !m2) throw new Error("fetchCompare requires m1 and m2");
  const url = `/compare?m1=${encodeURIComponent(m1)}&m2=${encodeURIComponent(m2)}`;
  const r = await instance.get(url);
  return r.data;
}

export async function loginUser(username, password) { const r = await instance.post('/login/', { username, password }); return r.data; }
export async function getMe() { try { const r = await instance.get('/me/'); return r.data; } catch { return { user: null }; } }
export async function logoutUser() { try { const r = await instance.post('/logout/'); localStorage.removeItem('sc_token'); return r.data; } catch (e) { localStorage.removeItem('sc_token'); throw e; } }
export async function toggleLike(model) { const r = await instance.post('/toggle_like/', { model }); return r.data; }
export async function fetchFavorites() { const r = await instance.get('/favorites/'); return r.data || []; }

export default instance;
