'use client';

import { motion } from 'framer-motion';

const footerLinks = [
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Menu', href: '#bento' },
  { label: 'Testimoni', href: '#testimonial' },
  { label: 'Pesan Sekarang', href: '#cta' },
];

const socials = [
  { label: 'IG', href: '#', full: 'Instagram' },
  { label: 'TT', href: '#', full: 'TikTok' },
  { label: 'WA', href: '#', full: 'WhatsApp' },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#070402', borderTop: '1px solid rgba(200,151,58,0.1)' }}
    >
      {/* Top glow line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(200,151,58,0.5), transparent)',
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[30vw] font-black tracking-tighter opacity-[0.015] translate-y-1/3 leading-none"
          style={{ color: '#c8973a', letterSpacing: '-0.05em' }}
        >
          ESTEH
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Main row */}
        <div className="pt-20 pb-12 grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h2
                className="text-3xl font-black tracking-tight leading-none"
                style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
              >
                Es<span style={{ color: '#c8973a' }}>Teh</span>
              </h2>
              <p
                className="text-xs tracking-[0.3em] uppercase mt-1"
                style={{ color: 'rgba(200,151,58,0.5)' }}
              >
                Solo · Est. 2026
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,234,216,0.4)' }}>
              Menyajikan cita rasa teh melati autentik dari Solo. Wangi, sepet, legit, dan kental — dalam setiap tegukan.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(200,151,58,0.5)' }}>
              Navigasi
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(245,234,216,0.45)' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#c8973a'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(245,234,216,0.45)'; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(200,151,58,0.5)' }}>
              Kontak
            </h3>
            <div className="space-y-2 text-sm" style={{ color: 'rgba(245,234,216,0.45)' }}>
              <p>+62 812-3456-7890</p>
              <p>estehsolo@email.com</p>
              <p>Ketintang, Surabaya,<br />Jawa Timur</p>
            </div>
            <div className="flex gap-4 pt-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
                  style={{
                    border: '1px solid rgba(200,151,58,0.25)',
                    color: 'rgba(200,151,58,0.6)',
                  }}
                  aria-label={s.full}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(200,151,58,0.7)';
                    el.style.color = '#c8973a';
                    el.style.background = 'rgba(200,151,58,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(200,151,58,0.25)';
                    el.style.color = 'rgba(200,151,58,0.6)';
                    el.style.background = 'transparent';
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(200,151,58,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(245,234,216,0.25)' }}>
            © 2026 Es Teh Solo. Hak Cipta Dilindungi.
          </p>
          <p className="text-xs" style={{ color: 'rgba(200,151,58,0.3)' }}>
            Crafted with ♥ in Solo, Java
          </p>
        </div>
      </div>
    </footer>
  );
}
