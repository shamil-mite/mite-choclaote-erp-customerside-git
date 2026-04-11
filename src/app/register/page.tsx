import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = buildMetadata({
  title: 'Create Account | Heart of Chocolate',
  description: 'Customer registration for ordering, account history, saved addresses, and future loyalty features.',
  path: '/register',
});

export default function RegisterPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-16">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(245,158,11,0.18),rgba(15,23,42,0.84))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/80">Customer registration</p>
        <h1 className="mt-4 text-4xl font-semibold text-white lg:text-5xl">Create an account built for repeat purchase.</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">Registration connects to Django customer records, saved addresses, order history, and future price mapping rules for retail or B2B customers.</p>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] lg:p-12">
        <RegisterForm />
        <div className="mt-6 text-sm text-slate-400">
          Already registered? <Link href="/login" className="text-white underline underline-offset-4">Log in</Link>
        </div>
      </div>
    </div>
  );
}
