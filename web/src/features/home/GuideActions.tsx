'use client';
import { Button } from '@editonny/design-system';
import { useCopy } from '../feedback/use-copy';
import { showInLibrary } from './library-events';

/** Copies `text`; without clipboard access it selects the `pre` of its card (`data-copy-source`) for manual copying. */
export function CopyButton({ text, label, success, fallback }: { text: string; label: string; success: string; fallback: string }) {
  const copy = useCopy();
  return <Button size="sm" icon="copy" onClick={event => copy(text, { success, fallback }, event.currentTarget.closest('[data-copy-source]')?.querySelector('pre'))}>{label}</Button>;
}

/** Opens a library example's dialog in place. */
export function ExampleButton({ id, children }: { id: string; children: string }) {
  return <Button variant="dark" size="sm" iconRight="arrow-up-right" onClick={() => showInLibrary({ tab: 'examples', open: id })}>{children}</Button>;
}
