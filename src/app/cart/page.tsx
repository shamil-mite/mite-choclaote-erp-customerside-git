'use client';

import Link from 'next/link';
import { useCart } from '@/components/providers/cart-provider';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <h1 className="text-4xl font-semibold text-white">Cart</h1>
          <p className="mt-3 text-base text-slate-300">Review your selected products before checkout. Website orders route into ERP sales orders for fulfillment and stock control.</p>
          <div className="mt-8 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/15 p-8 text-slate-400">Your cart is empty.</div>
            ) : (
              items.map((item) => (
                <div key={item.slug} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-slate-950/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">AED {item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.slug, Number(event.target.value))}
                      className="w-20 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-center text-white outline-none"
                    />
                    <button type="button" onClick={() => removeItem(item.slug)} className="rounded-full border border-red-400/30 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-400/10">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <aside className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <h2 className="text-2xl font-semibold text-white">Order summary</h2>
          <div className="mt-8 flex items-center justify-between text-base text-slate-300">
            <span>Subtotal</span>
            <span className="font-semibold text-white">AED {subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">VAT is estimated in checkout and final fulfillment stays connected to ERP order processing and customer history.</p>
          <Link href="/checkout" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">
            Continue to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
