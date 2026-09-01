import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zenth',
    short_name: 'Zenth',
    description: 'Autonomous self-learning cryptocurrency paper trading terminal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/images/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
