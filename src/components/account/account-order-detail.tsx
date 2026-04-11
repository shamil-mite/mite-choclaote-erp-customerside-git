'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/cart-provider';
import { clearAuthBundle, getStorefrontOrder, readAccessToken, type StorefrontOrder } from '@/lib/storefront-api';

export function AccountOrderDetail({ orderNo }: { orderNo: string }) {
  const router = useRouter();
  const { replaceItems } = useCart();
  const [order, setOrder] = useState<StorefrontOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = readAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    getStorefrontOrder(orderNo, token)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof Error && /401|403|not found/i.test(err.message)) {
          clearAuthBundle();
          router.replace('/login');
          return;
        }
        setError(err instanceof Error ? err.message : 'Could not load order.');
      })
      .finally(() => setLoading(false));
  }, [orderNo, router]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 text-slate-300 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          Loading order detail...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-rose-400/30 bg-rose-500/10 p-8 text-rose-100 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          {error || 'Order not found.'}
        </div>
      </div>
    );
  }

  async function retryPayment() {
    const token = readAccessToken();
    if (!token || !order) return;
    setPaying(true);
    setError('');
    try {
      const session = await fetch(`${process.env.NEXT_PUBLIC_STOREFRONT_API_BASE_URL || 'http://127.0.0.1:8000/api/storefront'}/payments/session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_no: order.order_no }),
      });
      const payload = await session.json().catch(() => ({}));
      if (!session.ok) {
        throw new Error(typeof payload?.detail === 'string' ? payload.detail : 'Could not start payment session.');
      }
      if (payload.payment_url) {
        window.location.href = payload.payment_url;
        return;
      }
      throw new Error(payload.message || 'Card gateway is not configured yet.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment.');
    } finally {
      setPaying(false);
    }
  }

  function reorderItems() {
    if (!order) return;
    const nextItems = order.items
      .filter((item) => item.product_slug)
      .map((item) => ({
        productId: item.product_id,
        slug: item.product_slug,
        name: item.product,
        price: Number(item.unit_price || 0),
        quantity: Math.max(1, Number(item.quantity || 0)),
        image: item.product_image || '/placeholder-product.svg',
      }));
    if (!nextItems.length) {
      setError('This order does not contain reorderable items.');
      return;
    }
    replaceItems(nextItems);
    router.push('/cart');
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-16">
      <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">Order detail</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{order.order_no}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Review the order breakdown, payment state, and the exact items that were sent into ERP.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reorderItems}
              className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/16"
            >
              Reorder Items
            </button>
            {order.mode_of_transaction === 'card' && order.payment_status !== 'paid' ? (
              <button
                type="button"
                onClick={retryPayment}
                disabled={paying}
                className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {paying ? 'Opening payment...' : 'Retry Payment'}
              </button>
            ) : null}
            <Link
              href="/account"
              className="inline-flex rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              Back to account
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Order date</p>
          <p className="mt-4 text-2xl font-semibold text-white">{order.order_date}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">ERP status</p>
          <p className="mt-4 text-2xl font-semibold capitalize text-white">{order.status.replace('_', ' ')}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Payment status</p>
          <p className="mt-4 text-2xl font-semibold capitalize text-white">{order.payment_status.replace('_', ' ')}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Fulfillment</p>
          <p className="mt-4 text-2xl font-semibold capitalize text-white">{order.fulfillment_status.replace('_', ' ')}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Net total</p>
          <p className="mt-4 text-2xl font-semibold text-white">AED {Number(order.net_total || 0).toFixed(2)}</p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <div>
            <h2 className="text-2xl font-semibold text-white">Order summary</h2>
            <p className="mt-2 text-sm text-slate-300">Commercial and payment information stored against this order.</p>
          </div>
          <dl className="space-y-4 text-sm text-slate-300">
            <div className="flex justify-between gap-4"><dt>Customer</dt><dd className="text-right text-white">{order.customer_name}</dd></div>
            <div className="flex justify-between gap-4"><dt>Email</dt><dd className="text-right text-white">{order.customer_email || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Mode</dt><dd className="text-right capitalize text-white">{order.mode_of_transaction.replace('_', ' ')}</dd></div>
            <div className="flex justify-between gap-4"><dt>Payment Provider</dt><dd className="text-right capitalize text-white">{order.payment_provider || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Payment Reference</dt><dd className="text-right text-white">{order.payment_reference || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Fulfillment Status</dt><dd className="text-right capitalize text-white">{order.fulfillment_status || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Courier Partner</dt><dd className="text-right text-white">{order.courier_partner_name || '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Tracking Reference</dt><dd className="text-right text-white">{order.courier_ref || '-'}</dd></div>
            {order.tracking_url ? (
              <div className="flex justify-between gap-4">
                <dt>Tracking Link</dt>
                <dd className="text-right">
                  <a href={order.tracking_url} target="_blank" rel="noreferrer" className="text-amber-200 underline underline-offset-4">
                    Track shipment
                  </a>
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4"><dt>Delivery Notes</dt><dd className="text-right text-white">{order.notes || '-'}</dd></div>
          </dl>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Items</h2>
              <p className="mt-2 text-sm text-slate-300">The exact line items sent to ERP from the storefront checkout.</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">UOM</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`${item.product_code}-${item.product}`} className="border-b border-white/6">
                    <td className="px-4 py-4 text-white">{item.product}</td>
                    <td className="px-4 py-4">{item.product_code || '-'}</td>
                    <td className="px-4 py-4">{item.uom || '-'}</td>
                    <td className="px-4 py-4">{Number(item.quantity || 0).toFixed(3)}</td>
                    <td className="px-4 py-4">AED {Number(item.unit_price || 0).toFixed(2)}</td>
                    <td className="px-4 py-4">AED {Number(item.discount_amount || 0).toFixed(2)}</td>
                    <td className="px-4 py-4 font-semibold text-white">AED {Number(item.amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 text-sm text-slate-300">
            <div className="flex justify-between"><span>Subtotal</span><span>AED {Number(order.subtotal || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>VAT</span><span>AED {Number(order.vat || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Courier Fee</span><span>AED {Number(order.courier_fee || 0).toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-semibold text-white"><span>Net Total</span><span>AED {Number(order.net_total || 0).toFixed(2)}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
