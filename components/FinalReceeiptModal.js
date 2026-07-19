'use client';

export default function FinalReceiptModal({ items, onNo, onYes }) {
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/70 flex items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-cream-200 rounded-t-lg border border-charcoal-900/10 overflow-hidden">
          <div className="bg-cream-100 px-4 py-2 border-b border-charcoal-900/10">
            <h2 className="font-extrabold text-sm text-charcoal-900">Final Receipt</h2>
          </div>
          <div className="h-56 overflow-y-auto px-4 py-3 font-mono text-[11px] text-charcoal-900/80">
            {items.map((i) => (
              <div key={i.cartId} className="py-0.5">
                {i.name} - {i.brand} ({i.qty} {i.unit})
                <span className="mx-1">
                  {'.'.repeat(Math.max(4, 30 - i.name.length))}
                </span>
                ${i.price.toFixed(2)}
              </div>
            ))}
          </div>
          <div className="bg-cream-100 px-4 py-2 border-t border-charcoal-900/10 text-sm font-bold text-charcoal-900">
            Total: ${total.toFixed(2)}
          </div>
        </div>

        <div className="bg-charcoal-800 rounded-b-lg border-x border-b border-mint-500/30 px-6 py-5 text-center">
          <p className="font-bold text-cream-50 mb-3">Finalize Transaction?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onNo}
              className="bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-sm px-8 py-2.5 rounded-full transition-colors"
            >
              NO
            </button>
            <button
              onClick={onYes}
              className="bg-leaf-500 hover:bg-leaf-600 text-white font-extrabold text-sm px-8 py-2.5 rounded-full transition-colors"
            >
              YES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
