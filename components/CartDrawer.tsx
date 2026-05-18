'use client';

import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, QrCode, Banknote, Download, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: number, amount: number) => void;
  totalPrice: number;
  clearCart: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, totalPrice, clearCart }: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'qris' | 'success'>('cart');
  const [isDownloading, setIsDownloading] = useState(false);

  // MENGARAH KE GAMBAR QRIS LOKAL DI FOLDER PUBLIC
  // Pastikan nama file gambar kamu adalah qris.png dan ditaruh di folder "public"
  const qrisImageUrl = '/qris.png'; 

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCheckoutStep('cart');
      setCustomerName('');
      setPaymentMethod('cod');
    }, 300);
  };

  const handleProcessOrder = () => {
    if (!customerName.trim()) {
      alert("Tolong masukkan nama kamu dulu ya!");
      return;
    }

    if (paymentMethod === 'qris') {
      setCheckoutStep('qris');
    } else {
      setCheckoutStep('success');
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
    <div className="fixed inset-0 bg-black/50 z-50 transition-opacity flex justify-end">
      <div className="max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
            <ShoppingBag className="text-amber-800" /> Keranjang Belanja
          </h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* STEP 1: CART */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Keranjangmu masih kosong.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-sm text-amber-700 font-semibold">{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 text-slate-600">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 text-slate-600">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-dashed border-slate-300">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pemesan (Untuk dipanggil)</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Budi" 
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                      <div className="relative">
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium text-slate-700"
                        >
                          <option value="cod">Bayar di Tempat (Tunai)</option>
                          <option value="qris">Bayar Pakai QRIS</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
                          {paymentMethod === 'cod' ? <Banknote size={20} /> : <QrCode size={20} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-slate-50 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold text-slate-800">
                  <span>Total Tagihan:</span>
                  <span className="text-amber-800 text-xl">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={handleProcessOrder}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]"
                >
                  Proses Pesanan Sekarang
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: QRIS PENGGUNA */}
        {checkoutStep === 'qris' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <button onClick={() => setCheckoutStep('cart')} className="text-sm text-slate-500 mb-4 hover:text-amber-700 text-left">
              ← Kembali ke Keranjang
            </button>
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              <div>
                <h4 className="font-bold text-xl text-slate-800">Scan QRIS GoPay</h4>
                <p className="text-slate-500 text-sm">Total tagihan: <span className="font-bold text-amber-700">Rp {totalPrice.toLocaleString('id-ID')}</span></p>
                <p className="text-xs text-slate-400 mt-1">Pastikan nominal sesuai saat transfer</p>
              </div>
              
              <div className="p-4 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50">
                <img src={qrisImageUrl} alt="QRIS Merchant" className="w-48 h-48 rounded-lg shadow-sm object-cover" />
              </div>

              <button 
                onClick={handleDownloadQR}
                disabled={isDownloading}
                className="flex items-center gap-2 text-amber-700 font-semibold bg-amber-100 px-4 py-2 rounded-full hover:bg-amber-200 transition-colors text-sm"
              >
                <Download size={16} /> {isDownloading ? 'Mendownload...' : 'Simpan QR ke Galeri'}
              </button>
            </div>

            <div className="pt-6 mt-6 border-t">
              <button 
                onClick={() => setCheckoutStep('success')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-md transition-transform active:scale-[0.98]"
              >
                Saya Sudah Bayar
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {checkoutStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 size={64} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">Pesanan Diterima!</h3>
              <p className="text-slate-600">
                Terima kasih, <span className="font-bold text-amber-700">{customerName}</span>.<br/>
                Pesananmu sedang disiapkan. Mohon tunggu panggilan nama kamu ya!
              </p>
            </div>
            <div className="w-full pt-8">
              <button 
                onClick={finishOrder}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition-transform active:scale-[0.98]"
              >
                Tutup & Kembali
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}