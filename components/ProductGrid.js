'use client';

import { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '@/lib/mockProducts';

export default function ProductGrid({ onAdd }) {
  const [active, setActive] = useState('Fresh Cuts');
  const items = PRODUCTS.filter((p) => p.category === active);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex gap-1 px-6 pt-5 shrink-0 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 whitespace-nowrap transition-colors border-b-2 ${
              active === cat
                ? 'border-oxblood-500 text-paper-50'
                : 'border-transparent text-paper-50/40 hover:text-paper-50/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((p) => (
            <button
              key={p.id}
              onClick={() => onAdd(p)}
              className="group relative text-left bg-ink-900 hover:bg-ink-800 border border-paper-50/10 hover:border-oxblood-500/50 px-4 py-4 transition-colors"
            >
              {p.tag && (
                <span className="absolute top-2 right-2 text-[10px] font-mono uppercase tracking-wider text-sage-500">
                  {p.tag}
                </span>
              )}
              <p className="font-display font-medium text-sm text-paper-50 leading-snug pr-8">
                {p.name}
              </p>
              {p.allergens.length > 0 && (
                <p className="text-[10px] font-mono uppercase tracking-wide text-mustard-500 mt-1">
                  Contains: {p.allergens.join(', ')}
                </p>
              )}
              <p className="font-mono text-sm text-steel-300 mt-3">
                ${p.price.toFixed(2)}{' '}
                <span className="text-steel-400/60">/ {p.unit}</span>
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
