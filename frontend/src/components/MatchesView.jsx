import React, { useState } from 'react';
import { Heart, MapPin, X, ShieldCheck } from 'lucide-react';

export default function MatchesView({ matches, loading, onStartSwiping }) {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (loading) {
    return (
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-slate-800/60 animate-pulse border border-slate-700/40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 select-none">
        <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/20">
          <Heart className="w-7 h-7 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">No Matches Yet</h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
          On Coy, matches only happen when both people like each other. Keep swiping — your likes remain 100% confidential!
        </p>
        <button
          onClick={onStartSwiping}
          className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all active:scale-95"
        >
          <span>Discover Profiles</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-950 select-none">
      {/* Matches Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-800/60">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Mutual Matches</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {matches.length}
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Connections where both of you swiped right
          </p>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3.5 pb-6">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
            >
              <img
                src={match.photo}
                alt={match.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-white truncate">
                    {match.name.split(' ')[0]}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {match.age}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">{match.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Match Detail Modal */}
      {selectedMatch && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-h-[85%] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Modal Header Image */}
            <div className="relative h-56 w-full bg-slate-800">
              <img
                src={selectedMatch.photo}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-slate-300 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedMatch.name}
                  </h3>
                  <span className="text-xl text-slate-300">
                    {selectedMatch.age}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{selectedMatch.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  About
                </h4>
                <p className="text-xs leading-relaxed text-slate-200">
                  {selectedMatch.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMatch.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Matched on {new Date(selectedMatch.matched_at).toLocaleDateString()} with full mutual privacy.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
