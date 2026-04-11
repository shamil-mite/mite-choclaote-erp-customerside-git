'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readAccessToken, storefrontClientRequest } from '@/lib/storefront-api';

type CartItem = {
  productId?: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  replaceItems: (items: CartItem[]) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'hoc-ecommerce-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const token = readAccessToken();
    if (!token) return;
    const handle = window.setTimeout(() => {
      storefrontClientRequest(
        '/cart/sync/',
        {
          method: 'POST',
          body: JSON.stringify({
            items,
            subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
          }),
        },
        token,
      ).catch(() => {});
    }, 500);
    return () => window.clearTimeout(handle);
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem: (item) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.slug === item.slug);
        if (existing) {
          return current.map((entry) =>
            entry.slug === item.slug ? { ...entry, quantity: entry.quantity + 1 } : entry
          );
        }
        return [...current, { ...item, quantity: 1 }];
      });
    },
    replaceItems: (nextItems) => {
      setItems(
        nextItems
          .filter((entry) => entry.slug && entry.quantity > 0)
          .map((entry) => ({
            ...entry,
            quantity: Math.max(1, entry.quantity),
          }))
      );
    },
    updateQuantity: (slug, quantity) => {
      setItems((current) =>
        current
          .map((entry) => (entry.slug === slug ? { ...entry, quantity: Math.max(1, quantity) } : entry))
          .filter((entry) => entry.quantity > 0)
      );
    },
    removeItem: (slug) => {
      setItems((current) => current.filter((entry) => entry.slug !== slug));
    },
    clearCart: () => setItems([]),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
