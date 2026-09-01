import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDocBySlug, getAllDocSlugs } from '@/config/docs';
import { DocsPageView } from '@/components/docs';
import { seoMeta, canonicalUrl, getBreadcrumbSchema } from '@/config/seo';

export async function generateStaticParams() {
  return [{ slug: [] }, ...getAllDocSlugs().map((slug) => ({ slug: [slug] }))];
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  if (segments && segments.length > 1) return { title: 'Not Found' };
  const currentSlug = segments?.[0] || 'overview';
  const doc = getDocBySlug(currentSlug);
  if (!doc) return { title: 'Not Found' };

  const url = canonicalUrl(`/documentation/${currentSlug === 'overview' ? '' : currentSlug + '/'}`);
  const title = `${doc.title} - Zenth Docs`;

  return {
    title,
    description: doc.subtitle,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description: doc.subtitle,
      siteName: seoMeta.siteName,
      locale: seoMeta.locale,
      images: [seoMeta.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: doc.subtitle,
      creator: seoMeta.twitterHandle,
      images: [seoMeta.ogImage.url],
    },
  };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug: segments } = await params;
  if (segments && segments.length > 1) notFound();
  const currentSlug = segments?.[0] || 'overview';
  const doc = getDocBySlug(currentSlug);
  if (!doc) notFound();

  const breadcrumbLd = JSON.stringify(
    getBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Documentation', href: '/documentation/' },
      { name: doc.title, href: `/documentation/${currentSlug === 'overview' ? '' : currentSlug + '/'}` },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />
      <DocsPageView page={doc} />
    </>
  );
}
