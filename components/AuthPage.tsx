'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { CupSoda } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

type AuthMode = 'login' | 'register';

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSwitchToLogin = (email?: string) => {
    setMode('login');
    if (email) {
      setRegisteredEmail(email);
      setSuccessMessage('Registrasi berhasil! Silakan login dengan email Anda.');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

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
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm
                  onSwitchToRegister={() => setMode('register')}
                  onLoginSuccess={onAuthSuccess}
                  prefilledEmail={registeredEmail}
                  successMessage={successMessage}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterForm
                  onSwitchToLogin={handleSwitchToLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-amber-600 text-xs mt-8"
        >
          Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami
        </motion.p>
      </div>
    </div>
  );
}
