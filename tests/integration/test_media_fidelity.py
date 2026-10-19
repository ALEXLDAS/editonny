"""Source appearance must survive an unrequested no-effect cut."""
import hashlib
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

HELPERS = Path(__file__).resolve().parents[2] / 'skills/editonny/engine/helpers'
sys.path.insert(0, str(HELPERS))
from common import probe_video
from render_cut import build_vf
from media_policy import color_tags
from media_fixtures import decoded_samples, make_patches


@unittest.skipUnless(shutil.which('ffmpeg'), 'FFmpeg is required')
class MediaFidelityTests(unittest.TestCase):
    def render(self, full=False, matrix='bt709'):
        with tempfile.TemporaryDirectory() as temp:
            source, output = Path(temp) / 'source.mp4', Path(temp) / 'output.mkv'
            known_samples = make_patches(source, full, matrix)
            original = hashlib.sha256(source.read_bytes()).hexdigest()
            facts = probe_video(source)
            vf = build_vf(facts, 128, 64, 24, '')
            subprocess.run(['ffmpeg', '-v', 'error', '-i', str(source), '-vf', vf,
                            '-c:v', 'ffv1', *color_tags(facts), str(output)], check=True, capture_output=True)
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), original)
            self.assertEqual(decoded_samples(source), known_samples, 'Fixture decoding changed stored source samples')
            return facts, probe_video(output), decoded_samples(source), decoded_samples(output)

    def test_sdr_no_effect_preserves_gray_and_color(self):
        _, _, expected, actual = self.render()
        self.assertEqual(actual, expected)

    def test_full_range_is_not_reinterpreted_as_limited(self):
        _, actual, expected_pixels, actual_pixels = self.render(full=True)
        self.assertEqual(actual_pixels, expected_pixels, 'Unrequested full-range brightness change')
        self.assertEqual(actual.get('color_range'), 'pc')

    def test_bt601_is_not_retagged_as_bt709(self):
        _, actual, expected_pixels, actual_pixels = self.render(matrix='smpte170m')
        self.assertEqual(actual['color_space'], 'smpte170m')
        self.assertEqual(actual_pixels, expected_pixels)

    def test_missing_color_metadata_is_not_guessed(self):
        vf = build_vf({'has_video': True}, 128, 64, 24, '')
        self.assertNotIn('bt709', vf, 'Unknown source must not receive invented color interpretation')


if __name__ == '__main__':
    unittest.main()
