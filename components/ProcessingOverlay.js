'use client';

export default function ProcessingOverlay({ onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-cream-200 flex items-center justify-center animate-fade-in">
      <p className="font-extrabold text-charcoal-900 text-lg">
        Processing<span className="animate-pulse-dot">...</span>
      </p>
      <button
        onClick={onCancel}
        className="fixed bottom-6 right-6 bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
