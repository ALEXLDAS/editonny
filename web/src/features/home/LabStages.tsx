'use client';
import { Chip, KineticCaption, SegmentedControl, Switch, useReducedMotion, Waveform } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { Footage } from './Footage';
import styles from './home.module.css';

/** Kind of each word in the lab transcript: kept word, pause, or mistake. Every locale has the same eleven tokens. */
const KINDS = ['word', 'pause', 'word', 'word', 'mistake', 'word', 'pause', 'word', 'mistake', 'word', 'word'] as const;
const RAW_CUTS: Array<[number, number]> = [[0.08, 0.17], [0.4, 0.44], [0.6, 0.68], [0.72, 0.8]];
export const FONTS = [
  { key: 'impact', label: 'fontImpact', font: 'var(--font-caption-impact)', uppercase: true, size: 24 },
  { key: 'clean', label: 'fontClean', font: 'var(--font-caption-clean)', uppercase: false, size: 20 },
  { key: 'hand', label: 'fontHand', font: 'var(--font-caption-hand)', uppercase: false, size: 28 },
  { key: 'marker', label: 'fontMarker', font: 'var(--font-caption-marker)', uppercase: true, size: 20 },
] as const;
export const PICKS = ['steps', 'beforeAfter', 'number', 'question'] as const;
export type Pick = (typeof PICKS)[number];
/** Illustrative frame width (px at full size) and aspect ratio per format. */
export const FRAMES = { '9:16': [190, '9 / 16'], '16:9': [440, '16 / 9'], '1:1': [300, '1 / 1'], '4:5': [270, '4 / 5'] } as const;
export type Frame = keyof typeof FRAMES;

export function CutStage({ edited, onEdited }: { edited: boolean; onEdited(value: boolean): void }) {
  const t = useTranslations('Home.lab');
  return (
    <div className={styles.cutStage}>
      <p className={styles.transcript}>
        {t('tokens').split('|').map((token, i) => (
          <span key={i} aria-hidden="true" data-kind={KINDS[i]} data-gone={edited && KINDS[i] !== 'word' ? 'true' : undefined}>{token}</span>
        ))}
        <span className="ds-visually-hidden">{t('tokens').split('|').filter((_, i) => !edited || KINDS[i] === 'word').join(' ')}</span>
      </p>
      <Waveform bars={64} height={44} color="var(--orange-500)" muted="var(--surface-tile-hover)" progress={1} cuts={edited ? [] : RAW_CUTS} />
      <div className={styles.stageControls}>
        <SegmentedControl size="sm" label={t('tabCut')} value={edited ? 'edited' : 'raw'} onChange={value => onEdited(value === 'edited')}
          options={[{ value: 'raw', label: t('cutRaw') }, { value: 'edited', label: t('cutEdited') }]} />
        <span className={styles.stageInfo} aria-live="polite">{edited ? t('cutInfoEdited') : t('cutInfoRaw')}</span>
      </div>
    </div>
  );
}

export function CaptionsStage({ on, font, onOn, onFont }: { on: boolean; font: (typeof FONTS)[number]['key']; onOn(value: boolean): void; onFont(value: (typeof FONTS)[number]['key']): void }) {
  const t = useTranslations('Home.lab');
  const reduced = useReducedMotion();
  const style = FONTS.find(item => item.key === font) ?? FONTS[0];
  return (
    <div className={styles.stageColumn}>
      <Footage className={styles.labPhone}>
        {on && <div className={styles.labCaption}><KineticCaption text={t('captionSample')} wps={2.4} highlight="var(--sun-400)" font={style.font} size={style.size} uppercase={style.uppercase} playing={!reduced} loop /></div>}
      </Footage>
      <div className={styles.stageChips}>
        <Switch checked={on} label={t('captionsLabel')} onChange={onOn} />
        {FONTS.map(item => <Chip key={item.key} tone="sun" font={item.font} selected={on && font === item.key} onClick={() => { onFont(item.key); onOn(true); }}>{t(item.label)}</Chip>)}
      </div>
    </div>
  );
}

export function MotionStage({ pick, onPick }: { pick: Pick; onPick(value: Pick): void }) {
  const t = useTranslations('Home.lab');
  const bench = useTranslations('Home.bench');
  return (
    <div className={styles.stageColumn}>
      <div className={styles.motionPhone} aria-hidden="true">
        {pick === 'steps' && <div className={styles.motionSteps}>{(['step1', 'step2', 'step3'] as const).map((key, i) => <div key={key} className={styles.stepCard} data-index={i}>{`0${i + 1} ${bench(key)}`}</div>)}</div>}
        {pick === 'beforeAfter' && <div className={styles.motionCompare}><span>{t('before')}</span><span>{t('after')}</span></div>}
        {pick === 'number' && <div className={styles.motionNumber}><b>↑ 240%</b><div>{[30, 55, 78, 100].map((height, i) => <span key={height} data-index={i} style={{ height: `${height}%` }} />)}</div></div>}
        {pick === 'question' && <div className={styles.motionQuestion}><span>{t('question')}</span><span>{t('answer')}</span></div>}
      </div>
      <div className={styles.stageChips}>
        {PICKS.map(key => <Chip key={key} tone="orange" selected={pick === key} onClick={() => onPick(key)}>{t(`picks.${key}.label`)}</Chip>)}
      </div>
    </div>
  );
}

export function FormatStage({ frame, onFrame }: { frame: Frame; onFrame(value: Frame): void }) {
  const t = useTranslations('Home.lab');
  const [width, ratio] = FRAMES[frame];
  return (
    <div className={styles.stageColumn}>
      <div className={styles.frameBox}>
        <Footage className={styles.frame} style={{ '--frame-width': width, '--frame-ratio': ratio } as CSSProperties}>
          <span className={styles.frameSafe} />
          <span className={styles.frameLabel}>{frame}</span>
        </Footage>
      </div>
      <SegmentedControl size="sm" label={t('tabFormat')} value={frame} onChange={value => onFrame(value as Frame)} options={Object.keys(FRAMES)} />
    </div>
  );
}
