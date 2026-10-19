import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

test('guide check detects stale generated outputs without overwriting them', async () => {
  const root = await mkdtemp(join(tmpdir(), 'editonny-web-build-'));
  try {
    await cp(new URL('../web/', import.meta.url), join(root, 'web'), { recursive: true });
    await mkdir(join(root, 'skills/editonny/visuals'), { recursive: true });
    await cp(new URL('../skills/editonny/visuals/catalog.json', import.meta.url), join(root, 'skills/editonny/visuals/catalog.json'));
    await symlink(fileURLToPath(new URL('../node_modules', import.meta.url)), join(root, 'node_modules'), 'junction');
    const runCheck = () => spawnSync(process.execPath, ['web/build-data.mjs', '--check'], { cwd: root, encoding: 'utf8' });
    const catalog = join(root, 'web/catalog.json');
    await writeFile(catalog, '{"scenes":[]}\n');
    assert.notEqual(runCheck().status, 0);
    assert.equal(await readFile(catalog, 'utf8'), '{"scenes":[]}\n');

    execFileSync(process.execPath, ['web/build-data.mjs'], { cwd: root });
    assert.equal(runCheck().status, 0);
    const script = join(root, 'web/app.js');
    await writeFile(script, '// outdated\n');
    assert.notEqual(runCheck().status, 0);
    assert.equal(await readFile(script, 'utf8'), '// outdated\n');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
