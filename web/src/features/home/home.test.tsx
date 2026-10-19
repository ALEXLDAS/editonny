import { act, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import messages from '../../../messages/en-US.json';
import { stubOffscreen } from '../../../../design-system/components/offscreen.testing';
import { familyOf, PROFESSIONS_FAMILY } from '../catalog/families';
import { Bench, STEP_AT } from './Bench';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

const renderInEnglish = (node: ReactNode) => render(<NextIntlClientProvider locale="en-US" messages={messages}>{node}</NextIntlClientProvider>);

it('the workbench edits itself step by step while on screen', () => {
  vi.useFakeTimers();
  renderInEnglish(<Bench />);
  expect(screen.getByText(messages.Home.bench.badgeRaw)).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(STEP_AT[0]!); });
  expect(screen.getByText(messages.Home.bench.marked)).toBeInTheDocument();
  for (let step = 1; step < STEP_AT.length; step++) act(() => { vi.advanceTimersByTime(STEP_AT[step]! - STEP_AT[step - 1]!); });
  expect(screen.getByText(messages.Home.bench.sampleReady)).toBeInTheDocument();
});

it('the workbench waits off screen', () => {
  vi.useFakeTimers();
  stubOffscreen();
  renderInEnglish(<Bench />);
  act(() => { vi.advanceTimersByTime(STEP_AT.at(-1)!); });
  expect(screen.getByText(messages.Home.bench.badgeRaw)).toBeInTheDocument();
});

it('a chapter parks the workbench on its step while time passes', () => {
  vi.useFakeTimers();
  renderInEnglish(<Bench />);
  act(() => { screen.getByRole('button', { name: messages.Home.bench.chapterMotion }).click(); });
  act(() => { vi.advanceTimersByTime(STEP_AT.at(-1)! * 2); });
  expect(screen.getByText(messages.Home.bench.method)).toBeInTheDocument();
  expect(screen.queryByText(messages.Home.bench.sampleReady)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: messages.Home.bench.chapterMotion })).toHaveAttribute('aria-pressed', 'true');
});

it('profession categories, panels, and demonstrations share one family', () => {
  for (const category of ['Health', 'Legal panels', 'Dental demonstrations', 'Creators']) expect(familyOf(category)).toBe(PROFESSIONS_FAMILY);
  for (const category of ['General', 'Pointers', 'Proof cards']) expect(familyOf(category)).toBe(category);
});
