'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Leaf, CupSoda, MapPin, Phone } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 1,
      name: "Es Teh Original",
      description: "Racikan teh melati asli Solo dengan gula batu murni.",
      price: "Rp 5.000",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Es Teh Kampul",
      description: "Paduan teh Solo dengan irisan jeruk peras segar yang legit.",
      price: "Rp 7.000",
      image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Es Teh Susu",
      description: "Kombinasi teh kental legit dengan susu kental manis.",
      price: "Rp 8.000",
      image: "https://images.unsplash.com/photo-1558857563-b37103fac696?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Es Teh Leci",
      description: "Kesegaran es teh dengan sirup leci dan buah leci asli.",
      price: "Rp 10.000",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <>
      {/* Panggil komponen loading dan kirim state isLoading ke dalamnya */}
      <LoadingScreen isLoading={isLoading} />

      {/* Konten Utama Website */}
      <div className="min-h-screen bg-amber-50 font-sans text-slate-800">
        {/* Header/Navbar */}
        <nav className="bg-amber-800 text-amber-50 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CupSoda size={28} className="text-amber-300" />
              <h1 className="text-2xl font-bold tracking-wider">Es-Teh S.O.L.O</h1>
            </div>
            <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-full transition-colors font-medium">
              <ShoppingBag size={20} />
              <span className="hidden sm:inline">Pesan Sekarang</span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-amber-800 to-amber-900 text-amber-50 py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="bg-amber-700/50 text-amber-200 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center w-fit mx-auto gap-2">
              <Leaf size={16} /> 100% Teh Asli Pilihan
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Kesegaran Autentik <br className="hidden md:block" /> di Setiap Tegukan.
            </h2>
            <p className="text-lg md:text-xl text-amber-200/90 max-w-2xl mx-auto">
              Diramu dengan resep tradisional Solo, menghasilkan perpaduan wangi melati, sepet, dan manis yang pas.
            </p>
            <a href="#menu" className="inline-block bg-amber-400 text-amber-950 font-bold px-8 py-3.5 rounded-full hover:bg-amber-300 transition-transform hover:scale-105 shadow-lg mt-4">
              Lihat Menu Kami
            </a>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-amber-950 mb-4">Menu Favorit</h3>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xl text-amber-950">{product.name}</h4>
                    <div className="flex text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-xs font-bold ml-1">4.9</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                  <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                    <span className="font-bold text-lg text-amber-700">{product.price}</span>
                    <button className="bg-amber-100 text-amber-800 hover:bg-amber-800 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-amber-950 text-amber-100/70 py-12 px-4 border-t border-amber-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <h5 className="text-2xl font-bold text-amber-50 flex items-center justify-center md:justify-start gap-2">
                <CupSoda size={24} /> Es-Teh S.O.L.O
              </h5>
              <p className="text-sm">Menyajikan teh terbaik dengan cita rasa lokal sejak 2026. Wangi, sepet, legit, kental.</p>
            </div>
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-amber-50">Kontak Kami</h5>
              <p className="flex items-center justify-center md:justify-start gap-2 text-sm"><Phone size={16}/> +62 812-3456-7890</p>
              <p className="flex items-center justify-center md:justify-start gap-2 text-sm"><MapPin size={16}/> Jl. Slamet Riyadi No. 123, Solo</p>
            </div>
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-amber-50">Jam Buka</h5>
              <p className="text-sm">Setiap Hari<br/>10.00 - 22.00 WIB</p>
            </div>
          </div>
          <div className="text-center mt-12 text-sm pt-8 border-t border-amber-900/50">
            <p>&copy; 2026 Es-Teh S.O.L.O. Hak Cipta Dilindungi.</p>
          </div>
        </footer>
      </div>
    </>
  );
}