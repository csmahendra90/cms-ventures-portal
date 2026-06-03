// js/api.js — All API calls to the Express backend
const API = {
  async get(url) {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch(e) { console.error('API GET error:', e); return null; }
  },
  async post(url, body) {
    try {
      const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      return await res.json();
    } catch(e) { console.error('API POST error:', e); return null; }
  },
  async patch(url, body) {
    try {
      const res = await fetch(url, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      return await res.json();
    } catch(e) { console.error('API PATCH error:', e); return null; }
  },
  async del(url) {
    try {
      const res = await fetch(url, { method:'DELETE' });
      return await res.json();
    } catch(e) { console.error('API DELETE error:', e); return null; }
  }
};
