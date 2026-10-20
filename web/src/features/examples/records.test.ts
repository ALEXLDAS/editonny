// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { routing } from '@/i18n/routing';
import { applyExample, DEFAULT_DRAFT } from '../request/draft';
import { phrasesFor } from '../request/phrases';
import { createPrompt } from '../request/prompt';
import { getExamples } from './examples';

const VISUAL_EXAMPLES = [
  'first-video', 'environment-test', 'ad', 'reels', 'vsl', 'lesson', 'explain', 'introduce', 'demonstrate',
  'screen-camera', 'split-screen', 'evidence-card', 'background-cutout', 'paper-notes', 'answer-question',
  'bold-phrases', 'fullscreen-explainer', 'data-card', 'typed-request', 'gauge', 'search-comment', 'step-list',
  'profession-panel', 'hand-tracked-object', 'layered-depth', 'spatial-explanation', 'editing-process',
  'reference', 'visual-identity', 'polish', 'replace-hook', 'visual-pacing', 'reduce-clutter', 'clear-face',
  'animate-moment', 'change-format', 'generated-media', 'finish-sample', 'reuse-style', 'hook-versions', 'mobile-style',
];

describe.each(routing.locales)('%s example requests', locale => {
  it.each(VISUAL_EXAMPLES)('%s allows the visuals its goal requests or preserves', id => {
    const example = getExamples(locale).find(example => example.id === id)!;
    expect(example).toBeDefined();
    const draft = applyExample(DEFAULT_DRAFT, example);
    const request = createPrompt(draft, locale);
    expect(request).toContain(example.goal);
    expect(request).not.toContain(phrasesFor(locale).effects.none);
  });

  it('keeps default visuals off for take selection and audio-only work', () => {
    for (const id of ['select-takes', 'voice-effect', 'sound-effects', 'music', 'clean-audio']) {
      const example = getExamples(locale).find(example => example.id === id)!;
      expect(applyExample(DEFAULT_DRAFT, example).effects).toBe('none');
    }
  });
});
