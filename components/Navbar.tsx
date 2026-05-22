'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Menu', href: '#bento' },
  { label: 'Testimoni', href: '#testimonial' },
  { label: 'Pesan Sekarang', href: '#cta' },
];

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'WhatsApp', href: '#' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const linkVariant = {
  hidden: { y: '100%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: '-100%', opacity: 0, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
};

const overlayVariant = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 700);
  };

  return (
    <>
      {/* Fixed Navbar Bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glassmorphic background */}
        <motion.div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            background: scrolled
              ? 'rgba(10,6,3,0.8)'
              : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(200,151,58,0.1)' : 'none',
          }}
        />

        {/* Logo */}
        <a
          href="/"
          className="relative z-10 text-xl font-black tracking-tight leading-none"
          style={{ color: '#f5ead8' }}
        >
          Es<span style={{ color: '#c8973a' }}>Teh</span>
          <span className="text-xs font-medium tracking-widest ml-2 opacity-60" style={{ color: '#c8b99a' }}>
            SOLO
          </span>
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="relative z-10 flex flex-col items-end gap-1.5 p-2 group"
          aria-label="Toggle menu"
          id="nav-menu-btn"
        >
          <motion.span
            className="block h-px w-8 origin-right"
            style={{ background: '#c8973a' }}
            animate={open ? { rotate: -45, y: 4, width: '2rem' } : { rotate: 0, y: 0, width: '2rem' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.span
            className="block h-px origin-right"
            style={{ background: '#c8973a', width: '1.25rem' }}
            animate={open ? { rotate: 45, y: -4, width: '2rem' } : { rotate: 0, y: 0, width: '1.25rem' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          />
        </button>
      </motion.nav>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-overlay"
            variants={overlayVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-[99] flex flex-col justify-between p-8 md:p-16 pt-24 md:pt-28 overflow-hidden"
            style={{ background: '#0d0904' }}
          >
            {/* Ambient glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(200,151,58,0.08) 0%, transparent 70%)',
              }}
            />

            {/* Nav links */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="relative z-10 space-y-2 md:space-y-4 flex-1 flex flex-col justify-center"
            >
              {navLinks.map((link, i) => (
                <li key={i} className="overflow-hidden">
                  <motion.div variants={linkVariant}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="group flex items-baseline gap-4 text-left w-full"
                      style={{ color: '#f5ead8' }}
                      onMouseEnter={(e) => {
                        const label = e.currentTarget.querySelector<HTMLElement>('.nav-label');
                        const arrow = e.currentTarget.querySelector<HTMLElement>('.nav-arrow');
                        if (label) label.style.color = '#c8973a';
                        if (arrow) { arrow.style.opacity = '1'; arrow.style.transform = 'translateX(0)'; }
                      }}
                      onMouseLeave={(e) => {
                        const label = e.currentTarget.querySelector<HTMLElement>('.nav-label');
                        const arrow = e.currentTarget.querySelector<HTMLElement>('.nav-arrow');
                        if (label) label.style.color = '#f5ead8';
                        if (arrow) { arrow.style.opacity = '0'; arrow.style.transform = 'translateX(-8px)'; }
                      }}
                    >
                      <span
                        className="text-xs tracking-widest opacity-40 w-6 text-right shrink-0"
                        style={{ color: '#c8973a' }}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className="nav-label text-5xl md:text-7xl lg:text-8xl font-black leading-none transition-colors duration-300"
                        style={{ letterSpacing: '-0.03em', color: '#f5ead8' }}
                      >
                        {link.label}
                      </span>
                      <span
                        className="nav-arrow text-2xl transition-all duration-300"
                        style={{ color: '#c8973a', opacity: 0, transform: 'translateX(-8px)' }}
                      >
                        →
                      </span>
                    </button>
                  </motion.div>
                </li>
              ))}
            </motion.ul>

            {/* Bottom row: socials + contact */}
            <motion.div
              className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 border-t"
              style={{ borderColor: 'rgba(200,151,58,0.15)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex gap-8">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="text-sm tracking-widest uppercase transition-colors duration-200"
                    style={{ color: 'rgba(245,234,216,0.4)' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#c8973a'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(245,234,216,0.4)'; }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <div className="text-right">
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(200,151,58,0.5)' }}>
                  Kontak
                </p>
                <a
                  href="tel:+6281234567890"
                  className="text-sm font-medium"
                  style={{ color: 'rgba(245,234,216,0.7)' }}
                >
                  +62 812-3456-7890
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
