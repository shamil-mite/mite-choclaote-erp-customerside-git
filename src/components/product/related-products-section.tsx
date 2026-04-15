import { SectionHeading } from '@/components/home/section-heading';
import { ProductCard } from '@/components/home/product-card';
import type { RelatedProduct } from '@/lib/product-page.types';

export function RelatedProductsSection({ products }: { products: RelatedProduct[] }) {
  if (!products.length) return null;

  return (
    <section className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="You May Also Like"
          title="You May Also Like"
          subtitle="More premium chocolates from the same collection, presented with the same crafted visual language."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-6 xl:justify-start">
          {products.map((product, index) => (
            <div
              key={String(product.id)}
              className="w-full max-w-[320px] md:max-w-[360px] xl:w-[calc(25%-18px)] xl:max-w-[290px]"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
