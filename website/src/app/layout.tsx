import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Zenth — Autonomous Self-Learning Trading Platform',
  description:
    'Zenth is an autonomous self-learning cryptocurrency paper trading terminal connected to multi-exchange feeds with strict risk controls.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen w-full bg-[#0a0a0a] text-neutral-100 antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
