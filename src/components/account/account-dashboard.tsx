'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/components/providers/cart-provider';
import {
  clearAuthBundle,
  readAccessToken,
  storefrontClientRequest,
  type StorefrontAddress,
  type StorefrontOrder,
  type StorefrontProfile,
} from '@/lib/storefront-api';

const EMPTY_ADDRESS = {
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
  is_default: false,
};

export function AccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { replaceItems } = useCart();
  const [profile, setProfile] = useState<StorefrontProfile | null>(null);
  const [orders, setOrders] = useState<StorefrontOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_mobile: '',
    marketing_opt_in: false,
  });
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

  useEffect(() => {
    const token = readAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    async function loadAccount() {
      try {
        const [profileData, orderData] = await Promise.all([
          storefrontClientRequest<StorefrontProfile>('/auth/profile/', {}, token),
          storefrontClientRequest<StorefrontOrder[]>('/orders/', {}, token),
        ]);
        setProfile(profileData);
        setOrders(orderData);
        setProfileForm({
          customer_name: profileData.customer_name || '',
          customer_email: profileData.customer_email || '',
          customer_mobile: profileData.customer_mobile || '',
          marketing_opt_in: Boolean(profileData.marketing_opt_in),
        });
      } catch {
        clearAuthBundle();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  useEffect(() => {
    const payment = searchParams.get('payment');
    const orderNo = searchParams.get('order');
    if (payment === 'success' && orderNo) {
      setSuccess(`Payment completed for order ${orderNo}.`);
      setError('');
    } else if (payment === 'cancelled' && orderNo) {
      setError(`Payment was not completed for order ${orderNo}. You can retry from the order detail page.`);
      setSuccess('');
    }
  }, [searchParams]);

  const totals = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpend = orders.reduce((sum, order) => sum + Number(order.net_total || 0), 0);
    const latestOrder = orders[0]?.order_no || 'No orders yet';
    return { totalOrders, totalSpend, latestOrder };
  }, [orders]);

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSavingProfile(true);
    try {
      const token = readAccessToken();
      const updated = await storefrontClientRequest<StorefrontProfile>(
        '/auth/profile/',
        {
          method: 'PATCH',
          body: JSON.stringify(profileForm),
        },
        token,
      );
      setProfile(updated);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAddressSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSavingAddress(true);
    try {
      const token = readAccessToken();
      const created = await storefrontClientRequest<StorefrontAddress>(
        '/addresses/',
        {
          method: 'POST',
          body: JSON.stringify(addressForm),
        },
        token,
      );
      const refreshed = await storefrontClientRequest<StorefrontProfile>('/auth/profile/', {}, token);
      setProfile(refreshed);
      setAddressForm(EMPTY_ADDRESS);
      setShowAddressForm(false);
      setSuccess(`Address ${created.label} saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address.');
    } finally {
      setSavingAddress(false);
    }
  }

  function handleLogout() {
    clearAuthBundle();
    router.push('/login');
    router.refresh();
  }

  function reorderOrder(order: StorefrontOrder) {
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

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 text-slate-300 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          Loading your account...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
      <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80">Customer account</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Manage profile, addresses, and order history.</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              This area is built for repeat purchase, account retention, and clean self-service order visibility.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
          >
            Logout
          </button>
        </div>
      </section>

      {error ? <div className="mt-6 rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      {success ? <div className="mt-6 rounded-[18px] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</div> : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Orders</p>
          <p className="mt-4 text-4xl font-semibold text-white">{totals.totalOrders}</p>
          <p className="mt-2 text-sm text-slate-300">Completed and active website orders.</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Total spend</p>
          <p className="mt-4 text-4xl font-semibold text-white">AED {totals.totalSpend.toFixed(2)}</p>
          <p className="mt-2 text-sm text-slate-300">Value across all recorded website orders.</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Latest order</p>
          <p className="mt-4 text-3xl font-semibold text-white">{totals.latestOrder}</p>
          <p className="mt-2 text-sm text-slate-300">Latest ERP-linked sales order reference.</p>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <div>
            <h2 className="text-2xl font-semibold text-white">Profile</h2>
            <p className="mt-2 text-sm text-slate-300">Keep your contact record accurate so checkout and order communication stay clean.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <input
              value={profileForm.customer_name}
              onChange={(event) => setProfileForm((current) => ({ ...current, customer_name: event.target.value }))}
              className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none"
              placeholder="Full name"
              required
            />
            <input
              value={profileForm.customer_email}
              onChange={(event) => setProfileForm((current) => ({ ...current, customer_email: event.target.value }))}
              className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none"
              placeholder="Email"
              type="email"
              required
            />
            <input
              value={profileForm.customer_mobile}
              onChange={(event) => setProfileForm((current) => ({ ...current, customer_mobile: event.target.value }))}
              className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none"
              placeholder="Mobile"
              required
            />
            <label className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={profileForm.marketing_opt_in}
                onChange={(event) => setProfileForm((current) => ({ ...current, marketing_opt_in: event.target.checked }))}
              />
              Receive launch updates, product drops, and gifting campaigns
            </label>
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingProfile ? 'Saving profile...' : 'Save profile'}
            </button>
          </form>
        </section>

        <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Addresses</h2>
              <p className="mt-2 text-sm text-slate-300">Store delivery destinations for faster repeat checkout.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddressForm((current) => !current)}
              className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              {showAddressForm ? 'Close' : 'Add address'}
            </button>
          </div>

          <div className="space-y-3">
            {profile?.addresses.length ? (
              profile.addresses.map((address) => (
                <div key={address.id} className="rounded-[20px] border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <strong className="text-white">{address.label}</strong>
                    {address.is_default ? <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Default</span> : null}
                  </div>
                  <p className="mt-2">{address.contact_name} | {address.phone}</p>
                  <p className="mt-1">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ''}</p>
                  <p className="mt-1">{address.city ? `${address.city}, ` : ''}{address.emirate}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-white/15 px-4 py-6 text-sm text-slate-400">
                No saved addresses yet.
              </div>
            )}
          </div>

          {showAddressForm ? (
            <form onSubmit={handleAddressSave} className="grid gap-4 md:grid-cols-2">
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
                  onChange={(event) => setAddressForm((current) => ({ ...current, [field]: event.target.value }))}
                  className="rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none"
                  placeholder={label}
                  required={['contact_name', 'phone', 'emirate', 'address_line_1'].includes(field)}
                />
              ))}
              <textarea
                value={addressForm.delivery_notes}
                onChange={(event) => setAddressForm((current) => ({ ...current, delivery_notes: event.target.value }))}
                className="min-h-28 rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none md:col-span-2"
                placeholder="Delivery notes"
              />
              <label className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200 md:col-span-2">
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(event) => setAddressForm((current) => ({ ...current, is_default: event.target.checked }))}
                />
                Save as default delivery address
              </label>
              <button
                type="submit"
                disabled={savingAddress}
                className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
              >
                {savingAddress ? 'Saving address...' : 'Save address'}
              </button>
            </form>
          ) : null}
        </section>
      </div>

      <section className="mt-8 rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
        <div>
          <h2 className="text-2xl font-semibold text-white">Order history</h2>
          <p className="mt-2 text-sm text-slate-300">Orders placed through the website flow into ERP sales orders and remain visible here for repeat purchase tracking.</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-sm text-slate-200">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Mode</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Fulfillment</th>
                <th className="px-4 py-2 text-right">Net Total</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="rounded-[18px] bg-slate-950/60">
                    <td className="rounded-l-[18px] px-4 py-4 font-semibold text-white">
                      <Link href={`/account/orders/${order.order_no}`} className="transition hover:text-amber-200">
                        {order.order_no}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{order.order_date}</td>
                    <td className="px-4 py-4 capitalize">{order.mode_of_transaction.replace('_', ' ')}</td>
                    <td className="px-4 py-4 capitalize">{order.status}</td>
                    <td className="px-4 py-4 capitalize">{order.payment_status.replace('_', ' ')}</td>
                    <td className="px-4 py-4 capitalize">{order.fulfillment_status.replace('_', ' ')}</td>
                    <td className="px-4 py-4 text-right font-semibold text-white">AED {Number(order.net_total || 0).toFixed(2)}</td>
                    <td className="rounded-r-[18px] px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => reorderOrder(order)}
                          className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 transition hover:bg-amber-300/16"
                        >
                          Reorder
                        </button>
                        <Link
                          href={`/account/orders/${order.order_no}`}
                          className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/12"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                    No website orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
