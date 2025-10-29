import React, { useEffect, useState } from 'react';
import { getReceipts } from '../api';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await getReceipts();
      setReceipts(res);
    } catch (e) {
      console.error(e);
      alert('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Receipts</h2>
      {loading && <div className="card small"><span className="spinner" /> Loading...</div>}
      {receipts.length === 0 && !loading && <div className="card empty-state">No receipts yet</div>}
      {receipts.map(r => (
        <div key={r.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div><strong>Receipt #{r.id}</strong></div>
            <div className="small">{new Date(r.createdAt).toLocaleString()}</div>
          </div>
          <div className="small" style={{ marginTop:8 }}>
            Total: ${r.total.toFixed(2)}
          </div>
          <details style={{ marginTop:8 }}>
            <summary className="small">Items ({JSON.parse(r.items).length})</summary>
            <ul>
              {JSON.parse(r.items).map((it, i) => (
                <li key={i}>{it.name} — {it.qty} × ${it.price.toFixed(2)}</li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}