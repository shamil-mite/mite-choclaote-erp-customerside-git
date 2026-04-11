import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/components/providers/cart-provider';
import { buildMetadata, organizationJsonLd } from '@/lib/seo';
import { siteConfig } from '@/data/catalog';

const headingFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '600', '700'],
});

const bodyFont = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} | Premium Chocolate Ecommerce`,
  description: siteConfig.description,
  path: '/',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-[#f5f0ef] text-[#4a4a4a] antialiased`}>
        <CartProvider>
          <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f3f1_0%,#f5f0ef_40%,#f3ece9_100%)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,169,166,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(232,213,211,0.62),transparent_26%)]" />
            <SiteHeader />
            <main className="relative z-10">{children}</main>
            <SiteFooter />
          </div>
        </CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </body>
    </html>
  );
}
