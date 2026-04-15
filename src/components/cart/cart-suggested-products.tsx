import { SectionHeading } from '@/components/home/section-heading';
import { ProductCard } from '@/components/home/product-card';
import type { CartSuggestedProduct } from '@/lib/cart-page.types';

type CartSuggestedProductsProps = {
  products: CartSuggestedProduct[];
};

export function CartSuggestedProducts({ products }: CartSuggestedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="left"
          eyebrow="You May Also Like"
          title="You May Also Like"
          subtitle="A refined selection chosen to complement your current cart with the same premium chocolate experience."
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
