'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/cart-provider';
import { clearAuthBundle, readAccessToken, storefrontClientRequest, type StorefrontAuthBundle } from '@/lib/storefront-api';

type Address = StorefrontAuthBundle['profile']['addresses'][number];

type Profile = StorefrontAuthBundle['profile'];

type CheckoutOrder = {
  id: number;
  order_no: string;
  net_total: number;
  payment_status: string;
};

type PaymentSessionResponse = {
  provider: string;
  payment_url: string;
  payment_reference: string;
  status: string;
  message?: string;
};

type PromoValidationResult = {
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  min_order_amount: number;
};

const MODE_OPTIONS = [
  { value: 'card', label: 'Card / Online Payment' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'credit', label: 'Credit' },
];

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState<CheckoutOrder | null>(null);
  const [mode, setMode] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<PromoValidationResult | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    contact_name: '',
    phone: '',
    email: '',
    emirate: 'Dubai',
    city: '',
    postal_code: '',
    address_line_1: '',
    address_line_2: '',
    delivery_notes: '',
    is_default: true,
  });

  useEffect(() => {
    const token = readAccessToken();
    if (!token) return;
    storefrontClientRequest<Profile>('/auth/profile/', {}, token)
      .then((data) => {
        setProfile(data);
        const defaultAddress = data.addresses.find((address) => address.is_default) || data.addresses[0];
        setSelectedAddressId(defaultAddress?.id || null);
        setAddressForm((current) => ({
          ...current,
          contact_name: data.customer_name || current.contact_name,
          phone: data.customer_mobile || current.phone,
          email: data.customer_email || current.email,
        }));
      })
      .catch(() => {
        clearAuthBundle();
        setProfile(null);
      });
  }, []);

  const discountAmount = useMemo(() => Number((promoResult?.discount_amount || 0).toFixed(2)), [promoResult]);
  const taxableSubtotal = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);
  const vat = useMemo(() => Number((taxableSubtotal * 0.05).toFixed(2)), [taxableSubtotal]);
  const total = useMemo(() => Number((taxableSubtotal + vat).toFixed(2)), [taxableSubtotal, vat]);

  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const token = readAccessToken();
      const address = await storefrontClientRequest<Address>('/addresses/', {
        method: 'POST',
        body: JSON.stringify(addressForm),
      }, token);
      const refreshed = await storefrontClientRequest<Profile>('/auth/profile/', {}, token);
      setProfile(refreshed);
      setSelectedAddressId(address.id);
      setAddingAddress(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address.');
    }
  }

  async function applyPromo() {
    if (!promoCode.trim()) {
      setPromoResult(null);
      return;
    }
    setError('');
    setValidatingPromo(true);
    try {
      const token = readAccessToken();
      const result = await storefrontClientRequest<PromoValidationResult>(
        '/promos/validate/',
        {
          method: 'POST',
          body: JSON.stringify({
            promo_code: promoCode.trim(),
            subtotal: subtotal.toFixed(2),
          }),
        },
        token,
      );
      setPromoResult(result);
    } catch (err) {
      setPromoResult(null);
      setError(err instanceof Error ? err.message : 'Could not apply promo code.');
    } finally {
      setValidatingPromo(false);
    }
  }

  async function placeOrder() {
    setError('');
    setSuccessOrder(null);
    if (!profile) {
      setError('Login is required before checkout.');
      return;
    }
    if (!selectedAddressId) {
      setError('Select or create a delivery address.');
      return;
    }
    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }
    setPlacingOrder(true);
    try {
      const token = readAccessToken();
      const resolvedItems = await Promise.all(
        items.map(async (item) => {
          if (item.productId) {
            return { product_id: item.productId, quantity: item.quantity };
          }
          const product = await storefrontClientRequest<{ id: number }>(`/products/${item.slug}/`);
          return { product_id: product.id, quantity: item.quantity };
        })
      );
      const payload = {
        address_id: selectedAddressId,
        mode_of_transaction: mode,
        promo_code: promoResult?.code || promoCode.trim(),
        items: resolvedItems,
      };
      const order = await storefrontClientRequest<CheckoutOrder>('/checkout/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token);
      if (mode === 'card') {
        const session = await storefrontClientRequest<PaymentSessionResponse>(
          '/payments/session/',
          {
            method: 'POST',
            body: JSON.stringify({ order_no: order.order_no }),
          },
          token,
        );
        clearCart();
        if (session.payment_url) {
          window.location.href = session.payment_url;
          return;
        }
        setSuccessOrder(order);
      } else {
        clearCart();
        setSuccessOrder(order);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (!readAccessToken()) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <h1 className="text-4xl font-semibold text-white">Checkout</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">Login or register before checkout so the order connects to your customer record, saved addresses, and future order history.</p>
        <div className="mt-8 flex gap-4">
          <Link href="/login" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">Log in</Link>
          <Link href="/register" className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {successOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] border border-emerald-400/25 bg-slate-950 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Order Confirmed</div>
            <h2 className="mt-4 text-4xl font-semibold text-white">Order placed successfully</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Your order has been created successfully and pushed into our ERP workflow for fulfillment.
            </p>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-6">
              <div className="text-sm uppercase tracking-[0.25em] text-slate-400">Reference No</div>
              <div className="mt-2 text-3xl font-semibold text-white">{successOrder.order_no}</div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
              >
                Continue shopping
              </button>
              <button
                type="button"
                onClick={() => router.push('/account')}
                className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white"
              >
                View my account
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div>
          <h1 className="text-4xl font-semibold text-white">Checkout</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">Place a real website order that lands in ERP `Sales Orders` for internal fulfillment.</p>
        </div>

        {error ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Delivery address</p>
              <p className="mt-2 text-lg font-semibold text-white">{profile?.customer_name}</p>
            </div>
            <button type="button" onClick={() => setAddingAddress((current) => !current)} className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white">
              {addingAddress ? 'Close' : 'Add address'}
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {profile?.addresses.map((address) => (
              <label key={address.id} className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 text-sm text-slate-200">
                <input type="radio" name="address" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} className="mt-1" />
                <span>
                  <strong className="block text-white">{address.label}</strong>
                  {address.contact_name} | {address.phone}
                  <br />
                  {address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ''}, {address.emirate}
                </span>
              </label>
            ))}
          </div>
          {addingAddress ? (
            <form onSubmit={saveAddress} className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ['label', 'Label'],
                ['contact_name', 'Contact name'],
                ['phone', 'Phone'],
                ['email', 'Email'],
                ['emirate', 'Emirate'],
                ['city', 'City'],
                ['postal_code', 'Postal code'],
                ['address_line_1', 'Address line 1'],
                ['address_line_2', 'Address line 2'],
              ].map(([field, label]) => (
                <input
                  key={field}
                  value={(addressForm as Record<string, string | boolean>)[field] as string}
                  onChange={(e) => setAddressForm((current) => ({ ...current, [field]: e.target.value }))}
                  className="rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none"
                  placeholder={label}
                  required={['contact_name', 'phone', 'emirate', 'address_line_1'].includes(field)}
                />
              ))}
              <textarea value={addressForm.delivery_notes} onChange={(e) => setAddressForm((current) => ({ ...current, delivery_notes: e.target.value }))} className="md:col-span-2 min-h-28 rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Delivery notes" />
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 md:col-span-2">Save address</button>
            </form>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Mode of transaction</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {MODE_OPTIONS.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200">
                <input type="radio" name="mode" checked={mode === option.value} onChange={() => setMode(option.value)} />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Promo code</p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="flex-1 rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none"
            />
            <button
              type="button"
              onClick={applyPromo}
              disabled={validatingPromo || subtotal <= 0}
              className="rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {validatingPromo ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {promoResult ? (
            <div className="mt-4 rounded-[18px] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <strong>{promoResult.code}</strong> applied. Discount AED {promoResult.discount_amount.toFixed(2)}
              {promoResult.description ? ` - ${promoResult.description}` : ''}
            </div>
          ) : null}
        </div>
        </section>

        <aside className="space-y-6 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <h2 className="text-2xl font-semibold text-white">Order summary</h2>
        <div className="space-y-4 text-sm text-slate-300">
          {items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-slate-950/60 px-4 py-4">
              <div>
                <div className="font-semibold text-white">{item.name}</div>
                <div>Qty {item.quantity}</div>
              </div>
              <div className="font-semibold text-white">AED {(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-white/10 pt-4 text-sm text-slate-300">
          <div className="flex justify-between"><span>Subtotal</span><span>AED {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>- AED {discountAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>VAT</span><span>AED {vat.toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-semibold text-white"><span>Total</span><span>AED {total.toFixed(2)}</span></div>
        </div>
        <button onClick={placeOrder} disabled={placingOrder || !items.length} className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70">
          {placingOrder ? 'Placing order...' : 'Place order'}
        </button>
        </aside>
      </div>
    </>
  );
}
