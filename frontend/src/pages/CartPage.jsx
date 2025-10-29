import React, { useState, useEffect } from 'react';
import { getCart, addOrUpdateCart, deleteCartItem, checkout } from '../api';
import CheckoutModal from '../components/CheckoutModal';
import { useToast } from '../components/Toast';

export default function CartPage({ cart, onCartChange }) {
  const [localCart, setLocalCart] = useState(cart);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => { setLocalCart(cart); }, [cart]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await getCart();
      setLocalCart(res);
      if (onCartChange) onCartChange();
    } catch (e) {
      console.error(e);
      toast('Failed to refresh cart', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(item, newQty) {
    setLoading(true);
    try {
      await addOrUpdateCart(item.productId, newQty);
      await refresh();
    } catch (e) {
      console.error(e);
      toast('Failed to update quantity', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function remove(item) {
    const ok = window.confirm(`Remove ${item.product.name} from cart?`);
    if (!ok) return;
    setLoading(true);
    try {
      await deleteCartItem(item.id);
      await refresh();
      toast('Item removed', 'info');
    } catch (e) {
      console.error(e);
      toast('Failed to remove item', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout(data) {
    setLoading(true);
    try {
      const payload = { name: data.name, email: data.email };
      const res = await checkout(payload);
      setReceipt(res.receipt);
      setShowCheckout(false);
      await refresh();
      toast('Order placed', 'success');
    } catch (e) {
      console.error(e);
      toast('Checkout failed', 'error');
      alert('Checkout failed: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div>
        <h2>Your Cart</h2>
        {loading && <div className="card small"><span className="spinner" /> Loading...</div>}
        {!loading && localCart.items.length === 0 && (
          <div className="card empty-state">
            <div style={{ fontSize: 28 }}>🛒</div>
            <div style={{ marginTop: 8 }}>Your cart is empty</div>
            <div className="small" style={{ marginTop: 6 }}>Add items from the products page to get started.</div>
          </div>
        )}
        {localCart.items.map(it => (
          <div key={it.id} className="card" style={{ marginBottom: 8 }}>
            <div className="row">
              <div>
                <strong>{it.product.name}</strong>
                <div className="small">${it.product.price.toFixed(2)} each</div>
              </div>
              <div className="qty-controls">
                <button className="btn secondary" onClick={() => updateQty(it, Math.max(0, it.qty - 1))} disabled={loading}>-</button>
                <input className="input-qty" value={it.qty} onChange={(e) => updateQty(it, Number(e.target.value || 0))} />
                <button className="btn secondary" onClick={() => updateQty(it, it.qty + 1)} disabled={loading}>+</button>
                <button className="btn" style={{marginLeft:8}} onClick={() => remove(it)} disabled={loading}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="cart-summary">
        <h3>Summary</h3>
        <div className="row small">
          <div>Subtotal</div>
          <div>${(localCart.total || 0).toFixed(2)}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setShowCheckout(true)} disabled={localCart.items.length === 0 || loading}>
            {loading ? <span className="spinner" /> : 'Checkout'}
          </button>
        </div>

        {receipt && (
          <div style={{ marginTop: 12 }}>
            <h4>Last receipt</h4>
            <div>ID: {receipt.id}</div>
            <div>Total: ${receipt.total.toFixed(2)}</div>
            <div className="small">At: {new Date(receipt.timestamp).toLocaleString()}</div>
          </div>
        )}
      </aside>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onSubmit={handleCheckout} />}
    </div>
  );
}