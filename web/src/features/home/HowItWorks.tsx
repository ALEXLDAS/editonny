import { Eyebrow, Highlight, Icon } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import styles from './home.module.css';

const NEEDS = [['needAgent', 'needAgentValue'], ['Python', 'needPythonValue'], ['uv', 'needUvValue'], ['needFfmpeg', 'needFfmpegValue'], ['needNode', 'needNodeValue']] as const;

/** Three steps from download to the first request, what the computer needs, and who charges for what. */
export function HowItWorks() {
  const t = useTranslations('Home.how');
  // Tool names stay as written; the other labels are messages.
  const label = (key: string) => (key.startsWith('need') ? t(key as 'needAgent') : key);
  return (
    <section id="how-it-works" className={styles.section} aria-labelledby="how-title">
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <Eyebrow index="04">{t('eyebrow')}</Eyebrow>
          <h2 className={styles.h2} id="how-title">{t('titleA')}<Highlight>{t('highlight')}</Highlight></h2>
          <p className={styles.lead}>{t('lead')}</p>
        </div>
        <ol className={styles.howSteps}>
          {([1, 2, 3] as const).map(n => (
            <li key={n}>
              <span className={styles.outlineNumber} aria-hidden="true">{`0${n}`}</span>
              <h3>{t(`step${n}Title`)}</h3>
              <p>{t(`step${n}Text`)}</p>
            </li>
          ))}
        </ol>
        <div className={styles.howCards}>
          <div className={styles.howCard}>
            <h3><Icon name="cpu" size={18} color="var(--accent-2-text)" />{t('needTitle')}</h3>
            <dl className={styles.needs}>
              {NEEDS.map(([name, value]) => <div key={name}><dt>{label(name)}</dt><dd>{t(value)}</dd></div>)}
            </dl>
            <p className={styles.howNote}>{t('needNote')}</p>
          </div>
          <div className={styles.howCard}>
            <h3><Icon name="receipt" size={18} color="var(--warning)" />{t('costTitle')}</h3>
            <ul className={styles.costs}>
              {([1, 2, 3] as const).map(n => <li key={n}><strong>{t(`cost${n}Title`)}</strong> {t(`cost${n}Text`)}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
