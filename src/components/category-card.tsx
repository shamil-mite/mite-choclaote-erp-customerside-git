import Link from 'next/link';
import type { Category } from '@/data/catalog';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="group block rounded-[28px] border border-[#e2d1ce] bg-white p-6 shadow-[0_20px_50px_rgba(201,169,166,0.14)] transition hover:-translate-y-2 hover:border-[var(--site-rose)]">
      <div className="rounded-[24px] bg-[linear-gradient(160deg,rgba(201,169,166,0.22),rgba(255,255,255,0.92))] px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8b6f6b]">{category.eyebrow}</p>
        <h3 className="mt-4 font-heading text-4xl text-[#4a3a36]">{category.name}</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#6b615e]">{category.description}</p>
      </div>
    </Link>
  );
}
