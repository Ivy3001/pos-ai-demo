'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import ChatWidget from '@/components/ChatWidget';

export default function PosPage() {
  const [cartItems, setCartItems] = useState([]);
  const [associate, setAssociate] = useState({ id: '', name: '' });
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const id = sessionStorage.getItem('associateId');
    if (!id) {
      router.replace('/login');
      return;
    }
    setAssociate({
      id,
      name: sessionStorage.getItem('associateName') || '',
    });
  }, [router]);

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

  async function handleCheckout() {
    const payload = {
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        unit: i.unit,
      })),
      associateId: associate.id,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setCheckoutStatus(`Order ${data.orderId} recorded — $${data.total.toFixed(2)}`);
      } else {
        setCheckoutStatus('Checkout failed — try again.');
      }
    } catch {
      setCheckoutStatus('Checkout service unreachable (offline demo mode).');
    }

    setCartItems([]);
    setTimeout(() => setCheckoutStatus(null), 4000);
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
        <div className="font-mono text-xs text-paper-50/50 text-right">
          <div>Associate #{associate.id}</div>
          {checkoutStatus && (
            <div className="text-sage-500 mt-0.5">{checkoutStatus}</div>
          )}
        </div>
      </header>

      <div className="flex-1 flex min-h-0 flex-col sm:flex-row">
        <ProductGrid onAdd={handleAdd} />
        <Cart items={cartItems} onRemove={handleRemove} onCheckout={handleCheckout} />
      </div>

      <ChatWidget />
    </main>
  );
}
