import { SectionHeading } from '@/components/home/section-heading';
import { ProductCard } from '@/components/home/product-card';
import type { CategoryProduct } from '@/lib/category-page.types';

type CategoryProductGridProps = {
  title?: string;
  subtitle?: string;
  products: CategoryProduct[];
};

export function CategoryProductGrid({
  title = 'Explore Our Delicious Menu',
  subtitle = 'A curated selection of premium chocolates from this collection, elegantly presented with the same luxury feel as the homepage.',
  products,
}: CategoryProductGridProps) {
  return (
    <section className="relative px-4 pb-24 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-18">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Made With Love"
          title={title}
          subtitle={subtitle}
        />

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {products.map((product, index) => (
            <div
              key={String(product.id)}
              className="w-full max-w-[320px] md:max-w-[360px] xl:w-[calc(25%-18px)] xl:max-w-[290px]"
            >
              <ProductCard
                product={product}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
