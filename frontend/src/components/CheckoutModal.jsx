import React, { useState, useEffect } from 'react';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CheckoutModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false });
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const valid = name.trim().length > 0 && isValidEmail(email);
    setCanSubmit(valid);
  }, [name, email]);

  async function submit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true });

    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim() });
    } finally {
      setSubmitting(false);
    }
  }

  const nameError = touched.name && name.trim().length === 0 ? 'Name is required' : '';
  const emailError = touched.email && !isValidEmail(email) ? 'Enter a valid email' : '';

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="panel">
        <h3>Checkout</h3>
        <form onSubmit={submit} noValidate>
          <div style={{ marginBottom: 8 }}>
            <label className="small">Name</label>
            <input
              style={{ width: '100%', padding: 8 }}
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
            />
            {nameError && <div style={{ color: 'red', fontSize: 12 }}>{nameError}</div>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="small">Email</label>
            <input
              type="email"
              style={{ width: '100%', padding: 8 }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
            />
            {emailError && <div style={{ color: 'red', fontSize: 12 }}>{emailError}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? <span className="spinner" /> : 'Place order'}
            </button>
            <button type="button" className="btn secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}