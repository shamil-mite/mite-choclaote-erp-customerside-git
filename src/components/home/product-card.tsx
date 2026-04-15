'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import type { HomeProduct } from '@/lib/homepage.types';
import { useCart } from '@/components/providers/cart-provider';

type ProductCardProps = {
  product: HomeProduct;
  index?: number;
};

function formatPrice(value: number, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const cartItem = hydrated ? items.find((item) => item.slug === product.slug) : undefined;
  const quantity = cartItem?.quantity || 0;
  const normalizedProductId =
    typeof product.id === 'number'
      ? product.id
      : Number.isFinite(Number(product.id))
        ? Number(product.id)
        : undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group overflow-hidden rounded-[26px] border border-[#8e603f]/25 bg-[linear-gradient(180deg,rgba(42,22,16,0.95),rgba(22,10,8,0.98))] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-2 hover:border-[#d2a179]/45 hover:shadow-[0_26px_60px_rgba(0,0,0,0.42)]"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[1.04/0.92] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,8,6,0.04),rgba(18,8,6,0.65)_100%)]" />
        </div>
      </Link>

      <div className="space-y-5 px-5 pb-6 pt-5 sm:px-6">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-2xl text-[#f8ece2] transition group-hover:text-[#ffd9b7]">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription ? (
            <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#dccabb]/72">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-semibold tracking-wide text-[#f3d0a8]">
            {formatPrice(product.price, product.currency)}
          </p>

          {quantity > 0 ? (
            <div className="inline-flex min-h-11 items-center rounded-full border border-[#d1a37d]/25 bg-[rgba(31,14,10,0.88)] px-2 shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
              <div className="inline-flex items-center rounded-full border border-[#d1a37d]/25 bg-[rgba(50,21,14,0.9)] px-1">
                <button
                  type="button"
                  aria-label={`Decrease ${product.name} quantity`}
                  onClick={() => updateQuantity(product.slug, quantity - 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f3d0a8] transition hover:bg-[rgba(210,161,121,0.12)] hover:text-white"
                >
                  <Minus size={15} />
                </button>
                <span className="min-w-8 text-center text-sm font-semibold text-[#f8ece2]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${product.name} quantity`}
                  onClick={() =>
                    addItem({
                      productId: normalizedProductId,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.imageUrl,
                    })
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f3d0a8] transition hover:bg-[rgba(210,161,121,0.12)] hover:text-white"
                >
                  <Plus size={15} />
                </button>
              </div>
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
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d1a37d]/20 bg-gradient-to-r from-[#8e5434] to-[#c2815a] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
