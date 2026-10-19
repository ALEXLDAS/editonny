import { getScenes } from '@/features/catalog/scenes';
import { getExamples } from '@/features/examples/examples';
import { Hero } from '@/features/home/Hero';
import { Bento, Callout, HowItWorks, StartingPoints, Stats, Tapes } from '@/features/home/Sections';
import { ClientMessages } from '@/i18n/ClientMessages';
import type { AppLocale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/site';

const STARTS = ['lesson', 'introduce', 'demonstrate'];

// shortcut: home prefetch triggers unused CSS warnings; restore after the router fix.
export const prefetch = 'force-disabled';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  return pageMetadata((await params).locale as AppLocale, 'home');
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as AppLocale;
  const examples = getExamples(locale);
  const scenes = getScenes(locale).length;
  return <ClientMessages groups={['Home.bento', 'Home.phone']}>
    <Hero />
    <Tapes scenes={scenes} />
    <Stats scenes={scenes} requests={examples.length} />
    <Bento />
    <HowItWorks />
    <StartingPoints starts={STARTS.map(id => examples.find(example => example.id === id)!).filter(Boolean)} total={examples.length} />
    <Callout />
  </ClientMessages>;
}
