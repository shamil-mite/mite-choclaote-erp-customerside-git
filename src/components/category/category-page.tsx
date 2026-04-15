import { HomeShell } from '@/components/home/home-shell';
import { CategoryBanner } from '@/components/category/category-banner';
import { CategoryProductGrid } from '@/components/category/category-product-grid';
import type { CategoryPageData } from '@/lib/category-page.types';

type CategoryPageProps = {
  data: CategoryPageData;
};

export function CategoryPage({ data }: CategoryPageProps) {
  return (
    <HomeShell>
      <CategoryBanner category={data.category} productCount={data.products.length} />

      <main>
        <CategoryProductGrid products={data.products} />
      </main>
    </HomeShell>
  );
}
