"""Explicit pinned-renderer conformance; ordinary unit runs do not download/render a browser."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / 'skills/editonny/engine/helpers'), str(ROOT / 'tests')]
from common import content_hash
from fidelity import verify_media
from intake import inspect_sources, propose_settings
from workflow_fixtures import confirmation
from workspace import create_workspace, publish_export, record_review, render_dependencies, seed_source


@unittest.skipUnless(os.environ.get('EDITONNY_NATIVE_CONFORMANCE') == '1', 'Explicit pinned native render conformance job')
class ManagedNativeTests(unittest.TestCase):
    def test_captioned_native_source_geometry_audio_and_delivery(self):
        (ROOT / '.work').mkdir(exist_ok=True)
        root = Path(tempfile.mkdtemp(prefix='managed native ', dir=ROOT / '.work'))
        def run(*args, cwd=ROOT):
            result = subprocess.run([str(a) for a in args], cwd=cwd, capture_output=True, text=True, timeout=600)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            return result
        try:
            source = root / 'original.mp4'
            run('ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=0x56728a:s=360x640:r=24:d=3',
                '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=3',
                '-vf', 'setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709',
                '-c:v', 'libx264', '-qp', '0', '-pix_fmt', 'yuv420p', '-color_range', 'tv',
                '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-c:a', 'aac', source)
            original = content_hash(source)
            inspection = inspect_sources([source], False)
            config = propose_settings(inspection, {'delivery': {'subtitleFormats': ['srt', 'vtt']}})['config']
            project = create_workspace(root / 'Downloads/editonny', 'Conformance', inspection, config, confirmation(config, inspection))
            cut = seed_source(project)
            edit = cut.parent
            (edit / 'transcripts/cut.json').write_text(json.dumps({'words': [
                {'text': 'Color', 'start': 0.1, 'end': 0.8}, {'text': 'stays', 'start': 0.9, 'end': 1.5},
                {'text': 'original', 'start': 1.6, 'end': 2.8}]}))
            for args in (['prepare'], ['compose'], ['hf', 'lint'], ['hf', 'check'],
                         ['hf', 'render', '--quality', 'draft', '--crf', '10', '--output', 'renders/candidate.mp4']):
                result = run(sys.executable, 'build.py', *args, cwd=project)
                (root / (args[-1].split('/')[-1] + '.log')).write_text(result.stdout + result.stderr)
            candidate = project / 'renders/candidate.mp4'
            record_review(project, candidate, {'reviewer': 'agent', 'notes': 'Complete three-second controlled caption/voice fixture, checked by the conformance gate',
                'findings': [], 'intervals': [[0, 3]], 'artifactHash': content_hash(candidate), 'dependencies': render_dependencies(project)})
            report = verify_media(candidate, project)
            (root / 'verification.json').write_text(json.dumps(report, indent=2))
            self.assertEqual(report['status'], 'passed', report)
            delivered = publish_export(project, candidate, report)
            self.assertEqual(len(delivered['subtitles']), 2)
            self.assertEqual(content_hash(source), original)
            for at in (0.5, 1.5, 2.5):
                run('ffmpeg', '-v', 'error', '-ss', at, '-i', candidate, '-frames:v', '1', root / f'frame-{at}.png')
            print(f'Managed native evidence: {root}', flush=True)
        finally:
            if os.environ.get('EDITONNY_KEEP_EVIDENCE') != '1':
                shutil.rmtree(root)


if __name__ == '__main__':
    unittest.main()
