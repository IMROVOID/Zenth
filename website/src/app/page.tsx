import React from 'react';
import { Header, Footer } from '@/components/layout';
import { Hero } from '@/components/hero';
import { WhatIsZenth } from '@/components/what-is-zenth';
import { KeyFeatures } from '@/components/key-features';
import { HowItWorks } from '@/components/how-it-works';
import { QuickStart } from '@/components/quick-start';
import { Faq } from '@/components/faq';

export default function HomePage() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-[#0a0a0a] overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Hero Section */}
      <Hero />

      {/* What is Zenth Product Showcase Section */}
      <WhatIsZenth />

      {/* How it Works Autonomous Signal-to-Execution Pipeline Section */}
      <HowItWorks />

      {/* Key Features Bento Section */}
      <KeyFeatures />

      {/* Quick Start / Installation Section */}
      <QuickStart />

      {/* Frequently Asked Questions Section */}
      <Faq />

      {/* Bottom Footer Section */}
      <Footer />
    </main>
  );
}

