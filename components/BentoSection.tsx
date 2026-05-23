'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const cards = [
  {
    id: 'bento-1',
    className: 'bento-1',
    img: '/bento-hero.png',
    label: 'Signature',
    title: 'Es Teh Melati Original',
    desc: 'Resep turun-temurun dari Solo dengan bunga melati pilihan.',
    tall: true,
  },
  {
    id: 'bento-2',
    className: 'bento-2',
    img: '/bento-plantation.png',
    label: 'Sumber',
    title: 'Kebun Teh Pegunungan Jawa',
    desc: 'Dipetik langsung dari kebun teh di dataran tinggi.',
    tall: false,
  },
  {
    id: 'bento-3',
    className: 'bento-3',
    img: '/bento-brewing.png',
    label: 'Proses',
    title: 'Seduhan Tradisional',
    desc: 'Diseduh setiap pagi dengan teknik turun-temurun.',
    tall: false,
  },
  {
    id: 'bento-4',
    className: 'bento-4',
    img: null,
    label: null,
    title: null,
    isQuote: true,
    quote: '"Satu tegukan membawa kenangan rasa yang tak terlupakan."',
  },
  {
    id: 'bento-5',
    className: 'bento-5',
    img: '/bento-cup.png',
    label: 'Produk',
    title: 'Cup Premium',
    desc: 'Dikemas dengan elegan untuk setiap momen.',
    tall: false,
  },
  {
    id: 'bento-6',
    className: 'bento-6',
    img: null,
    label: null,
    title: null,
    isStats: true,
    statNum: '50+',
    statLabel: 'Varian Menu',
    statSub: 'Dari original hingga fusion modern',
  },
];

export default function BentoSection() {
  return (
    <section
      id="bento"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
      style={{ background: '#0d0904' }}
    >
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: '#c8973a' }} />
            <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
              Galeri
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
          >
            Setiap Detail,
            <br />
            Penuh Makna.
          </h2>
        </div>
        <p
          className="text-base font-light max-w-xs"
          style={{ color: 'rgba(245,234,216,0.45)' }}
        >
          Dari kebun hingga cangkir — kami memperhatikan setiap langkah dengan seksama.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto bento-grid">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            id={card.id}
            className={`${card.className} relative rounded-2xl overflow-hidden group`}
            style={{
              minHeight: card.className === 'bento-1' ? '480px' : '220px',
              background: 'rgba(200,151,58,0.04)',
              border: '1px solid rgba(200,151,58,0.1)',
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Image card */}
            {card.img && (
              <>
                <Image
                  src={card.img}
                  alt={card.title || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,6,3,0.9) 0%, rgba(10,6,3,0.2) 60%, transparent 100%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                  {card.label && (
                    <span
                      className="text-xs tracking-[0.3em] uppercase"
                      style={{ color: '#c8973a' }}
                    >
                      {card.label}
                    </span>
                  )}
                  {card.title && (
                    <h3
                      className="text-lg md:text-xl font-bold leading-tight"
                      style={{ color: '#f5ead8' }}
                    >
                      {card.title}
                    </h3>
                  )}
                  {card.desc && (
                    <p className="text-sm" style={{ color: 'rgba(245,234,216,0.55)' }}>
                      {card.desc}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Quote card */}
            {card.isQuote && (
              <div className="flex items-center justify-center h-full p-8">
                <blockquote
                  className="text-xl md:text-2xl font-light italic text-center leading-relaxed"
                  style={{ color: 'rgba(245,234,216,0.7)' }}
                >
                  <span style={{ color: '#c8973a', fontSize: '3rem', lineHeight: 0.5, verticalAlign: 'bottom' }}>&quot;</span>
                  <br />
                  {card.quote?.replace(/^"|"$/g, '')}
                </blockquote>
              </div>
            )}

            {/* Stats card */}
            {card.isStats && (
              <div className="flex flex-col justify-center h-full p-8 space-y-3">
                <span
                  className="text-6xl font-black"
                  style={{ color: '#c8973a', letterSpacing: '-0.04em' }}
                >
                  {card.statNum}
                </span>
                <div>
                  <p className="text-lg font-bold" style={{ color: '#f5ead8' }}>
                    {card.statLabel}
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(245,234,216,0.45)' }}>
                    {card.statSub}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
