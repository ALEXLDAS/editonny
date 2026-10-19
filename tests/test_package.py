import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('package', ROOT / 'scripts/package.py')
package = importlib.util.module_from_spec(spec)
spec.loader.exec_module(package)


class PackageTests(unittest.TestCase):
    def test_packages_reject_symlinked_source_roots(self):
        with tempfile.TemporaryDirectory(prefix='editonny package roots ') as temporary:
            base = Path(temporary)
            root, outside = base / 'project', base / 'private'
            root.mkdir()
            (outside / 'editonny').mkdir(parents=True)
            (outside / 'editonny/VERSION').write_text('1.0.0')
            (outside / 'private-notes.txt').write_text('Private content must stay outside the package')
            (root / 'web').symlink_to(outside, target_is_directory=True)
            (root / 'skills').symlink_to(outside, target_is_directory=True)
            for kind in ('site', 'plugin'):
                with self.subTest(kind=kind), self.assertRaisesRegex(ValueError, 'symlink'):
                    package.build(root, root / 'dist', kind)
            self.assertFalse(list((root / 'dist').glob('*.zip')))

    def test_packages_have_separate_contents_and_no_local_secrets(self):
        with tempfile.TemporaryDirectory(prefix='editonny package ') as temp:
            root = Path(temp)
            for name in ['web/index.html', 'web/styles.css', 'web/app.js', 'web/app.mjs', 'web/model.mjs',
                         'web/catalog.json', 'web/prompts/create.mjs', 'web/.env', 'web/build-data.mjs', 'web/old-guide.PDF', 'web/private.mp4',
                         'skills/editonny/SKILL.md', 'skills/editonny/VERSION',
                         'skills/editonny/engine/.env', 'skills/editonny/engine/.venv/private',
                         'skills/editonny/old-prompts.pdf', 'skills/editonny/clip.MP4',
                         'skills/editonny/visuals/clip.webm', 'skills/editonny/visuals/still.png',
                         '.codex-plugin/plugin.json', '.claude-plugin/plugin.json',
                         'install.py', 'editonny.py', 'README.md', 'README.pt-BR.md', 'README.es.md', 'LICENSE.md',
                         'PRODUCT.md', 'docs/architecture.md', 'docs/design.md', 'docs/setup.md',
                         'docs/installation.md', 'docs/archive/private.pdf']:
                p = root / name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text('1.0.0' if p.name == 'VERSION' else 'fixture')
            site = package.build(root, root / 'dist', 'site')
            plugin = package.build(root, root / 'dist', 'plugin')
            with zipfile.ZipFile(site) as archive:
                self.assertIn('index.html', archive.namelist())
                self.assertIn('app.js', archive.namelist())
                self.assertIn('prompts/create.mjs', archive.namelist())
                self.assertNotIn('build-data.mjs', archive.namelist())
                self.assertNotIn('private.mp4', archive.namelist())
                self.assertTrue(all(not p.lower().endswith('.pdf') for p in archive.namelist()))
                self.assertTrue(all('skills/' not in p and '.env' not in p for p in archive.namelist()))
            with zipfile.ZipFile(plugin) as archive:
                self.assertIn('skills/editonny/SKILL.md', archive.namelist())
                self.assertIn('install.py', archive.namelist())
                self.assertIn('README.pt-BR.md', archive.namelist())
                self.assertIn('README.es.md', archive.namelist())
                self.assertIn('PRODUCT.md', archive.namelist())
                self.assertIn('docs/architecture.md', archive.namelist())
                self.assertIn('web/index.html', archive.namelist())
                self.assertNotIn('web/build-data.mjs', archive.namelist())
                self.assertNotIn('web/private.mp4', archive.namelist())
                self.assertIn('skills/editonny/visuals/still.png', archive.namelist())
                self.assertIn('skills/editonny/clip.MP4', archive.namelist())
                self.assertIn('skills/editonny/visuals/clip.webm', archive.namelist())
                self.assertTrue(all(not p.lower().endswith('.pdf') for p in archive.namelist()))
                self.assertTrue(all('.env' not in p and '.venv' not in p and 'archive/' not in p for p in archive.namelist()))


if __name__ == '__main__':
    unittest.main()
