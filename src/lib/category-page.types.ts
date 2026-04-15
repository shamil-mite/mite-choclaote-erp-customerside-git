export type CategoryBanner = {
  id: string | number;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
};

export type CategoryProduct = {
  id: string | number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  shortDescription?: string | null;
  currency?: string;
};

export type CategoryPageData = {
  category: CategoryBanner;
  products: CategoryProduct[];
};
