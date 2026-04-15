'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CartPageItem } from '@/lib/cart-page.types';
import { CartQuantityControl } from './cart-quantity-control';

type CartItemCardProps = {
  item: CartPageItem;
  index?: number;
  onIncrease?: (item: CartPageItem) => void;
  onDecrease?: (item: CartPageItem) => void;
  onRemove?: (item: CartPageItem) => void;
};

function formatPrice(value: number, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CartItemCard({
  item,
  index = 0,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group overflow-hidden rounded-[28px] border border-[#8e603f]/25 bg-[linear-gradient(180deg,rgba(42,22,16,0.94),rgba(22,10,8,0.98))] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition duration-500 hover:border-[#d2a179]/35 hover:shadow-[0_24px_54px_rgba(0,0,0,0.4)]"
    >
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-center lg:gap-6 lg:p-6">
        <Link href={`/product/${item.slug}`} className="relative block overflow-hidden rounded-[20px]">
          <div className="relative aspect-[1.08/0.85] overflow-hidden rounded-[20px]">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              unoptimized
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 180px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,8,6,0.02),rgba(18,8,6,0.35)_100%)]" />
          </div>
        </Link>

        <div className="min-w-0">
          <Link href={`/product/${item.slug}`}>
            <h2 className="font-heading text-2xl text-[#f8ece2] transition group-hover:text-[#ffd9b7]">
              {item.name}
            </h2>
          </Link>
          {item.shortDescription ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#dccabb]/72 sm:text-base">
              {item.shortDescription}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#e9d8ca]">
            <span className="rounded-full border border-[#8e603f]/25 bg-[#1d110d]/60 px-4 py-2">
              Unit Price: <span className="font-semibold text-[#f3d0a8]">{formatPrice(item.unitPrice, item.currency)}</span>
            </span>
            <span className="rounded-full border border-[#8e603f]/25 bg-[#1d110d]/60 px-4 py-2">
              Total: <span className="font-semibold text-[#f3d0a8]">{formatPrice(lineTotal, item.currency)}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <CartQuantityControl
            quantity={item.quantity}
            onDecrease={onDecrease ? () => onDecrease(item) : undefined}
            onIncrease={onIncrease ? () => onIncrease(item) : undefined}
          />

          <button
            type="button"
            onClick={onRemove ? () => onRemove(item) : undefined}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d1a37d]/20 bg-transparent px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3d0a8] transition duration-300 hover:border-[#d1a37d]/40 hover:bg-[#24120e]"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  );
}
