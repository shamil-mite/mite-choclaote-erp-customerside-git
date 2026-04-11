import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/catalog';
import { getBlogPosts, getCategories, getProducts } from '@/lib/storefront-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, blogPosts] = await Promise.all([
    getCategories(),
    getProducts(),
    getBlogPosts(),
  ]);

  return [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/catalog`, priority: 0.9 },
    { url: `${siteConfig.url}/blog`, priority: 0.8 },
    { url: `${siteConfig.url}/about`, priority: 0.7 },
    { url: `${siteConfig.url}/contact`, priority: 0.7 },
    ...categories.map((category) => ({ url: `${siteConfig.url}/category/${category.slug}`, priority: 0.8 })),
    ...products.map((product) => ({ url: `${siteConfig.url}/product/${product.slug}`, priority: 0.8 })),
    ...blogPosts.map((post) => ({ url: `${siteConfig.url}/blog/${post.slug}`, priority: 0.7 })),
  ];
}
