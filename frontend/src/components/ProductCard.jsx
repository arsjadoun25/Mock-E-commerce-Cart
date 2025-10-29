import React, { useState } from 'react';
import { useToast } from './Toast';

const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'>
    <rect fill='#e5e7eb' width='100%' height='100%' rx='6' />
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='Arial, Helvetica, sans-serif' font-size='24' fill='#6b7280'>No image</text>
  </svg>`;
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export default function ProductCard({ p, onAdd }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image || PLACEHOLDER);
  const toast = useToast();

  function handleImgError() {
    setImgSrc(PLACEHOLDER);
  }

  async function handleAdd() {
    setLoading(true);
    try {
      await onAdd(p.id, qty);
      toast(`${p.name} added to cart`, 'success');
    } catch (e) {
      console.error(e);
      toast('Failed to add to cart', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" aria-label={p.name}>
      <div className="img-wrap">
        <img
          alt={p.name}
          src={imgSrc}
          onError={handleImgError}
        />
      </div>

      <h3 style={{ marginTop: 10 }}>{p.name}</h3>

      <div className="row small">
        <div className="price-pill">${p.price.toFixed(2)}</div>
      </div>

      <div style={{ display: 'flex', marginTop: 8, gap: 8 }}>
        <input
          className="input-qty"
          type="number"
          min="1"
          value={qty}
          onChange={e => setQty(Number(e.target.value || 1))}
          aria-label={`Quantity for ${p.name}`}
        />
        <button className="btn" onClick={handleAdd} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}