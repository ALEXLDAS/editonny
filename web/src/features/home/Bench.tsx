'use client';
import { Badge, Chip, Icon, KineticCaption, useInterval, useInView, useReducedMotion, Waveform } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import { useRef, useState, type CSSProperties } from 'react';
import { Footage } from './Footage';
import styles from './home.module.css';

/** Milliseconds on screen before each step: 1 pauses marked, 2 pauses cut, 3 captions, 4 motion, 5 sample ready. */
export const STEP_AT = [2200, 3600, 5600, 8100, 10700];
const LAST = STEP_AT.length;
const CHAPTERS = [
  { key: 'chapterRaw', target: 0, from: 0, to: 0 },
  { key: 'chapterPauses', target: 2, from: 1, to: 2 },
  { key: 'chapterCaptions', target: 3, from: 3, to: 3 },
  { key: 'chapterMotion', target: 4, from: 4, to: 4 },
  { key: 'chapterResult', target: 5, from: 5, to: 5 },
] as const;
const CHECKS = [{ key: 'check1', working: 1, done: 2 }, { key: 'check2', working: 3, done: 3 }, { key: 'check3', working: 4, done: 4 }, { key: 'check4', working: 5, done: 5 }] as const;
const CLAUSES = [[1, 2], [3, 3], [4, 4]] as const;
const PROGRESS = [0, 0.05, 0.25, 0.5, 0.75, 1];
/** Playhead position per step, as a fraction of the track lane. */
const PLAYHEAD = [0, 0.04, 0.12, 0.36, 0.62, 1];
const MARKED: Array<[number, number]> = [[0.2, 0.28], [0.44, 0.49], [0.74, 0.84]];
const PAUSES = [7, 4, 9];

/** Playing on a clock (`elapsed` ms on screen, stopping at step `until`) or parked on a chosen step. */
type Mode = { elapsed: number; until: number } | { step: number };

const phase = (step: number, from: number, to: number) => (step > to ? 'done' : step >= from ? 'active' : 'idle');

/**
 * The hero workbench: a request, its checklist, a 9:16 monitor, and a four-track timeline that edit themselves in
 * sequence while on screen. Chapters jump to a step; reduced motion shows the finished sample. Illustrative only.
 */
export function Bench() {
  const t = useTranslations('Home.bench');
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [mode, setMode] = useState<Mode>({ elapsed: 0, until: LAST });
  // Reduced motion starts on the finished sample; chapters still pick any step.
  const step = 'step' in mode ? mode.step : reduced ? LAST : STEP_AT.filter(at => mode.elapsed >= at).length;
  const next = 'elapsed' in mode && step < mode.until ? STEP_AT[step]! : null;
  useInterval(() => setMode(current => ('elapsed' in current && next !== null ? { ...current, elapsed: next } : current)),
    reduced || !inView || next === null || !('elapsed' in mode) ? null : next - mode.elapsed);

  // The pauses chapter shows the marks before cutting when it starts from the raw take.
  const jump = (target: number) => setMode(target === 2 && step < 1 && !reduced ? { elapsed: STEP_AT[0]!, until: 2 } : { step: target });
  const caption = t('caption');
  return (
    <div ref={root} className={styles.bench} data-step={step}>
      <div className={styles.benchBar}>
        <span className={styles.benchDot} data-tone="rec" />
        <span className={styles.benchDot} />
        <span className={styles.benchDot} />
        <span className={styles.benchTitle}>{t('title')}</span>
        <Badge tone="neutral" mono className={styles.benchBadge}>{t('badge')}</Badge>
      </div>
      <div className={styles.benchMain}>
        <div className={styles.monitorWell}>
          <Footage className={styles.monitor}>
            <div className={styles.monitorTop}>
              <Badge tone={step < 2 ? 'rec' : step === LAST ? 'volt' : 'solid'} mono live={step < 2}>{step < 2 ? t('badgeRaw') : step === LAST ? t('badgeFinal') : t('badgeEditing')}</Badge>
              <span className={styles.monitorTime}>{step >= 2 ? '0:31' : '0:42'}</span>
            </div>
            {step === 1 && <div className={styles.monitorMarked}><Icon name="scissors" size={14} />{t('marked')}</div>}
            {(step === 3 || step === LAST) && (
              <div className={styles.monitorCaption}>
                <KineticCaption text={caption} wps={2.6} highlight="var(--sun-400)" font="var(--font-caption-impact)" size={22} uppercase playing={!reduced} loop />
              </div>
            )}
            {step === 4 && (
              <div className={styles.monitorScene}>
                <span className={styles.monitorMethod}>{t('method')}</span>
                {(['step1', 'step2', 'step3'] as const).map((key, i) => (
                  <div key={key} className={styles.stepCard} data-index={i}><span>{`0${i + 1}`}</span><span>{t(key)}</span></div>
                ))}
              </div>
            )}
            {step === LAST && <div className={styles.monitorReady}><Icon name="check" size={13} />{t('sampleReady')}</div>}
          </Footage>
        </div>
        <div className={styles.benchSide}>
          <span className={styles.mono}>{t('request')}</span>
          <p className={styles.requestBubble}>
            “{CLAUSES.map(([from, to], i) => (
              <span key={from}>
                <span className={styles.clause} data-phase={phase(step, from, to)}>{t(`req${i * 2 + 1}` as 'req1')}</span>
                {t(`req${i * 2 + 2}` as 'req2')}
              </span>
            ))}”
          </p>
          <ul className={styles.checklist}>
            {CHECKS.map(check => {
              const state = step >= check.done ? 'done' : step >= check.working ? 'working' : 'idle';
              return (
                <li key={check.key} data-state={state}>
                  <span className={styles.checkDot} aria-hidden="true"><Icon name={state === 'done' ? 'check' : state === 'working' ? 'loader' : 'minus'} size={12} /></span>
                  {t(check.key)}
                </li>
              );
            })}
          </ul>
          <div className={styles.chapters} role="group" aria-label={t('chapters')}>
            {CHAPTERS.map(chapter => (
              <Chip key={chapter.key} size="sm" tone="orange" selected={step >= chapter.from && step <= chapter.to} onClick={() => jump(chapter.target)}>{t(chapter.key)}</Chip>
            ))}
            <button type="button" className={styles.replay} aria-label={t('replayLabel')} onClick={() => setMode({ elapsed: 0, until: LAST })}>
              <Icon name="rotate-ccw" size={14} />{t('replay')}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.timecodes}><span>00:00</span><span>00:10</span><span>00:20</span><span>{step >= 2 ? '00:31' : '00:42'}</span></div>
        <div className={styles.tracks}>
          <div className={styles.track}>
            <span className={styles.trackLabel}>{t('trackVideo')}</span>
            <div className={styles.clips}>
              {[18, 14, 20, 16].map((grow, i) => (
                <span key={grow} className={styles.clipGroup}>
                  <span className={styles.clip} style={{ flexGrow: grow }} />
                  {i < PAUSES.length && <span className={styles.pause} data-marked={step === 1 ? 'true' : undefined} style={{ flexGrow: step >= 2 ? 0 : PAUSES[i], transitionDelay: `${i * 80}ms` }} />}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.track}>
            <span className={styles.trackLabel}>{t('trackVoice')}</span>
            <Waveform bars={56} height={26} playing={!reduced} color="var(--orange-500)" muted="var(--surface-tile-hover)" progress={PROGRESS[step]} cuts={step === 1 ? MARKED : []} className={styles.trackWave} />
          </div>
          <div className={styles.track}>
            <span className={styles.trackLabel}>{t('trackCaption')}</span>
            <div className={styles.captionWords} data-visible={step >= 3 ? 'true' : undefined}>
              {caption.split(' ').slice(0, 9).map((word, i) => <span key={`${word}-${i}`}>{word}</span>)}
            </div>
          </div>
          <div className={styles.track}>
            <span className={styles.trackLabel}>{t('trackMotion')}</span>
            <div className={styles.motionLane}><span className={styles.motionChip} data-visible={step >= 4 ? 'true' : undefined}>{t('motionChip')}</span></div>
          </div>
          <span className={styles.playhead} style={{ '--playhead': PLAYHEAD[step] } as CSSProperties} />
        </div>
      </div>
      <p className={styles.benchNote}>{t('note')}</p>
    </div>
  );
}
