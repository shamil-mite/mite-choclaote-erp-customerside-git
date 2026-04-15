import {
  blogPosts as fallbackBlogPosts,
  categories as fallbackCategories,
  fallbackBanners,
  getBlogPostBySlug as getFallbackBlogPostBySlug,
  getCategoryBySlug as getFallbackCategoryBySlug,
  getFallbackPage,
  getProductBySlug as getFallbackProductBySlug,
  getProductsByCategory as getFallbackProductsByCategory,
  products as fallbackProducts,
  type BlogPost,
  type Category,
  type Product,
  type WebsiteBanner,
  type WebsitePage,
} from '@/data/catalog';

const API_BASE_URL = (process.env.NEXT_PUBLIC_STOREFRONT_API_BASE_URL || 'http://127.0.0.1:8000/api/storefront').replace(/\/$/, '');

// The Django backend builds absolute media URLs using the port it actually listens on
// (e.g. gunicorn on 8098), which may differ from the port the frontend expects (8000).
// This normalises any absolute localhost/127.0.0.1 URL so its origin matches API_BASE_URL.
const API_ORIGIN = (() => {
  try { return new URL(API_BASE_URL).origin; } catch { return ''; }
})();

export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (
      API_ORIGIN &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
      parsed.origin !== API_ORIGIN
    ) {
      return `${API_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // relative URL — return as-is
  }
  return url;
}

type FetchOptions = RequestInit & {
  revalidate?: number;
};

async function fetchJson<T>(path: string, fallback: T, options: FetchOptions = {}): Promise<T> {
  try {
    const { revalidate = 120, headers, ...init } = options;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(headers || {}),
      },
      ...(revalidate === 0 ? { cache: 'no-store' as const } : { next: { revalidate } }),
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

function unwrapListPayload<T>(payload: T[] | { results?: T[] } | unknown, fallback: T[]): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object' && Array.isArray((payload as { results?: T[] }).results)) {
    return (payload as { results: T[] }).results;
  }
  return fallback;
}

export async function getCategories(): Promise<Category[]> {
  const payload = await fetchJson<Category[] | { results?: Category[] }>('/categories/', fallbackCategories, { revalidate: 0 });
  return unwrapListPayload(payload, fallbackCategories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const fallback = getFallbackCategoryBySlug(slug);
  return fetchJson<Category | undefined>(`/categories/${slug}/`, fallback, { revalidate: 0 });
}

type ProductQueryParams = {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inventory?: string;
  sort?: string;
};

export async function getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set('q', params.q);
  if (params.category) queryParams.set('category', params.category);
  if (params.minPrice) queryParams.set('min_price', params.minPrice);
  if (params.maxPrice) queryParams.set('max_price', params.maxPrice);
  if (params.inventory) queryParams.set('inventory', params.inventory);
  if (params.sort) queryParams.set('sort', params.sort);
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const payload = await fetchJson<Product[] | { results?: Product[] }>(`/products/${query}`, fallbackProducts, { revalidate: 0 });
  return unwrapListPayload(payload, fallbackProducts).sort(
    (a, b) => Number(a.listingOrder ?? 9999) - Number(b.listingOrder ?? 9999) || a.name.localeCompare(b.name),
  );
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const fallback = getFallbackProductsByCategory(slug);
  const payload = await fetchJson<Product[] | { results?: Product[] }>(`/products/?category=${encodeURIComponent(slug)}`, fallback, { revalidate: 0 });
  return unwrapListPayload(payload, fallback);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const fallback = getFallbackProductBySlug(slug);
  return fetchJson<Product | undefined>(`/products/${slug}/`, fallback, { revalidate: 0 });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const payload = await fetchJson<BlogPost[] | { results?: BlogPost[] }>('/blog-posts/', fallbackBlogPosts, { revalidate: 0 });
  return unwrapListPayload(payload, fallbackBlogPosts);
}

export async function getBanners(): Promise<WebsiteBanner[]> {
  const payload = await fetchJson<WebsiteBanner[] | { results?: WebsiteBanner[] }>('/banners/', fallbackBanners, { revalidate: 0 });
  return unwrapListPayload(payload, fallbackBanners);
}

export async function getWebsitePage(pageKey: string): Promise<WebsitePage | undefined> {
  const fallback = getFallbackPage(pageKey);
  return fetchJson<WebsitePage | undefined>(`/pages/${encodeURIComponent(pageKey)}/`, fallback, { revalidate: 0 });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const fallback = getFallbackBlogPostBySlug(slug);
  return fetchJson<BlogPost | undefined>(`/blog-posts/${slug}/`, fallback, { revalidate: 0 });
}

export type StorefrontAuthBundle = {
  access: string;
  refresh: string;
  profile: StorefrontProfile;
};

export type StorefrontAddress = {
  id: number;
  label: string;
  contact_name: string;
  phone: string;
  email: string;
  emirate: string;
  city: string;
  postal_code: string;
  address_line_1: string;
  address_line_2: string;
  delivery_notes: string;
  is_default: boolean;
};

export type StorefrontProfile = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  marketing_opt_in: boolean;
  addresses: StorefrontAddress[];
};

export type StorefrontOrder = {
  id: number;
  order_no: string;
  order_date: string;
  source: string;
  status: string;
  payment_status: string;
  payment_provider: string;
  payment_reference: string;
  fulfillment_status: string;
  courier_ref: string;
  net_total: number;
  subtotal: number;
  vat: number;
  courier_fee: number;
  mode_of_transaction: string;
  notes: string;
  customer_name: string;
  customer_email: string;
  courier_partner_name: string;
  tracking_url: string;
  promotion_code: string;
  invoice_discount_amount: number;
  items: Array<{
    product_id: number;
    product_slug: string;
    product_image: string;
    product_code: string;
    product: string;
    uom: string;
    unit_price: number;
    quantity: number;
    discount_amount: number;
    amount: number;
  }>;
};

export const STOREFRONT_ACCESS_TOKEN_KEY = 'hoc-storefront-access';
export const STOREFRONT_REFRESH_TOKEN_KEY = 'hoc-storefront-refresh';

export function readAccessToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STOREFRONT_ACCESS_TOKEN_KEY) || '';
}

export function readRefreshToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STOREFRONT_REFRESH_TOKEN_KEY) || '';
}

export function persistAuthBundle(bundle: StorefrontAuthBundle) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STOREFRONT_ACCESS_TOKEN_KEY, bundle.access);
  window.localStorage.setItem(STOREFRONT_REFRESH_TOKEN_KEY, bundle.refresh);
}

export function clearAuthBundle() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STOREFRONT_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(STOREFRONT_REFRESH_TOKEN_KEY);
}

export function isAuthenticatedStorefrontUser() {
  return Boolean(readAccessToken());
}

async function refreshStorefrontAccessToken() {
  const refresh = readRefreshToken();
  if (!refresh) return '';
  const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.access) {
    clearAuthBundle();
    return '';
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STOREFRONT_ACCESS_TOKEN_KEY, payload.access);
  }
  return String(payload.access);
}

function shouldAttemptRefresh(response: Response, payload: unknown) {
  if (response.status !== 401) return false;
  if (!payload || typeof payload !== 'object') return true;
  const detail = typeof (payload as { detail?: unknown }).detail === 'string' ? (payload as { detail: string }).detail : '';
  return detail.includes('token') || detail.includes('Token') || detail.includes('not valid');
}

async function performStorefrontRequest(path: string, options: RequestInit = {}, token?: string) {
  const accessToken = token || readAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

export async function storefrontClientRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  let { response, payload } = await performStorefrontRequest(path, options, token);
  if (shouldAttemptRefresh(response, payload)) {
    const newAccess = await refreshStorefrontAccessToken();
    if (newAccess) {
      ({ response, payload } = await performStorefrontRequest(path, options, newAccess));
    }
  }
  if (!response.ok) {
    const detail = typeof payload?.detail === 'string'
      ? payload.detail
      : typeof payload === 'string'
        ? payload
        : JSON.stringify(payload);
    throw new Error(detail || 'Request failed.');
  }
  return payload as T;
}

export async function getStorefrontOrder(orderNo: string, token?: string) {
  return storefrontClientRequest<StorefrontOrder>(`/orders/${encodeURIComponent(orderNo)}/`, {}, token);
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  mobile?: string;
  subject?: string;
  message: string;
}) {
  return storefrontClientRequest<{ detail: string }>('/contact/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
