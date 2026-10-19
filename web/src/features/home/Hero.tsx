import { Aurora, Button, CreatorChip, Eyebrow, KineticText } from '@editonny/design-system';
import photo from '@editonny/design-system/assets/imagery/matheus-gomes.jpeg';
import { useTranslations } from 'next-intl';
import { NewTabLink } from '@/components/shell/NewTabLink';
import { AUTHOR, REPOSITORY_URL } from '@/lib/links';
import { Bench } from './Bench';
import styles from './home.module.css';

/** Creator, headline with the rotating keyword, calls to action, and the self-editing workbench. */
export function Hero() {
  const t = useTranslations('Home.hero');
  const nav = useTranslations('Nav');
  const common = useTranslations('Common');
  return (
    <section id="demo" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroAurora} aria-hidden="true"><Aurora intensity={0.55} grain palette="fire" /></div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <CreatorChip name={AUTHOR.name} role={t('creatorRole')} status={t('creatorStatus')} photo={photo.src} href={REPOSITORY_URL} newTabLabel={common('newTab')} className={styles.creator} />
          <Eyebrow dot>{t('eyebrow')}</Eyebrow>
          <h1 className={styles.heroTitle} id="hero-title">
            <span>{t('line1')}</span>
            <span>{t('line2')}</span>
            <span><KineticText words={t('words').split('|')} interval={2400} /></span>
          </h1>
          <p className={styles.heroLead}>{t('leadA')}<span>{t('leadHighlight')}</span>{t('leadB')}</p>
          <div className={styles.heroActions}>
            <Button href={REPOSITORY_URL} as={NewTabLink} size="lg" icon="github" label={`${nav('getSkill')} ${common('newTab')}`}>{nav('getSkill')}</Button>
            <Button href="#library" size="lg" variant="outline">{t('explore')}</Button>
          </div>
          <ul className={styles.heroMeta}>
            <li>{t('metaFree')}</li>
            <li>{t('metaOpen')}</li>
            <li>{t('metaAgents')}</li>
          </ul>
        </div>
        <Bench />
      </div>
    </section>
  );
}
