import { describe, expect, it } from 'vitest';
import { createPrompt, scenePrompt } from './prompt';

// Golden strings produced by the previous guide's builder (web/model.mjs) for the same inputs.
const GOLDEN_EMPTY = "$editonny\n\nEdit the videos in: [enter the video folder]\nGoal: turn the footage into a clear, engaging video.\nFormat: 9:16 (vertical).\nPace: natural, preserving intentional pauses.\nCaptions: readable, with subtle emphasis on important words.\nVisuals: subtle, only when they help explain the speech.\n\nStandard editing cleanup: Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions. Preserve complete words, natural pacing, intentional pauses, and the meaning of the speech. Measure cuts against the actual recording and review transitions so speech is not clipped. For targeted revisions, apply cleanup only within the requested editing scope; preserve unrelated content and approved timing.\n\nFirst check the environment and files. Preserve the originals, spoken words, and meaning. Do not invent prices, results, or testimonials. Prepare an 8\u201315 second sample for me to review before finishing the full video. Do not use paid services or upload media to third parties without my authorization. When finished, report the output file and the checks performed.";
const GOLDEN_FULL = "/editonny\n\nEdit the videos in: /Users/Ana/Raw videos\nGoal: teach photography.\nFormat: 16:9 (horizontal).\nPace: dynamic, with precise cuts that preserve complete words.\nCaptions: no captions.\nVisuals: educational, with steps, pointers, and titles.\nCatalog reference: Revenue growth (revenue-growth). Adapt the text to the actual footage.\n\nStandard editing cleanup: Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions. Preserve complete words, natural pacing, intentional pauses, and the meaning of the speech. Measure cuts against the actual recording and review transitions so speech is not clipped. For targeted revisions, apply cleanup only within the requested editing scope; preserve unrelated content and approved timing.\n\nFirst check the environment and files. Preserve the originals, spoken words, and meaning. Do not invent prices, results, or testimonials. Prepare an 8\u201315 second sample for me to review before finishing the full video. Do not use paid services or upload media to third parties without my authorization. When finished, report the output file and the checks performed.";
const GOLDEN_SCENE = "$editonny\n\nEdit the videos in: [enter the video folder]\nGoal: edit my video using this visual reference.\nFormat: 9:16 (vertical).\nPace: natural, preserving intentional pauses.\nCaptions: readable, with subtle emphasis on important words.\nVisuals: subtle, only when they help explain the speech.\nCatalog reference: Revenue counter (revenue-counter). Adapt the text to the actual footage.\n\nStandard editing cleanup: Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions. Preserve complete words, natural pacing, intentional pauses, and the meaning of the speech. Measure cuts against the actual recording and review transitions so speech is not clipped. For targeted revisions, apply cleanup only within the requested editing scope; preserve unrelated content and approved timing.\n\nFirst check the environment and files. Preserve the originals, spoken words, and meaning. Do not invent prices, results, or testimonials. Prepare an 8\u201315 second sample for me to review before finishing the full video. Do not use paid services or upload media to third parties without my authorization. When finished, report the output file and the checks performed.";
const CLEANUP = 'Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions.';
const FULL = { agent: 'claude', folder: '/Users/Ana/Raw videos', goal: 'teach photography', format: 'horizontal', pace: 'dynamic', captions: 'none', effects: 'educational' } as const;
const SCENE = { id: 'revenue-growth', name: 'Revenue growth' };

describe('createPrompt in English', () => {
  it('matches the previous builder for an empty draft', () => {
    expect(createPrompt({}, 'en-US')).toBe(GOLDEN_EMPTY);
  });

  it('matches the previous builder for a full draft with a scene', () => {
    expect(createPrompt(FULL, 'en-US', SCENE)).toBe(GOLDEN_FULL);
  });

  it('matches the previous scene request', () => {
    expect(scenePrompt({ id: 'revenue-counter', name: 'Revenue counter' }, 'codex', 'en-US')).toBe(GOLDEN_SCENE);
  });

  it('does not double the final period of a goal that already ends a sentence', () => {
    expect(createPrompt({ goal: 'Teach photography.' }, 'en-US')).toContain('Goal: Teach photography.\n');
    expect(createPrompt({ goal: 'Can you tighten the intro?' }, 'en-US')).toContain('Goal: Can you tighten the intro?\n');
  });
});

describe('createPrompt in every locale', () => {
  it.each(['en-US', 'pt-BR', 'es'] as const)('%s starts with the agent entry and keeps user data verbatim', locale => {
    const goal = 'Explique a preparação do café — '.repeat(60).trim();
    const prompt = createPrompt({ agent: 'claude', folder: '  /Videos/Málaga/東京  ', goal }, locale);
    expect(prompt.startsWith('/editonny\n')).toBe(true);
    expect(prompt).toContain('/Videos/Málaga/東京');
    expect(prompt).toContain(goal);
    expect(createPrompt({}, locale).startsWith('$editonny\n')).toBe(true);
  });

  it.each(['en-US', 'pt-BR', 'es'] as const)('%s states the cleanup policy exactly once', locale => {
    const prompt = createPrompt(FULL, locale, SCENE);
    const cleanup = createPrompt({}, locale).split('\n\n')[2]!;
    expect(prompt.split(cleanup).length - 1).toBe(1);
  });

  it('keeps the canonical English cleanup sentence', () => {
    expect(createPrompt({}, 'en-US')).toContain(CLEANUP);
  });

  it.each(['en-US', 'pt-BR', 'es'] as const)('%s drops the scene reference when visuals are off', locale => {
    const withScene = createPrompt({ effects: 'subtle' }, locale, SCENE);
    const withoutVisuals = createPrompt({ effects: 'none' }, locale, SCENE);
    expect(withScene).toContain('revenue-growth');
    expect(withoutVisuals).not.toContain('revenue-growth');
  });

  it('localizes the template outside the user data', () => {
    expect(createPrompt({}, 'pt-BR')).not.toContain('Edit the videos in');
    expect(createPrompt({}, 'es')).not.toContain('Edit the videos in');
    expect(createPrompt({ format: 'portrait' }, 'pt-BR')).toContain('4:5');
  });
});
