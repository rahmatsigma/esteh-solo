'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, QrCode, Banknote, Download, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: number;
  name: string;
  price: string | number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: number, amount: number) => void;
  totalPrice: number;
  clearCart: () => void;
  initialCustomerName?: string;
  onConfirmOrder: (customerName: string, paymentMethod: string) => Promise<boolean>;
}

export default function CartModal({ isOpen, onClose, cart, updateQuantity, totalPrice, clearCart, initialCustomerName = '', onConfirmOrder }: CartModalProps) {
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'qris' | 'success'>('cart');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomerName(initialCustomerName);
    }
  }, [isOpen, initialCustomerName]);

  const qrisImageUrl = '/qris.png'; 

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCheckoutStep('cart');
      setPaymentMethod('cod');
    }, 300);
  };

  const handleProcessOrder = async () => {
    if (!customerName.trim()) {
      alert("Tolong masukkan nama Anda dulu ya!");
      return;
    }

    setIsSubmitting(true);
    const success = await onConfirmOrder(customerName, paymentMethod);
    setIsSubmitting(false);

    if (success) {
      if (paymentMethod === 'qris') {
        setCheckoutStep('qris');
      } else {
        setCheckoutStep('success');
      }
    }
  };

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrisImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRIS-EsTehSolo-${customerName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Gagal mendownload QR. Silakan screenshot layar ini.");
    } finally {
      setIsDownloading(false);
    }
  };

  const finishOrder = () => {
    clearCart();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-w-lg w-full max-h-[90vh] bg-[#120c07] border border-amber-900/30 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden text-[#f5ead8]"
      >
        <div className="flex justify-between items-center p-6 border-b border-amber-900/30 bg-[#0a0603]/50">
          <h3 className="text-xl font-black text-[#c8973a] flex items-center gap-2">
            <ShoppingBag /> Konfirmasi Pesanan
          </h3>
          <button onClick={handleClose} className="text-[#f5ead8]/50 hover:text-[#f5ead8] transition">
            <X size={24} />
          </button>
        </div>

        {/* STEP 1: CART */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-[#f5ead8]/40">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Keranjangmu masih kosong.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-[#0a0603] p-4 rounded-2xl border border-amber-900/20">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-[#c8973a] font-semibold">Rp {(Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-[#120c07] border border-amber-900/30 rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-[#f5ead8]/60 hover:text-[#f5ead8] p-1 transition">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-[#f5ead8]/60 hover:text-[#f5ead8] p-1 transition">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5 pt-6 border-t border-amber-900/30">
                    <div>
                      <label className="block text-sm font-semibold text-[#f5ead8]/70 mb-2">Nama Pemesan</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Masukkan nama Anda..." 
                        className="w-full bg-[#0a0603] border border-amber-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c8973a] transition-all text-[#f5ead8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#f5ead8]/70 mb-2">Metode Pembayaran</label>
                      <div className="relative">
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-[#0a0603] border border-amber-900/40 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-[#c8973a] transition-all font-medium text-[#f5ead8]"
                        >
                          <option value="cod">Bayar di Tempat (Tunai)</option>
                          <option value="qris">Bayar Pakai QRIS</option>
                        </select>
                        <div className="absolute right-4 top-3.5 pointer-events-none text-[#c8973a]">
                          {paymentMethod === 'cod' ? <Banknote size={20} /> : <QrCode size={20} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-amber-900/30 bg-[#0a0603]/80 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#f5ead8]/70 font-medium">Total Tagihan:</span>
                  <span className="text-[#c8973a] text-2xl font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={handleProcessOrder}
                  disabled={isSubmitting}
                  className="w-full bg-[#c8973a] hover:bg-[#e8b86d] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: QRIS PENGGUNA */}
        {checkoutStep === 'qris' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <button onClick={() => setCheckoutStep('cart')} className="text-sm text-[#f5ead8]/50 mb-6 hover:text-[#c8973a] text-left transition">
              ← Kembali ke Detail
            </button>
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              <div>
                <h4 className="font-bold text-2xl text-[#f5ead8] mb-1">Scan QRIS GoPay</h4>
                <p className="text-[#f5ead8]/60 text-sm mb-2">Total tagihan: <span className="font-black text-[#c8973a] text-lg">Rp {totalPrice.toLocaleString('id-ID')}</span></p>
                <div className="bg-amber-900/20 text-[#c8973a] text-xs px-3 py-1.5 rounded-full inline-block">Pastikan nominal sesuai saat transfer</div>
              </div>
              
              <div className="p-4 border-2 border-dashed border-[#c8973a]/50 rounded-3xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrisImageUrl} alt="QRIS Merchant" className="w-56 h-56 rounded-xl shadow-sm object-cover" />
              </div>

              <button 
                onClick={handleDownloadQR}
                disabled={isDownloading}
                className="flex items-center gap-2 text-[#0a0603] font-bold bg-[#c8973a] px-5 py-2.5 rounded-full hover:bg-[#e8b86d] transition-colors text-sm"
              >
                <Download size={16} /> {isDownloading ? 'Mendownload...' : 'Simpan QR ke Galeri'}
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-amber-900/30">
              <button 
                onClick={() => setCheckoutStep('success')}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-md transition-transform active:scale-[0.98]"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {checkoutStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="bg-green-500/20 p-5 rounded-full"
            >
              <CheckCircle2 size={72} className="text-green-500" />
            </motion.div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-[#f5ead8]">Pesanan Diterima!</h3>
              <p className="text-[#f5ead8]/70 leading-relaxed">
                Terima kasih, <span className="font-bold text-[#c8973a]">{customerName}</span>.<br/>
                Pesananmu sedang disiapkan. Mohon tunggu panggilan nama kamu ya!
              </p>
            </div>
            <div className="w-full pt-8">
              <button 
                onClick={finishOrder}
                className="w-full bg-[#120c07] border border-[#c8973a] hover:bg-[#c8973a] hover:text-[#0a0603] text-[#c8973a] font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                Tutup & Kembali
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}