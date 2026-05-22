'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
  loadedCount: number;
  totalCount: number;
}

export default function Preloader({ onComplete, loadedCount, totalCount }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'loading' | 'reveal'>('loading');
  const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (loadedCount >= totalCount && totalCount > 0 && !hasCompleted.current) {
      hasCompleted.current = true;
      const t1 = setTimeout(() => setPhase('reveal'), 400);
      const t2 = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [loadedCount, totalCount, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#2e5c52' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,151,58,0.12) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo */}
          <motion.div
            className="relative z-10 text-center mb-16"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-4"
              style={{ color: '#e8b86d' }}
            >
              Est. 2026 · Solo, Java
            </p>
            <h1
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
              style={{ color: '#fff8f0' }}
            >
              Es Teh
            </h1>
            <h1
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
              style={{ color: '#e8b86d' }}
            >
              Solo.
            </h1>
          </motion.div>

          {/* Progress area */}
          <motion.div
            className="relative z-10 w-64 md:w-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Track */}
            <div
              className="w-full h-px relative overflow-hidden"
              style={{ background: 'rgba(200,151,58,0.2)' }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full"
                style={{ background: '#e8b86d', width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            <div
              className="flex justify-between mt-3 text-xs tracking-widest"
              style={{ color: 'rgba(232,184,109,0.7)' }}
            >
              <span>LOADING</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Reveal curtain */}
          <AnimatePresence>
            {phase === 'reveal' && (
              <motion.div
                key="curtain"
                className="absolute inset-0 z-20"
                style={{ background: '#2e5c52', transformOrigin: 'top' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
