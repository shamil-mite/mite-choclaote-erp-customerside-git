'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { WebsiteBanner } from '@/data/catalog';

export function HomeBannerCarousel({ banners }: { banners: WebsiteBanner[] }) {
  const safeBanners = banners.length ? banners : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (safeBanners.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeBanners.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [safeBanners.length]);

  if (!safeBanners.length) return null;

  const activeBanner = safeBanners[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[#e2cfcb] bg-[linear-gradient(120deg,#faf5f3_0%,#f0dfdb_52%,#efe6e1_100%)] shadow-[0_28px_80px_rgba(201,169,166,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(255,255,255,0.72),transparent_32%),radial-gradient(circle_at_right_bottom,rgba(201,169,166,0.24),transparent_28%)]" />
      <div className="relative grid min-h-[70vh] gap-10 px-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
        <div className="flex max-w-3xl flex-col justify-center">
          {activeBanner.subtitle ? (
            <div className="inline-flex w-fit rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b] shadow-[0_12px_24px_rgba(201,169,166,0.12)]">
              {activeBanner.subtitle}
            </div>
          ) : null}
          <h1 className="mt-7 font-heading text-6xl leading-[0.92] text-[#4a3a36] md:text-7xl xl:text-8xl">
            {activeBanner.title}
          </h1>
          {activeBanner.description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#675d5a]">{activeBanner.description}</p>
          ) : null}
          {activeBanner.buttonText && activeBanner.buttonUrl ? (
            <div className="mt-9">
              <Link
                href={activeBanner.buttonUrl}
                className="inline-flex items-center rounded-full bg-[#8b6f6b] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(139,111,107,0.28)] transition hover:bg-[#725a56]"
              >
                {activeBanner.buttonText}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-[36px] bg-white/45 blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[34px] border border-white/55 bg-white/70 shadow-[0_20px_50px_rgba(201,169,166,0.18)]">
            {activeBanner.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeBanner.imageUrl} alt={activeBanner.title} className="h-full min-h-[320px] w-full object-cover lg:min-h-[520px]" />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,rgba(201,169,166,0.28),rgba(255,249,247,0.95))] px-8 text-center font-heading text-5xl text-[#8b6f6b] lg:min-h-[520px]">
                {activeBanner.title}
              </div>
            )}
          </div>
        </div>
      </div>

      {safeBanners.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {safeBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`Go to banner ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? 'w-10 bg-[#8b6f6b]' : 'w-2.5 bg-white/85'}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
