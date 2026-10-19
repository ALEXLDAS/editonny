import { Eyebrow, Highlight, Icon } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import { LibraryLink } from './LibraryLink';
import styles from './home.module.css';

const EDITOR = [['cuts', 'scissors'], ['story', 'clapperboard'], ['captions', 'type'], ['audio', 'volume-2'], ['reframe', 'crop']] as const;
const MOTION = [['lists', 'list-ordered'], ['comparisons', 'columns-2'], ['numbers', 'trending-up'], ['diagrams', 'git-fork'], ['catalog', 'sparkles']] as const;

/** The two services: the Editor (cut and finish) and Motion (speech becomes scenes), each linking to its library tab. */
export function Features({ scenes }: { scenes: number }) {
  const t = useTranslations('Home.features');
  return (
    <section id="features" className={`${styles.section} ${styles.sectionTight}`} aria-labelledby="features-title">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>
            <Eyebrow index="02">{t('eyebrow')}</Eyebrow>
            <h2 className={styles.h2} id="features-title">{t('titleA')}<Highlight>{t('highlight')}</Highlight></h2>
          </div>
          <p className={styles.sectionLead}>{t('lead')}</p>
        </div>
        <div className={styles.services}>
          <article className={styles.service}>
            <div className={styles.serviceHead}>
              <div><span className={styles.serviceTag}>{t('editorTag')}</span><h3 className={styles.serviceTitle}>{t('editorTitle')}</h3></div>
              <span className={styles.serviceMark} data-mark="ED" aria-hidden="true" />
            </div>
            <ul className={styles.featureList}>
              {EDITOR.map(([key, icon]) => (
                <li key={key}><span className={styles.featureIcon}><Icon name={icon} size={20} /></span><span><strong>{t(`editor.${key}.title`)}</strong><span>{t(`editor.${key}.text`)}</span></span></li>
              ))}
            </ul>
            <LibraryLink request={{ tab: 'examples', query: '' }} className={styles.serviceLink}>{t('editorLink')} <Icon name="arrow-up-right" size={16} /></LibraryLink>
          </article>
          <article className={styles.service} data-tone="accent">
            <div className={styles.serviceHead}>
              <div><span className={styles.serviceTag}>{t('motionTag')}</span><h3 className={styles.serviceTitle}>{t('motionTitle')}</h3></div>
              <span className={styles.serviceMark} data-mark="MO" aria-hidden="true" />
            </div>
            <ul className={styles.featureList}>
              {MOTION.map(([key, icon]) => (
                <li key={key}><span className={styles.featureIcon}><Icon name={icon} size={20} /></span><span><strong>{t(`motion.${key}.title`, { scenes })}</strong><span>{t(`motion.${key}.text`)}</span></span></li>
              ))}
            </ul>
            <LibraryLink request={{ tab: 'scenes', query: '' }} className={styles.serviceLink}>{t('motionLink', { scenes })} <Icon name="arrow-up-right" size={16} /></LibraryLink>
          </article>
        </div>
      </div>
    </section>
  );
}
