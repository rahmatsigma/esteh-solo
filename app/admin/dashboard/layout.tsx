'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingBag, CupSoda, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Jika belum login, kembalikan ke halaman login (/admin)
        router.replace('/admin');
      } else {
        setIsLoading(false);
      }
    };
    
    checkSession();

    // Dengarkan perubahan status autentikasi (misal jika user logout dari tab lain)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Dashboard Admin */}
      <aside className="w-64 bg-white border-r border-amber-100 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-amber-100 flex items-center gap-3 text-amber-900 font-black text-2xl">
          <CupSoda className="text-amber-600" size={28} />
          <span>Es<span className="text-amber-600">Teh</span></span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-amber-900 transition font-medium">
            <Package size={20} className="text-amber-600" />
            Produk
          </Link>
          <Link href="/admin/dashboard/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-amber-900 transition font-medium">
            <ShoppingBag size={20} className="text-amber-600" />
            Pesanan
          </Link>
        </nav>
        <div className="p-4 border-t border-amber-100">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition font-medium"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white shadow-sm border-b border-amber-100 p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xl">
            <CupSoda className="text-amber-700" />
            <span>Admin</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut size={20} />
          </button>
        </header>
        
        {/* Mobile Navigation (Bottom Bar or simple links) - we will keep it simple */}
        <div className="md:hidden bg-white border-b border-amber-100 flex overflow-x-auto">
          <Link href="/admin/dashboard" className="flex-1 py-3 text-center text-amber-900 font-medium hover:bg-amber-50 border-r border-amber-100">Produk</Link>
          <Link href="/admin/dashboard/orders" className="flex-1 py-3 text-center text-amber-900 font-medium hover:bg-amber-50">Pesanan</Link>
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
