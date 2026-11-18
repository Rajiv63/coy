import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Shield, Info } from 'lucide-react';
import SwipeDeck from './SwipeDeck.jsx';
import MatchesView from './MatchesView.jsx';
import MatchModal from './MatchModal.jsx';
import { API_BASE } from '../api.js';

export default function DiscoverView({ onMatchCountChange }) {
  const [subView, setSubView] = useState('swipe');
  const [feedProfiles, setFeedProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [feedError, setFeedError] = useState(null);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  // Fetch Feed
  const fetchFeed = useCallback(async () => {
    setLoadingFeed(true);
    setFeedError(null);
    try {
      const res = await fetch(`${API_BASE}/api/feed`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load feed (${res.status})`);
      }
      const data = await res.json();
      setFeedProfiles(data.profiles || []);
    } catch (err) {
      console.error('Fetch feed error:', err);
      setFeedError(err.message || 'Failed to fetch profiles');
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  // Fetch Matches
  const fetchMatches = useCallback(async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch(`${API_BASE}/api/matches`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load matches (${res.status})`);
      }
      const data = await res.json();
      const loadedMatches = data.matches || [];
      setMatches(loadedMatches);
      if (onMatchCountChange) {
        onMatchCountChange(loadedMatches.length);
      }
    } catch (err) {
      console.error('Fetch matches error:', err);
    } finally {
      setLoadingMatches(false);
    }
  }, [onMatchCountChange]);

  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  const handleMatch = (profile) => {
    setMatchedProfile(profile);
    fetchMatches();
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-950 relative select-none">
      {/* Top Header */}
      <header className="px-5 pt-3.5 pb-2.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md z-20">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-md shadow-rose-600/30">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white">COY</h1>
            <p className="text-[9px] uppercase tracking-widest text-rose-400 font-semibold leading-none">
              Privacy First
            </p>
          </div>
        </div>

        {/* Sub-view Segmented Control */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setSubView('swipe')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              subView === 'swipe'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Swipe
          </button>
          <button
            onClick={() => {
              setSubView('matches');
              fetchMatches();
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              subView === 'matches'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Matches</span>
            {matches.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  subView === 'matches'
                    ? 'bg-white text-rose-600'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {matches.length}
              </span>
            )}
          </button>
        </div>

        {/* Privacy Info Icon */}
        <button
          onClick={() => setShowPrivacyNotice((prev) => !prev)}
          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          title="Privacy Information"
          aria-label="Privacy guarantee"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
        </button>
      </header>

      {/* Floating Privacy Notice Banner */}
      {showPrivacyNotice && (
        <div className="mx-4 mt-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-xl flex items-start gap-2.5 z-30 animate-in fade-in duration-150">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-white mb-0.5">
              Coy&apos;s Zero-Leak Privacy Guarantee
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your likes are stored privately on encrypted servers. No user can ever see, filter, or be notified that you liked them unless the feeling is 100% mutual.
            </p>
          </div>
          <button
            onClick={() => setShowPrivacyNotice(false)}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {subView === 'swipe' ? (
          <SwipeDeck
            initialProfiles={feedProfiles}
            loading={loadingFeed}
            error={feedError}
            onMatch={handleMatch}
            onRefresh={fetchFeed}
            onViewMatches={() => {
              setSubView('matches');
              fetchMatches();
            }}
          />
        ) : (
          <MatchesView
            matches={matches}
            loading={loadingMatches}
            onStartSwiping={() => setSubView('swipe')}
            onRefresh={fetchMatches}
          />
        )}
      </div>

      {/* "It's a Match!" Celebration Modal */}
      <MatchModal
        matchedProfile={matchedProfile}
        onKeepSwiping={() => setMatchedProfile(null)}
        onViewMatches={() => {
          setMatchedProfile(null);
          setSubView('matches');
          fetchMatches();
        }}
      />
    </div>
  );
}
