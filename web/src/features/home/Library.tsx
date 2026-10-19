'use client';
import { Button, Chip, Eyebrow, Highlight, Icon, PromptCard, SceneCard, SegmentedControl } from '@editonny/design-system';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { familyOf } from '../catalog/families';
import { backgroundFor, motifFor } from '../catalog/motif';
import type { Scene } from '../catalog/scenes';
import { SceneDialog, useSceneLabels } from '../catalog/CatalogView';
import type { Example } from '../examples/examples';
import { ExampleDialog } from '../examples/ExamplesView';
import { useDraft } from '../preferences/use-draft';
import { AGENTS, type Agent } from '../request/options';
import { phrasesFor } from '../request/phrases';
import { filterExamples, filterScenes } from '../search';
import { useLibraryRequests, type LibraryTab } from './library-events';
import styles from './home.module.css';

const PAGE = 12;
const MORE = 24;
const AGENT_LABELS: Record<Agent, string> = { codex: 'Codex', claude: 'Claude Code' };
type Filter = { key: string; label: string };
type LibraryProps = { examples: Example[]; scenes: Scene[]; categories: Filter[]; families: Filter[] };

/**
 * Ready-made requests and motion scenes in one searchable library. Other sections steer it with `showInLibrary`.
 * The agent choice is the visitor's saved brief, so copied requests start with `$editonny` or `/editonny`.
 */
export function Library({ examples, scenes, categories, families }: LibraryProps) {
  const t = useTranslations('Home.library');
  const locale = useLocale() as AppLocale;
  const labels = useSceneLabels();
  const [draft, updateDraft] = useDraft();
  const [tab, setTab] = useState<LibraryTab>('examples');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState({ examples: '', scenes: '' });
  const [shown, setShown] = useState({ examples: PAGE, scenes: PAGE });
  const [open, setOpen] = useState<{ tab: LibraryTab; id: string } | null>(null);
  const section = useRef<HTMLElement>(null);

  const search = (value: string) => { setQuery(value); setShown({ examples: PAGE, scenes: PAGE }); };
  useLibraryRequests(request => {
    if (request.tab) setTab(request.tab);
    if (request.query !== undefined) { search(request.query); setFilter({ examples: '', scenes: '' }); }
    if (request.open) setOpen({ tab: request.tab ?? 'examples', id: request.open });
    if (request.scroll) {
      section.current?.scrollIntoView();
      section.current?.focus({ preventScroll: true });
    }
  });

  const matchedExamples = filterExamples(examples, query, '', phrasesFor(locale));
  const matchedScenes = filterScenes(scenes, query, '');
  const isExamples = tab === 'examples';
  const current = filter[tab];
  const visibleExamples = matchedExamples.filter(example => !filter.examples || example.category === filter.examples);
  const visibleScenes = matchedScenes.filter(scene => !filter.scenes || familyOf(scene.category) === filter.scenes);
  const total = isExamples ? visibleExamples.length : visibleScenes.length;
  const chips = (isExamples ? categories : families).map(item => ({
    ...item,
    count: isExamples ? matchedExamples.filter(example => example.category === item.key).length : matchedScenes.filter(scene => familyOf(scene.category) === item.key).length,
  }));
  const choose = (key: string) => { setFilter(value => ({ ...value, [tab]: value[tab] === key ? '' : key })); setShown(value => ({ ...value, [tab]: PAGE })); };
  const openExample = open?.tab === 'examples' ? examples.find(example => example.id === open.id) : undefined;
  const openScene = open?.tab === 'scenes' ? scenes.findIndex(scene => scene.id === open.id) : -1;
  const close = () => setOpen(null);

  return (
    <section ref={section} id="library" tabIndex={-1} className={`${styles.section} ${styles.sectionDeep}`} aria-labelledby="library-title">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>
            <Eyebrow index="05">{t('eyebrow')}</Eyebrow>
            <h2 className={styles.h2} id="library-title">{t('titleA')}<Highlight>{t('highlight')}</Highlight></h2>
          </div>
          <p className={styles.sectionLead}>{t('lead', { requests: examples.length, scenes: scenes.length })}</p>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.toolbarRow}>
            <div className={styles.libraryTabs} role="group" aria-label={t('tabsLabel')}>
              <Chip tone="orange" selected={isExamples} count={matchedExamples.length} onClick={() => setTab('examples')}>{t('tabPrompts')}</Chip>
              <Chip tone="orange" selected={!isExamples} count={matchedScenes.length} onClick={() => setTab('scenes')}>{t('tabScenes')}</Chip>
            </div>
            <label className={styles.search}>
              <Icon name="search" size={16} color="var(--text-3)" />
              <input type="search" value={query} onChange={event => search(event.target.value)} placeholder={isExamples ? t('placeholderPrompts') : t('placeholderScenes')} aria-label={t('search')} autoComplete="off" />
            </label>
            <div className={styles.agent}>
              <span className={styles.mono} aria-hidden="true">{t('agent')}</span>
              <SegmentedControl size="sm" label={t('agent')} value={draft.agent} onChange={value => updateDraft({ agent: value as Agent })} options={AGENTS.map(value => ({ value, label: AGENT_LABELS[value] }))} />
            </div>
          </div>
          <div className={styles.chipRow} role="group" aria-label={t('filters')}>
            <Chip size="sm" selected={!current} count={isExamples ? matchedExamples.length : matchedScenes.length} onClick={() => choose('')}>{isExamples ? t('allObjectives') : t('allFamilies')}</Chip>
            {chips.map(item => <Chip key={item.key} size="sm" selected={current === item.key} count={item.count} onClick={() => choose(item.key)}>{item.label}</Chip>)}
          </div>
        </div>
        <p className={styles.results} aria-live="polite">
          {isExamples ? t('promptsCount', { count: total }) : t('scenesCount', { count: total })}{query.trim() && ` ${t('resultsFor', { query: query.trim() })}`}
        </p>
        {total === 0 ? <div className={styles.empty}>{t('emptyA')} “{query}”. {t('emptyB')}</div> : isExamples ? (
          <ul className={styles.promptGrid}>
            {visibleExamples.slice(0, shown.examples).map(example => (
              <li key={example.id}>
                <PromptCard index={String(examples.indexOf(example) + 1).padStart(2, '0')} category={example.categoryLabel} title={example.title} summary={example.summary}
                  action={t('action')} onClick={() => setOpen({ tab: 'examples', id: example.id })} className={styles.fill} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.sceneGrid}>
            {visibleScenes.slice(0, shown.scenes).map(scene => {
              const index = scenes.indexOf(scene);
              return (
                <li key={scene.id}>
                  <SceneCard name={scene.name} group={scene.categoryLabel} when={scene.whenToUse} motif={motifFor(scene.category, index)} bg={backgroundFor(index)}
                    duration={scene.duration} format={scene.format} labels={labels} onClick={() => setOpen({ tab: 'scenes', id: scene.id })} className={styles.fill} />
                </li>
              );
            })}
          </ul>
        )}
        <div className={styles.libraryFoot}>
          {total > shown[tab] && <Button variant="outline" icon="plus" onClick={() => setShown(value => ({ ...value, [tab]: value[tab] + MORE }))}>{t('more', { count: total - shown[tab] })}</Button>}
          {!isExamples && <p className={styles.note}>{t('thumbsNote')}</p>}
          <Link href={isExamples ? '/examples' : '/catalog'} className={styles.textLink}>{isExamples ? t('examplesLink') : t('catalogLink')} <Icon name="arrow-up-right" size={16} /></Link>
        </div>
      </div>
      {openExample && <ExampleDialog example={openExample} onClose={close} />}
      {openScene >= 0 && <SceneDialog scene={scenes[openScene]!} index={openScene} onClose={close} />}
    </section>
  );
}
