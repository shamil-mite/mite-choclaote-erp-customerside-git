export type Category = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  thumbImage: string;
  seoTitle: string;
  seoDescription: string;
};

export type Product = {
  id?: number;
  slug: string;
  name: string;
  code: string;
  categorySlug: string;
  categoryName?: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  rating: number;
  reviewCount: number;
  inventoryStatus: 'in_stock' | 'limited' | 'sold_out';
  heroImage: string;
  gallery: string[];
  seoTitle: string;
  seoDescription: string;
  highlights: string[];
  ingredients: string[];
  badges: string[];
  listingOrder?: number;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  publishedAt: string;
  readMinutes: number;
  image: string;
  seoTitle: string;
  seoDescription: string;
};

export type WebsiteBanner = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  mobileImageUrl: string;
};

export type WebsitePage = {
  page_key: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

export const siteConfig = {
  name: 'Heart of Chocolate',
  description:
    'Artisan chocolate bars, gift boxes, and premium seasonal drops crafted for elegant online ordering in the UAE.',
  url: 'https://www.heartofchocolate.ae',
  locale: 'en_AE',
  ogImage: '/og-default.svg',
  contactEmail: 'hello@heartofchocolate.ae',
  phone: '+971 55 302 3232',
  address: 'Ajman, United Arab Emirates',
  socials: {
    instagram: 'https://instagram.com/heartofchocolate',
    tiktok: 'https://tiktok.com/@heartofchocolate',
    linkedin: 'https://linkedin.com/company/heartofchocolate',
  },
} as const;

export const fallbackBanners: WebsiteBanner[] = [
  {
    id: 1,
    title: 'Luxury chocolate crafted for gifting and repeat delight.',
    subtitle: 'Seasonal featured collection',
    description:
      'Discover elegant chocolate bars, premium boxes, and gifting selections designed for beautiful presentation and smooth online ordering.',
    buttonText: 'Shop featured collection',
    buttonUrl: '/catalog',
    imageUrl: '',
    mobileImageUrl: '',
  },
];

export const fallbackPages: Record<string, WebsitePage> = {
  about: {
    page_key: 'about',
    title: 'About Heart of Chocolate',
    subtitle: 'A chocolate house built around elegant gifting and consistent flavour.',
    bannerImage: '',
    content:
      'Heart of Chocolate creates premium bars, gifting formats, and signature collections for everyday indulgence, seasonal campaigns, and curated retail moments.\n\nWe focus on balanced flavour, premium presentation, and a buying experience that feels polished from the first visit to the final delivery.',
    seoTitle: 'About Us | Heart of Chocolate',
    seoDescription: 'Learn about Heart of Chocolate, our products, and the premium gifting experience behind the brand.',
  },
  contact: {
    page_key: 'contact',
    title: 'Contact Heart of Chocolate',
    subtitle: 'Reach our team for orders, gifting, retail enquiries, and support.',
    bannerImage: '',
    content:
      'For customer support, gifting enquiries, collaborations, and retail opportunities, contact our team using the form below. We will review and respond as quickly as possible.',
    seoTitle: 'Contact | Heart of Chocolate',
    seoDescription: 'Get in touch with Heart of Chocolate for support, corporate gifting, and product enquiries.',
  },
};

export const categories: Category[] = [
  {
    slug: 'signature-bars',
    name: 'Signature Bars',
    eyebrow: 'Best Sellers',
    description: 'Premium bars for everyday indulgence and gifting.',
    heroTitle: 'Signature bars designed to feel premium at first glance.',
    heroDescription: 'A refined collection of customer favourites that anchor the storefront and support repeat purchase.',
    heroImage: '',
    thumbImage: '',
    seoTitle: 'Signature Bars | Heart of Chocolate',
    seoDescription: 'Explore signature chocolate bars from Heart of Chocolate.',
  },
  {
    slug: 'filled-bites',
    name: 'Filled Bites',
    eyebrow: 'Small Format',
    description: 'Compact formats built for impulse, tasting sets, and gifting.',
    heroTitle: 'Small-format chocolates with strong visual and flavour presence.',
    heroDescription: 'Compact products that work well for events, curated boxes, and premium snack moments.',
    heroImage: '',
    thumbImage: '',
    seoTitle: 'Filled Bites | Heart of Chocolate',
    seoDescription: 'Discover filled bites and compact chocolate formats from Heart of Chocolate.',
  },
  {
    slug: 'gift-boxes',
    name: 'Gift Boxes',
    eyebrow: 'Gifting',
    description: 'Curated boxes created for celebrations and corporate gifting.',
    heroTitle: 'Gift boxes made for special occasions and premium presentation.',
    heroDescription: 'Curated chocolate boxes that suit festive campaigns, client gifting, and personal moments.',
    heroImage: '',
    thumbImage: '',
    seoTitle: 'Gift Boxes | Heart of Chocolate',
    seoDescription: 'Browse gift boxes and premium chocolate gifting formats from Heart of Chocolate.',
  },
];

export const products: Product[] = [
  {
    id: 1,
    slug: 'milk-chocolate-bar',
    name: 'Milk Chocolate Bar',
    code: 'CHOCO-001',
    categorySlug: 'signature-bars',
    categoryName: 'Signature Bars',
    shortDescription: 'Balanced milk chocolate with a smooth finish.',
    description: 'A premium milk chocolate bar built for daily indulgence and elegant gifting.',
    price: 30,
    compareAtPrice: 36,
    rating: 4.9,
    reviewCount: 148,
    inventoryStatus: 'in_stock',
    heroImage: '',
    gallery: [],
    seoTitle: 'Milk Chocolate Bar | Heart of Chocolate',
    seoDescription: 'Premium milk chocolate bar from Heart of Chocolate.',
    highlights: ['Smooth finish', 'Gift-friendly', 'Retail-ready'],
    ingredients: ['Cocoa butter', 'Milk powder', 'Sugar'],
    badges: ['Best Seller'],
    listingOrder: 2,
  },
  {
    id: 2,
    slug: 'almond-choco-bar',
    name: 'Almond Choco Bar',
    code: 'CHOCO-002',
    categorySlug: 'signature-bars',
    categoryName: 'Signature Bars',
    shortDescription: 'Roasted almond crunch inside premium chocolate.',
    description: 'A layered bar that blends crisp almond texture with a smooth chocolate finish.',
    price: 25,
    compareAtPrice: 32,
    rating: 4.8,
    reviewCount: 102,
    inventoryStatus: 'in_stock',
    heroImage: '',
    gallery: [],
    seoTitle: 'Almond Choco Bar | Heart of Chocolate',
    seoDescription: 'Crunchy almond chocolate bar from Heart of Chocolate.',
    highlights: ['Roasted almond', 'Premium finish', 'Gift favourite'],
    ingredients: ['Cocoa mass', 'Almond', 'Milk powder', 'Sugar'],
    badges: ['Popular'],
    listingOrder: 1,
  },
  {
    id: 3,
    slug: 'signature-gift-box',
    name: 'Signature Gift Box',
    code: 'GIFT-001',
    categorySlug: 'gift-boxes',
    categoryName: 'Gift Boxes',
    shortDescription: 'Curated chocolate box for premium gifting.',
    description: 'A curated box designed for personal celebrations and corporate gifting.',
    price: 145,
    compareAtPrice: 160,
    rating: 5,
    reviewCount: 31,
    inventoryStatus: 'in_stock',
    heroImage: '',
    gallery: [],
    seoTitle: 'Signature Gift Box | Heart of Chocolate',
    seoDescription: 'Luxury chocolate gift box from Heart of Chocolate.',
    highlights: ['Luxury gift', 'Curated box', 'Corporate ready'],
    ingredients: ['Assorted chocolates', 'Roasted nuts'],
    badges: ['Luxury Gift'],
    listingOrder: 3,
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-build-a-premium-chocolate-gift-box',
    title: 'How To Build A Premium Chocolate Gift Box That Customers Reorder',
    excerpt: 'A practical guide to product mix, packaging, and storytelling for premium chocolate gifting.',
    content: [
      'Premium gifting is not only about what is inside the box. It is about how clearly the product communicates quality before it is opened.',
      'For ecommerce, presentation, photography, and clear structured content all matter. Customers need confidence before purchase.',
      'The strongest gift formats combine a hero product, a smaller tasting piece, and a texture-led inclusion to create balance.',
    ],
    category: 'Gifting',
    publishedAt: '2026-03-05',
    readMinutes: 6,
    image: '',
    seoTitle: 'How To Build A Premium Chocolate Gift Box | Heart of Chocolate',
    seoDescription: 'Learn how to structure premium gift boxes for stronger conversion and reorder value.',
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products
    .filter((product) => product.categorySlug === slug)
    .sort((a, b) => (a.listingOrder ?? 9999) - (b.listingOrder ?? 9999) || a.name.localeCompare(b.name));
}

export function getFallbackPage(pageKey: string) {
  return fallbackPages[pageKey];
}
