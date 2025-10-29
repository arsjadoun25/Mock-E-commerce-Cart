const BASE = '';

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const getProducts = () => api('/api/products');
export const getCart = () => api('/api/cart');
export const addOrUpdateCart = (productId, qty) =>
  api('/api/cart', { method: 'POST', body: JSON.stringify({ productId, qty }) });
export const deleteCartItem = (id) =>
  api(`/api/cart/${id}`, { method: 'DELETE' });
export const checkout = (payload) =>
  api('/api/checkout', { method: 'POST', body: JSON.stringify(payload) });
export const getReceipts = () => api('/api/receipts');