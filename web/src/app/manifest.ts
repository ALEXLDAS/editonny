import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'editonny',
    short_name: 'editonny',
    description: 'Local video editing through conversation: cuts, captions, sound, and motion with the AI you already use.',
    start_url: '/',
    display: 'standalone',
    background_color: BRAND.ink900,
    theme_color: BRAND.ink900,
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
