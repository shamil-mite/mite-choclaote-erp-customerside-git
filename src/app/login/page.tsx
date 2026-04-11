import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = buildMetadata({
  title: 'Customer Login | Heart of Chocolate',
  description: 'Login page for returning customers to reorder, track orders, and manage their account.',
  path: '/login',
});

function AuthShell({
  title,
  description,
  footer,
}: {
  title: string;
  description: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-16">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(56,189,248,0.18),rgba(15,23,42,0.84))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-100/80">Customer account</p>
        <h1 className="mt-4 text-4xl font-semibold text-white lg:text-5xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">{description}</p>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] lg:p-12">
        <LoginForm />
        <div className="mt-6 text-sm text-slate-400">{footer}</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in to reorder faster."
      description="Returning customers should be able to re-buy, track orders, manage addresses, and access customer-specific pricing without touching the ERP interface."
      footer={<Link href="/register" className="text-white underline underline-offset-4">Create a new account</Link>}
    />
  );
}
