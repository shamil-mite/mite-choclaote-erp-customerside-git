import { HomeShell } from '@/components/home/home-shell';
import { ProductBanner } from '@/components/product/product-banner';
import { ProductDetailSection } from '@/components/product/product-detail-section';
import { RelatedProductsSection } from '@/components/product/related-products-section';
import type { ProductPageData } from '@/lib/product-page.types';

export function ProductPageView({ data }: { data: ProductPageData }) {
  return (
    <HomeShell>
      <ProductBanner product={data.product} />

      <main>
        <ProductDetailSection product={data.product} />
        <RelatedProductsSection products={data.relatedProducts} />
      </main>
    </HomeShell>
  );
}
