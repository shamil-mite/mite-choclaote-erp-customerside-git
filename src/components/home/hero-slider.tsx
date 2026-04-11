'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HomeBanner } from '@/lib/homepage.types';
import { HeroSlideContent } from './hero-slide-content';

type HeroSliderProps = {
  banners: HomeBanner[];
  autoPlayMs?: number;
};

export function HeroSlider({ banners, autoPlayMs = 5000 }: HeroSliderProps) {
  const sortedBanners = useMemo(
    () => [...banners].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [banners],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (sortedBanners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sortedBanners.length);
    }, autoPlayMs);

    return () => window.clearInterval(timer);
  }, [sortedBanners.length, autoPlayMs]);

  const activeBanner = sortedBanners[activeIndex];

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + sortedBanners.length) % sortedBanners.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % sortedBanners.length);

  if (!activeBanner) return null;

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#140b08]">
      <AnimatePresence mode="wait">
        <motion.div
          key={String(activeBanner.id)}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={activeBanner.imageUrl}
            alt={activeBanner.title}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(30,12,6,0.24),transparent_38%),linear-gradient(90deg,rgba(16,8,6,0.82)_0%,rgba(16,8,6,0.55)_38%,rgba(16,8,6,0.2)_65%,rgba(16,8,6,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,6,5,0.25)_0%,rgba(10,6,5,0.15)_45%,rgba(10,6,5,0.95)_100%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-between">
        <HeroSlideContent banner={activeBanner} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-5 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
          <div className="flex items-end justify-between gap-4">
            <div className="pointer-events-auto hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous slide"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1f120d]/70 text-white backdrop-blur transition hover:border-[#d3a170]/50 hover:bg-[#2b1710]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1f120d]/70 text-white backdrop-blur transition hover:border-[#d3a170]/50 hover:bg-[#2b1710]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="pointer-events-auto ml-auto grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
              {sortedBanners.slice(0, 4).map((banner, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={String(banner.id)}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? 'border-[#d3a170] shadow-[0_20px_50px_rgba(0,0,0,0.35)]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <div className="relative aspect-[1.25/1]">
                      <Image
                        src={banner.thumbnailUrl || banner.imageUrl}
                        alt={banner.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className={`absolute inset-0 ${isActive ? 'bg-[#120907]/20' : 'bg-[#120907]/45'}`} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                      <p className="line-clamp-2 text-xs font-medium uppercase tracking-[0.2em] text-[#f6eadf] sm:text-sm">
                        {banner.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
