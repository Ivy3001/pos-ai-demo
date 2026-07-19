'use client';

export default function Cart({ items, onRemove, onCheckout }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = total * 0.0875;

  return (
    <div className="w-full sm:w-[340px] shrink-0 flex flex-col bg-paper-100 text-ink-950">
      <div className="ticket-edge text-paper-100 shrink-0" />

      <div className="px-5 pt-4 pb-2 shrink-0">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-800/50">
          Order Ticket
        </p>
        <h2 className="font-display font-bold text-lg">Current Sale</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 divide-y divide-ink-950/10 min-h-0">
        {items.length === 0 && (
          <p className="font-mono text-xs text-ink-800/40 py-6 text-center">
            No items yet — tap a product to add it.
          </p>
        )}
        {items.map((i) => (
          <div key={i.id} className="py-3 flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-medium">{i.name}</p>
              <p className="font-mono text-xs text-ink-800/50">
                {i.qty} {i.unit} × ${i.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-sm">${(i.price * i.qty).toFixed(2)}</span>
              <button
                onClick={() => onRemove(i.id)}
                aria-label={`Remove ${i.name}`}
                className="text-ink-800/40 hover:text-oxblood-600 font-mono text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pt-3 pb-5 border-t border-dashed border-ink-950/20 shrink-0">
        <div className="flex justify-between font-mono text-xs text-ink-800/60 mb-1">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-mono text-xs text-ink-800/60 mb-3">
          <span>Tax (8.75%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-display font-bold text-xl mb-4">
          <span>Total</span>
          <span>${(total + tax).toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full bg-oxblood-600 hover:bg-oxblood-700 disabled:bg-ink-950/15 disabled:text-ink-950/30 text-paper-50 font-display font-bold tracking-wide py-3.5 transition-colors"
        >
          Charge Customer
        </button>
      </div>
    </div>
  );
}
