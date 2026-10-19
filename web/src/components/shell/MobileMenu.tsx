'use client';
import { Dialog, IconButton } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { REPOSITORY_URL } from '@/lib/links';
import { PAGES, SECTIONS } from './nav';
import styles from './shell.module.css';

/** Below 1100 px the section links move into this dialog, followed by the standalone pages. */
export function MobileMenu({ home }: { home: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className={styles.mobileOnly}>
      <IconButton icon="menu" label={t('Header.openMenu')} variant="ghost" size={40} aria-expanded={open} onClick={() => setOpen(true)} />
      <Dialog open={open} title={t('Header.menuTitle')} closeLabel={t('Header.closeMenu')} onClose={close} width={420}>
        <nav aria-label={t('Nav.label')}>
          <ul className={styles.menuList}>
            {SECTIONS.map(section => (
              <li key={section.id}><NextLink href={`${home}#${section.id}`} className={styles.menuLink} onClick={close}>{t(`Nav.${section.key}`)}</NextLink></li>
            ))}
          </ul>
          <h3 className={styles.menuGroup}>{t('Nav.pages')}</h3>
          <ul className={styles.menuList}>
            {PAGES.map(item => (
              <li key={item.href}>
                <Link href={item.href} className={styles.menuPage} aria-current={pathname === item.href ? 'page' : undefined} onClick={close}>{t(`Nav.${item.key}`)}</Link>
              </li>
            ))}
            <li>
              <a href={REPOSITORY_URL} className={styles.menuPage} target="_blank" rel="noopener noreferrer">
                GitHub <span className="ds-visually-hidden">{t('Common.newTab')}</span>
              </a>
            </li>
          </ul>
        </nav>
      </Dialog>
    </div>
  );
}
