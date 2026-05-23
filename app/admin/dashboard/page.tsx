'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  created_ad?: string;
  created_at?: string;
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) {
      showToast(error.message, 'error');
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', image: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(String(formData.price).replace(/[^0-9]/g, '')),
      image: formData.image,
    };

    if (editingProduct) {
      // Update
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id);
        
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Produk berhasil diperbarui!', 'success');
        fetchProducts();
        handleCloseModal();
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('products')
        .insert([payload]);
        
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Produk berhasil ditambahkan!', 'success');
        fetchProducts();
        handleCloseModal();
      }
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Produk berhasil dihapus!', 'success');
        fetchProducts();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-white ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <div>
          <h1 className="text-2xl font-bold text-amber-950">Manajemen Produk</h1>
          <p className="text-amber-700/70 mt-1">Kelola daftar menu Es Teh Solo Anda di sini.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm hover:shadow"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="p-6 border-b border-amber-100 flex justify-between items-center bg-amber-50/50">
          <h2 className="text-lg font-semibold text-amber-900">Daftar Menu</h2>
          <button 
            onClick={fetchProducts} 
            disabled={isLoading}
            className="text-amber-600 hover:text-amber-800 transition disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/30 text-amber-900 border-b border-amber-100">
                <th className="p-4 font-semibold w-16">No</th>
                <th className="p-4 font-semibold w-24">Gambar</th>
                <th className="p-4 font-semibold">Detail Produk</th>
                <th className="p-4 font-semibold w-32">Harga</th>
                <th className="p-4 font-semibold w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-amber-600">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw size={28} className="animate-spin text-amber-500" />
                      <p>Memuat data produk...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-amber-600/70">
                    Belum ada produk. Silakan tambahkan produk baru.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id} className="border-b border-amber-50 hover:bg-amber-50/30 transition">
                    <td className="p-4 text-amber-900/60 font-medium">{index + 1}</td>
                    <td className="p-4">
                      {product.image ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-100 border border-amber-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-amber-100 text-amber-400 flex items-center justify-center border border-amber-200">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-amber-950 mb-1">{product.name}</div>
                      <div className="text-sm text-amber-700/80 line-clamp-2">{product.description}</div>
                    </td>
                    <td className="p-4 font-semibold text-amber-900">
                      Rp {Number(String(product.price).replace(/[^0-9]/g, '')).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-amber-100 bg-amber-50/50">
                <h3 className="text-xl font-bold text-amber-950">
                  {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-amber-500 hover:text-amber-700 hover:bg-amber-100 p-2 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white"
                    placeholder="Contoh: Es Teh Solo Original"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Deskripsi</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white resize-none"
                    placeholder="Penjelasan singkat mengenai produk..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">URL Gambar</label>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {formData.image && (
                  <div className="mt-2">
                    <p className="text-xs text-amber-700 mb-2">Preview Gambar:</p>
                    <div className="h-32 w-full rounded-xl overflow-hidden bg-amber-100 border border-amber-200 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> Menyimpan...
                      </>
                    ) : (
                      editingProduct ? 'Simpan Perubahan' : 'Tambahkan Produk'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
