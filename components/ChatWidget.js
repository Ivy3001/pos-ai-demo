'use client';

import { useState, useRef, useEffect } from 'react';


const MOCK_REPLIES = [
  {
    match: /allerg|nut|dairy|gluten/i,
    reply:
      "I don't have live allergen data wired up yet — for now, check the tag under the item in the catalog. Once the backend's connected I'll pull this straight from the product database.",
  },
  {
    match: /cook|slow cook|roast|grill/i,
    reply:
      'A chuck roast is great for slow cooking — low and slow, 6-8 hrs, breaks down the connective tissue. (This is a placeholder answer — real responses will come from the AI model once it\'s connected.)',
  },
  {
    match: /how much|serve|people|feed/i,
    reply:
      "Rule of thumb is about 0.5 lb per person for a main cut. I'll give more precise, catalog-aware answers once the AI backend is hooked up.",
  },
];

function getMockReply(text) {
  const hit = MOCK_REPLIES.find((m) => m.match.test(text));
  return (
    hit?.reply ||
    "That's a placeholder response — I'm just the UI shell right now. Once the AI backend is connected, I'll answer this using the real model."
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm the counter assistant. Ask me anything a customer might ask — cuts, allergens, portions.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

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

      if (!res.ok) throw new Error('proxy returned an error');

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

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-slide-up w-[320px] sm:w-[360px] h-[440px] bg-ink-900 border border-paper-50/15 shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-paper-50/10 shrink-0">
            <div className="stamp-badge w-9 h-9 flex items-center justify-center text-sage-500 text-[8px] font-display font-bold shrink-0">
              ASK
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-paper-50">Counter Assistant</p>
              <p className="font-mono text-[10px] text-paper-50/40">
                {loading ? 'thinking…' : 'placeholder mode — not yet connected'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-paper-50/40 hover:text-paper-50 font-mono text-lg leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 text-sm leading-snug ${
                  m.role === 'user'
                    ? 'ml-auto bg-oxblood-600 text-paper-50'
                    : 'bg-paper-50 text-ink-950'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-paper-50/10 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a customer question…"
              className="flex-1 bg-ink-950 border border-paper-50/15 focus:border-oxblood-500 outline-none px-3 py-2 text-sm text-paper-50 font-body"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-oxblood-600 hover:bg-oxblood-700 disabled:opacity-40 text-paper-50 px-4 text-sm font-display font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="stamp-badge w-16 h-16 bg-ink-900 flex items-center justify-center text-sage-500 text-[10px] font-display font-bold shadow-xl hover:bg-ink-800 transition-colors"
      >
        {open ? 'CLOSE' : 'ASK AI'}
      </button>
    </div>
  );
}
