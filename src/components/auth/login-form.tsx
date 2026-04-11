'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { persistAuthBundle, storefrontClientRequest, type StorefrontAuthBundle } from '@/lib/storefront-api';
import { SocialLoginButtons } from '@/components/auth/social-login-buttons';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const bundle = await storefrontClientRequest<StorefrontAuthBundle>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      persistAuthBundle(bundle);
      router.push('/checkout');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Email" type="email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Password" type="password" required />
      {error ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      <button disabled={submitting} className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? 'Signing in...' : 'Continue'}
      </button>
      <SocialLoginButtons />
    </form>
  );
}
