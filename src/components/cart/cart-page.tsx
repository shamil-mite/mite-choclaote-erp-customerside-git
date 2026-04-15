'use client';

import { useMemo } from 'react';
import { HomeShell } from '@/components/home/home-shell';
import { useCart } from '@/components/providers/cart-provider';
import { CartHeading } from './cart-heading';
import { CartItemCard } from './cart-item-card';
import { CartSummaryCard } from './cart-summary-card';
import { CartEmptyState } from './cart-empty-state';
import { CartSuggestedProducts } from './cart-suggested-products';
import type { CartPageItem, CartSuggestedProduct } from '@/lib/cart-page.types';

type CartPageProps = {
  suggestedProducts?: CartSuggestedProduct[];
};

export function CartPage({ suggestedProducts = [] }: CartPageProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const cartItems = useMemo<CartPageItem[]>(
    () =>
      items.map((item) => ({
        id: item.productId || item.slug,
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        imageUrl: item.image,
        shortDescription: '',
        unitPrice: item.price,
        quantity: item.quantity,
        currency: 'AED',
      })),
    [items]
  );

  const curatedSuggestions = useMemo<CartSuggestedProduct[]>(
    () =>
      suggestedProducts
        .filter((product) => !items.some((item) => item.slug === product.slug))
        .slice(0, 4),
    [items, suggestedProducts]
  );

  const totals = useMemo(() => {
    const vat = subtotal * 0.05;
    const total = subtotal + vat;
    return {
      subtotal,
      discount: 0,
      vat,
      total,
      currency: 'AED',
    };
  }, [subtotal]);

  return (
    <HomeShell>
      <CartHeading itemCount={items.reduce((sum, item) => sum + item.quantity, 0)} />

      <main>
        {cartItems.length === 0 ? (
          <CartEmptyState />
        ) : (
          <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
            <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
              <div>
                <h2 className="font-heading text-4xl text-[#f8ece2]">Cart Items</h2>
                <div className="mt-8 space-y-5">
                  {cartItems.map((item, index) => (
                    <CartItemCard
                      key={String(item.id)}
                      item={item}
                      index={index}
                      onIncrease={(target) => updateQuantity(target.slug, target.quantity + 1)}
                      onDecrease={(target) => updateQuantity(target.slug, target.quantity - 1)}
                      onRemove={(target) => removeItem(target.slug)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <CartSummaryCard totals={totals} />
              </div>
            </div>
          </section>
        )}

        <CartSuggestedProducts products={curatedSuggestions} />
      </main>
    </HomeShell>
  );
}
