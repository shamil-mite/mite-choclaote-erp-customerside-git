'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { siteConfig } from '@/data/catalog';
import { CartIcon } from '@/components/site-icons';
import { HeaderCartStatus } from '@/components/header-cart-status';
import { isAuthenticatedStorefrontUser } from '@/lib/storefront-api';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const accountHref = hydrated && isAuthenticatedStorefrontUser() ? '/account' : '/login';

  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/8 bg-[linear-gradient(180deg,rgba(12,7,5,0.7),rgba(12,7,5,0.18)_75%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(145deg,rgba(201,169,166,0.9),rgba(107,67,45,0.95))] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#d6b396]">
              Heart Of Chocolate
            </span>
            <span className="font-heading text-[2rem] leading-none text-[#f7ede4]">
              Crafted for gifting
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[#efe1d8] transition hover:text-[#d3a170]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#efe1d8] transition hover:text-[#d3a170]"
          >
            Account
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-right lg:block">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b396]">
              Customer Care
            </div>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-[#efe1d8] transition hover:text-[#d3a170]"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[rgba(39,21,15,0.72)] px-4 py-2.5 text-sm font-semibold text-[#f7ede4] shadow-[0_14px_28px_rgba(0,0,0,0.22)] transition hover:border-[#d3a170] hover:bg-[rgba(56,30,21,0.85)]"
          >
            <CartIcon className="h-4 w-4" />
            <HeaderCartStatus />
          </Link>
        </div>
      </div>
    </header>
  );
}
