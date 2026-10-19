import { notFound } from 'next/navigation';

// This segment never renders content, so dev-time instant-navigation validation has nothing to check.
export const instant = false;

// Unknown paths inside a locale render the localized not-found page.
export default function CatchAll() {
  notFound();
}
