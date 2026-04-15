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

            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {data.categories.map((category, index) => (
                <div
                  key={String(category.id)}
                  className="w-full max-w-[320px] md:max-w-[360px] xl:w-[calc(25%-18px)] xl:max-w-[290px]"
                >
                  <CategoryCard
                    category={category}
                    index={index}
                  />
                </div>
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

            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {data.products.map((product, index) => (
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
      </main>
    </HomeShell>
  );
}
