'use client';
import { Button, Eyebrow, Highlight, Icon } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import { useState, type CSSProperties } from 'react';
import styles from './home.module.css';

const PLATES = [1, 2, 3, 4] as const;
const BARS = [30, 60, 45, 80, 35, 20, 70, 90, 50, 40, 65, 30, 85, 55, 25, 75, 45, 60, 35, 80, 50, 30, 70, 40, 60, 90, 35, 55, 45, 65];

/** One edit as four stacked layers (raw take, cut, captions, motion) that separate or assemble; the list highlights a layer. */
export function Anatomy() {
  const t = useTranslations('Home.anatomy');
  const bench = useTranslations('Home.bench');
  const [separated, setSeparated] = useState(true);
  const [focus, setFocus] = useState<number | null>(null);
  const layer = (index: number) => ({
    '--z': `${(separated ? index * 64 : index * 4) + (focus === index ? 22 : 0)}`,
    opacity: focus === null || focus === index ? 1 : 0.28,
  }) as CSSProperties;
  return (
    <section id="anatomy" className={styles.section} aria-labelledby="anatomy-title">
      <div className={styles.split}>
        <div className={styles.stackStage} aria-hidden="true">
          <div className={styles.stack}>
            <div className={styles.stackBase} />
            <div className={styles.layer} style={layer(0)}>
              <div className={styles.layerShadow} />
              <div className={styles.plateRaw}>
                <span className={styles.plateTag}>{t('tagRaw')}</span>
                {[[3, 1, 2], [2, 2, 1], [1, 4]].map((row, r) => (
                  <div key={r} className={styles.plateRow}>{row.map((grow, i) => <span key={i} data-cut={(r === 0 && i === 1) || (r === 1 && i === 2) || (r === 2 && i === 0) ? 'true' : undefined} style={{ flexGrow: grow }} />)}</div>
                ))}
                <div className={styles.plateBars}>{BARS.map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div>
              </div>
            </div>
            <div className={styles.layer} style={layer(1)}>
              <div className={styles.plateCut}>
                <span className={styles.cutMark} style={{ left: '34%', width: '12%' }} />
                <span className={styles.cutMark} style={{ left: '72%', width: '9%' }} />
                <span className={styles.cutPill}><Icon name="scissors" size={12} />{t('tagCut')}</span>
              </div>
            </div>
            <div className={styles.layer} style={layer(2)}>
              <div className={styles.plateCaption}>{t('captionA')}<span>{t('captionB')}</span>{t('captionC')}</div>
              <span className={styles.plateCaptionTag}>{t('tagCaption')}</span>
            </div>
            <div className={styles.layer} style={layer(3)}>
              <div className={styles.plateMotion}>
                {(['step1', 'step2', 'step3'] as const).map((key, i) => <div key={key} className={styles.stepCard} data-index={i}>{`0${i + 1} ${bench(key)}`}</div>)}
              </div>
              <div className={styles.plateScan}><span /></div>
            </div>
          </div>
        </div>
        <div className={styles.sectionCopy}>
          <Eyebrow index="01">{t('eyebrow')}</Eyebrow>
          <h2 className={styles.h2} id="anatomy-title">{t('titleA')}<Highlight>{t('highlight')}</Highlight></h2>
          <p className={styles.lead}>{t('lead')}</p>
          <ol className={styles.plates}>
            {PLATES.map((n, index) => (
              <li key={n}>
                <button type="button" className={styles.plateItem} aria-pressed={focus === index} data-dim={focus !== null && focus !== index ? 'true' : undefined}
                  onMouseEnter={() => setFocus(index)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(index)} onBlur={() => setFocus(null)}
                  onClick={() => setFocus(index)}>
                  <span className={styles.plateNumber}>{`0${n}`}</span>
                  <span className={styles.plateText}><strong>{t(`plate${n}Title`)}</strong><span>{t(`plate${n}Text`)}</span></span>
                </button>
              </li>
            ))}
          </ol>
          <div>
            <Button variant="outline" icon={separated ? 'layers' : 'layers-2'} onClick={() => { setSeparated(value => !value); setFocus(null); }}>{separated ? t('assemble') : t('separate')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
