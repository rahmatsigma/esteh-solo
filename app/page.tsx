'use client';

import { useState, useEffect } from 'react';
import LenisProvider from '@/components/LenisProvider';
import Navbar from '@/components/Navbar';
import SequenceScroll from '@/components/SequenceScroll';
import AboutSection from '@/components/AboutSection';
import BentoSection from '@/components/BentoSection';
import StatsSection from '@/components/StatsSection';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import AuthPage from '@/components/AuthPage';
import { supabase } from '@/lib/supabase';

type PageState = 'loading' | 'auth' | 'home';

export default function Home() {
  // const [pageState, setPageState] = useState<PageState>('loading');
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   // Check Supabase session on mount
  //   const checkSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
      
  //     if (session) {
  //       setIsAuthenticated(true);
  //       setPageState('home');
  //     } else {
  //       // Show loading screen for 2.5 seconds, then auth page
  //       const timer = setTimeout(() => {
  //         setPageState('auth');
  //       }, 2500);

  //       return () => clearTimeout(timer);
  //     }
  //   };

  //   checkSession();

  //   // Listen for auth state changes
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (session) {
  //       setIsAuthenticated(true);
  //       setPageState('home');
  //     } else if (event === 'SIGNED_OUT') {
  //       setIsAuthenticated(false);
  //       setPageState('auth');
  //     }
  //   });

  //   return () => subscription?.unsubscribe();
  // }, []);

  // const handleAuthSuccess = () => {
  //   setIsAuthenticated(true);
  //   setPageState('home');
  // };

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   setIsAuthenticated(false);
  //   setPageState('auth');
  // };

  // // Render loading screen
  // if (pageState === 'loading') {
  //   return <LoadingScreen isLoading={true} />;
  // }

  // // Render auth page
  // if (pageState === 'auth') {
  //   return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  // }

  // Render home page
  return (
    <LenisProvider>
      {/* Navbar — fixed, always on top */}
      <Navbar />

      <main>
        {/* ── Hero: Image Sequence Scrollytelling ─── */}
        <SequenceScroll />

        {/* ── Below-the-fold sections ──────────────── */}
        {/* -mt-[100vh] pulls these sections up to close the hero */}
        <div className="-mt-[100vh] relative z-10">
          <AboutSection />
          <BentoSection />
          <StatsSection />
          <TestimonialSection />
          <CTASection />
          <Footer />
        </div>
      </main>
    </LenisProvider>
  );
}