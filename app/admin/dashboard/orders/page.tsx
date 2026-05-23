'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, CheckCircle, Clock, Eye, X } from 'lucide-react';
import { motion } from 'framer-motion';

type OrderItem = {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  customer_name: string;
  total_price: number;
  status: string;
  items: OrderItem[];
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
      
    if (!error) {
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <div>
          <h1 className="text-2xl font-bold text-amber-950">Rekap Penjualan</h1>
          <p className="text-amber-700/70 mt-1">Pantau semua pesanan masuk dari pelanggan.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="p-6 border-b border-amber-100 flex justify-between items-center bg-amber-50/50">
          <h2 className="text-lg font-semibold text-amber-900">Daftar Pesanan</h2>
          <button 
            onClick={fetchOrders} 
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
                <th className="p-4 font-semibold w-16">ID</th>
                <th className="p-4 font-semibold">Pelanggan & Waktu</th>
                <th className="p-4 font-semibold">Pesanan</th>
                <th className="p-4 font-semibold w-32">Total Harga</th>
                <th className="p-4 font-semibold w-32">Status</th>
                <th className="p-4 font-semibold w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-amber-600">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw size={28} className="animate-spin text-amber-500" />
                      <p>Memuat data pesanan...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-amber-600/70">
                    Belum ada pesanan yang masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-amber-50 hover:bg-amber-50/30 transition">
                    <td className="p-4 text-amber-900/60 font-medium">#{order.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-amber-950 mb-1">{order.customer_name}</div>
                      <div className="text-xs text-amber-700/60 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.created_at).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-semibold transition"
                      >
                        <Eye size={16} />
                        Lihat {order.items?.length || 0} Item
                      </button>
                    </td>
                    <td className="p-4 font-semibold text-amber-900">
                      Rp {Number(String(order.total_price).replace(/[^0-9]/g, '')).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status === 'selesai' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {order.status === 'selesai' ? 'Selesai' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.status !== 'selesai' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'selesai')}
                          className="w-full py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition"
                        >
                          Selesaikan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-100"
          >
            <div className="flex justify-between items-center p-6 border-b border-amber-100 bg-amber-50/50">
              <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
                Pesanan #{selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-amber-900/50 hover:text-amber-900 transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6 space-y-1">
                <p className="text-sm text-amber-700/70">Nama Pelanggan:</p>
                <p className="font-bold text-lg text-amber-950">{selectedOrder.customer_name}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-amber-900 border-b border-amber-100 pb-2">Rincian Item</h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <h5 className="font-semibold text-gray-800">{item.name}</h5>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x Rp {Number(String(item.price).replace(/[^0-9]/g, '')).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="font-bold text-amber-700">
                      Rp {(Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-amber-100 bg-amber-50/30 flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700/70 mb-1">Total Tagihan</p>
                <p className="text-2xl font-black text-amber-700">Rp {Number(String(selectedOrder.total_price).replace(/[^0-9]/g, '')).toLocaleString('id-ID')}</p>
              </div>
              {selectedOrder.status !== 'selesai' && (
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'selesai')}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition"
                >
                  Selesaikan Pesanan
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
