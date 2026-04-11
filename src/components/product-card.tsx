'use client';

import Link from 'next/link';
import { useCart } from '@/components/providers/cart-provider';
import type { Product } from '@/data/catalog';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#e2d1ce] bg-white shadow-[0_20px_50px_rgba(201,169,166,0.16)] transition hover:-translate-y-2 hover:border-[var(--site-rose)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(232,213,211,0.78),rgba(255,255,255,0.94))] px-6 py-8">
          <div className="absolute right-5 top-5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b6f6b]">
            {product.code}
          </div>
          <div className="mx-auto flex aspect-[4/3] max-w-[16rem] items-center justify-center rounded-[24px] border border-white/70 bg-white/90 p-6 text-center font-heading text-3xl text-[#7a605d] shadow-[0_14px_35px_rgba(201,169,166,0.18)]">
            {product.name}
          </div>
        </div>
      </Link>
      <div className="space-y-4 px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {product.badges.map((badge) => (
            <span key={badge} className="rounded-full bg-[#f4ebe9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b6f6b]">
              {badge}
            </span>
          ))}
        </div>
        <div>
          <h3 className="font-heading text-3xl text-[#4a3a36]">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6d6461]">{product.shortDescription}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold text-[#4a3a36]">AED {product.price.toFixed(2)}</div>
            {product.compareAtPrice ? <div className="text-sm text-[#9b8f8a] line-through">AED {product.compareAtPrice.toFixed(2)}</div> : null}
          </div>
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.heroImage,
              })
            }
            className="rounded-full bg-[var(--site-rose)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(201,169,166,0.28)] transition hover:bg-[var(--site-rose-dark)]"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
