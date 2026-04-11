'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { persistAuthBundle, storefrontClientRequest, type StorefrontAuthBundle } from '@/lib/storefront-api';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
    FB?: {
      init: (config: Record<string, unknown>) => void;
      login: (
        callback: (response: { authResponse?: { accessToken: string } }) => void,
        options?: Record<string, unknown>,
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(script);
  });
}

export function SocialLoginButtons({ redirectTo = '/checkout' }: { redirectTo?: string }) {
  const router = useRouter();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function completeLogin(path: string, payload: Record<string, unknown>) {
    setSubmitting(true);
    setError('');
    try {
      const bundle = await storefrontClientRequest<StorefrontAuthBundle>(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      persistAuthBundle(bundle);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) return;
    loadScript('https://accounts.google.com/gsi/client', 'google-gsi-client')
      .then(() => {
        if (!window.google || !googleButtonRef.current) return;
        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: { credential?: string }) => {
            if (!response.credential) {
              setError('Google login did not return a valid credential.');
              return;
            }
            completeLogin('/auth/social/google/', { credential: response.credential });
          },
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 360,
          text: 'continue_with',
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load Google login.'));
  }, []);

  useEffect(() => {
    if (!FACEBOOK_APP_ID) return;
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v22.0',
      });
    };
    loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk').catch((err) =>
      setError(err instanceof Error ? err.message : 'Could not load Facebook login.'),
    );
  }, []);

  function handleFacebookLogin() {
    if (!FACEBOOK_APP_ID || !window.FB) {
      setError('Facebook login is not configured yet.');
      return;
    }
    setSubmitting(true);
    setError('');
    window.FB.login(
      (response) => {
        if (!response.authResponse?.accessToken) {
          setSubmitting(false);
          setError('Facebook login was cancelled or did not return a valid token.');
          return;
        }
        completeLogin('/auth/social/facebook/', {
          access_token: response.authResponse.accessToken,
        });
      },
      { scope: 'public_profile,email' },
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative py-1 text-center">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        <span className="relative inline-block bg-[rgb(17,24,39)] px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          Or continue with
        </span>
      </div>
      <div className="space-y-3">
        {GOOGLE_CLIENT_ID ? <div ref={googleButtonRef} className="flex justify-center" /> : null}
        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={submitting || !FACEBOOK_APP_ID}
          className="w-full rounded-full border border-white/15 bg-[#1877f2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1669d2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue with Facebook
        </button>
      </div>
      {(!GOOGLE_CLIENT_ID || !FACEBOOK_APP_ID) ? (
        <p className="text-xs leading-6 text-slate-400">
          Social login requires `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_FACEBOOK_APP_ID` in the ecommerce frontend, and matching backend provider settings.
        </p>
      ) : null}
      {error ? <div className="rounded-[18px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
    </div>
  );
}
