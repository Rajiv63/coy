import React from 'react';
import { Home } from 'lucide-react';

export default function HomeView() {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 select-none">
      <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
        <Home className="w-7 h-7 text-slate-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-300 tracking-wide mb-1">
        Home
      </h2>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
        This is a placeholder tab. Switch to <span className="text-rose-400 font-medium">Discover</span> to browse profiles and explore mutual matches.
      </p>
    </div>
  );
}
