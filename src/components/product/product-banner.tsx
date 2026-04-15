import Image from 'next/image';
import Link from 'next/link';
import type { ProductDetail } from '@/lib/product-page.types';

function formatWeight(value?: number | null, unit?: string) {
  if (value === null || value === undefined || !unit) return '';
  const normalized = Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '');
  return `${normalized} ${unit}`;
}

export function ProductBanner({ product }: { product: ProductDetail }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#140b08]">
      <div className="absolute inset-0">
        <Image
          src={product.category.bannerImageUrl}
          alt={product.category.name}
          fill
          priority
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(30,12,6,0.30),transparent_38%),linear-gradient(90deg,rgba(16,8,6,0.88)_0%,rgba(16,8,6,0.62)_38%,rgba(16,8,6,0.28)_65%,rgba(16,8,6,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,6,5,0.22)_0%,rgba(10,6,5,0.18)_45%,rgba(10,6,5,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[460px] w-full max-w-[1600px] items-end px-6 pb-16 pt-28 sm:px-10 lg:min-h-[560px] lg:px-16 lg:pb-20">
        <div className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[#ead7c7]/70">
            <Link href="/" className="transition hover:text-[#f6eadf]">
              Home
            </Link>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`} className="transition hover:text-[#f6eadf]">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-[#f6eadf]">{product.name}</span>
          </nav>

          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-[#d3a170] sm:text-sm">
            Signature Product
          </p>

          <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-[#f8eee6] sm:text-6xl lg:text-7xl">
            {product.name}
          </h1>

          {product.shortDescription ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#f0dfd3]/80 sm:text-lg">
              {product.shortDescription}
            </p>
          ) : null}

          {product.productWeight && product.weightUnit ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[#d0a27d]/25 bg-[#1c110d]/55 px-5 py-2 text-sm font-medium text-[#f2decf] backdrop-blur">
                {formatWeight(product.productWeight, product.weightUnit)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
