'use client';

import { useState, useRef, useEffect } from 'react';

const MOCK_REPLIES = [
  {
    match: /allerg|nut|dairy|gluten/i,
    reply:
      "I don't have live allergen data wired up yet — check the tag under the item in the catalog for now.",
  },
  {
    match: /cook|slow cook|roast|grill/i,
    reply: 'For roasts, low and slow (6-8 hrs) breaks down connective tissue nicely.',
  },
  {
    match: /how much|serve|people|feed/i,
    reply: 'Rule of thumb is about 0.5 lb of meat per person for a main.',
  },
];

function getMockReply(text) {
  const hit = MOCK_REPLIES.find((m) => m.match.test(text));
  return hit?.reply || "I'm not sure — try asking about a specific item like Ham or Milk.";
}

export default function ChatWidget({ open, onOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      });
      if (!res.ok) throw new Error('proxy error');
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', text: data.reply }]);
    } catch {
      await new Promise((r) => setTimeout(r, 300));
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: `${getMockReply(text)} (offline demo mode)` },
      ]);
    }
    setLoading(false);
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[340px] h-[380px] bg-charcoal-900 rounded-lg border-2 border-mint-500 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-charcoal-800 shrink-0">
        <button
          onClick={onClose}
          className="w-2.5 h-2.5 rounded-full bg-coral-500 hover:bg-coral-600"
          aria-label="Close chat"
        />
        <span className="w-2.5 h-2.5 rounded-full bg-charcoal-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-charcoal-600" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-cream-50/50 font-medium">How can I help?</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-snug ${
                  m.role === 'user'
                    ? 'ml-auto bg-mint-500 text-charcoal-900'
                    : 'bg-charcoal-700 text-cream-50'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-charcoal-700 text-cream-50/50 px-3 py-2 rounded-lg text-sm w-fit">
                thinking…
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex items-center gap-2 px-3 py-3 bg-charcoal-800 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-charcoal-700 rounded-md px-3 py-2 text-sm text-cream-50 placeholder:text-cream-50/30 outline-none focus:ring-1 focus:ring-mint-500"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Send"
          className="w-8 h-8 rounded-full bg-mint-500 hover:bg-mint-600 disabled:opacity-40 flex items-center justify-center shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#242424" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
