'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CupSoda } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-amber-50 overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 3],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.5,
              times: [0, 0.4, 1],
            }}
            className="absolute w-32 h-8 bg-amber-300/60 rounded-[100%] blur-sm"
          />
          <motion.div
            className="relative flex items-center gap-3 z-10"
            initial={{ y: -500 }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 12,
              mass: 1,
            }}
            exit={{ scale: 6, opacity: 0, transition: { duration: 0.8 } }}
          >
            <motion.div
              exit={{ x: -150, y: -100, rotate: -45, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <CupSoda size={56} className="text-amber-800" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-extrabold tracking-wider text-amber-900"
              exit={{ x: 150, y: 100, rotate: 45, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              Es-Teh S.O.L.O
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}