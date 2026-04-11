import { ContactForm } from '@/components/contact-form';
import { ManagedContentPage } from '@/components/managed-content-page';
import { buildMetadata } from '@/lib/seo';
import { getWebsitePage } from '@/lib/storefront-api';
import { getFallbackPage, siteConfig } from '@/data/catalog';

export async function generateMetadata() {
  const page = (await getWebsitePage('contact')) || getFallbackPage('contact');
  return buildMetadata({
    title: page?.seoTitle || `Contact | ${siteConfig.name}`,
    description: page?.seoDescription || page?.subtitle || `Contact ${siteConfig.name}`,
    path: '/contact',
  });
}

export default async function ContactPage() {
  const page = (await getWebsitePage('contact')) || getFallbackPage('contact');

  return (
    <ManagedContentPage page={page}>
      <div className="space-y-8">
        <div className="space-y-3 text-sm leading-7 text-[#675d5a]">
          <div><strong>Email:</strong> {siteConfig.contactEmail}</div>
          <div><strong>Phone:</strong> {siteConfig.phone}</div>
          <div><strong>Address:</strong> {siteConfig.address}</div>
        </div>
        <ContactForm />
      </div>
    </ManagedContentPage>
  );
}
