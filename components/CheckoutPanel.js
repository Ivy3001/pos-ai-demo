'use client';

export default function CheckoutPanel({ items, onRemove, onProceed }) {
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <aside className="w-[320px] shrink-0 bg-cream-200 text-charcoal-900 flex flex-col">
      <div className="px-5 py-4 border-b border-charcoal-900/10 shrink-0">
        <h2 className="font-extrabold text-lg">Checkout</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 font-mono text-xs">
        {items.length === 0 && (
          <p className="text-charcoal-900/40 text-center py-8">No items yet.</p>
        )}
        {items.map((i) => (
          <div key={i.cartId} className="flex justify-between items-start py-1.5 gap-2 group">
            <span className="flex-1">
              {i.name} ({i.qty} {i.unit})
              <span className="mx-1">.....</span>
            </span>
            <span className="shrink-0">${i.price.toFixed(2)}</span>
            <button
              onClick={() => onRemove(i.cartId)}
              className="shrink-0 text-charcoal-900/30 hover:text-coral-600 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${i.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-charcoal-900/15 shrink-0 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-charcoal-900/50">Total:</p>
          <p className="text-lg font-extrabold">${total.toFixed(2)}</p>
        </div>
        <button
          onClick={onProceed}
          disabled={items.length === 0}
          aria-label="Proceed to checkout"
          className="w-11 h-11 rounded-full bg-leaf-500 hover:bg-leaf-600 disabled:bg-charcoal-900/15 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
