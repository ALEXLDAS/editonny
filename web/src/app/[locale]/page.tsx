import { Marquee } from '@editonny/design-system';
import { getTranslations } from 'next-intl/server';
import { familyOf, PROFESSIONS_FAMILY } from '@/features/catalog/families';
import { getSceneCategories, getScenes } from '@/features/catalog/scenes';
import { getExampleCategories, getExamples } from '@/features/examples/examples';
import { Anatomy } from '@/features/home/Anatomy';
import { Features } from '@/features/home/Features';
import { Guide } from '@/features/home/Guide';
import { Hero } from '@/features/home/Hero';
import { HowItWorks } from '@/features/home/HowItWorks';
import { Lab } from '@/features/home/Lab';
import { Library } from '@/features/home/Library';
import { MobileBar } from '@/features/home/MobileBar';
import styles from '@/features/home/home.module.css';
import { Offer } from '@/features/home/Offer';
import { ClientMessages } from '@/i18n/ClientMessages';
import type { AppLocale } from '@/i18n/routing';
import { homeJsonLd, pageMetadata } from '@/lib/site';

/** Catalog scenes the lab's motion requests point to. */
const LAB_SCENES = { steps: 'three-steps', beforeAfter: 'before-after', number: 'revenue-counter', question: 'question-answer' } as const;

// shortcut: home prefetch triggers unused CSS warnings; restore after the router fix.
export const prefetch = 'force-disabled';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  return pageMetadata((await params).locale as AppLocale, 'home');
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as AppLocale;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const examples = getExamples(locale);
  const scenes = getScenes(locale);
  const counts = { scenes: scenes.length, requests: examples.length };
  const families = new Map<string, string>();
  for (const { key, label } of getSceneCategories(locale)) {
    const family = familyOf(key);
    if (!families.has(family)) families.set(family, family === PROFESSIONS_FAMILY ? t('library.professions') : label);
  }
  const labScenes = Object.fromEntries(Object.entries(LAB_SCENES).map(([pick, id]) => {
    const scene = scenes.find(item => item.id === id);
    if (!scene) throw new Error(`Lab scene missing from the catalog: ${id}`);
    return [pick, { id, name: scene.name }];
  })) as Record<keyof typeof LAB_SCENES, { id: string; name: string }>;
  return <ClientMessages groups={['Home.bench', 'Home.anatomy', 'Home.lab', 'Home.library', 'Home.offer', 'Home.bar', 'Library', 'Catalog', 'Examples', 'Nav', 'Common']}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: await homeJsonLd(locale) }} />
    <Hero />
    <div className={styles.tape}><Marquee tone="orange" size={44} speed={38} rotate={-2} items={t('marquee', counts).split('|')} /></div>
    <Anatomy />
    <Features scenes={counts.scenes} />
    <Lab scenes={labScenes} />
    <HowItWorks />
    <Library examples={examples} scenes={scenes} categories={getExampleCategories(locale)} families={[...families].map(([key, label]) => ({ key, label }))} />
    <Guide firstVideo={examples.find(example => example.id === 'first-video')!.title} />
    <Offer {...counts} />
    <MobileBar />
  </ClientMessages>;
}
