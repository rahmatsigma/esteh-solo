'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess?: () => void;
  prefilledEmail?: string;
  successMessage?: string;
}

export default function LoginForm({ onSwitchToRegister, onLoginSuccess, prefilledEmail = '', successMessage = '' }: LoginFormProps) {
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(successMessage);

  useEffect(() => {
    setSuccess(successMessage);
    if (successMessage) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || 'Email atau password salah');
        return;
      }

      if (data.user) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <div className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Masuk</h1>
          <p className="text-amber-700">Nikmati pengalaman Es Teh Solo yang istimewa</p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            variants={itemVariants}
            className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm"
          >
            {success}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <motion.div variants={itemVariants} className="relative">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@example.com"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-500 transition"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants} className="relative">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-500 transition"
              />
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              variants={itemVariants}
              className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Masuk
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        {/* Switch to Register */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-amber-700">
            Belum punya akun?{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-semibold text-amber-600 hover:text-amber-700 transition underline"
            >
              Daftar sekarang
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
