import { notFound } from 'next/navigation';
import { blogPostingJsonLd, buildMetadata } from '@/lib/seo';
import { getBlogPostBySlug, normalizeMediaUrl } from '@/lib/storefront-api';

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: 'Article Not Found',
      description: 'The requested blog article could not be found.',
      path: `/blog/${slug}`,
    });
  }
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-10 lg:px-10 lg:py-14">
      <section className="relative overflow-hidden rounded-[38px] border border-[#e2cfcb] bg-[linear-gradient(140deg,#faf5f3_0%,#f1e4e1_100%)] shadow-[0_24px_70px_rgba(201,169,166,0.16)]">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={normalizeMediaUrl(post.image)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        ) : null}
        <div className="relative min-h-[58vh] bg-[linear-gradient(90deg,rgba(248,241,239,0.92),rgba(248,241,239,0.58))] px-8 py-14 lg:px-14 lg:py-20">
          <div className="inline-flex rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">
            {post.category}
          </div>
          <h1 className="mt-7 max-w-5xl font-heading text-6xl leading-[0.94] text-[#4a3a36] md:text-7xl">{post.title}</h1>
          <div className="mt-6 text-sm uppercase tracking-[0.24em] text-[#7a6f6c]">
            {post.publishedAt} - {post.readMinutes} min read
          </div>
        </div>
      </section>

      <article className="rounded-[32px] border border-[#e2cfcb] bg-white p-8 shadow-[0_20px_60px_rgba(201,169,166,0.12)] lg:p-12">
        <p className="mb-8 text-lg leading-8 text-[#5b514e]">{post.excerpt}</p>
        <div className="space-y-6 text-[15px] leading-8 text-[#5f5553]">
          {post.content.map((paragraph, index) => (
            <p key={`${post.slug}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }} />
    </div>
  );
}
