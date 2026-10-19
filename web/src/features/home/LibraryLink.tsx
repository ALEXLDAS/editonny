'use client';
import type { ReactNode } from 'react';
import { showInLibrary, type LibraryRequest } from './library-events';

/** A link to the home library that also picks its tab or search; without JavaScript it still jumps to the section. */
export function LibraryLink({ request, className, children }: { request: LibraryRequest; className?: string; children: ReactNode }) {
  return <a href="#library" className={className} onClick={event => { event.preventDefault(); showInLibrary({ ...request, scroll: true }); }}>{children}</a>;
}
