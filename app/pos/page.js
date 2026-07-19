'use client';

import { useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import ChatWidget from '@/components/ChatWidget';

export default function PosPage() {
  const [cartItems, setCartItems] = useState([]);

  function handleAdd(product) {
    setCartItems((items) => {
      const existing = items.find((i) => i.id === product.id);
      if (existing) {
        return items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...items, { ...product, qty: 1 }];
    });
  }

  function handleRemove(id) {
    setCartItems((items) => items.filter((i) => i.id !== id));
  }

  function handleCheckout() {
    alert('Placeholder checkout — no payment processor connected yet.');
    setCartItems([]);
  }

  return (
    <main className="h-screen flex flex-col bg-ink-950">
      <header className="flex items-center justify-between px-6 py-3 border-b border-paper-50/10 shrink-0">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-50/40">
            Counter POS · Station 04
          </p>
          <h1 className="font-display font-bold text-lg text-paper-50">Sale in Progress</h1>
        </div>
        <div className="font-mono text-xs text-paper-50/50">Associate #1042</div>
      </header>

      <div className="flex-1 flex min-h-0 flex-col sm:flex-row">
        <ProductGrid onAdd={handleAdd} />
        <Cart items={cartItems} onRemove={handleRemove} onCheckout={handleCheckout} />
      </div>

      <ChatWidget />
    </main>
  );
}
