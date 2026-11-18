import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Info, Heart, X } from 'lucide-react';

export default function ProfileCard({ profile, isFront, onSwipe }) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [imgError, setImgError] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -120], [0, 1]);

  const photoUrl = imgError
    ? `https://i.pravatar.cc/600?u=${profile.id}`
    : profile.photo;

  const handleDragEnd = (_event, info) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 10 : 5,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isFront ? handleDragEnd : undefined}
      animate={
        isFront
          ? { scale: 1, y: 0, opacity: 1 }
          : { scale: 0.94, y: 12, opacity: 0.85 }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl select-none flex flex-col ${
        isFront ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* Profile Image with subtle gradient */}
      <div className="relative flex-1 w-full bg-slate-800 overflow-hidden">
        <img
          src={photoUrl}
          alt={profile.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 ease-out"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

        {/* LIKE Stamp (green, fades in dragging right) */}
        {isFront && (
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 border-4 border-emerald-400 bg-emerald-950/60 backdrop-blur-sm text-emerald-400 font-extrabold text-2xl uppercase tracking-wider px-4 py-1.5 rounded-xl rotate-[-15deg] pointer-events-none flex items-center gap-1.5 shadow-lg"
          >
            <Heart className="w-6 h-6 fill-emerald-400" />
            <span>LIKE</span>
          </motion.div>
        )}

        {/* NOPE Stamp (rose, fades in dragging left) */}
        {isFront && (
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-6 border-4 border-rose-500 bg-rose-950/60 backdrop-blur-sm text-rose-500 font-extrabold text-2xl uppercase tracking-wider px-4 py-1.5 rounded-xl rotate-[15deg] pointer-events-none flex items-center gap-1.5 shadow-lg"
          >
            <X className="w-6 h-6 stroke-[3]" />
            <span>NOPE</span>
          </motion.div>
        )}
      </div>

      {/* Details Box */}
      <div className="p-4 bg-gradient-to-b from-slate-950/95 to-slate-950 flex flex-col gap-2 z-10 border-t border-slate-800/50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="text-lg font-medium text-slate-300">
                {profile.age}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{profile.location}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBio((prev) => !prev);
            }}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors pointer-events-auto"
            aria-label="Toggle full bio"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Bio */}
        <p
          className={`text-xs leading-relaxed text-slate-300 transition-all ${
            showFullBio ? 'line-clamp-none' : 'line-clamp-2'
          }`}
        >
          {profile.bio}
        </p>

        {/* Interest Chips */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[10px] font-medium px-2.5 py-0.5 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
