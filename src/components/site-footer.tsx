'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/catalog';

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) {
    return (
      <footer className="border-t border-[#3b2318] bg-[linear-gradient(180deg,#170b08_0%,#110705_100%)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-16 text-sm text-[#d8c4b3] lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#d3a170]">Heart Of Chocolate</p>
            <h2 className="mt-4 max-w-lg font-heading text-5xl text-[#f7ede4]">Premium chocolate made for beautiful online ordering.</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#ccb7a7]">{siteConfig.description}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f3e7dc]">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="transition hover:text-[#d3a170]">Home</Link></li>
              <li><Link href="/catalog" className="transition hover:text-[#d3a170]">All Products</Link></li>
              <li><Link href="/blog" className="transition hover:text-[#d3a170]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f3e7dc]">Brand</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="transition hover:text-[#d3a170]">About Us</Link></li>
              <li><Link href="/contact" className="transition hover:text-[#d3a170]">Contact</Link></li>
              <li><Link href="/account" className="transition hover:text-[#d3a170]">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f3e7dc]">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>{siteConfig.address}</li>
              <li><a href={`tel:${siteConfig.phone}`} className="transition hover:text-[#d3a170]">{siteConfig.phone}</a></li>
              <li><a href={`mailto:${siteConfig.contactEmail}`} className="transition hover:text-[#d3a170]">{siteConfig.contactEmail}</a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#dfccca] bg-[linear-gradient(180deg,#f1e7e4_0%,#ecdfdb_100%)]">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-16 text-sm text-[#5d5350] lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#8b6f6b]">Heart Of Chocolate</p>
          <h2 className="mt-4 max-w-lg font-heading text-5xl text-[#4a3a36]">Premium chocolate made for beautiful online ordering.</h2>
          <p className="mt-4 max-w-xl leading-7 text-[#675d5a]">{siteConfig.description}</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#4a3a36]">Shop</h3>
          <ul className="mt-4 space-y-3">
            <li><Link href="/" className="transition hover:text-[#8b6f6b]">Home</Link></li>
            <li><Link href="/catalog" className="transition hover:text-[#8b6f6b]">All Products</Link></li>
            <li><Link href="/blog" className="transition hover:text-[#8b6f6b]">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#4a3a36]">Brand</h3>
          <ul className="mt-4 space-y-3">
            <li><Link href="/about" className="transition hover:text-[#8b6f6b]">About Us</Link></li>
            <li><Link href="/contact" className="transition hover:text-[#8b6f6b]">Contact</Link></li>
            <li><Link href="/account" className="transition hover:text-[#8b6f6b]">My Account</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#4a3a36]">Contact</h3>
          <ul className="mt-4 space-y-3">
            <li>{siteConfig.address}</li>
            <li><a href={`tel:${siteConfig.phone}`} className="transition hover:text-[#8b6f6b]">{siteConfig.phone}</a></li>
            <li><a href={`mailto:${siteConfig.contactEmail}`} className="transition hover:text-[#8b6f6b]">{siteConfig.contactEmail}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
