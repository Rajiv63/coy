import React from 'react';
import { Home, Compass } from 'lucide-react';

export default function BottomNav({ active, onChange, matchCount = 0 }) {
  return (
    <nav className="w-full shrink-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-6 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] flex items-center justify-around z-30 select-none">
      {/* Home tab (completely blank placeholder) */}
      <button
        onClick={() => onChange('home')}
        className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 ${
          active === 'home'
            ? 'text-rose-500 scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Home"
      >
        <Home className="w-6 h-6" />
        <span className="text-[11px] font-medium mt-1">Home</span>
      </button>

      {/* Discover tab (all functionality) */}
      <button
        onClick={() => onChange('discover')}
        className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-200 ${
          active === 'discover'
            ? 'text-rose-500 scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Discover"
      >
        <Compass className="w-6 h-6" />
        <span className="text-[11px] font-medium mt-1">Discover</span>
        {matchCount > 0 && (
          <span className="absolute top-0 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        )}
      </button>
    </nav>
  );
}
