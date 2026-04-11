'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const accountHref = hydrated && isAuthenticatedStorefrontUser() ? '/account' : '/login';
  const isHome = pathname === '/';

  return (
    <header
      className={
        isHome
          ? 'absolute inset-x-0 top-0 z-40 border-b border-white/8 bg-[linear-gradient(180deg,rgba(12,7,5,0.7),rgba(12,7,5,0.18)_75%,transparent)] backdrop-blur-md'
          : 'sticky top-0 z-40 border-b border-[#e2cfcc] bg-[rgba(248,243,241,0.92)] backdrop-blur-xl'
      }
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-4">
          <div
            className={
              isHome
                ? 'flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(145deg,rgba(201,169,166,0.9),rgba(107,67,45,0.95))] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.35)]'
                : 'flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#c9a9a6,#8b6f6b)] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(139,111,107,0.28)]'
            }
          >
            H
          </div>
          <div className="flex flex-col">
            <span className={isHome ? 'text-[11px] font-semibold uppercase tracking-[0.42em] text-[#d6b396]' : 'text-[11px] font-semibold uppercase tracking-[0.42em] text-[#8b6f6b]'}>
              Heart Of Chocolate
            </span>
            <span className={isHome ? 'font-heading text-[2rem] leading-none text-[#f7ede4]' : 'font-heading text-[2rem] leading-none text-[#4a3a36]'}>
              Crafted for gifting
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isHome
                  ? 'text-sm font-semibold uppercase tracking-[0.18em] text-[#efe1d8] transition hover:text-[#d3a170]'
                  : 'text-sm font-semibold uppercase tracking-[0.18em] text-[#5f5553] transition hover:text-[#8b6f6b]'
              }
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className={
              isHome
                ? 'text-sm font-semibold uppercase tracking-[0.18em] text-[#efe1d8] transition hover:text-[#d3a170]'
                : 'text-sm font-semibold uppercase tracking-[0.18em] text-[#5f5553] transition hover:text-[#8b6f6b]'
            }
          >
            Account
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-right lg:block">
            <div className={isHome ? 'text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b396]' : 'text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b6f6b]'}>
              Customer Care
            </div>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className={
                isHome
                  ? 'text-sm text-[#efe1d8] transition hover:text-[#d3a170]'
                  : 'text-sm text-[#5f5553] transition hover:text-[#8b6f6b]'
              }
            >
              {siteConfig.contactEmail}
            </a>
          </div>
          <Link
            href="/cart"
            className={
              isHome
                ? 'inline-flex items-center gap-2 rounded-full border border-white/15 bg-[rgba(39,21,15,0.72)] px-4 py-2.5 text-sm font-semibold text-[#f7ede4] shadow-[0_14px_28px_rgba(0,0,0,0.22)] transition hover:border-[#d3a170] hover:bg-[rgba(56,30,21,0.85)]'
                : 'inline-flex items-center gap-2 rounded-full border border-[#d9c5c2] bg-white px-4 py-2.5 text-sm font-semibold text-[#4a3a36] shadow-[0_14px_28px_rgba(201,169,166,0.16)] transition hover:border-[#c9a9a6] hover:bg-[#fff9f7]'
            }
          >
            <CartIcon className="h-4 w-4" />
            <HeaderCartStatus />
          </Link>
        </div>
      </div>
    </header>
  );
}
