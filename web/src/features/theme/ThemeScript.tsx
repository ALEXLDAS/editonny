'use client';
import { THEME_KEY } from './theme';

// Runs before the first paint so a saved light theme never flashes dark. Mirrors parseTheme and guards blocked storage.
const SCRIPT = `try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_KEY)}));if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeScript() {
  // A client render (Next serves notFound() pages as an error shell) never runs the script and ThemeToggle applies the
  // theme instead; a data-block type there keeps React from warning about the inert script.
  return <script suppressHydrationWarning type={typeof window === 'undefined' ? undefined : 'text/plain'} dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
