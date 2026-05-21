'use client';

import LenisProvider from '@/components/LenisProvider';
import Navbar from '@/components/Navbar';
import SequenceScroll from '@/components/SequenceScroll';
import AboutSection from '@/components/AboutSection';
import BentoSection from '@/components/BentoSection';
import StatsSection from '@/components/StatsSection';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
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