import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { ProductCard } from '@/components/product-card';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/storefront-api';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return buildMetadata({
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      path: `/category/${slug}`,
    });
  }

  return buildMetadata({
    title: category.seoTitle || `${category.name} | Heart of Chocolate`,
    description: category.seoDescription || category.description,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-10 lg:px-10 lg:py-14">
      <section className="relative overflow-hidden rounded-[38px] border border-[#e2cfcb] bg-[linear-gradient(140deg,#faf5f3_0%,#f1e4e1_100%)] shadow-[0_24px_70px_rgba(201,169,166,0.16)]">
        {category.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.heroImage} alt={category.name} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        ) : null}
        <div className="relative min-h-[42vh] px-8 py-12 lg:px-14 lg:py-16">
          <div className="inline-flex rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">
            {category.eyebrow}
          </div>
          <h1 className="mt-7 max-w-4xl font-heading text-6xl leading-[0.94] text-[#4a3a36] md:text-7xl">
            {category.heroTitle || category.name}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#675d5a]">
            {category.heroDescription || category.description}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-sm text-[#675d5a]">{products.length} products in this category</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
