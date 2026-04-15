import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { CategoryPage as CategoryPageView } from '@/components/category/category-page';
import { getCategoryBySlug, getProductsByCategory, normalizeMediaUrl } from '@/lib/storefront-api';
import type { CategoryPageData } from '@/lib/category-page.types';

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

  const data: CategoryPageData = {
    category: {
      id: category.slug,
      title: category.name,
      slug: category.slug,
      description: category.heroDescription || category.description,
      imageUrl: normalizeMediaUrl(category.heroImage || category.thumbImage) || '/placeholder-category.svg',
    },
    products: products.map((product) => ({
      id: product.id || product.slug,
      name: product.name,
      slug: product.slug,
      imageUrl: normalizeMediaUrl(product.heroImage || product.gallery?.[0]) || '/placeholder-product.svg',
      price: Number(product.price || 0),
      shortDescription: product.shortDescription || '',
      currency: 'AED',
    })),
  };

  return <CategoryPageView data={data} />;
}
