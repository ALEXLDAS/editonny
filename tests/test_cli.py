from pathlib import Path
import functools
import importlib.util
import json
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / 'editonny.py'


class CLITests(unittest.TestCase):
    def run_cli(self, *args):
        return subprocess.run([sys.executable, str(CLI), *args], cwd=tempfile.gettempdir(),
                              text=True, capture_output=True)

    def test_catalog_accent_insensitive_and_json(self):
        result = self.run_cli('catalog', 'transitions', '--json')
        self.assertEqual(result.returncode, 0, result.stderr)
        scenes = json.loads(result.stdout)
        self.assertGreater(len(scenes), 0)
        self.assertTrue(all('id' in s for s in scenes))

    def test_unknown_helper_rejected_without_path_traversal(self):
        result = self.run_cli('helper', '../install')
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn('Traceback', result.stderr)

    def test_scene_requires_a_project(self):
        result = self.run_cli('scene')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('--project', result.stderr)

    def test_scene_invalid_arguments_fail_cleanly_before_writing(self):
        for arguments in [('scene', '--project'), ('scene', '--project', '/tmp', '--unknown-option', 'scene'),
                          ('scene', '--project', '/tmp', '--use', 'scene', '--start', '1,2'),
                          ('scene', '--project', '/tmp', '--use', 'scene', '--start', 'nan')]:
            with self.subTest(arguments=arguments):
                result = self.run_cli(*arguments)
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn('Traceback', result.stderr)

    def test_guide_cannot_serve_outside_web_or_list_directories(self):
        spec = importlib.util.spec_from_file_location('cli', ROOT / 'skills/editonny/scripts/editonny.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            web = root / 'web'
            web.mkdir()
            (web / 'index.html').write_text('editonny')
            (web / 'empty').mkdir()
            (root / 'secret').write_text('private')
            (web / 'leak').symlink_to(root / 'secret')
            server = module.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(module.GuideHandler, directory=str(web)))
            worker = threading.Thread(target=server.serve_forever, daemon=True)
            worker.start()
            try:
                url = f'http://127.0.0.1:{server.server_port}'
                self.assertEqual(urllib.request.urlopen(url).read(), b'editonny')
                for path in ['/../secret', '/%2e%2e/secret', '/leak', '/empty/', '/.env']:
                    with self.subTest(path=path), self.assertRaises(urllib.error.HTTPError) as error:
                        urllib.request.urlopen(url + path)
                    self.assertEqual(error.exception.code, 404)
            finally:
                server.shutdown()
                server.server_close()
                worker.join()

    def test_doctor_json_has_real_checks(self):
        result = self.run_cli('doctor', '--json')
        self.assertIn(result.returncode, [0, 1])
        report = json.loads(result.stdout)
        self.assertEqual(report['product'], 'editonny')
        self.assertTrue(any(c['name'] == 'ffmpeg' for c in report['checks']))
        self.assertTrue(all('ok' in c for c in report['checks']))

    def test_help_from_other_working_directory(self):
        result = self.run_cli('--help')
        self.assertEqual(result.returncode, 0)
        for command in ['doctor', 'catalog', 'new', 'scene', 'helper', 'guide']:
            self.assertIn(command, result.stdout)


if __name__ == '__main__':
    unittest.main()
