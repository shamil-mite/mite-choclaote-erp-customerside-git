export type CartPageItem = {
  id: string | number;
  productId?: number;
  slug: string;
  name: string;
  imageUrl: string;
  shortDescription?: string | null;
  unitPrice: number;
  currency?: string;
  quantity: number;
};

export type CartPageTotals = {
  subtotal: number;
  discount?: number;
  vat: number;
  total: number;
  currency?: string;
};

export type CartSuggestedProduct = {
  id: string | number;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  currency?: string;
  shortDescription?: string | null;
};
