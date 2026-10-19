'use client';
import { useInterval, useInView, useReducedMotion } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import { useRef, useState, type CSSProperties } from 'react';
import styles from './home.module.css';

const RUN = 6000;
const TICK = 40;
const VIDEOS = 96;
const WORKDAY_MINUTES = 480;

/** One workday, played once on screen: a hired editor delivers one video, Editonny about one every five minutes. Illustrative. */
export function Race() {
  const t = useTranslations('Home.offer');
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [elapsed, setElapsed] = useState(0);
  const done = reduced || elapsed >= RUN;
  // Plays once while on screen; the button stops it on the result or replays it (WCAG 2.2.2).
  useInterval(() => setElapsed(value => Math.min(RUN, value + TICK)), done || !inView ? null : TICK);
  const progress = done ? 1 : elapsed / RUN;
  const ours = Math.min(VIDEOS, Math.floor(progress * (VIDEOS + 0.99)));
  const minutes = Math.round(progress * WORKDAY_MINUTES);
  const clock = `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
  const row = (name: string, cost: string, count: number, fill: number, label: string, tone: 'editor' | 'editonny') => (
    <div className={styles.raceRow} data-tone={tone} data-done={done ? 'true' : undefined}>
      <div className={styles.raceHead}>
        <div><strong>{name}</strong><span>{cost}</span></div>
        <div className={styles.raceCount}><b>{count}</b><span>{count === 1 ? t('videoWord') : t('videosWord')}</span></div>
      </div>
      <div className={styles.raceTrack} style={{ '--fill': `${fill}%` } as CSSProperties}><span className={styles.raceFill} /><span className={styles.raceLabel}>{label}</span></div>
    </div>
  );
  return (
    <div ref={root} className={styles.race}>
      <p className="ds-visually-hidden">{`${t('raceTitle')}: ${t('editorName')} 1, ${t('editonnyName')} ${VIDEOS}. ${VIDEOS}× ${t('result')}`}</p>
      <div className={styles.raceTop}>
        <span className={styles.mono} aria-hidden="true">{t('raceTitle')}</span>
        {!reduced && <button type="button" className={styles.replay} onClick={() => setElapsed(done ? 0 : RUN)}>{done ? t('raceReplay') : t('raceSkip')}</button>}
        <span className={styles.raceClock} aria-hidden="true"><span data-done={done ? 'true' : undefined} />{clock}<small>/ 8h00</small></span>
      </div>
      <div aria-hidden="true" className={styles.raceRows}>
        {row(t('editorName'), t('editorCost'), done ? 1 : 0, done ? 4 : progress * 4, done ? t('delivered') : t('editing'), 'editor')}
        {row(t('editonnyName'), t('editonnyCost'), ours, (ours / VIDEOS) * 100, ours > 14 ? t('barLabel') : '', 'editonny')}
      </div>
      <div className={styles.raceResult} aria-hidden="true" data-done={done ? 'true' : undefined}><b>{VIDEOS}×</b><span>{t('result')}</span></div>
    </div>
  );
}
