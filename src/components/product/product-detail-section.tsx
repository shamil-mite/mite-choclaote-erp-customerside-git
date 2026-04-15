'use client';

import Image from 'next/image';
import { useMemo, useSyncExternalStore } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import type { ProductDetail } from '@/lib/product-page.types';

function formatPrice(value: number, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatWeight(value?: number | null, unit?: string) {
  if (value === null || value === undefined || !unit) return '';
  const normalized = Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '');
  return `${normalized} ${unit}`;
}

export function ProductDetailSection({ product }: { product: ProductDetail }) {
  const { items, addItem, updateQuantity } = useCart();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const cartQuantity = hydrated ? (items.find((item) => item.slug === product.slug)?.quantity || 0) : 0;

  const normalizedProductId = useMemo(() => {
    if (typeof product.id === 'number') return product.id;
    const parsed = Number(product.id);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [product.id]);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:gap-10">
        <div className="overflow-hidden rounded-[30px] border border-[#8e603f]/25 bg-[linear-gradient(180deg,rgba(42,22,16,0.94),rgba(22,10,8,0.98))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="relative aspect-[1/1] overflow-hidden rounded-[24px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,8,6,0.04),rgba(18,8,6,0.35)_100%)]" />
          </div>
        </div>

        <div className="rounded-[30px] border border-[#8e603f]/25 bg-[linear-gradient(180deg,rgba(42,22,16,0.96),rgba(22,10,8,0.99))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:p-8">
          <h2 className="font-heading text-4xl tracking-tight text-[#f8ece2] sm:text-5xl">
            {product.name}
          </h2>

          {product.productWeight && product.weightUnit ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#8e603f]/30 bg-[#1d110d]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3d0a8]">
                {formatWeight(product.productWeight, product.weightUnit)}
              </span>
            </div>
          ) : null}

          <p className="mt-6 text-base leading-8 text-[#dccabb]/78">
            {product.longDescription}
          </p>

          <div className="mt-8 text-4xl font-semibold text-[#f3d0a8]">
            {formatPrice(product.price, product.currency)}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {cartQuantity > 0 ? (
              <div className="inline-flex items-center overflow-hidden rounded-full border border-[#8e603f]/35 bg-[#1b0f0c]/85 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.slug, cartQuantity - 1)}
                  aria-label={`Decrease ${product.name} quantity`}
                  className="inline-flex h-11 w-11 items-center justify-center text-lg text-[#f2decf] transition hover:bg-[#2a1711]"
                >
                  <Minus size={18} />
                </button>
                <div className="inline-flex h-11 min-w-12 items-center justify-center border-x border-[#8e603f]/30 px-4 text-sm font-semibold text-[#f7ede4]">
                  {cartQuantity}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: normalizedProductId,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.imageUrl,
                    })
                  }
                  aria-label={`Increase ${product.name} quantity`}
                  className="inline-flex h-11 w-11 items-center justify-center text-lg text-[#f2decf] transition hover:bg-[#2a1711]"
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  addItem({
                    productId: normalizedProductId,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.imageUrl,
                  })
                }
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d0a27d]/30 bg-gradient-to-r from-[#9b5d37] to-[#c48a63] px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(125,67,32,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(125,67,32,0.5)]"
              >
                Buy
              </button>
            )}
          </div>

          {cartQuantity > 0 ? (
            <p className="mt-4 text-sm text-[#f0dfd3]/72">
              Currently in cart: <span className="font-semibold text-[#f3d0a8]">{cartQuantity}</span>
            </p>
          ) : null}

          <div className="mt-8 grid gap-5 rounded-[24px] border border-[#8e603f]/22 bg-[#1b0f0c]/60 p-5">
            {product.highlights.length ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#c79b6f]">
                  Highlights
                </p>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-[#e9d8ca]">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>• {highlight}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.ingredients.length ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#c79b6f]">
                  Ingredients
                </p>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-[#e9d8ca]">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient}>• {ingredient}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
