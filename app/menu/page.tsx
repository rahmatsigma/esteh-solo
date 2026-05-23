'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import Link from 'next/link';
import CartModal from '@/components/CartDrawer';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
};

type CartItem = Product & { quantity: number };

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
        
      if (!error && data) {
        setProducts(data);
      }
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity, 0);

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Keranjang belanja kosong!');
    if (!customerName.trim()) return alert('Mohon masukkan nama Anda!');
    
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async (finalName: string, paymentMethod: string): Promise<boolean> => {
    const items = cart.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: Number(String(item.price).replace(/[^0-9]/g, ''))
    }));

    const { error } = await supabase
      .from('orders')
      .insert([{
        customer_name: finalName,
        total_price: totalPrice,
        status: 'pending',
        items: items
      }]);

    if (error) {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
      console.error(error);
      return false;
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0a0603] text-[#f5ead8] pb-24">
      {/* Header */}
      <header className="bg-[#120c07] border-b border-amber-900/30 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#c8973a] hover:text-[#e8b86d] transition">
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Kembali</span>
          </Link>
          <h1 className="text-xl font-black">Menu Kami</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
        {/* Menu List */}
        <div className="flex-1">
          <h2 className="text-3xl font-black mb-8 text-[#c8973a]">Pilih Minumanmu</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-20 text-[#c8973a]">
              <div className="w-8 h-8 border-4 border-[#c8973a] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-[#f5ead8]/50">Belum ada menu yang tersedia saat ini.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#120c07] border border-amber-900/20 rounded-2xl overflow-hidden flex flex-col group">
                  <div className="h-48 relative bg-black/40">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-900/40">No Image</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-sm text-[#f5ead8]/60 mb-4 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-900/20">
                      <span className="font-bold text-[#c8973a]">Rp {Number(String(product.price).replace(/[^0-9]/g, '')).toLocaleString('id-ID')}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-amber-900/30 text-[#c8973a] hover:bg-[#c8973a] hover:text-black p-2 rounded-xl transition"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#120c07] border border-amber-900/30 rounded-3xl p-6 sticky top-24">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <ShoppingCart className="text-[#c8973a]" />
              Pesanan Anda
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10 text-[#f5ead8]/40 text-sm">
                Belum ada pesanan yang ditambahkan.
              </div>
            ) : (
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-amber-900/10">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                      <div className="text-[#c8973a] font-bold text-sm">Rp {(Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#0a0603] rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-[#f5ead8]/60 hover:text-white p-1"><Minus size={14} /></button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-[#f5ead8]/60 hover:text-white p-1"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500/70 hover:text-red-500 p-2">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleOpenConfirmation} className="space-y-4 pt-6 border-t border-amber-900/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#f5ead8]/70">Total Pembayaran</span>
                <span className="text-2xl font-black text-[#c8973a]">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              
              <div>
                <label className="block text-sm text-[#f5ead8]/70 mb-2">Nama Pemesan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan nama Anda..."
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-[#0a0603] border border-amber-900/40 rounded-xl px-4 py-3 text-[#f5ead8] focus:outline-none focus:border-[#c8973a] transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={cart.length === 0}
                className="w-full bg-[#c8973a] text-black font-bold py-3.5 rounded-xl mt-2 hover:bg-[#e8b86d] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>

      <CartModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cart={cart.map(c => ({...c, price: String(c.price)}))}
        updateQuantity={updateQuantity}
        totalPrice={totalPrice}
        clearCart={() => setCart([])}
        initialCustomerName={customerName}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
}
