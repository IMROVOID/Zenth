import type { MetadataRoute } from 'next';
import { assetPath } from '@/config/assets';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zenth',
    short_name: 'Zenth',
    description: 'Autonomous self-learning cryptocurrency paper trading terminal.',
    start_url: assetPath('/'),
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: assetPath('/images/logo.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      { src: assetPath('/favicon.ico'), sizes: '48x48', type: 'image/x-icon' },
    ],
  };
}
