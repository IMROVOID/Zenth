import React from 'react';
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { Hero } from '@/components/hero';
import { WhatIsZenth } from '@/components/what-is-zenth';
import { KeyFeatures } from '@/components/key-features';
import { HowItWorks } from '@/components/how-it-works';
import { QuickStart } from '@/components/quick-start';
import { Faq } from '@/components/faq';
import { faqConfig } from '@/config';
import { canonicalUrl, getFaqSchema } from '@/config/seo';

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl('/') },
};

const faqLd = JSON.stringify(
  getFaqSchema(faqConfig.items.map((i) => ({ question: i.question, answer: i.answer })))
);

export default function HomePage() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-[#0a0a0a] overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd }} />
      <Header />
      <Hero />
      <WhatIsZenth />
      <HowItWorks />
      <KeyFeatures />
      <QuickStart />
      <Faq />
      <Footer />
    </main>
  );
}
