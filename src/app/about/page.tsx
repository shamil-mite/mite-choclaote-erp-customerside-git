import { ManagedContentPage } from '@/components/managed-content-page';
import { buildMetadata } from '@/lib/seo';
import { getWebsitePage } from '@/lib/storefront-api';
import { getFallbackPage, siteConfig } from '@/data/catalog';

export async function generateMetadata() {
  const page = (await getWebsitePage('about')) || getFallbackPage('about');
  return buildMetadata({
    title: page?.seoTitle || `About Us | ${siteConfig.name}`,
    description: page?.seoDescription || page?.subtitle || siteConfig.description,
    path: '/about',
  });
}

export default async function AboutPage() {
  const page = (await getWebsitePage('about')) || getFallbackPage('about');

  return (
    <ManagedContentPage page={page}>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[#8b6f6b]">Brand summary</div>
          <h2 className="mt-3 font-heading text-4xl text-[#4a3a36]">Built for premium presentation and repeat purchase.</h2>
        </div>
        <p className="text-sm leading-8 text-[#675d5a]">
          Use the ERP admin module <strong>Website Pages</strong> to manage this banner and copy without changing frontend code.
        </p>
      </div>
    </ManagedContentPage>
  );
}

