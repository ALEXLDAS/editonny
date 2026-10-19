import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createPrompt, filterScenes, scenePrompt } from '../web/model.mjs';
const source = JSON.parse(await readFile(new URL('../skills/editonny/visuals/catalog.json', import.meta.url), 'utf8'));
test('search combines accent-insensitive terms and category', () => {
  const scenes = [{ name: 'Café comparison', category: 'Health', whenToUse: 'explain options', id: 'a' }, { name: 'Café comparison', category: 'Other', id: 'b' }];
  assert.equal(filterScenes(scenes, 'cafe comparison', 'Health').length, 1);
  assert.equal(filterScenes(scenes, 'nonexistent').length, 0);
  assert.equal(filterScenes(scenes, '  ').length, 2);
});
test('requests preserve spaced folders, choices, and editorial boundaries', () => {
  const prompt = createPrompt({ folder: '/Users/Ana/Raw videos', goal: 'teach photography', agent: 'claude', format: '16:9', scene: 'comparison' });
  assert.match(prompt, /^\/editonny/);
  for (const phrase of ['/Users/Ana/Raw videos', 'teach photography', '16:9', 'comparison', 'Preserve the originals', '8–15 second', 'paid services']) assert.ok(prompt.includes(phrase));
  assert.match(createPrompt({}), /^\$editonny/);
  assert.match(createPrompt({}), /enter the video folder/);
});
test('public catalog matches the installed catalog without claim text', async () => {
  const output = JSON.parse(await readFile(new URL('../web/catalog.json', import.meta.url), 'utf8'));
  assert.deepEqual(output.scenes.map(s => s.id), source.scenes.map(s => s.id));
  assert.ok(output.scenes.length > 0);
  assert.ok(output.scenes.every(s => !('texts' in s) && !('file' in s)));
  assert.match(scenePrompt(output.scenes[0]), new RegExp(output.scenes[0].id));
});
test('portrait feed format is available and preserved in requests', async () => {
  const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
  assert.match(html, /<option>4:5 \(portrait feed\)<\/option>/);
  assert.match(createPrompt({ format: '4:5 (portrait feed)' }), /Format: 4:5 \(portrait feed\)/);
});
test('example search combines terms across content and categories', async () => {
  const { filterPrompts } = await import('../web/model.mjs');
  assert.equal(typeof filterPrompts, 'function');
  const entries = [{ id: 'a', title: 'Review', category: 'Finishing', summary: 'Check audio', when: 'After the cut', goal: 'Preserve words', tips: ['Check breaths'] }, { id: 'b', title: 'Review', category: 'Editing', tips: [] }];
  assert.deepEqual(filterPrompts(entries, 'review breaths', 'Finishing'), [entries[0]]);
  assert.deepEqual(filterPrompts(entries, 'words cut'), [entries[0]]);
  assert.deepEqual(filterPrompts(entries, '  '), entries);
  assert.deepEqual(filterPrompts(entries, 'nonexistent'), []);
  assert.deepEqual(filterPrompts(entries, 'review', 'Another'), []);
});
test('personalization changes example fields and clears the previous scene', async () => {
  const { applyPreset } = await import('../web/model.mjs');
  assert.equal(typeof applyPreset, 'function');
  const current = { folder: '/Videos/Ana', agent: 'claude', format: '1:1 (square)', effects: 'previous', goal: 'previous', pace: 'calm', captions: 'no captions', scene: 'previous' };
  const result = applyPreset(current, { goal: 'Edit a lesson', format: '16:9 (horizontal)', effects: 'educational' });
  assert.deepEqual(result, { ...current, goal: 'Edit a lesson', format: '16:9 (horizontal)', effects: 'educational', scene: undefined });
  assert.equal(current.goal, 'previous');
  assert.equal(applyPreset(current, { goal: 'Review' }).format, current.format);
  assert.match(createPrompt(result), /^\/editonny/);
  assert.ok(createPrompt(result).includes('/Videos/Ana'));
  assert.ok(!createPrompt(result).includes('Catalog reference'));
});
test('library has unique IDs, complete content, and valid form presets', async () => {
  const { prompts } = await import('../web/prompts.mjs');
  const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
  assert.ok(prompts.length >= 9);
  assert.equal(new Set(prompts.map(prompt => prompt.id)).size, prompts.length);
  for (const id of ['vsl', 'lesson', 'reels', 'polish', 'hook-versions', 'interview', 'explain', 'introduce', 'demonstrate']) assert.ok(prompts.some(prompt => prompt.id === id), id);
  const options = name => [...html.match(new RegExp(`<select[^>]*name="${name}"[^>]*>(.*?)</select>`))[1].matchAll(/<option(?: value="([^"]*)")?>([^<]*)<\/option>/g)].map(match => match[1] ?? match[2]);
  const formats = options('format');
  const effects = options('effects');
  for (const prompt of prompts) {
    for (const field of ['id', 'title', 'category', 'summary', 'when', 'goal']) assert.ok(typeof prompt[field] === 'string' && prompt[field].trim(), `${prompt.id}: ${field}`);
    assert.ok(Array.isArray(prompt.tips) && prompt.tips.length > 0 && prompt.tips.every(tip => typeof tip === 'string' && tip.trim()), prompt.id);
    if (prompt.format) assert.ok(formats.includes(prompt.format), `${prompt.id}: ${prompt.format}`);
    if (prompt.effects) assert.ok(effects.includes(prompt.effects), `${prompt.id}: ${prompt.effects}`);
  }
  for (const match of html.matchAll(/data-example="([^"]+)"/g)) assert.ok(prompts.some(prompt => prompt.id === match[1]), match[1]);
});

test('source groups compose all 54 examples without omissions or reordering', async () => {
  const { prompts } = await import('../web/prompts.mjs');
  const { create } = await import('../web/prompts/create.mjs');
  const { refine } = await import('../web/prompts/refine.mjs');
  const { audioMedia } = await import('../web/prompts/audio-media.mjs');
  const { deliver } = await import('../web/prompts/deliver.mjs');
  assert.deepEqual(prompts, [...create, ...refine, ...audioMedia, ...deliver]);
  assert.equal(prompts.length, 54);
});
