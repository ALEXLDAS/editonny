import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / 'skills/editonny/engine/helpers'), str(ROOT / 'tests')]
from media_fixtures import make_patches
from intake import inspect_sources, propose_settings
from workflow_fixtures import confirmation
from workspace import create_workspace, publish_export, record_review, render_dependencies


class DeliveryTests(unittest.TestCase):
    def test_vfr_cadence_cannot_be_silently_resampled_to_cfr(self):
        from common import content_hash, probe_video
        from fidelity import verify_media
        from workspace import seed_source
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); source = root / 'vfr.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'color=gray:s=128x64:r=30:d=2',
                '-vf', "select='eq(mod(n,3),0)+eq(mod(n,7),1)',setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709",
                '-fps_mode', 'vfr', '-bf', '0', '-c:v', 'libx264', str(source)], check=True)
            inspection = inspect_sources([source], False)
            c = propose_settings(inspection, {'captions': False, 'delivery': {'workspaceRoot': str(root / 'downloads')}})['config']
            self.assertEqual(c['workflow']['video']['timing'], 'vfr')
            project = create_workspace(root / 'downloads', 'VFR', inspection, c, confirmation(c, inspection))
            seed_source(project)
            changed = root / 'resampled.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(source), '-vf', 'fps=30', '-c:v', 'libx264', str(changed)], check=True)
            record_review(project, source, {'reviewer': 'agent', 'notes': 'Complete irregular source cadence reviewed', 'findings': [],
                'intervals': [[0, probe_video(source)['duration']]], 'artifactHash': content_hash(source), 'dependencies': render_dependencies(project)})
            self.assertEqual(verify_media(source, project)['status'], 'passed')
            report = verify_media(changed, project)
            self.assertEqual(report['status'], 'failed', report)
            self.assertTrue(any(c['name'] == 'presentationTiming' and c['status'] == 'failed' for c in report['checks']))
            with self.assertRaises(ValueError):
                publish_export(project, changed, report)

    def test_source_chroma_cannot_be_reduced_behind_a_preserve_contract(self):
        from common import content_hash
        from fidelity import verify_media
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); original = root / 'patches.mp4'; make_patches(original)
            source = root / '444.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(original), '-pix_fmt', 'yuv444p', '-c:v', 'libx264', '-qp', '0', str(source)], check=True)
            inspection = inspect_sources([source], False)
            c = propose_settings(inspection, {'captions': False, 'delivery': {'workspaceRoot': str(root / 'downloads')}})['config']
            project = create_workspace(root / 'downloads', 'Chroma', inspection, c, confirmation(c, inspection))
            edit = project.parent / 'edit'
            (edit / 'cut_timeline.json').write_text(json.dumps({'duration': 1 / 24, 'fps_str': '24', 'segments': [
                {'out_start': 0, 'out_end': 1 / 24, 'src_start': 0, 'src_end': 1 / 24, 'source_path': str(source)}]}))
            record_review(project, source, {'reviewer': 'agent', 'notes': 'Complete 4:4:4 source reviewed', 'findings': [],
                'intervals': [[0, 1 / 24]], 'artifactHash': content_hash(source), 'dependencies': render_dependencies(project)})
            report = verify_media(original, project)
            self.assertEqual(report['status'], 'failed', report)
            self.assertTrue(any(c['name'] == 'chromaPrecision' and c['status'] == 'failed' for c in report['checks']))

    def test_export_does_not_follow_a_replaced_exports_symlink(self):
        from fidelity import verify_media
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); source, project = self.prepare(root)
            outside = root / 'outside'; outside.mkdir()
            exports = project.parent / 'exports'; exports.rmdir(); exports.symlink_to(outside, target_is_directory=True)
            with self.assertRaisesRegex(ValueError, 'symlink|destination|layout'):
                publish_export(project, source, verify_media(source, project))
            self.assertEqual(list(outside.iterdir()), [])

    def test_failed_subtitle_stage_removes_partial_task_files(self):
        from unittest.mock import patch
        from fidelity import verify_media
        from project_contract import load_contract
        from workspace import record_confirmation
        with tempfile.TemporaryDirectory() as tmp:
            source, project = self.prepare(Path(tmp))
            config = load_contract(project)
            config['workflow']['delivery']['subtitleFormats'] = ['srt']
            (project / 'project.json').write_text(json.dumps(config))
            inspection = inspect_sources([source], False)
            record_confirmation(project, confirmation(config, inspection))
            from common import content_hash
            record_review(project, source, {'reviewer': 'agent', 'notes': 'Complete synthetic fixture reviewed', 'findings': [],
                'intervals': [[0, 1 / 24]], 'artifactHash': content_hash(source), 'dependencies': render_dependencies(project)})
            def fail_subtitles(project, fmt, destination):
                destination.write_text('partial subtitle')
                raise ValueError('Interrupted subtitle generation')
            with patch('export_subtitles.export_subtitles', side_effect=fail_subtitles):
                with self.assertRaisesRegex(ValueError, 'Interrupted subtitle'):
                    publish_export(project, source, verify_media(source, project))
            self.assertEqual(list((project.parent / 'exports').iterdir()), [])

    def test_preserve_audio_cannot_deliver_a_muted_candidate(self):
        from common import content_hash
        from fidelity import verify_media
        from workspace import seed_source
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp); source = root / 'voiced.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'color=blue:s=128x64:r=24:d=1',
                '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                '-vf', 'setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709',
                '-color_range', 'tv', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                '-c:a', 'aac', str(source)], check=True)
            inspection = inspect_sources([source], False)
            config = propose_settings(inspection, {'scope': 'captions', 'captions': False, 'delivery': {'workspaceRoot': str(root / 'downloads')}})['config']
            project = create_workspace(root / 'downloads', 'Muted', inspection, config, confirmation(config, inspection))
            seed_source(project)
            muted = root / 'muted.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(source), '-map', '0:v', '-c', 'copy', str(muted)], check=True)
            record_review(project, source, {'reviewer': 'agent', 'notes': 'Complete voiced source inspected', 'findings': [],
                'intervals': [[0, 1]], 'artifactHash': content_hash(source), 'dependencies': render_dependencies(project)})
            report = verify_media(muted, project)
            self.assertEqual(report['status'], 'failed', report)
            with self.assertRaises(ValueError):
                publish_export(project, muted, report)
            changed = root / 'different-voice.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(source), '-f', 'lavfi', '-i',
                'sine=frequency=880:duration=1', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', str(changed)], check=True)
            changed_report = verify_media(changed, project)
            self.assertEqual(changed_report['status'], 'failed', changed_report)
            self.assertTrue(any(c['name'] == 'preservedAudio' and c['status'] == 'failed' for c in changed_report['checks']))

    def test_revision_lock_excludes_cut_renderer(self):
        from workspace import revision_lock
        from project_contract import settings_hash, load_contract
        with tempfile.TemporaryDirectory() as tmp:
            source, project = self.prepare(Path(tmp))
            edit = project.parent / 'edit'; edl = edit / 'edl.json'
            edl.write_text(json.dumps({'sources': {'s': str(source)}, 'contractHash': settings_hash(load_contract(project)),
                'ranges': [{'id': 'a', 'source': 's', 'start': 0, 'end': 1 / 24}]}))
            with revision_lock(project):
                result = subprocess.run([sys.executable, str(ROOT / 'skills/editonny/engine/helpers/render_cut.py'),
                    str(edl), '--no-jcut'], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertFalse((edit / 'cut.mp4').exists())

    def prepare(self, root):
        source = root / 'source.mp4'; make_patches(source)
        inspection = inspect_sources([source], detect_language=False)
        config = propose_settings(inspection, {'captions': False, 'delivery': {'workspaceRoot': str(root / 'downloads')}})['config']
        project = create_workspace(root / 'downloads', 'Test', inspection, config, confirmation(config, inspection))
        (project.parent / 'edit/cut_timeline.json').write_text(json.dumps({'duration': 1 / 24, 'fps_str': '24',
            'segments': [{'out_start': 0, 'out_end': 1 / 24, 'src_start': 0, 'src_end': 1 / 24, 'source_path': str(source)}]}))
        from common import content_hash
        record_review(project, source, {'reviewer': 'agent', 'notes': 'Inspected complete synthetic one-frame reference',
                      'findings': [], 'intervals': [[0, 1 / 24]], 'artifactHash': content_hash(source), 'dependencies': render_dependencies(project)})
        return source, project

    def test_no_effect_delivers_unique_validated_files(self):
        self.assertTrue((ROOT / 'skills/editonny/engine/helpers/fidelity.py').exists(), 'Fidelity gate is not implemented')
        from fidelity import verify_media
        with tempfile.TemporaryDirectory() as tmp:
            source, project = self.prepare(Path(tmp))
            report = verify_media(source, project)
            self.assertEqual(report['status'], 'passed', report)
            first = publish_export(project, source, report)
            second = publish_export(project, source, report)
            self.assertNotEqual(first['artifact'], second['artifact'])
            self.assertEqual(Path(first['artifact']).read_bytes(), source.read_bytes())
            self.assertEqual(len(list((project.parent / 'exports').iterdir())), 4)

    def test_gate_rejects_unrequested_brightness_change_with_identical_tags(self):
        self.assertTrue((ROOT / 'skills/editonny/engine/helpers/fidelity.py').exists(), 'Fidelity gate is not implemented')
        from fidelity import verify_media
        with tempfile.TemporaryDirectory() as tmp:
            source, project = self.prepare(Path(tmp))
            changed = Path(tmp) / 'brighter.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(source), '-vf', 'eq=brightness=0.1',
                            '-c:v', 'libx264', '-crf', '0', '-color_range', 'tv', '-colorspace', 'bt709', str(changed)], check=True)
            report = verify_media(changed, project)
            self.assertEqual(report['status'], 'failed', report)
            self.assertTrue(any(c['name'] == 'appearance' and c['status'] == 'failed' for c in report['checks']), report)
            with self.assertRaises(ValueError):
                publish_export(project, changed, report)


if __name__ == '__main__':
    unittest.main()
