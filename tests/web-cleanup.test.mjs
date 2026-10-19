import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPreset, createPrompt, scenePrompt } from '../web/model.mjs';
import { prompts } from '../web/prompts.mjs';

const cleanup = 'Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions.';

test('custom editing requests include cleanup without changing Unicode user data', () => {
  const prompt = createPrompt({ folder: '/Videos/Málaga/東京', goal: 'Explain café preparation', agent: 'claude' });
  assert.ok(prompt.includes(cleanup));
  assert.ok(prompt.includes('/Videos/Málaga/東京'));
  assert.ok(prompt.includes('Explain café preparation'));
  assert.match(prompt, /^\/editonny/);
  assert.ok(prompt.includes('Preserve complete words, natural pacing, intentional pauses, and the meaning of the speech.'));
});

test('scene requests and every personalized example retain the shared cleanup default once', () => {
  const requests = [scenePrompt({ id: 'revenue-growth', name: 'Revenue growth' }),
    ...prompts.map(example => createPrompt(applyPreset({ folder: '/raw videos', agent: 'codex' }, example)))];
  for (const request of requests) {
    assert.equal(request.split(cleanup).length - 1, 1);
    assert.match(request, /^\$editonny/);
    assert.ok(request.includes('Measure cuts against the actual recording'));
  }
});

test('targeted revisions keep the requested scope and approved timing', () => {
  const prompt = createPrompt({ goal: 'Correct only the caption at 00:12; keep all other timing unchanged.' });
  assert.ok(prompt.includes('Correct only the caption at 00:12; keep all other timing unchanged.'));
  assert.ok(prompt.includes('For targeted revisions, apply cleanup only within the requested editing scope; preserve unrelated content and approved timing.'));
});
