import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ProductCard } from '@/components/product-card';
import { getCategories, getProducts } from '@/lib/storefront-api';
import { siteConfig } from '@/data/catalog';

export const metadata = buildMetadata({
  title: `Shop All Products | ${siteConfig.name}`,
  description: 'Browse all chocolate bars, gifting formats, and featured collections from Heart of Chocolate.',
  path: '/catalog',
});

type CatalogPageProps = {
  searchParams?: Promise<{
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    inventory?: string;
    sort?: string;
  }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = (await searchParams) || {};
  const q = params.q || '';
  const minPrice = params.minPrice || '';
  const maxPrice = params.maxPrice || '';
  const inventory = params.inventory || '';
  const sort = params.sort || '';

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ q, minPrice, maxPrice, inventory, sort }),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
      <section className="rounded-[38px] border border-[#e2cfcb] bg-[linear-gradient(145deg,#faf5f3_0%,#f2e5e1_100%)] p-8 shadow-[0_24px_70px_rgba(201,169,166,0.16)] lg:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">Catalog</div>
        <h1 className="mt-4 font-heading text-6xl text-[#4a3a36]">Shop all products</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#675d5a]">
          Browse the full storefront catalog or narrow your view by category, price range, and stock availability.
        </p>

        <form className="mt-8 grid gap-4 rounded-[28px] border border-[#e7d6d3] bg-white/85 p-5 md:grid-cols-5">
          <input name="q" defaultValue={q} placeholder="Search by product name, code, or barcode" className="rounded-[18px] border border-[#e3d3cf] px-4 py-3 text-[#4a3a36] outline-none md:col-span-2" />
          <input name="minPrice" defaultValue={minPrice} placeholder="Min AED" className="rounded-[18px] border border-[#e3d3cf] px-4 py-3 text-[#4a3a36] outline-none" />
          <input name="maxPrice" defaultValue={maxPrice} placeholder="Max AED" className="rounded-[18px] border border-[#e3d3cf] px-4 py-3 text-[#4a3a36] outline-none" />
          <select name="inventory" defaultValue={inventory} className="rounded-[18px] border border-[#e3d3cf] px-4 py-3 text-[#4a3a36] outline-none">
            <option value="">Any stock</option>
            <option value="in_stock">In stock</option>
            <option value="limited">Limited stock</option>
            <option value="sold_out">Sold out</option>
          </select>
          <select name="sort" defaultValue={sort} className="rounded-[18px] border border-[#e3d3cf] px-4 py-3 text-[#4a3a36] outline-none">
            <option value="">Website listing order</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
          <div className="md:col-span-5 flex flex-wrap gap-3">
            <button className="rounded-full bg-[#8b6f6b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">Apply filters</button>
            <Link href="/catalog" className="rounded-full border border-[#d3beb9] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#5b4a46]">
              Reset
            </Link>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="rounded-full border border-[#d7c4c1] bg-white px-4 py-2 text-sm font-medium text-[#5d5250] transition hover:border-[#8b6f6b] hover:text-[#8b6f6b]">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 text-sm text-[#675d5a]">{products.length} products found</div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
