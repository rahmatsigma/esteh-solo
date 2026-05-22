'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    x.set(dx);
    y.set(dy);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex items-center justify-center px-10 py-5 font-bold text-sm tracking-widest uppercase overflow-hidden group"
      style={{
        x: springX,
        y: springY,
        background: '#c8973a',
        color: '#0a0603',
        borderRadius: '100px',
        letterSpacing: '0.15em',
        cursor: 'none',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10">{children}</span>
      {/* Shine sweep */}
      <motion.span
        className="absolute inset-0 rounded-[100px] opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
    </motion.a>
  );
}

export default function CTASection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const glowX = mousePos.x * 100;
  const glowY = mousePos.y * 100;

  return (
    <section
      id="cta"
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient"
    >
      {/* Mouse-tracking glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at ${glowX}% ${glowY}%, rgba(200,151,58,0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,151,58,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,151,58,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating orbs */}
      {[
        { top: '15%', left: '10%', size: 300, delay: 0 },
        { top: '60%', right: '8%', size: 200, delay: 2 },
        { bottom: '10%', left: '30%', size: 150, delay: 1 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            ...orb,
            width: orb.size,
            height: orb.size,
            background: 'radial-gradient(circle, rgba(200,151,58,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px" style={{ background: '#c8973a' }} />
            <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
              Mulai Sekarang
            </span>
            <div className="w-8 h-px" style={{ background: '#c8973a' }} />
          </div>
          <h2
            className="text-5xl md:text-7xl font-black leading-none"
            style={{ color: '#f5ead8', letterSpacing: '-0.03em' }}
          >
            Pesan Sekarang.
            <br />
            <span style={{ color: '#c8973a' }}>Rasakan Bedanya.</span>
          </h2>
          <p className="text-lg font-light" style={{ color: 'rgba(245,234,216,0.55)' }}>
            Gratis ongkir untuk pesanan pertama Anda. Nikmati kesegaran Es Teh Solo langsung di tangan Anda.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton href="#menu">Pesan via WhatsApp</MagneticButton>

          <a
            href="#bento"
            className="text-sm tracking-widest uppercase underline underline-offset-4 transition-colors duration-200"
            style={{ color: 'rgba(245,234,216,0.4)', letterSpacing: '0.1em' }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#c8973a'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(245,234,216,0.4)'; }}
          >
            Lihat Menu Dulu
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap gap-6 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {['✓ 100% Alami', '✓ Tanpa Pengawet', '✓ Gratis Ongkir', '✓ Pesanan Hari Ini'].map((badge, i) => (
            <span
              key={i}
              className="text-xs tracking-wide"
              style={{ color: 'rgba(200,151,58,0.6)' }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
