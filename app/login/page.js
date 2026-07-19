'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [associateId, setAssociateId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    // TODO(backend): replace with a real auth call, e.g.
    // POST /api/auth/login { associateId, pin } -> session/JWT
    if (!associateId || pin.length < 4) {
      setError('Enter your associate ID and a 4-digit PIN.');
      return;
    }
    setError('');
    router.push('/pos');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="grain-overlay" />

      <div className="w-full max-w-sm relative">
        <div className="ticket-edge text-ink-950" />
        <div className="bg-paper-100 text-ink-950 px-8 pt-8 pb-10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-ink-800/60 uppercase">
                Station 04
              </p>
              <h1 className="font-display text-2xl font-bold mt-1">Clock In</h1>
            </div>
            <div className="stamp-badge w-14 h-14 flex items-center justify-center text-oxblood-600 font-display text-[10px] font-bold text-center leading-tight shrink-0">
              COUNTER<br />POS
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="associateId"
                className="block font-mono text-xs uppercase tracking-wider text-ink-800/70 mb-1.5"
              >
                Associate ID
              </label>
              <input
                id="associateId"
                value={associateId}
                onChange={(e) => setAssociateId(e.target.value)}
                type="text"
                inputMode="numeric"
                placeholder="e.g. 1042"
                className="w-full bg-paper-50 border-2 border-ink-950/15 focus:border-oxblood-600 outline-none rounded-none px-4 py-3 font-mono text-lg tracking-wide transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block font-mono text-xs uppercase tracking-wider text-ink-800/70 mb-1.5"
              >
                PIN
              </label>
              <input
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                type="password"
                inputMode="numeric"
                placeholder="••••"
                className="w-full bg-paper-50 border-2 border-ink-950/15 focus:border-oxblood-600 outline-none rounded-none px-4 py-3 font-mono text-lg tracking-[0.5em] transition-colors"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-oxblood-600 border-l-2 border-oxblood-600 pl-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-oxblood-600 hover:bg-oxblood-700 active:translate-y-px text-paper-50 font-display font-bold tracking-wide py-3.5 transition-colors"
            >
              Start Shift
            </button>
          </form>
        </div>
        <p className="text-center font-mono text-[11px] text-paper-100/40 mt-4">
          Forgot your PIN? Flag a manager.
        </p>
      </div>
    </main>
  );
}
