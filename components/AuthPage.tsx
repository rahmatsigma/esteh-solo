'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import { CupSoda } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CupSoda size={32} className="text-amber-700" />
            <h2 className="text-2xl font-bold text-amber-900">Es Teh Solo</h2>
          </div>
          <p className="text-amber-600 text-sm">Authentic Javanese Iced Tea</p>
        </motion.div>

        {/* Auth Form Container */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LoginForm onLoginSuccess={onAuthSuccess} />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-amber-600 text-xs mt-8"
        >
          Admin Portal - Es Teh Solo
        </motion.p>
      </div>
    </div>
  );
}