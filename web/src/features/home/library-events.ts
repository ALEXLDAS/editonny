'use client';
import { useEffect, useEffectEvent } from 'react';

export type LibraryTab = 'examples' | 'scenes';
/** What another home section asks the library to show: a tab, a search, an item's dialog, and whether to go there. */
export type LibraryRequest = { tab?: LibraryTab; query?: string; open?: string; scroll?: boolean };

const EVENT = 'editonny:library';

/**
 * Points the home library at `request`. The mounted library handles it, so a copy of the page that Next.js keeps
 * hidden after a navigation is never the target.
 */
export function showInLibrary(request: LibraryRequest) {
  window.dispatchEvent(new CustomEvent<LibraryRequest>(EVENT, { detail: request }));
}

/** Runs `handler` for every request sent with `showInLibrary`. */
export function useLibraryRequests(handler: (request: LibraryRequest) => void) {
  const onRequest = useEffectEvent((event: Event) => handler((event as CustomEvent<LibraryRequest>).detail));
  useEffect(() => {
    window.addEventListener(EVENT, onRequest);
    return () => window.removeEventListener(EVENT, onRequest);
  }, []);
}
