'use client';
import { Button, Eyebrow, Highlight, SegmentedControl } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { NewTabLink } from '@/components/shell/NewTabLink';
import { REPOSITORY_URL } from '@/lib/links';
import { useCopy } from '../feedback/use-copy';
import { CaptionsStage, CutStage, FONTS, FormatStage, MotionStage, type Frame, type Pick } from './LabStages';
import { LibraryLink } from './LibraryLink';
import styles from './home.module.css';

const TABS = ['cut', 'captions', 'motion', 'format'] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS = { cut: 'tabCut', captions: 'tabCaptions', motion: 'tabMotion', format: 'tabFormat' } as const;

/** Input, request, and result for four requests, each with a schematic stage the visitor can operate. */
export function Lab({ scenes }: { scenes: Record<Pick, { id: string; name: string }> }) {
  const t = useTranslations('Home.lab');
  const nav = useTranslations('Nav');
  const common = useTranslations('Common');
  const library = useTranslations('Library');
  const copy = useCopy();
  const request = useRef<HTMLParagraphElement>(null);
  const [tab, setTab] = useState<Tab>('cut');
  const [edited, setEdited] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [font, setFont] = useState<(typeof FONTS)[number]['key']>('impact');
  const [pick, setPick] = useState<Pick>('steps');
  const [frame, setFrame] = useState<Frame>('9:16');
  const text = {
    cut: { input: t('cut.input'), request: t('cut.request'), output: t('cut.output') },
    captions: { input: t('captions.input'), request: t('captions.request'), output: t('captions.output') },
    motion: { input: t(`picks.${pick}.input`), request: t(`picks.${pick}.request`), output: t('motionOutput') },
    format: { input: t('format.input'), request: t('format.request', { format: frame }), output: t('format.output') },
  }[tab];
  const scene = scenes[pick];
  return (
    <section id="lab" className={`${styles.section} ${styles.sectionDeep}`} aria-labelledby="lab-title">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>
            <Eyebrow index="03">{t('eyebrow')}</Eyebrow>
            <h2 className={styles.h2} id="lab-title">{t('titleA')}<Highlight tone="volt">{t('highlight')}</Highlight></h2>
          </div>
          <p className={styles.sectionLead}>{t('lead')}</p>
        </div>
        <div className={styles.labTabs}>
          <SegmentedControl tone="solid" label={t('tabsLabel')} value={tab} onChange={value => setTab(value as Tab)} options={TABS.map(value => ({ value, label: t(TAB_LABELS[value]) }))} />
        </div>
        <div className={styles.labGrid}>
          <div className={styles.labStage}>
            <span className={styles.stageTag}>{t('schematic')}</span>
            {tab === 'cut' && <CutStage edited={edited} onEdited={setEdited} />}
            {tab === 'captions' && <CaptionsStage on={captions} font={font} onOn={setCaptions} onFont={setFont} />}
            {tab === 'motion' && <MotionStage pick={pick} onPick={setPick} />}
            {tab === 'format' && <FormatStage frame={frame} onFrame={setFrame} />}
          </div>
          <div className={styles.labCard}>
            <div className={styles.labRow}><span className={styles.mono}>{t('input')}</span><p>{text.input}</p></div>
            <div className={styles.labRow} data-tone="accent">
              <span className={styles.mono}>{t('request')}</span>
              <div className={styles.labRequest}>
                <p ref={request}>“{text.request}”</p>
                <Button variant="dark" size="sm" icon="copy" onClick={() => copy(text.request, { success: t('copied'), fallback: library('copyFallback') }, request.current)}>{t('copy')}</Button>
              </div>
            </div>
            <div className={styles.labRow} data-tone="volt"><span className={styles.mono}>{t('output')}</span><p>{text.output}</p></div>
            {tab === 'motion' && (
              <LibraryLink request={{ tab: 'scenes', query: scene.name }} className={styles.labScene}>
                <span aria-hidden="true">✦</span> {t('catalogScene')} {scene.name}<span className={styles.labSceneId}>{scene.id}</span>
              </LibraryLink>
            )}
            <p className={styles.labFoot}>{t('footnote')}</p>
          </div>
        </div>
        <div className={styles.labCta}>
          <span>{t('cta')}</span>
          <Button href={REPOSITORY_URL} as={NewTabLink} variant="outline" size="sm" icon="github" label={`${nav('getSkill')} ${common('newTab')}`}>{nav('getSkill')}</Button>
        </div>
      </div>
    </section>
  );
}
