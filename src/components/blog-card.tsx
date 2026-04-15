import Link from 'next/link';
import type { BlogPost } from '@/data/catalog';
import { normalizeMediaUrl } from '@/lib/storefront-api';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-[#e0cdca] bg-white shadow-[0_22px_52px_rgba(201,169,166,0.14)] transition hover:-translate-y-1.5 hover:border-[#c9a9a6]">
      <div className="h-72 bg-[linear-gradient(135deg,rgba(201,169,166,0.32),rgba(255,249,247,0.95))]">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={normalizeMediaUrl(post.image)} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-end p-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8b6f6b]">{post.category}</div>
              <div className="mt-3 font-heading text-4xl text-[#4a3a36]">{post.title}</div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4 px-7 py-7">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b6f6b]">{post.category}</div>
        <h3 className="font-heading text-3xl text-[#4a3a36]">{post.title}</h3>
        <p className="text-sm leading-7 text-[#675d5a]">{post.excerpt}</p>
        <div className="flex items-center justify-between border-t border-[#efe3e1] pt-4 text-sm text-[#7a6f6c]">
          <span>{post.publishedAt}</span>
          <Link href={`/blog/${post.slug}`} className="font-semibold text-[#8b6f6b] transition hover:text-[#6e5753]">
            Read article
          </Link>
        </div>
      </div>
    </article>
  );
}
