import { buildMetadata } from '@/lib/seo';
import { AccountOrderDetail } from '@/components/account/account-order-detail';

export const metadata = buildMetadata({
  title: 'Order Detail',
  description: 'Review item-level order details, payment state, and fulfillment progress for your Heart of Chocolate order.',
  path: '/account/orders',
});

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  return <AccountOrderDetail orderNo={orderNo} />;
}
