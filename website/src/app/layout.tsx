import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

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
  const themeInitScript = `
    (function() {
      try {
        var match = document.cookie.match(/(?:^|;\\s*)zenth_docs_theme=([^;]+)/);
        var pref = match ? match[1] : localStorage.getItem('zenth_docs_theme');
        var exp = localStorage.getItem('zenth_docs_theme_exp');
        if (exp && Date.now() > parseInt(exp, 10)) { pref = null; }
        var isDark = pref === 'dark' || (!pref || pref === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);
        var resolved = isDark ? 'dark' : 'light';
        document.documentElement.classList.add(resolved);
        document.documentElement.classList.remove(isDark ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', resolved);
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen w-full bg-[var(--docs-bg-primary,rgb(16,16,16))] text-[var(--docs-text-primary,rgb(242,240,236))] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

