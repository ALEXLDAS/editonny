'use client';
import { Button } from '@editonny/design-system';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { NewTabLink } from '@/components/shell/NewTabLink';
import { REPOSITORY_URL } from '@/lib/links';
import { showInLibrary } from './library-events';
import styles from './home.module.css';

const AFTER_HERO = 700;

/** Below 1100 px, once the hero scrolls away, a bottom bar keeps the library and the repository one tap away. */
export function MobileBar() {
  const t = useTranslations('Home.bar');
  const nav = useTranslations('Nav');
  const common = useTranslations('Common');
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > AFTER_HERO);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  if (!visible) return null;
  return (
    <div className={styles.mobileBar}>
      <Button href="#library" variant="glass" block onClick={event => { event.preventDefault(); showInLibrary({ tab: 'examples', scroll: true }); }}>{t('resources')}</Button>
      <Button href={REPOSITORY_URL} as={NewTabLink} block icon="github" label={`${nav('getSkill')} ${common('newTab')}`}>{nav('getSkill')}</Button>
    </div>
  );
}
