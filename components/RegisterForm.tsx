'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RegisterFormProps {
  onSwitchToLogin: (email?: string) => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message || 'Gagal mendaftar. Silakan coba lagi.');
        return;
      }

      if (data.user) {
        // Switch to login form with registered email
        onSwitchToLogin(email);
      }
    } catch (err) {
      setError('Gagal mendaftar. Silakan coba lagi.');
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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Daftar</h1>
          <p className="text-amber-700">Bergabunglah dengan komunitas Es Teh Solo kami</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <motion.div variants={itemVariants} className="relative">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Anda"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-500 transition"
              />
            </div>
          </motion.div>

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

          {/* Confirm Password Input */}
          <motion.div variants={itemVariants} className="relative">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Daftar
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        {/* Switch to Login */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-amber-700">
            Sudah punya akun?{' '}
            <button
              onClick={() => onSwitchToLogin()}
              className="font-semibold text-amber-600 hover:text-amber-700 transition underline"
            >
              Masuk di sini
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
