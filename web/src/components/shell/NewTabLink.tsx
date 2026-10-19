import type { AnchorHTMLAttributes } from 'react';

/** An anchor that opens in a new tab; plugs into design-system components through `as`. Name the new tab in the link text. */
export function NewTabLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}
