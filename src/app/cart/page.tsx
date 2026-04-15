import type { Metadata } from 'next';
import { CartPage } from '@/components/cart/cart-page';
import { getProducts } from '@/lib/storefront-api';
import type { CartSuggestedProduct } from '@/lib/cart-page.types';

export const metadata: Metadata = {
  title: 'Cart | Heart of Chocolate',
  description: 'Review your selected chocolates before checkout.',
};

export default async function Page() {
  const products = await getProducts();
  const suggestedProducts: CartSuggestedProduct[] = products.map((product) => ({
    id: product.id ?? product.slug,
    name: product.name,
    slug: product.slug,
    imageUrl: product.heroImage,
    price: product.price,
    currency: 'AED',
    shortDescription: product.shortDescription,
  }));

  return <CartPage suggestedProducts={suggestedProducts} />;
}
