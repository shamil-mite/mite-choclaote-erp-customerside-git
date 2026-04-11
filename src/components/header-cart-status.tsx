'use client';

import { useSyncExternalStore } from 'react';
import { useCart } from '@/components/providers/cart-provider';

export function HeaderCartStatus() {
  const { itemCount } = useCart();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const visibleCount = hydrated ? itemCount : 0;
  return <span>{visibleCount} item{visibleCount === 1 ? '' : 's'}</span>;
}
