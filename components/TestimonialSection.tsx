'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: 'Rasanya beda banget dari es teh biasa. Wangi melatinya kerasa banget dan manisnya pas. Sekarang jadi minuman wajib sehari-hari.',
    author: 'Sari Dewi',
    role: 'Pelanggan Setia, Surabaya',
    initial: 'S',
  },
  {
    id: 2,
    quote: 'Gak nyangka es teh bisa se-premium ini. Setiap tegukan beneran bikin tenang. Sudah coba semua varian dan semuanya enak!',
    author: 'Reza Pratama',
    role: 'Food Blogger, Jakarta',
    initial: 'R',
  },
  {
    id: 3,
    quote: 'Ini bukan sekadar minuman, ini pengalaman. Packaging-nya kece, rasanya autentik, dan harganya tetap terjangkau. 10/10!',
    author: 'Mei Lin',
    role: 'Content Creator, Bandung',
    initial: 'M',
  },
  {
    id: 4,
    quote: 'Sudah langganan sejak pertama kali buka. Kualitasnya konsisten, pelayanannya ramah, dan teh melatinya bikin nagih.',
    author: 'Adi Nugroho',
    role: 'Pengusaha, Solo',
    initial: 'A',
  },
];

const AUTOPLAY_INTERVAL = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (next: number, direction: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDir(direction);
    setIndex(next);
  };

  const goNext = () => go((index + 1) % testimonials.length, 1);
  const goPrev = () => go((index - 1 + testimonials.length) % testimonials.length, -1);

  useEffect(() => {
    timerRef.current = setTimeout(goNext, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const current = testimonials[index];

  return (
    <section
      id="testimonial"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#0d0904' }}
    >
      {/* Background quote mark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="text-[40vw] font-black opacity-[0.018] leading-none"
          style={{ color: '#c8973a' }}
        >
          &quot;
        </span>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-24 md:pt-32 px-6 md:px-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px" style={{ background: '#c8973a' }} />
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
            Apa Kata Mereka
          </span>
          <div className="w-8 h-px" style={{ background: '#c8973a' }} />
        </div>
        <h2
          className="text-4xl md:text-5xl font-black"
          style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
        >
          Suara Pelanggan Kami.
        </h2>
      </div>

      {/* Slide area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-16 lg:px-32">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-4xl mx-auto w-full"
          >
            <div className="py-12 md:py-20 text-center space-y-8">
              {/* Stars */}
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#c8973a', fontSize: '1.2rem' }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight"
                style={{ color: '#f5ead8', letterSpacing: '-0.01em' }}
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ background: 'rgba(200,151,58,0.2)', color: '#c8973a', border: '1px solid rgba(200,151,58,0.3)' }}
                >
                  {current.initial}
                </div>
                <div className="text-left">
                  <p className="font-bold" style={{ color: '#f5ead8' }}>{current.author}</p>
                  <p className="text-sm" style={{ color: 'rgba(245,234,216,0.45)' }}>{current.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative z-10 pb-16 px-6 flex items-center justify-center gap-8">
        {/* Prev */}
        <button
          onClick={goPrev}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ border: '1px solid rgba(200,151,58,0.3)', color: '#c8973a' }}
          aria-label="Sebelumnya"
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > index ? 1 : -1)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? '2rem' : '0.5rem',
                height: '0.5rem',
                background: i === index ? '#c8973a' : 'rgba(200,151,58,0.25)',
              }}
              aria-label={`Ke testimoni ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ border: '1px solid rgba(200,151,58,0.3)', color: '#c8973a' }}
          aria-label="Berikutnya"
        >
          →
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(200,151,58,0.1)' }}>
        <motion.div
          key={index}
          className="h-full"
          style={{ background: '#c8973a' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
        />
      </div>
    </section>
  );
}
