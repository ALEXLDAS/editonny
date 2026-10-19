import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LOCALES, OUT, render } from '../scripts/readme-art/build.mjs';

const root = new URL('../', import.meta.url);
const banners = render();

test('committed README banners match the generator (run npm run readme:art)', () => {
  for (const { path, content } of banners) assert.equal(readFileSync(new URL(path, root), 'utf8'), content, path);
  for (const locale of LOCALES) {
    const expected = banners.filter(item => item.path.startsWith(`${OUT}/${locale}/`)).map(item => item.path.split('/').pop()).sort();
    assert.deepEqual(readdirSync(new URL(`${OUT}/${locale}/`, root)).sort(), expected, locale);
  }
});

test('README banners are self-contained, accessible, and honor reduced motion', () => {
  for (const { path, content } of banners) {
    assert.match(content, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]* role="img" aria-labelledby="t d">/, path);
    assert.match(content, /<title id="t">[^<]+<\/title><desc id="d">[^<]+<\/desc>/, path);
    assert.match(content, /@media \(prefers-reduced-motion:reduce\)\{\*\{animation:none!important\}\}/, path);
    assert.doesNotMatch(content, /<script|<foreignObject|href="(?!data:|#)|url\((?!data:|#)/, path);
    assert.doesNotMatch(content, /undefined|NaN|\{[a-zA-Z]+\}/, path);
  }
});

test('banners render each locale\'s guide text', () => {
  for (const locale of LOCALES) {
    const messages = JSON.parse(readFileSync(new URL(`web/messages/${locale}.json`, root), 'utf8'));
    const hero = banners.find(item => item.path === `${OUT}/${locale}/hero.svg`).content;
    assert.ok(hero.includes(messages.Home.hero.line1.replace(/&/g, '&amp;')), `${locale} hero headline`);
  }
});

test('the generator imports without a script path', () => {
  const module = new URL('scripts/readme-art/build.mjs', root).href;
  const output = execFileSync(process.execPath, ['--input-type=module', '-e', `const { render } = await import(${JSON.stringify(module)}); console.log(render().length);`], { encoding: 'utf8' });
  assert.equal(output.trim(), String(banners.length));
});

test('the generator CLI runs its freshness check', () => {
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('scripts/readme-art/build.mjs', root)), '--check'], { encoding: 'utf8' });
  assert.match(output, /README art is current\./);
});
