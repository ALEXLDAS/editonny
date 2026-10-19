import { Button, Eyebrow, Highlight, Icon, Marquee } from '@editonny/design-system';
import photo from '@editonny/design-system/assets/imagery/matheus-gomes.jpeg';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { NewTabLink } from '@/components/shell/NewTabLink';
import { AUTHOR, REPOSITORY_URL } from '@/lib/links';
import { Race } from './Race';
import styles from './home.module.css';

/** The editor-versus-Editonny comparison and the open-source offer: free, with everything included. */
export function Offer({ scenes, requests }: { scenes: number; requests: number }) {
  const t = useTranslations('Home.offer');
  const common = useTranslations('Common');
  const footer = useTranslations('Footer');
  return (
    <section id="open-source" className={`${styles.section} ${styles.sectionDeep}`} aria-labelledby="offer-title">
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <Eyebrow index="07">{t('eyebrow')}</Eyebrow>
          <h2 className={`${styles.h2} ${styles.offerTitle}`} id="offer-title">{t('titleA')}<Highlight tone="white" nowrap>{t('highlight')}</Highlight>{t('titleB')}</h2>
          <p className={styles.lead}>{t('lead')}</p>
        </div>
        <div className={styles.offerGrid}>
          <Race />
          <div className={styles.offerCard}>
            <div className={styles.offerTop}>
              <span className={styles.offerTag}><Icon name="github" size={16} />{t('tag')}</span>
              <span className={styles.offerRepo}>{REPOSITORY_URL.replace('https://github.com/', '')}</span>
            </div>
            <div className={styles.offerOld}><s>{t('oldPrice')}</s><span>{t('promo')}</span></div>
            <p className={styles.offerPrice}><b>{t('price')}</b><span>{t('forever')}</span></p>
            <h3 className={styles.offerHeading}>{t('title')}</h3>
            <div className={styles.offerActions}>
              <Button href={REPOSITORY_URL} as={NewTabLink} variant="dark" size="lg" block icon="github" label={`${t('repo')} ${common('newTab')}`}>{t('repo')}</Button>
              <Button href="#guide" variant="white" block icon="terminal">{t('guide')}</Button>
            </div>
            <ul className={styles.included}>
              {([1, 2, 3, 4, 5] as const).map(n => <li key={n}><Icon name="check" size={16} />{t(`included${n}`, { scenes, requests })}</li>)}
            </ul>
            <div className={styles.offerCreator}>
              <Image src={photo} alt="" width={48} height={48} />
              <span><strong>{footer('madeBy')} {AUTHOR.name}</strong><span>{t('creatorNote')}</span></span>
            </div>
            <p className={styles.offerNote}>{t('promoNote')}</p>
          </div>
        </div>
        <div className={styles.offerTape}>
          <Marquee tone="volt" size={40} speed={30} items={[t('procrast'), `96× ${t('result')}`]} />
          <p className={styles.note}>{t('footnote')}</p>
        </div>
      </div>
    </section>
  );
}
