'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { persistAuthBundle, storefrontClientRequest, type StorefrontAuthBundle } from '@/lib/storefront-api';
import { SocialLoginButtons } from '@/components/auth/social-login-buttons';

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const bundle = await storefrontClientRequest<StorefrontAuthBundle>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          email,
          mobile,
          password,
          confirm_password: confirmPassword,
        }),
      });
      persistAuthBundle(bundle);
      router.push('/checkout');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Full name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Email" type="email" required />
      <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Mobile" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Password" type="password" required />
      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-[18px] border border-white/12 bg-white/8 px-4 py-3 text-white outline-none" placeholder="Confirm password" type="password" required />
      {error ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      <button disabled={submitting} className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? 'Creating account...' : 'Create account'}
      </button>
      <SocialLoginButtons />
    </form>
  );
}
