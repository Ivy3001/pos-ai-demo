'use client';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex gap-3 px-6 pt-5 pb-4 shrink-0">
      <div className="flex-1 flex items-center gap-2 bg-cream-200/90 rounded-md px-4 py-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-charcoal-900/50 shrink-0">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="SEARCH BY PRODUCT NAME OR BRAND . . ."
          className="flex-1 bg-transparent outline-none text-xs font-mono uppercase tracking-wider text-charcoal-900/70 placeholder:text-charcoal-900/40"
        />
      </div>
      <button className="bg-mint-500 hover:bg-mint-600 text-charcoal-900 font-bold text-sm px-6 rounded-md transition-colors shrink-0">
        SEARCH
      </button>
    </div>
  );
}
