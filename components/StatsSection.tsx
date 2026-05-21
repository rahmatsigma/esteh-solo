'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  { value: 10000, suffix: '+', label: 'Pelanggan Puas', description: 'Tersebar di seluruh Indonesia' },
  { value: 50, suffix: '+', label: 'Varian Menu', description: 'Original hingga fusion modern' },
  { value: 100, suffix: '%', label: 'Bahan Alami', description: 'Tanpa pengawet, tanpa pewarna buatan' },
  { value: 4.9, suffix: '★', label: 'Rating Rata-rata', description: 'Dari lebih dari 2000 ulasan' },
];

function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      setCount(isDecimal ? Math.round(current * 10) / 10 : Math.round(current));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [active, target, duration]);

  return count;
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(stat.value, 2200, isInView);

  const display = stat.value % 1 !== 0
    ? count.toFixed(1)
    : count >= 1000
    ? count.toLocaleString('id-ID')
    : count.toString();

  return (
    <div
      ref={ref}
      className="relative p-8 rounded-2xl flex flex-col gap-3 overflow-hidden group"
      style={{
        background: 'rgba(200,151,58,0.04)',
        border: '1px solid rgba(200,151,58,0.1)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(200,151,58,0.1) 0%, transparent 70%)' }}
      />

      <div
        className="text-5xl md:text-6xl font-black stat-number leading-none tracking-tight"
        style={{ color: '#c8973a', letterSpacing: '-0.03em' }}
        aria-label={`${stat.value}${stat.suffix}`}
      >
        {display}
        <span className="text-3xl">{stat.suffix}</span>
      </div>

      <div>
        <p className="text-lg font-bold" style={{ color: '#f5ead8' }}>
          {stat.label}
        </p>
        <p className="text-sm mt-1" style={{ color: 'rgba(245,234,216,0.45)' }}>
          {stat.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-all duration-500 group-hover:opacity-100 opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, #c8973a, transparent)' }}
      />
    </div>
  );
}

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
      style={{ background: '#0a0603' }}
    >
      {/* Background text watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="text-[25vw] font-black tracking-tighter opacity-[0.025] leading-none"
          style={{ color: '#c8973a', letterSpacing: '-0.05em' }}
        >
          SOLO
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px" style={{ background: '#c8973a' }} />
            <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
              Angka Berbicara
            </span>
            <div className="w-8 h-px" style={{ background: '#c8973a' }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-black"
            style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
          >
            Dipercaya Ribuan Orang.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
