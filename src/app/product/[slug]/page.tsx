import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { buildMetadata, productJsonLd } from '@/lib/seo';
import { getProductBySlug } from '@/lib/storefront-api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({ title: 'Product Not Found', description: 'The requested product could not be found.' });
  }
  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/product/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div className="rounded-[36px] border border-[#e2cfcb] bg-[linear-gradient(145deg,#f8f1ef_0%,#efe2df_100%)] p-8 shadow-[0_24px_70px_rgba(201,169,166,0.16)]">
          <div className="mx-auto flex aspect-square max-w-[34rem] items-center justify-center rounded-[30px] border border-white/70 bg-white/90 p-8 text-center font-heading text-5xl text-[#7a605d] shadow-[0_14px_35px_rgba(201,169,166,0.18)]">
            {product.name}
          </div>
        </div>
        <div className="rounded-[36px] border border-[#e2cfcb] bg-white p-8 shadow-[0_24px_70px_rgba(201,169,166,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8b6f6b]">{product.code}</p>
          <h1 className="mt-4 font-heading text-5xl text-[#4a3a36] lg:text-6xl">{product.name}</h1>
          <p className="mt-5 text-base leading-8 text-[#675d5a]">{product.description}</p>
          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div className="text-4xl font-semibold text-[#4a3a36]">AED {product.price.toFixed(2)}</div>
            {product.compareAtPrice ? (
              <div className="pb-1 text-lg text-[#9b8f8a] line-through">AED {product.compareAtPrice.toFixed(2)}</div>
            ) : null}
          </div>
          <div className="mt-8 grid gap-4 rounded-[24px] border border-[#eadbd8] bg-[#fbf7f6] p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b6f6b]">Inventory</p>
              <p className="mt-3 text-base font-medium capitalize text-[#4a3a36]">{product.inventoryStatus.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b6f6b]">Highlights</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#675d5a]">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>- {highlight}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-[32px] border border-[#e2cfcb] bg-white p-8 shadow-[0_20px_60px_rgba(201,169,166,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8b6f6b]">Why customers buy it</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {product.badges.map((badge) => (
              <div key={badge} className="rounded-[22px] border border-[#eadbd8] bg-[#fbf7f6] px-5 py-5 text-sm font-medium text-[#4a3a36]">
                {badge}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[32px] border border-[#e2cfcb] bg-white p-8 shadow-[0_20px_60px_rgba(201,169,166,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8b6f6b]">Ingredients</p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[#675d5a]">
            {product.ingredients.map((ingredient) => (
              <li key={ingredient}>- {ingredient}</li>
            ))}
          </ul>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
    </div>
  );
}
