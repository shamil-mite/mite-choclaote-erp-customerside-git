import { buildMetadata } from '@/lib/seo';
import { HomePage } from '@/components/home/home-page';
import { getBanners, getCategories, getProducts } from '@/lib/storefront-api';
import { siteConfig } from '@/data/catalog';
import type { HomePageData } from '@/lib/homepage.types';

export const metadata = buildMetadata({
  title: `${siteConfig.name} | Premium Chocolate Gifting And Online Shopping`,
  description:
    'Shop premium chocolate bars, gift boxes, and curated collections with elegant online ordering, category-led discovery, and seasonal highlights.',
  path: '/',
});

async function getHomePageData(): Promise<HomePageData> {
  const [banners, categories, products] = await Promise.all([
    getBanners(),
    getCategories(),
    getProducts(),
  ]);

  return {
    banners: banners.map((banner, index) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle || null,
      description: banner.description || null,
      imageUrl: banner.imageUrl || banner.mobileImageUrl || '/placeholder-banner.svg',
      thumbnailUrl: banner.mobileImageUrl || banner.imageUrl || '/placeholder-banner.svg',
      ctaLabel: banner.buttonText || 'Buy',
      ctaHref: banner.buttonUrl || '/catalog',
      sortOrder: index,
    })),
    categories: categories.map((category, index) => ({
      id: index + 1,
      name: category.name,
      slug: category.slug,
      imageUrl: category.thumbImage || category.heroImage || '/placeholder-category.svg',
      shortDescription: category.description || null,
    })),
    products: products.map((product, index) => ({
      id: product.id || index + 1,
      name: product.name,
      slug: product.slug,
      imageUrl: product.heroImage || product.gallery?.[0] || '/placeholder-product.svg',
      price: Number(product.price || 0),
      shortDescription: product.shortDescription || null,
      currency: 'AED',
    })),
  };
}

export default async function HomeRoute() {
  const data = await getHomePageData();
  return <HomePage data={data} />;
}
