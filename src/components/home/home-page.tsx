import { HeroSlider } from './hero-slider';
import { SectionHeading } from './section-heading';
import { CategoryCard } from './category-card';
import { ProductCard } from './product-card';
import { HomeShell } from './home-shell';
import type { HomePageData } from '@/lib/homepage.types';

type HomePageProps = {
  data: HomePageData;
};

export function HomePage({ data }: HomePageProps) {
  return (
    <HomeShell>
      <HeroSlider banners={data.banners} />

      <main>
        <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Our Categories"
              title="Our Categories"
              subtitle="Explore premium collections crafted for gifting, sharing, and indulgent everyday moments."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {data.categories.map((category, index) => (
                <CategoryCard
                  key={String(category.id)}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Made With Love"
              title="Explore Our Delicious Menu"
              subtitle="A refined selection of artisan chocolates, elegantly presented and ordered exactly as you manage them in ERP."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {data.products.map((product, index) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </HomeShell>
  );
}
