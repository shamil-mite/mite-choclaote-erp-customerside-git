import { Suspense } from 'react';
import { AccountDashboard } from '@/components/account/account-dashboard';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Customer Account',
  description: 'Manage your profile, delivery addresses, and website order history with Heart of Chocolate.',
  path: '/account',
});

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 text-slate-300 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            Loading your account...
          </div>
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  );
}
