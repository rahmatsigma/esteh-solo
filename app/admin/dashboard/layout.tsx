'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CupSoda, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar Dashboard Admin */}
      <header className="bg-white shadow-sm border-b border-amber-100 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xl">
          <CupSoda className="text-amber-700" />
          <span>Es Teh Solo Admin</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </header>
      
      {/* Konten Dashboard */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
