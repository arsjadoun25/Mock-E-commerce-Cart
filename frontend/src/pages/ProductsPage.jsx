import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, addOrUpdateCart } from '../api';

export default function ProductsPage({ onCartChange }) {
  const [products, setProducts] = useState([]);

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const res = await getProducts();
      setProducts(res);
    } catch (e) { console.error(e); }
  }

  async function handleAdd(productId, qty) {
    try {
      await addOrUpdateCart(productId, qty);
      onCartChange();
      alert('Added to cart');
    } catch (e) {
      console.error(e);
      alert('Add failed');
    }
  }

  return (
    <div>
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => <ProductCard key={p.id} p={p} onAdd={handleAdd} />)}
      </div>
    </div>
  );
}