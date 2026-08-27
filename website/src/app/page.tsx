import React from 'react';
import { Header } from '@/components/layout';
import { Hero } from '@/components/hero';

export default function HomePage() {
  return (
    <main className="fixed inset-0 w-full h-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#0a0a0a] overflow-hidden select-none selection:bg-emerald-500 selection:text-black">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Hero Section */}
      <Hero />
    </main>
  );
}
