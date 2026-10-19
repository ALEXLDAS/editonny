import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

test('standalone guide navigates, builds requests, and applies scenes and examples', async () => {
  const session = `editonny-file-test-${process.pid}`;
  const browser = (...args) => {
    const response = JSON.parse(execFileSync('agent-browser', ['--session', session, '--json', ...args], {
      encoding: 'utf8', timeout: 15000,
    }));
    assert.equal(response.success, true, JSON.stringify(response.error));
    return response.data;
  };
  const evaluate = expression => browser('eval', expression).result;
  const navigate = page => {
    browser('focus', `[data-nav="${page}"]`);
    browser('press', 'Enter');
    browser('wait', `#${page}`);
  };
  try {
    browser('open', new URL('../web/index.html', import.meta.url).href);
    navigate('create');
    assert.equal(evaluate('!document.querySelector("#create").hidden'), true);
    browser('fill', '#goal', 'Explain a feature clearly');
    browser('fill', '#folder', '/tmp/Raw videos café');
    browser('select', '#format', '4:5 (portrait feed)');
    let prompt = evaluate('document.querySelector("#prompt-result").value');
    assert.ok(prompt.includes('Explain a feature clearly'));
    assert.ok(prompt.includes('/tmp/Raw videos café'));
    assert.ok(prompt.includes('4:5 (portrait feed)'));
    assert.ok(prompt.includes('Remove unnecessary pauses, audible breaths, mistakes'));
    browser('focus', '[data-copy-target="prompt-result"]');
    browser('press', 'Enter');
    browser('wait', '#status');
    assert.match(evaluate('document.querySelector("#status").textContent'), /Copied\.|Automatic copy unavailable/);

    navigate('catalog');
    const catalog = JSON.parse(await readFile(new URL('../web/catalog.json', import.meta.url), 'utf8'));
    assert.equal(evaluate('document.querySelectorAll(".scene-card").length'), catalog.scenes.length);
    browser('fill', '#search', 'glow');
    browser('wait', '--fn', `document.querySelectorAll('.scene-card').length < ${catalog.scenes.length}`);
    assert.ok(evaluate('document.querySelectorAll(".scene-card").length') > 0);
    browser('focus', '.scene-card:first-child');
    browser('press', 'Enter');
    browser('wait', '#scene-dialog[open]');
    assert.equal(evaluate('document.querySelector("#scene-dialog").open'), true);
    browser('press', 'Escape');
    assert.equal(evaluate('document.querySelector("#scene-dialog").open'), false);
    assert.equal(evaluate('document.activeElement.matches(".scene-card")'), true);
    browser('press', 'Enter');
    browser('wait', '#scene-dialog[open]');
    browser('click', '#use-scene');
    browser('wait', '#create');
    assert.equal(evaluate('!document.querySelector("#create").hidden'), true);
    prompt = evaluate('document.querySelector("#prompt-result").value');
    assert.ok(prompt.includes('Catalog reference'));
    assert.ok(prompt.includes('/tmp/Raw videos café'));

    navigate('examples');
    browser('fill', '#example-search', 'lesson');
    assert.ok(evaluate('document.querySelectorAll(".prompt-card").length') > 0);
    browser('focus', '.prompt-card:first-child');
    browser('press', 'Enter');
    browser('wait', '#example-dialog[open]');
    assert.equal(evaluate('document.querySelector("#example-dialog").open'), true);
    browser('click', '#use-example');
    browser('wait', '#create');
    prompt = evaluate('document.querySelector("#prompt-result").value');
    assert.ok(prompt.includes('/tmp/Raw videos café'));
    assert.ok(!prompt.includes('Catalog reference'));
    navigate('installation');
    assert.equal(evaluate('!document.querySelector("#installation").hidden'), true);
  } finally {
    browser('close');
  }
});
