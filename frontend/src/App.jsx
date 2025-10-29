import React, { useEffect, useState } from 'react';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ReceiptsPage from './pages/ReceiptsPage';
import { getCart } from './api';

const THEME_KEY = 'vibe_theme';

export default function App() {
  const [view, setView] = useState('products');
  const [cartSummary, setCartSummary] = useState({ items: [], total: 0 });
  const [theme, setTheme] = useState(() => {
    // 1) try saved preference
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    // 2) respect system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const refreshCart = async () => {
    try {
      const c = await getCart();
      setCartSummary(c);
    } catch (e) {
      console.error('Cart load failed', e);
    }
  };

  useEffect(() => { refreshCart(); }, []);

  return (
    <div className="container">
      <header className="header" role="banner">
        <div className="logo">
          <div className="logo-badge">V</div>
          <div>
            <div className="header-title">Vibe Commerce — Mock Cart</div>
            <div className="header-sub">Simple cart flows · add/update/remove · mock checkout</div>
          </div>
        </div>

        <div className="header-controls" role="navigation" aria-label="Main navigation">
          <button className="btn secondary" onClick={() => setView('products')}>Products</button>
          <button className="btn" style={{marginLeft:8}} onClick={() => setView('cart')}>
            Cart <span className="badge" aria-live="polite" style={{marginLeft:8}}>{cartSummary.items.length}</span>
          </button>
          <button className="btn secondary" style={{marginLeft:8}} onClick={() => setView('receipts')}>Receipts</button>

          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            title="Toggle theme"
            onClick={toggleTheme}
            className="btn secondary"
            style={{marginLeft:12}}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main>
        {view === 'products' && <ProductsPage onCartChange={refreshCart} />}
        {view === 'cart' && <CartPage cart={cartSummary} onCartChange={refreshCart} />}
        {view === 'receipts' && <ReceiptsPage />}
      </main>
    </div>
  );
}