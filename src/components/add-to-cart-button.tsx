'use client';

import { useCart } from '@/components/providers/cart-provider';
import type { Product } from '@/data/catalog';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
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
      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
    >
      Add to cart
    </button>
  );
}
