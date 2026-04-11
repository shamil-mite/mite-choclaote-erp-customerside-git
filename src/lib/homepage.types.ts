export type HomeBanner = {
  id: string | number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  ctaLabel?: string | null;
  ctaHref: string;
  sortOrder?: number;
};

export type HomeCategory = {
  id: string | number;
  name: string;
  slug: string;
  imageUrl: string;
  shortDescription?: string | null;
};

export type HomeProduct = {
  id: string | number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  shortDescription?: string | null;
  currency?: string;
};

export type HomePageData = {
  banners: HomeBanner[];
  categories: HomeCategory[];
  products: HomeProduct[];
};
