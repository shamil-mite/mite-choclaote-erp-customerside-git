import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CheckoutClient } from '@/components/checkout/checkout-client';

export const metadata: Metadata = buildMetadata({
  title: 'Checkout | Heart of Chocolate',
  description: 'Checkout connected to customer addresses, sales order creation, and ERP-backed order processing.',
  path: '/checkout',
});

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-16">
      <CheckoutClient />
    </div>
  );
}
