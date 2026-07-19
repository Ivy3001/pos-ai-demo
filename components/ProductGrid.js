'use client';

import { PRODUCTS } from '@/lib/mockProducts';

export default function ProductGrid({ activeCategory, searchTerm, onSelect }) {
  const term = searchTerm.trim().toLowerCase();
  const items = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === 'All products' || p.category === activeCategory;
    const matchesSearch =
      !term || p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="text-left bg-cream-50 text-charcoal-900 rounded-xl p-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <p className="font-extrabold text-sm leading-tight">{p.name}</p>
            <p className="text-sm font-semibold text-charcoal-900/70 mt-1">
              ${p.pricePerUnit.toFixed(2)}
            </p>
            <div className="mt-2 aspect-square w-full max-w-[110px] rounded-lg bg-charcoal-900/10 flex items-center justify-center text-3xl">
              {p.emoji}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal-900/40 mt-2">
              {p.inputMode === 'weight' ? 'Weighed' : 'Weighed/Quantity'}
            </p>
          </button>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-cream-50/40 text-sm font-mono py-8 text-center">
            No products match your search.
          </p>
        )}
      </div>
    </div>
  );
}
