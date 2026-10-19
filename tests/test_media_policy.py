import importlib
from pathlib import Path
import sys
import unittest

HELPERS = Path(__file__).resolve().parents[1] / 'skills/editonny/engine/helpers'
sys.path.insert(0, str(HELPERS))
from workflow_fixtures import config


class MediaPolicyTests(unittest.TestCase):
    def test_filter_capabilities_accept_actual_two_and_three_flag_rows(self):
        from unittest.mock import patch
        import subprocess
        import media_policy
        media_policy.probe_capabilities.cache_clear()
        results = [subprocess.CompletedProcess([], 0, 'ffmpeg version fixture\n', ''),
                   subprocess.CompletedProcess([], 0, ' TS tonemap V->V Convert\n TSC zscale V->V Scale\n', ''),
                   subprocess.CompletedProcess([], 0, ' V....D libx264 H264\n V....D libx265 HEVC\n', '')]
        try:
            with patch.object(media_policy.shutil, 'which', return_value='/tools/ffmpeg'), \
                 patch.object(media_policy.subprocess, 'run', side_effect=results):
                capabilities = media_policy.probe_capabilities()
            self.assertEqual(capabilities['filters'], ['tonemap', 'zscale'])
        finally:
            media_policy.probe_capabilities.cache_clear()

    @classmethod
    def setUpClass(cls):
        assert (HELPERS / 'media_policy.py').exists(), 'Shared media preservation policy is missing'
        cls.m = importlib.import_module('media_policy')

    def facts(self, **changes):
        f = {'pix_fmt': 'yuv420p', 'bit_depth': 8, 'color_transfer': 'bt709', 'color_primaries': 'bt709',
             'color_space': 'bt709', 'color_range': 'tv', 'is_hdr': False, 'fps_str': '30000/1001'}
        f.update(changes)
        return f

    def test_preserve_has_no_creative_filter_or_color_conversion(self):
        p = self.m.plan_media([self.facts(color_range='pc')], config(), {'encoders': ['libx264'], 'filters': []}, 'master')
        self.assertEqual(p['color_range'], 'pc')
        self.assertEqual(p['filters'], [])
        self.assertIn('pc', p['encoderArgs'])

    def test_mixed_color_profiles_require_confirmed_target(self):
        with self.assertRaisesRegex(ValueError, 'Mixed'):
            self.m.plan_media([self.facts(), self.facts(color_space='smpte170m')], config(), {'encoders': ['libx264']}, 'master')

    def test_high_precision_is_not_silently_reduced(self):
        with self.assertRaisesRegex(ValueError, 'libx265'):
            self.m.plan_media([self.facts(pix_fmt='yuv420p10le', bit_depth=10)], config(), {'encoders': ['libx264']}, 'master')

    def test_hdr_master_quality_and_preview_override(self):
        capabilities = {'encoders': ['libx264', 'libx265']}
        hdr = self.facts(is_hdr=True, pix_fmt='yuv420p10le', bit_depth=10)
        for facts, override, expected in [(hdr, None, '16'), (self.facts(), None, '18'), (hdr, '26', '26')]:
            with self.subTest(hdr=facts['is_hdr'], override=override):
                args = self.m.encoder_args(facts, capabilities, quality=override)
                self.assertEqual(args[args.index('-crf') + 1], expected)

    def test_missing_required_filter_blocks_not_approximates(self):
        c = config()
        c['workflow']['color'].update(mode='convert', target='sdr-bt709', conversion='hable')
        with self.assertRaisesRegex(ValueError, 'zscale'):
            self.m.plan_media([self.facts(is_hdr=True, color_transfer='smpte2084', bit_depth=10,
                                        pix_fmt='yuv420p10le')], c, {'encoders': ['libx264'], 'filters': ['tonemap']}, 'delivery')

    def test_native_render_checks_the_cut_against_the_source_plan(self):
        from unittest.mock import patch
        import importlib.util
        spec = importlib.util.spec_from_file_location('native_render_build', HELPERS.parent / 'project-template/build.py')
        build = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(build)
        converted = config()
        converted['workflow']['color'].update(mode='convert', target='sdr-bt709', conversion='hable')
        hdr = self.facts(is_hdr=True, color_transfer='arib-std-b67', color_primaries='bt2020', color_space='bt2020nc',
                         bit_depth=10, pix_fmt='yuv420p10le', codec='hevc')
        sdr_cut = self.facts(codec='h264')
        hdr_source, sdr_source = {'id': 'source', 'facts': hdr}, {'id': 'source', 'facts': self.facts()}
        # Revisions keep deselected footage in the manifest; only selected sources define the plan.
        deselected = {'sources': [sdr_source, {'id': 'earlier', 'facts': hdr}]}
        capabilities = {'encoders': ['libx264', 'libx265'], 'filters': ['zscale', 'tonemap']}
        with patch.object(self.m, 'probe_capabilities', return_value=capabilities):
            build.check_native_media(converted, {'sources': [hdr_source]}, sdr_cut)
            build.check_native_media(config(), {'sources': [sdr_source]}, sdr_cut)
            build.check_native_media(config(), deselected, sdr_cut)
            with self.assertRaisesRegex(build.BuildError, 'color profile'):
                build.check_native_media(converted, {'sources': [hdr_source]}, hdr)
            with self.assertRaisesRegex(build.BuildError, 'color profile'):
                build.check_native_media(config(), {'sources': [hdr_source]}, sdr_cut)


if __name__ == '__main__':
    unittest.main()
