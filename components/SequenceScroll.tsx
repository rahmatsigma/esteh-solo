'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import Preloader from './Preloader';

const TOTAL_FRAMES = 240;
const BG_COLOR = '#2e5c52'; // Matches the teal edge of the sequence images for seamless blending

function getFramePath(i: number): string {
  const n = String(i).padStart(3, '0');
  return `/sequence/ezgif-frame-${n}.jpg`;
}

interface TextBeat {
  startProgress: number;
  endProgress: number;
  content: React.ReactNode;
  align: 'left' | 'center' | 'right';
}

const textBeats: TextBeat[] = [
  {
    startProgress: 0,
    endProgress: 0.2,
    align: 'center',
    content: (
      <div className="text-center space-y-4">
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
          Est. 2026 · Solo, Java
        </p>
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none"
          style={{ color: '#f5ead8', letterSpacing: '-0.03em' }}
        >
          Kenikmatan
          <br />
          <span style={{ color: '#c8973a' }}>Asli Solo.</span>
        </h2>
        <p className="text-lg md:text-xl font-light max-w-sm mx-auto" style={{ color: 'rgba(245,234,216,0.6)' }}>
          Teh melati pilihan, diracik dengan resep tradisional yang tak lekang waktu.
        </p>
      </div>
    ),
  },
  {
    startProgress: 0.22,
    endProgress: 0.48,
    align: 'left',
    content: (
      <div className="space-y-3">
        <div className="w-12 h-px" style={{ background: '#c8973a' }} />
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
          Bahan Pilihan
        </p>
        <h3
          className="text-4xl md:text-6xl font-black leading-tight"
          style={{ color: '#f5ead8', letterSpacing: '-0.02em', maxWidth: '14ch' }}
        >
          Wangi Melati,
          <br />
          Sepet yang Pas.
        </h3>
        <p className="text-base font-light" style={{ color: 'rgba(245,234,216,0.55)', maxWidth: '30ch' }}>
          Dipetik dari kebun teh terbaik di dataran tinggi Jawa, diseduh sempurna setiap pagi.
        </p>
      </div>
    ),
  },
  {
    startProgress: 0.5,
    endProgress: 0.76,
    align: 'right',
    content: (
      <div className="space-y-3 text-right">
        <div className="w-12 h-px ml-auto" style={{ background: '#c8973a' }} />
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
          Pengalaman
        </p>
        <h3
          className="text-4xl md:text-6xl font-black leading-tight"
          style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
        >
          Legit. Kental.
          <br />
          Tak Terlupakan.
        </h3>
        <p className="text-base font-light" style={{ color: 'rgba(245,234,216,0.55)', maxWidth: '30ch', marginLeft: 'auto' }}>
          Setiap tegukan membawa kenangan rasa yang otentik dan menyegarkan.
        </p>
      </div>
    ),
  },
  {
    startProgress: 0.78,
    endProgress: 1.0,
    align: 'center',
    content: (
      <div className="text-center space-y-6">
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#c8973a' }}>
          Mulai Perjalananmu
        </p>
        <h3
          className="text-4xl md:text-6xl font-black leading-none"
          style={{ color: '#f5ead8', letterSpacing: '-0.02em' }}
        >
          Siap Merasakan
          <br />
          <span style={{ color: '#c8973a' }}>Perbedaannya?</span>
        </h3>
        <p className="text-base font-light" style={{ color: 'rgba(245,234,216,0.55)' }}>
          Bergabung bersama ribuan pelanggan setia Es Teh Solo.
        </p>
        <a
          href="#cta"
          className="inline-block px-10 py-4 font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
          style={{
            background: '#c8973a',
            color: '#0a0603',
            borderRadius: '100px',
            letterSpacing: '0.15em',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#e8b86d'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#c8973a'; }}
        >
          Pesan Sekarang
        </a>
      </div>
    ),
  },
];

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress → frame index (0-based)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Canvas drawing function
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[Math.round(index)];
    if (!img || !img.complete) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Cover fit
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW: number, drawH: number, drawX: number, drawY: number;
    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = height * imgAspect;
    } else {
      drawW = width;
      drawH = width / imgAspect;
    }
    drawX = (width - drawW) / 2;
    drawY = (height - drawH) / 2;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Animate on frame change — use rAF for smoothness
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const target = Math.round(Math.max(0, Math.min(TOTAL_FRAMES - 1, latest)));
    if (target !== currentFrameRef.current) {
      currentFrameRef.current = target;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(target));
    }
  });

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawFrame(currentFrameRef.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawFrame]);

  // Preload all frames
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i + 1);
      img.onload = () => {
        imagesRef.current[i] = img;
        loaded++;
        setLoadedCount(loaded);
        // Draw first frame immediately when ready
        if (i === 0) drawFrame(0);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
    }
  }, [drawFrame]);

  // Text beat opacity helper
  const getTextOpacity = (beat: TextBeat, progress: number) => {
    const fadeIn = 0.08;
    const fadeOut = 0.08;
    if (progress < beat.startProgress) return 0;
    if (progress > beat.endProgress) return 0;
    const inProgress = (progress - beat.startProgress) / fadeIn;
    const outProgress = (beat.endProgress - progress) / fadeOut;
    return Math.min(Math.min(inProgress, outProgress), 1);
  };

  const [scrollProgress, setScrollProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setScrollProgress(v));

  return (
    <>
      <Preloader
        loadedCount={loadedCount}
        totalCount={TOTAL_FRAMES}
        onComplete={() => {}}
      />

      <div ref={containerRef} className="relative" style={{ height: '400vh' }}>
        {/* Sticky canvas */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: BG_COLOR }}
          />

          {/* Text overlays */}
          {textBeats.map((beat, i) => {
            const opacity = getTextOpacity(beat, scrollProgress);
            const translateY = opacity < 1 ? (scrollProgress < beat.startProgress ? 20 : -20) : 0;

            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center pointer-events-none px-8 md:px-16 lg:px-24"
                style={{
                  justifyContent:
                    beat.align === 'left'
                      ? 'flex-start'
                      : beat.align === 'right'
                      ? 'flex-end'
                      : 'center',
                }}
              >
                <div
                  className="max-w-xl transition-none"
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    pointerEvents: opacity > 0.5 ? 'auto' : 'none',
                  }}
                >
                  {beat.content}
                </div>
              </div>
            );
          })}

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
          >
            <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(200,151,58,0.6)' }}>
              Scroll
            </span>
            <div className="w-px h-12 relative overflow-hidden" style={{ background: 'rgba(200,151,58,0.2)' }}>
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ background: '#c8973a', height: '40%' }}
                animate={{ y: ['0%', '250%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
