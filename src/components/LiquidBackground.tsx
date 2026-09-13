'use client';

import * as React from 'react';

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Dynamic Liquid Glow Orbs */}
      <div className="absolute -top-32 -left-20 w-96 h-96 md:w-[32rem] md:h-[32rem] rounded-full bg-gradient-to-tr from-rose-400/30 via-fuchsia-400/25 to-pink-300/20 dark:from-rose-600/20 dark:via-fuchsia-700/20 dark:to-pink-900/10 blur-[90px] animate-liquid-1 will-change-transform" />
      
      <div className="absolute top-1/4 -right-24 w-96 h-96 md:w-[36rem] md:h-[36rem] rounded-full bg-gradient-to-bl from-cyan-400/25 via-teal-300/20 to-sky-400/25 dark:from-cyan-600/20 dark:via-teal-700/15 dark:to-blue-900/20 blur-[100px] animate-liquid-2 will-change-transform" />
      
      <div className="absolute -bottom-28 left-1/3 w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-gradient-to-t from-violet-500/25 via-purple-400/20 to-indigo-300/20 dark:from-violet-800/20 dark:via-purple-900/20 dark:to-indigo-950/20 blur-[90px] animate-liquid-3 will-change-transform" />

      {/* Subtle organic light reflections */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)] opacity-70" />

      {/* Organic fluid wave sheen */}
      <svg
        className="absolute bottom-0 left-0 w-full h-48 opacity-15 dark:opacity-10 text-primary/40 preserve-3d"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,138.7C672,139,768,181,864,202.7C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}
