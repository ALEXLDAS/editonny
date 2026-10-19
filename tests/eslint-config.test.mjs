import test from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';

test('lint covers first-party code and excludes generated and vendor files', async () => {
  const eslint = new ESLint();
  for (const file of [
    'web/app.mjs', 'web/build-data.mjs', 'tests/web.test.mjs',
    'skills/editonny/engine/preview/app.js',
    'skills/editonny/engine/preview/review/view.mjs',
    'skills/editonny/engine/preview/style/state.mjs',
    'skills/editonny/engine/project-template/compositions/scenes/3d/three-scene.js',
    'skills/editonny/engine/project-template/compositions/scenes/3d/engine/stage.mjs',
  ]) assert.equal(await eslint.isPathIgnored(file), false, file);
  for (const file of [
    'web/app.js', 'node_modules/example/index.js',
    'skills/editonny/engine/project-template/assets/three/RoomEnvironment.js',
  ]) assert.equal(await eslint.isPathIgnored(file), true, file);
});

test('strict line limits count the final newline and include tests', async () => {
  const eslint = new ESLint();
  const source = count => Array.from({ length: count }, (_, i) => `export const value${i} = ${i};`).join('\n');
  for (const filePath of ['web/prompts/create.mjs', 'tests/example.test.mjs', 'tests/fixtures/synthetic.mjs',
    'skills/editonny/engine/preview/review/view.mjs',
    'skills/editonny/engine/project-template/compositions/scenes/3d/engine/time.mjs']) {
    for (const [code, errors] of [[source(350), 0], [source(349) + '\n', 0], [source(350) + '\n', 1], [source(351), 1]]) {
      const [result] = await eslint.lintText(code, { filePath });
      assert.equal(result.errorCount, errors, filePath);
      assert.equal(result.warningCount, 0, filePath);
      if (errors) assert.deepEqual(result.messages.map(m => m.ruleId), ['quality/max-lines']);
    }
  }
});

test('unused bindings in engine and preview are errors', async () => {
  const eslint = new ESLint();
  for (const filePath of ['skills/editonny/engine/preview/app.js',
    'skills/editonny/engine/project-template/compositions/scenes/3d/three-scene.js']) {
    const [result] = await eslint.lintText('const dead = 1;', { filePath });
    assert.equal(result.errorCount, 1);
    assert.equal(result.warningCount, 0);
    assert.equal(result.messages[0].ruleId, 'no-unused-vars');
  }
});

test('lint distinguishes browser and Node runtimes', async () => {
  const eslint = new ESLint();
  const [browser] = await eslint.lintText('document.title = process.version;', { filePath: 'web/app.mjs' });
  assert.deepEqual(browser.messages.map(m => m.ruleId), ['no-undef']);
  assert.match(browser.messages[0].message, /'process'/);
  const [node] = await eslint.lintText('console.log(process.version); document.title = "test";', { filePath: 'web/build-data.mjs' });
  assert.deepEqual(node.messages.map(m => m.ruleId), ['no-undef']);
  assert.match(node.messages[0].message, /'document'/);
});
