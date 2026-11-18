import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X, RotateCcw, RefreshCw, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import ProfileCard from './ProfileCard.jsx';

export default function SwipeDeck({
  initialProfiles,
  loading,
  error,
  onMatch,
  onRefresh,
  onViewMatches,
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [isResetting, setIsResetting] = useState(false);
  const [swipingOut, setSwipingOut] = useState(null);
  const isProcessingSwipe = useRef(false);

  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const handleSwipe = useCallback(
    async (direction) => {
      if (profiles.length === 0 || isProcessingSwipe.current) return;

      const currentProfile = profiles[0];
      isProcessingSwipe.current = true;

      // 1. Animate card out immediately
      setSwipingOut({ id: currentProfile.id, direction });

      // 2. Remove profile from stack (optimistic UI)
      setTimeout(() => {
        setProfiles((prev) => prev.slice(1));
        setSwipingOut(null);
        isProcessingSwipe.current = false;
      }, 250);

      // 3. Dispatch POST /api/swipe in background
      try {
        const response = await fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetId: currentProfile.id,
            direction,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to record swipe');
        }

        const data = await response.json();

        // 4. Trigger match modal if mutual match
        if (data.matched && data.profile) {
          onMatch(data.profile);
        }
      } catch (err) {
        console.error('Background swipe error:', err);
      }
    },
    [profiles, onMatch]
  );

  // Keyboard navigation: ArrowLeft = Pass, ArrowRight = Like
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('like');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('pass');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  // Handle Demo Reset
  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error('Failed to reset:', e);
    } finally {
      setIsResetting(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 select-none">
        <div className="relative w-full max-w-sm flex-1 min-h-0 max-h-[480px] rounded-2xl bg-slate-800/40 border border-slate-700/50 animate-pulse flex flex-col justify-end p-6">
          <div className="h-7 w-48 bg-slate-700/60 rounded-md mb-2" />
          <div className="h-4 w-32 bg-slate-700/40 rounded-md mb-4" />
          <div className="h-3 w-full bg-slate-700/30 rounded-md mb-1.5" />
          <div className="h-3 w-3/4 bg-slate-700/30 rounded-md mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-slate-700/50 rounded-full" />
            <div className="h-6 w-20 bg-slate-700/50 rounded-full" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 animate-pulse">
          Loading privacy-protected profiles...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Couldn&apos;t load feed</h3>
        <p className="text-xs text-slate-400 mb-6 max-w-xs">{error}</p>
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // 3. Empty State (All caught up)
  if (profiles.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/30 select-none">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-slate-700/60 flex items-center justify-center text-rose-400 mb-5 shadow-inner">
          <Heart className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          You&apos;re All Caught Up!
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-8">
          You have swiped through all available profiles in your area. Check back soon for new arrivals, or review your mutual matches.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onViewMatches}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>View Mutual Matches</span>
          </button>

          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            className="w-full py-2.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting Database...' : 'Reset Demo Database'}</span>
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[0];
  const nextProfile = profiles.length > 1 ? profiles[1] : null;

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col p-4 overflow-hidden relative select-none">
      {/* Card Stack Container */}
      <div className="relative flex-1 min-h-0 w-full max-w-sm mx-auto">
        {/* Next Card behind */}
        {nextProfile && (
          <ProfileCard
            key={nextProfile.id}
            profile={nextProfile}
            isFront={false}
            onSwipe={() => {}}
          />
        )}

        {/* Current Top Card */}
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              className="absolute inset-0"
              animate={
                swipingOut?.id === currentProfile.id
                  ? {
                      x: swipingOut.direction === 'like' ? 450 : -450,
                      rotate: swipingOut.direction === 'like' ? 25 : -25,
                      opacity: 0,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    }
                  : { x: 0, rotate: 0, opacity: 1 }
              }
            >
              <ProfileCard
                profile={currentProfile}
                isFront={true}
                onSwipe={handleSwipe}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls & Keyboard Hints */}
      <div className="w-full max-w-xs mx-auto py-2 flex flex-col items-center gap-2 z-20">
        <div className="flex items-center justify-center gap-8">
          {/* Pass Button */}
          <button
            onClick={() => handleSwipe('pass')}
            disabled={!currentProfile || isProcessingSwipe.current}
            className="w-13 h-13 rounded-full bg-slate-900 border border-slate-800 text-rose-500 hover:bg-rose-950/40 hover:border-rose-500/50 flex items-center justify-center shadow-lg active:scale-90 transition-all p-3"
            aria-label="Pass profile (Left Arrow)"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleSwipe('like')}
            disabled={!currentProfile || isProcessingSwipe.current}
            className="w-13 h-13 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-400/50 flex items-center justify-center shadow-lg active:scale-90 transition-all p-3"
            aria-label="Like profile (Right Arrow)"
          >
            <Heart className="w-6 h-6 fill-emerald-400" />
          </button>
        </div>

        {/* Desktop Keyboard Helper */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              <ArrowLeft className="w-2.5 h-2.5 inline" />
            </kbd>
            <span>Pass</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              <ArrowRight className="w-2.5 h-2.5 inline" />
            </kbd>
            <span>Like</span>
          </span>
        </div>
      </div>
    </div>
  );
}
