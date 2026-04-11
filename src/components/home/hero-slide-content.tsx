import Link from 'next/link';
import type { HomeBanner } from '@/lib/homepage.types';

type HeroSlideContentProps = {
  banner: HomeBanner;
};

export function HeroSlideContent({ banner }: HeroSlideContentProps) {
  return (
    <div className="relative z-10 flex h-full items-center">
      <div className="max-w-3xl px-6 py-28 sm:px-10 lg:px-16">
        {banner.subtitle ? (
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-[#d3a170] sm:text-sm">
            {banner.subtitle}
          </p>
        ) : null}

        <h1 className="max-w-2xl font-heading text-5xl leading-[0.95] tracking-tight text-[#f8eee6] sm:text-6xl lg:text-8xl">
          {banner.title}
        </h1>

        {banner.description ? (
          <p className="mt-6 max-w-xl text-base leading-8 text-[#f0dfd3]/80 sm:text-lg">
            {banner.description}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={banner.ctaHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d0a27d]/30 bg-gradient-to-r from-[#9b5d37] to-[#c48a63] px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(125,67,32,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(125,67,32,0.5)]"
          >
            {banner.ctaLabel || 'Buy'}
          </Link>
        </div>
      </div>
    </div>
  );
}
