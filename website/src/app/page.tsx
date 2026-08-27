import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';

export default function HomePage() {
  return (
    <main className="h-screen max-h-screen w-full flex flex-col justify-between bg-[#0a0a0a] relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Hero Section */}
      <Hero />
    </main>
  );
}
