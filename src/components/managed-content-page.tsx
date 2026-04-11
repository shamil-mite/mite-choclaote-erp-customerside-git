import type { WebsitePage } from '@/data/catalog';

export function ManagedContentPage({
  page,
  children,
}: {
  page: WebsitePage;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 px-6 py-10 lg:px-10 lg:py-14">
      <section className="relative overflow-hidden rounded-[38px] border border-[#e0cdca] bg-[linear-gradient(140deg,#f8f1ef_0%,#eedddb_65%,#ead8d4_100%)] shadow-[0_26px_80px_rgba(201,169,166,0.18)]">
        {page.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={page.bannerImage} alt={page.title} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        ) : null}
        <div className="relative min-h-[50vh] bg-[linear-gradient(90deg,rgba(248,241,239,0.92),rgba(248,241,239,0.55))] px-8 py-14 lg:px-14 lg:py-20">
          {page.subtitle ? (
            <div className="inline-flex rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">
              {page.subtitle}
            </div>
          ) : null}
          <h1 className="mt-7 max-w-4xl font-heading text-6xl leading-[0.94] text-[#4a3a36] md:text-7xl">
            {page.title}
          </h1>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[32px] border border-[#e2cfcb] bg-white p-8 shadow-[0_20px_60px_rgba(201,169,166,0.12)] lg:p-10">
          <div className="prose max-w-none whitespace-pre-line text-[15px] leading-8 text-[#5f5553]">
            {page.content}
          </div>
        </article>
        {children ? (
          <aside className="rounded-[32px] border border-[#e2cfcb] bg-[linear-gradient(180deg,#fffefd_0%,#f7f0ee_100%)] p-8 shadow-[0_20px_60px_rgba(201,169,166,0.12)]">
            {children}
          </aside>
        ) : null}
      </section>
    </div>
  );
}
