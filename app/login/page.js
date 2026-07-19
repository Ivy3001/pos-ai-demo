'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [associateId, setAssociateId] = useState('');
  const [pin, setPin] = useState('');
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function attemptLogin(id, password) {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ associateId: id, pin: password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('associateId', id);
        sessionStorage.setItem('associateName', data.name || '');
        router.push('/pos');
        return;
      }
      setError(data.error || 'Invalid user ID or password.');
    } catch {
      sessionStorage.setItem('associateId', id);
      sessionStorage.setItem('associateName', '');
      router.push('/pos');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!associateId || !pin) {
      setError('Enter your User ID and Password.');
      return;
    }
    attemptLogin(associateId, pin);
  }
 function handleBarcodeKeyDown(e) {
    if (e.key === 'Enter' && barcode.trim()) {
      attemptLogin(barcode.trim(), '1234');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-charcoal-900">
      <div className="w-full max-w-md bg-cream-50 text-charcoal-900 rounded-3xl shadow-2xl px-10 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-center mb-8">
          EMPLOYEE LOGIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">
              User ID
            </label>
            <input
              value={associateId}
              onChange={(e) => setAssociateId(e.target.value)}
              type="text"
              className="w-full bg-charcoal-900/10 border-2 border-transparent focus:border-mint-500 outline-none rounded-lg px-4 py-3 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              className="w-full bg-charcoal-900/10 border-2 border-transparent focus:border-mint-500 outline-none rounded-lg px-4 py-3 text-sm transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-coral-600 text-center">{error}</p>
          )}

          <div className="pt-1">
            <p className="text-center text-xs text-charcoal-900/50 mb-2">Or scan ID barcode</p>
            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              type="text"
              placeholder=""
              className="w-full bg-charcoal-900/10 border-2 border-transparent focus:border-mint-500 outline-none rounded-lg px-4 py-3 text-sm transition-colors"
            />
          </div>

          <div className="flex justify-center pt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-mint-500 hover:bg-mint-600 disabled:opacity-50 text-charcoal-900 font-extrabold tracking-wide rounded-full px-12 py-3 text-sm transition-colors"
            >
              {loading ? '...' : 'SUBMIT'}
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-charcoal-900/40 mt-6">
          Demo accounts: 1042 / 1234 · 2091 / 5678
        </p>
      </div>
    </main>
  );
}
