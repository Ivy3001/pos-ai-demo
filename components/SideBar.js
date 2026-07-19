'use client';

import { CATEGORIES } from '@/lib/mockProducts';

export default function Sidebar({ active, onSelect, onOpenChat }) {
  return (
    <aside className="w-[220px] shrink-0 bg-charcoal-800 flex flex-col px-4 pt-6 pb-4">
      <div className="mb-6 leading-none">
        <span className="text-2xl font-extrabold text-mint-500">POS</span>
        <span className="text-sm font-bold text-cream-50/90">DEMO</span>
        <span className="text-sm font-bold text-mint-500">v0.1</span>
      </div>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => onSelect('All products')}
          className={`arrow-btn text-left pl-4 pr-6 py-2.5 text-sm font-semibold transition-colors ${
            active === 'All products'
              ? 'bg-mint-500 text-charcoal-900'
              : 'bg-charcoal-900 text-cream-50/80 hover:bg-charcoal-700'
          }`}
        >
          All products
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`arrow-btn text-left pl-4 pr-6 py-2.5 text-sm font-semibold transition-colors ${
              active === cat
                ? 'bg-mint-500 text-charcoal-900'
                : 'bg-charcoal-900 text-cream-50/80 hover:bg-charcoal-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      <button onClick={onOpenChat} className="relative text-left group">
        <div
          className="bubble-tail relative bg-cream-50 text-charcoal-900 rounded-2xl px-4 py-3 shadow-lg group-hover:bg-cream-100 transition-colors"
          style={{ '--tw-bubble-color': '#FFFCF8' }}
        >
          <p className="font-bold text-sm leading-tight">Need help?</p>
          <p className="text-xs text-charcoal-900/60 mt-0.5">Click here to chat...</p>
        </div>
      </button>
    </aside>
  );
}
