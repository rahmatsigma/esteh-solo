'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';

const text =
  'Setiap tetes teh kami berasal dari daun pilihan yang dipetik dengan penuh kasih dari kebun teh terbaik di pegunungan Jawa. Diseduh dengan resep turun-temurun dari Solo, menghadirkan cita rasa yang autentik — wangi melati yang khas, rasa sepet yang menyegarkan, dan kemanisan yang pas.';

// Sub-component so hooks are called at the top level of a component (not inside a loop)
function CharSpan({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(start + 0.04, 1);
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
  const color = useTransform(
    scrollYProgress,
    [start, end],
    ['rgba(245,234,216,0.15)', 'rgba(245,234,216,0.9)']
  );

  return (
    <motion.span style={{ opacity, color, display: char === '\n' ? 'block' : 'inline' }}>
      {char}
    </motion.span>
  );
}

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.3'],
  });

  const chars = text.split('');

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex items-center py-32 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: '#0a0603' }}
    >
      {/* Decorative vertical line */}
      <div
        className="absolute left-6 md:left-16 top-0 bottom-0 w-px opacity-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #c8973a, transparent)' }}
      />

      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left: label + char reveal */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px" style={{ background: '#c8973a' }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
                Tentang Kami
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-black leading-tight"
              style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
            >
              Dari Kebun Teh
              <br />
              ke Cangkir Anda.
            </h2>
          </div>

          {/* Character-by-character reveal */}
          <p
            className="text-xl md:text-2xl font-light leading-relaxed"
            style={{ color: 'rgba(245,234,216,0.4)' }}
            aria-label={text}
          >
            {chars.map((char, i) => (
              <CharSpan
                key={i}
                char={char}
                index={i}
                total={chars.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </p>
        </div>

        {/* Right: stats mini-cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '100%', label: 'Bahan Alami' },
            { num: '50+', label: 'Varian Rasa' },
            { num: '10K+', label: 'Pelanggan Puas' },
            { num: '2026', label: 'Tahun Berdiri' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl flex flex-col gap-1"
              style={{ background: 'rgba(200,151,58,0.06)', border: '1px solid rgba(200,151,58,0.12)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              <span
                className="text-3xl font-black"
                style={{ color: '#c8973a', letterSpacing: '-0.02em' }}
              >
                {item.num}
              </span>
              <span className="text-sm" style={{ color: 'rgba(245,234,216,0.5)' }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
