import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import { seoMeta, canonicalUrl, getSoftwareAppSchema } from '@/config/seo';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(seoMeta.siteUrl),
  title: {
    default: 'Zenth - Autonomous Self-Learning Trading Platform',
    template: '%s - Zenth Docs',
  },
  description:
    'Autonomous paper trading terminal with multi-exchange feeds, adaptive self-learning memory, and institutional risk management. Zero API keys required.',
  keywords: [...seoMeta.keywords],
  authors: [{ name: seoMeta.author, url: 'https://github.com/IMROVOID' }],
  creator: seoMeta.author,
  publisher: seoMeta.siteName,
  alternates: { canonical: canonicalUrl('/') },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: seoMeta.locale,
    url: canonicalUrl('/'),
    siteName: seoMeta.siteName,
    title: 'Zenth - Autonomous Self-Learning Trading Platform',
    description:
      'Autonomous paper trading terminal with multi-exchange feeds, adaptive self-learning memory, and institutional risk management.',
    images: [seoMeta.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenth - Autonomous Self-Learning Trading Platform',
    description:
      'Autonomous paper trading terminal with multi-exchange feeds, adaptive self-learning memory, and institutional risk management.',
    creator: seoMeta.twitterHandle,
    images: [seoMeta.ogImage.url],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo.svg',
  },
  manifest: '/manifest.webmanifest',
};

const ldJson = JSON.stringify(getSoftwareAppSchema());

// ponytail: inlined & minified to avoid double-escaping in here-doc; readability traded for safety.
const themeScript = [
  '(function(){try{',
  'var m=document.cookie.match(/(?:^|;\\s*)zenth_docs_theme=([^;]+)/);',
  "var p=m?m[1]:localStorage.getItem('zenth_docs_theme');",
  "var e=localStorage.getItem('zenth_docs_theme_exp');",
  'if(e&&Date.now()>parseInt(e,10)){p=null;}',
  "var d=p==='dark'||(!p||p==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches:false);",
  "var r=d?'dark':'light';",
  'document.documentElement.classList.add(r);',
  "document.documentElement.classList.remove(d?'light':'dark');",
  "document.documentElement.setAttribute('data-theme',r);",
  '}catch(ex){}})()',
].join('');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson }} />
      </head>
      <body className="min-h-screen w-full bg-[var(--docs-bg-primary,rgb(16,16,16))] text-[var(--docs-text-primary,rgb(242,240,236))] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
