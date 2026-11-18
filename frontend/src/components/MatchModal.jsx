import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MatchModal({ matchedProfile, onKeepSwiping, onViewMatches }) {
  const canvasRef = useRef(null);

  // Lightweight particle canvas confetti
  useEffect(() => {
    if (!matchedProfile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#38bdf8', '#fbbf24', '#34d399'];
    const particles = Array.from({ length: 65 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      r: Math.random() * 5 + 3,
      dx: (Math.random() - 0.5) * 14,
      dy: (Math.random() - 0.7) * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      dRotation: (Math.random() - 0.5) * 10,
    }));

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.alpha <= 0.02) continue;
        alive = true;
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.35; // gravity
        p.alpha *= 0.97;
        p.rotation += p.dRotation;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.5);
        ctx.restore();
      }
      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };
    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  const meAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 overflow-hidden select-none"
      >
        {/* Confetti canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Ambient glow */}
        <div className="absolute top-1/4 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center text-center mt-4 z-20"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Mutual Connection
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 font-serif tracking-tight">
            It&apos;s a Match!
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            You and <span className="text-white font-medium">{matchedProfile.name}</span> liked each other.
          </p>
        </motion.div>

        {/* Photos side by side */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 20 }}
          className="relative flex items-center justify-center my-auto z-20"
        >
          {/* User Photo */}
          <div className="relative w-28 h-40 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl rotate-[-8deg] translate-x-2">
            <img
              src={meAvatar}
              alt="You"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-semibold text-slate-200">
              You
            </div>
          </div>

          {/* Heart center */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ delay: 0.45 }}
            className="absolute z-30 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-600/50 border-2 border-slate-900"
          >
            <Heart className="w-6 h-6 text-white fill-white" />
          </motion.div>

          {/* Matched Profile Photo */}
          <div className="relative w-28 h-40 rounded-2xl overflow-hidden border-2 border-rose-500/80 shadow-2xl rotate-[8deg] -translate-x-2">
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-semibold text-slate-200">
              {matchedProfile.name.split(' ')[0]}
            </div>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 mb-4 text-center max-w-xs"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero-leak guarantee: Neither party was notified until mutual.</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="w-full flex flex-col gap-2.5 z-20"
        >
          <button
            onClick={onViewMatches}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Heart className="w-4 h-4" />
            <span>View Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onKeepSwiping}
            className="w-full py-2.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs transition-all active:scale-[0.98]"
          >
            Keep Swiping
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
