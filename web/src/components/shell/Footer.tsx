import { Icon, Wordmark } from '@editonny/design-system';
import photo from '@editonny/design-system/assets/imagery/matheus-gomes.jpeg';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import NextLink from 'next/link';
import { getPathname, Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { AUTHOR, REPOSITORY_URL } from '@/lib/site';
import styles from './shell.module.css';

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale });
  const newTab = <span className="ds-visually-hidden">{t('Common.newTab')}</span>;
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Wordmark size={22} />
          <p>{t('Footer.tagline')}</p>
          <a href={REPOSITORY_URL} className={styles.footerCreator} target="_blank" rel="noopener noreferrer">
            <Image src={photo} alt="" width={32} height={32} className={styles.footerPhoto} />
            <span>{t('Footer.madeBy')} <strong>{AUTHOR.name}</strong> · <span className={styles.footerOpen}>{t('Home.hero.metaOpen')}</span></span>
            {newTab}
          </a>
        </div>
        <nav aria-label={t('Footer.label')} className={styles.footerNav}>
          <Link href="/examples">{t('Footer.requests')}</Link>
          <Link href="/catalog">{t('Footer.scenes')}</Link>
          <Link href="/create">{t('Nav.create')}</Link>
          <Link href="/install">{t('Footer.install')}</Link>
          <NextLink href={`${getPathname({ locale, href: '/' })}#how-it-works`}>{t('Footer.requirements')}</NextLink>
          <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer"><Icon name="github" size={16} />GitHub{newTab}</a>
          <a href={AUTHOR.instagram} rel="author noopener noreferrer" target="_blank">Instagram{newTab}</a>
          <a href={`mailto:${AUTHOR.email}`}>{AUTHOR.email}</a>
        </nav>
        <p className={styles.footerNote}>{t('Footer.note')} {t('Footer.credits', { name: AUTHOR.name })} {t('Footer.license')}</p>
      </div>
    </footer>
  );
}
