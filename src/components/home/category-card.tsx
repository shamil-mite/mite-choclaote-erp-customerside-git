'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { HomeCategory } from '@/lib/homepage.types';

type CategoryCardProps = {
  category: HomeCategory;
  index?: number;
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <Link
        href={`/category/${category.slug}`}
        className="block overflow-hidden rounded-[28px] border border-[#8e603f]/30 bg-[linear-gradient(180deg,rgba(43,22,16,0.92),rgba(24,11,8,0.98))] shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-2 hover:border-[#d0a27d]/45 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
      >
        <div className="relative aspect-[1.06/1] overflow-hidden">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            unoptimized
            className="object-cover transition duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,7,0.05),rgba(20,10,7,0.75)_85%)]" />
        </div>

        <div className="space-y-4 px-5 pb-6 pt-5 text-center sm:px-6">
          <h3 className="font-heading text-2xl text-[#f8ece2]">{category.name}</h3>
          {category.shortDescription ? (
            <p className="line-clamp-2 text-sm leading-7 text-[#dccabb]/70">
              {category.shortDescription}
            </p>
          ) : null}

          <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#c79671]/25 bg-gradient-to-r from-[#7b482e] to-[#b67551] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white transition duration-300 group-hover:scale-[1.03]">
            More
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
