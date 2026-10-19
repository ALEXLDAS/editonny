'use client';
import { Button, SiteHeader } from '@editonny/design-system';
import { useLocale, useTranslations } from 'next-intl';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { getPathname } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { REPOSITORY_URL } from '@/lib/links';
import { LanguageMenu } from './LanguageMenu';
import { MobileMenu } from './MobileMenu';
import { SECTIONS } from './nav';
import { NewTabLink } from './NewTabLink';
import styles from './shell.module.css';

/**
 * Shell links to the home page skip router prefetch: the prefetched home head preloads its section CSS and hero photo
 * into whatever page is open, and the browser then warns that they went unused.
 */
export const HomeLink = (props: ComponentProps<typeof NextLink>) => <NextLink {...props} prefetch={false} />;

/** Floating header: wordmark, links to the home sections (a menu below 1100 px), language, theme, and the repository. */
export function Header() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const home = getPathname({ locale, href: '/' });
  return (
    <SiteHeader linkAs={HomeLink} homeHref={home} homeLabel={t('Header.homeLabel')} navLabel={t('Nav.label')} wordmarkSize={20}
      links={SECTIONS.map(section => ({ label: t(`Nav.${section.key}`), href: `${home}#${section.id}` }))}
      right={<>
        <LanguageMenu />
        <ThemeToggle labels={{ toDark: t('Theme.toDark'), toLight: t('Theme.toLight') }} />
        <Button href={REPOSITORY_URL} as={NewTabLink} size="sm" icon="github" label={`${t('Nav.getSkill')} ${t('Common.newTab')}`} className={styles.headerCta}>{t('Nav.getSkill')}</Button>
        <MobileMenu home={home} />
      </>} />
  );
}
