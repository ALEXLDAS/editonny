import type { AppPathname } from '@/i18n/routing';

/** Home sections in page order with their `Nav` message keys; the header and phone menu link to them from every page. */
export const SECTIONS = [
  { id: 'demo', key: 'demo' },
  { id: 'features', key: 'features' },
  { id: 'lab', key: 'lab' },
  { id: 'library', key: 'library' },
  { id: 'guide', key: 'guide' },
  { id: 'open-source', key: 'openSource' },
] as const;

export type NavItem = { href: AppPathname; key: 'home' | 'create' | 'catalog' | 'examples' | 'install' };
/** Standalone pages, listed in the phone menu and the footer. */
export const PAGES: NavItem[] = [{ href: '/', key: 'home' }, { href: '/create', key: 'create' }, { href: '/catalog', key: 'catalog' }, { href: '/examples', key: 'examples' }, { href: '/install', key: 'install' }];
