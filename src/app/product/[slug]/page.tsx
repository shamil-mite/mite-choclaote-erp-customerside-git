import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPageView } from '@/components/product/product-page';
import { buildMetadata, productJsonLd } from '@/lib/seo';
import { getCategoryBySlug, getProductBySlug, getProductsByCategory } from '@/lib/storefront-api';
import type { ProductPageData } from '@/lib/product-page.types';

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

  const category = await getCategoryBySlug(product.categorySlug);
  const categoryProducts = await getProductsByCategory(product.categorySlug);

  const data: ProductPageData = {
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      code: product.code,
      imageUrl: product.heroImage,
      shortDescription: product.shortDescription,
      longDescription: product.description,
      price: product.price,
      currency: 'AED',
      productWeight: product.productWeight,
      weightUnit: product.weightUnit,
      inventoryStatus: product.inventoryStatus,
      highlights: product.highlights ?? [],
      ingredients: product.ingredients ?? [],
      badges: product.badges ?? [],
      category: {
        name: category?.name || product.categoryName || 'Collection',
        slug: category?.slug || product.categorySlug,
        bannerImageUrl: category?.heroImage || category?.thumbImage || product.heroImage,
      },
    },
    relatedProducts: categoryProducts
      .filter((entry) => entry.slug !== product.slug)
      .slice(0, 4)
      .map((entry) => ({
        id: entry.id ?? entry.slug,
        name: entry.name,
        slug: entry.slug,
        imageUrl: entry.heroImage,
        price: entry.price,
        shortDescription: entry.shortDescription,
        currency: 'AED',
      })),
  };

  return (
    <>
      <ProductPageView data={data} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
    </>
  );
}
