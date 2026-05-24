'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,234,216,0.5) 100%)',
              }}
            >
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              >
                <div
                  className="p-4 rounded-full"
                  style={{ background: 'rgba(200,151,58,0.1)' }}
                >
                  <LogOut size={32} style={{ color: '#c8973a' }} />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-amber-900 mb-2">Keluar?</h3>
                <p className="text-amber-700 text-sm">
                  Apakah Anda yakin ingin keluar dari akun Anda?
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-amber-200 text-amber-900 font-semibold hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tidak
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      </motion.div>
                      Proses...
                    </>
                  ) : (
                    <>
                      <LogOut size={18} />
                      Iya
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
