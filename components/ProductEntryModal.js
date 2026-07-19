'use client';

import { useState } from 'react';

export default function ProductEntryModal({ product, onCancel, onConfirm }) {
  const isWeight = product.inputMode === 'weight';
  const [raw, setRaw] = useState('');

  const amount = parseFloat(raw || '0');
  const price = amount * product.pricePerUnit;

  function pressDigit(d) {
    if (d === '.' && (!isWeight || raw.includes('.'))) return;
    if (raw.length >= 6) return;
    setRaw((r) => r + d);
  }

  function backspace() {
    setRaw((r) => r.slice(0, -1));
  }

  function nudge(delta) {
    if (isWeight) return;
    const next = Math.max(0, (parseInt(raw || '0', 10) || 0) + delta);
    setRaw(String(next));
  }

  function handleEnter() {
    const qty = isWeight ? amount : parseInt(raw || '0', 10);
    if (!qty || qty <= 0) return;
    onConfirm({ qty, unitPrice: product.pricePerUnit });
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/70 flex items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-2xl bg-cream-50 text-charcoal-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-900/10">
          <div>
            <h2 className="text-xl font-extrabold uppercase tracking-tight">{product.name}</h2>
            <p className="text-xs text-charcoal-900/50 mt-0.5">({product.brand})</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{product.emoji}</span>
            <button
              onClick={onCancel}
              aria-label="Cancel"
              className="text-charcoal-900/40 hover:text-coral-600 text-2xl leading-none px-2"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex gap-4 p-5">
          <div className="bg-charcoal-800 rounded-xl p-4 flex-1">
            <div className="flex justify-between items-baseline mb-4 px-1">
              <span className="font-mono text-mint-400 text-lg font-bold">
                {isWeight ? `${raw || '0'} ${product.unit}` : raw || '0'}
              </span>
              <span className="font-mono text-mint-400 text-lg font-bold">
                ${price.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9'].map((d) => (
                <KeypadButton key={d} onClick={() => pressDigit(d)}>{d}</KeypadButton>
              ))}
              <KeypadButton onClick={backspace} variant="ghost" className="row-span-2">
                Back
              </KeypadButton>

              {['4', '5', '6'].map((d) => (
                <KeypadButton key={d} onClick={() => pressDigit(d)}>{d}</KeypadButton>
              ))}

              {['1', '2', '3'].map((d) => (
                <KeypadButton key={d} onClick={() => pressDigit(d)}>{d}</KeypadButton>
              ))}
              {isWeight ? (
                <KeypadButton onClick={() => pressDigit('.')} variant="ghost">.</KeypadButton>
              ) : (
                <KeypadButton onClick={() => nudge(1)} variant="ghost">+</KeypadButton>
              )}

              <KeypadButton onClick={() => pressDigit('0')} className="col-span-2">
                0
              </KeypadButton>
              {!isWeight && (
                <KeypadButton onClick={() => nudge(-1)} variant="ghost">−</KeypadButton>
              )}
              <KeypadButton
                onClick={handleEnter}
                variant="mint"
                className={isWeight ? 'col-span-2' : ''}
              >
                ENTER
              </KeypadButton>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-charcoal-900/30 font-bold text-xs px-1">
            OR
          </div>

          <div className="flex-1 bg-charcoal-700 rounded-xl flex items-center justify-center text-center px-4">
            <p className="text-cream-50/60 font-semibold text-sm">
              {isWeight ? 'Place item on scale...' : 'Scan item...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeypadButton({ children, onClick, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-charcoal-600 hover:bg-charcoal-700 text-cream-50 border border-mint-500/30',
    ghost: 'bg-charcoal-700 hover:bg-charcoal-600 text-mint-400 border border-mint-500/40',
    mint: 'bg-mint-500 hover:bg-mint-600 text-charcoal-900 border border-mint-500',
  };
  return (
    <button
      onClick={onClick}
      className={`${styles[variant]} rounded-md py-3 font-bold text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
