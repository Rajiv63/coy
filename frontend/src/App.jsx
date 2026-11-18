import React, { useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import HomeView from './components/HomeView.jsx';
import DiscoverView from './components/DiscoverView.jsx';

export default function App() {
  const [tab, setTab] = useState('discover');
  const [matchCount, setMatchCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="relative w-full max-w-sm h-screen sm:h-[812px] bg-slate-900 sm:rounded-3xl sm:shadow-2xl flex flex-col overflow-hidden border border-slate-800">
        <main className="flex-1 overflow-hidden relative">
          {tab === 'home' ? (
            <HomeView />
          ) : (
            <DiscoverView onMatchCountChange={setMatchCount} />
          )}
        </main>

        <BottomNav active={tab} onChange={setTab} matchCount={matchCount} />
      </div>
    </div>
  );
}
