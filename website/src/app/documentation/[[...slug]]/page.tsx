import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allDocPages, getDocBySlug, getAllDocSlugs } from '@/config/docs';
import { DocsPageView } from '@/components/docs';

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return [
    { slug: [] },
    ...slugs.map((slug) => ({
      slug: [slug],
    })),
  ];
}

interface DocumentationPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: DocumentationPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  // If multi-segment or unknown, handle gracefully
  if (resolvedParams.slug && resolvedParams.slug.length > 1) {
    return { title: 'Not Found — Zenth Documentation' };
  }
  const currentSlug = resolvedParams.slug?.[0] || 'overview';
  const doc = getDocBySlug(currentSlug);
  if (!doc) {
    return { title: 'Not Found — Zenth Documentation' };
  }

  return {
    title: `${doc.title} — Zenth Documentation`,
    description: doc.subtitle,
  };
}

export default async function DocumentationPage({
  params,
}: DocumentationPageProps) {
  const resolvedParams = await params;
  if (resolvedParams.slug && resolvedParams.slug.length > 1) {
    notFound();
  }
  const currentSlug = resolvedParams.slug?.[0] || 'overview';
  const doc = getDocBySlug(currentSlug);
  if (!doc) {
    notFound();
  }

  return <DocsPageView page={doc} />;
}
