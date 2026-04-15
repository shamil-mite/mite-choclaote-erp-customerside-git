export type ProductCategoryRef = {
  name: string;
  slug: string;
  bannerImageUrl: string;
};

export type ProductDetail = {
  id?: number;
  slug: string;
  name: string;
  code: string;
  imageUrl: string;
  shortDescription?: string | null;
  longDescription: string;
  price: number;
  currency?: string;
  productWeight?: number | null;
  weightUnit?: string;
  inventoryStatus: 'in_stock' | 'limited' | 'sold_out';
  highlights: string[];
  ingredients: string[];
  badges: string[];
  category: ProductCategoryRef;
};

export type RelatedProduct = {
  id: string | number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  shortDescription?: string | null;
  currency?: string;
};

export type ProductPageData = {
  product: ProductDetail;
  relatedProducts: RelatedProduct[];
};
