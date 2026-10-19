import { Accordion, Eyebrow, Highlight, Icon } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { CopyButton, ExampleButton } from './GuideActions';
import styles from './home.module.css';

/** Four steps from opening the agent to the first request, the install request to paste, and the FAQ. */
export function Guide({ firstVideo }: { firstVideo: string }) {
  const t = useTranslations('Home.guide');
  const install = useTranslations('Install');
  const library = useTranslations('Library');
  const faq = [
    [t('faqFreeTitle'), t('faqFreeBody')], [install('faq7Title'), install('faq7Body')], [install('faq2Title'), install('faq2Body')],
    [install('faq1Title'), install('faq1Body')], [install('faq5Title'), install('faq5Body')], [install('faq3Title'), install('faq3Body')],
    [install('faq4Title'), install('faq4Body')], [t('faqCatalogTitle'), t('faqCatalogBody')],
  ].map(([title, body]) => ({ title: title!, body: body! }));
  const step = (n: 1 | 2 | 3 | 4, extra?: ReactNode) => (
    <li className={styles.guideStep}>
      <span className={styles.guideNumber} aria-hidden="true">{`0${n}`}</span>
      <div><h3>{t(`step${n}Title`)}</h3><p>{t(`step${n}Text`)}</p>{extra}</div>
    </li>
  );
  return (
    <section id="guide" className={styles.section} aria-labelledby="guide-title">
      <div className={`${styles.container} ${styles.guide}`}>
        <div className={styles.guideMain}>
          <div className={styles.sectionTitle}>
            <Eyebrow index="06">{t('eyebrow')}</Eyebrow>
            <h2 className={styles.h2} id="guide-title">{t('titleA')}<Highlight>{t('highlight')}</Highlight></h2>
          </div>
          <ol className={styles.guideSteps}>
            {step(1)}
            {step(2, (
              <div className={styles.installCard} data-copy-source>
                <div className={styles.installHead}>
                  <span className={styles.installKicker}>{t('askKicker')}</span>
                  <CopyButton text={install('askRequest')} label={t('copyInstall')} success={t('installCopied')} fallback={library('copyFallback')} />
                </div>
                <p>{t('askLead')}</p>
                <pre className={styles.code} tabIndex={0}>{install('askRequest')}</pre>
                <span className={styles.installNote}><Icon name="check" size={14} color="var(--accent-2-text)" />{t('installNote')}</span>
              </div>
            ))}
            {step(3)}
            {step(4, <div className={styles.guideAction}><ExampleButton id="first-video">{t('firstVideo', { title: firstVideo })}</ExampleButton></div>)}
          </ol>
          <Link href="/install" className={styles.textLink}>{t('terminal')} <Icon name="arrow-up-right" size={16} /></Link>
        </div>
        <Accordion items={faq} defaultOpen={-1} />
      </div>
    </section>
  );
}
