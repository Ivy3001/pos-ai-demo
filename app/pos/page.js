'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import ProductGrid from '@/components/ProductGrid';
import CheckoutPanel from '@/components/CheckoutPanel';
import ProductEntryModal from '@/components/ProductEntryModal';
import FinalReceiptModal from '@/components/FinalReceiptModal';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import ChatWidget from '@/components/ChatWidget';

let cartIdCounter = 0;

export default function PosPage() {
  const [associate, setAssociate] = useState({ id: '', name: '' });
  const [activeCategory, setActiveCategory] = useState('All products');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = sessionStorage.getItem('associateId');
    if (!id) {
      router.replace('/login');
      return;
    }
    setAssociate({ id, name: sessionStorage.getItem('associateName') || '' });
  }, [router]);

  function handleAddToCart({ qty, unitPrice }) {
    const p = selectedProduct;
    cartIdCounter += 1;
    setCartItems((items) => [
      ...items,
      {
        cartId: cartIdCounter,
        id: p.id,
        name: p.name,
        brand: p.brand,
        unit: p.unit,
        qty,
        price: qty * unitPrice,
      },
    ]);
    setSelectedProduct(null);
  }

  function handleRemove(cartId) {
    setCartItems((items) => items.filter((i) => i.cartId !== cartId));
  }

  async function handleConfirmCheckout() {
    setShowReceipt(false);
    setProcessing(true);

    const payload = {
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.qty > 0 ? i.price / i.qty : i.price,
        qty: i.qty,
        unit: i.unit,
      })),
      associateId: associate.id,
    };

    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
    }

    setTimeout(() => {
      setProcessing(false);
      setCartItems([]);
    }, 1200);
  }

  return (
    <main className="h-screen flex bg-charcoal-900 overflow-hidden">
      <Sidebar
        active={activeCategory}
        onSelect={setActiveCategory}
        onOpenChat={() => setChatOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <ProductGrid
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          onSelect={setSelectedProduct}
        />
      </div>

      <CheckoutPanel
        items={cartItems}
        onRemove={handleRemove}
        onProceed={() => setShowReceipt(true)}
      />

      {selectedProduct && (
        <ProductEntryModal
          product={selectedProduct}
          onCancel={() => setSelectedProduct(null)}
          onConfirm={handleAddToCart}
        />
      )}

      {showReceipt && (
        <FinalReceiptModal
          items={cartItems}
          onNo={() => setShowReceipt(false)}
          onYes={handleConfirmCheckout}
        />
      )}

      {processing && <ProcessingOverlay onCancel={() => setProcessing(false)} />}

      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </main>
  );
}
