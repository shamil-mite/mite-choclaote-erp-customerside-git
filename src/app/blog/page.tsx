import { buildMetadata } from '@/lib/seo';
import { BlogCard } from '@/components/blog-card';
import { getBlogPosts } from '@/lib/storefront-api';
import { siteConfig } from '@/data/catalog';

export const metadata = buildMetadata({
  title: `Blog | ${siteConfig.name}`,
  description: 'Read product stories, gifting content, and premium chocolate articles from Heart of Chocolate.',
  path: '/blog',
});

export default async function BlogIndexPage() {
  const blogPosts = await getBlogPosts();
  const featuredPost = blogPosts[0];
  const remainingPosts = featuredPost ? blogPosts.slice(1) : [];

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-10 lg:px-10 lg:py-14">
      <section className="relative overflow-hidden rounded-[38px] border border-[#e2cfcb] bg-[linear-gradient(140deg,#faf5f3_0%,#f1e4e1_100%)] shadow-[0_24px_70px_rgba(201,169,166,0.16)]">
        {featuredPost?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={featuredPost.image} alt={featuredPost.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        ) : null}
        <div className="relative min-h-[58vh] bg-[linear-gradient(90deg,rgba(248,241,239,0.95),rgba(248,241,239,0.62))] p-8 lg:p-14">
          <div className="inline-flex rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">
            Journal
          </div>
          <h1 className="mt-6 max-w-4xl font-heading text-6xl leading-[0.94] text-[#4a3a36] md:text-7xl">
            Stories, gifting ideas, and chocolate notes.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-[#675d5a]">
            Publish articles from ERP and present them here with a premium banner-led layout that supports SEO, answer engines, and product discovery.
          </p>
          {featuredPost ? (
            <div className="mt-10 max-w-2xl rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_rgba(201,169,166,0.14)]">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8b6f6b]">{featuredPost.category}</div>
              <h2 className="mt-4 font-heading text-4xl text-[#4a3a36]">{featuredPost.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#675d5a]">{featuredPost.excerpt}</p>
              <div className="mt-5 text-xs uppercase tracking-[0.24em] text-[#7a6f6c]">
                {featuredPost.publishedAt} - {featuredPost.readMinutes} min read
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {(remainingPosts.length ? remainingPosts : blogPosts).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
