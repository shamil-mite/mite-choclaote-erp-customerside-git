import Link from 'next/link';
import type { CartPageTotals } from '@/lib/cart-page.types';

type CartSummaryCardProps = {
  totals: CartPageTotals;
};

function formatPrice(value: number, currency = 'AED') {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CartSummaryCard({ totals }: CartSummaryCardProps) {
  const currency = totals.currency ?? 'AED';

  return (
    <aside className="rounded-[30px] border border-[#8e603f]/25 bg-[linear-gradient(180deg,rgba(42,22,16,0.96),rgba(22,10,8,0.99))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:sticky lg:top-28 lg:p-7">
      <h2 className="font-heading text-3xl text-[#f8ece2]">Order Summary</h2>

      <div className="mt-8 space-y-4 text-base text-[#e9d8ca]">
        <div className="flex items-center justify-between gap-4">
          <span>Subtotal</span>
          <span className="font-medium text-[#f8ece2]">{formatPrice(totals.subtotal, currency)}</span>
        </div>

        {totals.discount ? (
          <div className="flex items-center justify-between gap-4">
            <span>Discount</span>
            <span className="font-medium text-[#f3d0a8]">- {formatPrice(totals.discount, currency)}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <span>VAT</span>
          <span className="font-medium text-[#f8ece2]">{formatPrice(totals.vat, currency)}</span>
        </div>
      </div>

      <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-[#8e603f]/50 to-transparent" />

      <div className="flex items-center justify-between gap-4">
        <span className="font-heading text-3xl text-[#f8ece2]">Total</span>
        <span className="font-heading text-4xl text-[#f3d0a8]">{formatPrice(totals.total, currency)}</span>
      </div>

      <div className="mt-8 space-y-4">
        <Link
          href="/checkout"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#d0a27d]/30 bg-gradient-to-r from-[#9b5d37] to-[#c48a63] px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(125,67,32,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(125,67,32,0.5)]"
        >
          Proceed to Checkout
        </Link>

        <Link
          href="/catalog"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#d1a37d]/20 bg-transparent px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3d0a8] transition duration-300 hover:border-[#d1a37d]/40 hover:bg-[#24120e]"
        >
          Continue Shopping
        </Link>
      </div>
    </aside>
  );
}
