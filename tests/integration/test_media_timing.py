from fractions import Fraction
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

HELPERS = Path(__file__).resolve().parents[2] / 'skills/editonny/engine/helpers'
sys.path.insert(0, str(HELPERS))
from common import output_fps_for, probe_video


class MediaTimingTests(unittest.TestCase):
    def test_vfr_cut_keeps_irregular_picture_timestamps(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp); edit = root / 'edit'; edit.mkdir()
            source = root / 'vfr.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=s=160x96:r=30:d=1',
                            '-vf', "select='eq(mod(n,3),0)+eq(mod(n,7),1)'", '-fps_mode', 'vfr',
                            '-c:v', 'libx264', '-pix_fmt', 'yuv420p', str(source)], check=True)
            edl = edit / 'edl.json'
            edl.write_text(json.dumps({'sources': {'s': str(source)}, 'ranges': [
                {'id': 'a', 'source': 's', 'start': 0, 'end': 0.4},
                {'id': 'b', 'source': 's', 'start': 0.5, 'end': 0.9}]}))
            result = subprocess.run([sys.executable, str(HELPERS / 'render_cut.py'), str(edl), '--no-jcut'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            def timestamps(path):
                data = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_frames',
                    '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'json', str(path)], capture_output=True, text=True, check=True).stdout)
                return [float(f['best_effort_timestamp_time']) for f in data['frames']]
            original = timestamps(source)
            output = timestamps(edit / 'cut.mp4')
            first = [t for t in original if 0 <= t < 0.4]
            second = [t for t in original if 0.5 <= t < 0.9]
            expected = first + [t - second[0] + 0.4 for t in second]
            self.assertEqual(len(output), len(expected))
            self.assertTrue(all(abs(a - b) <= 1e-6 for a, b in zip(output, expected)), (output, expected))

    def test_source_sixty_fps_is_not_reduced(self):
        self.assertEqual(output_fps_for(60), 60)

    def test_fractional_cut_preserves_exact_rate_and_source_dimensions(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            edit = root / 'edit'; edit.mkdir()
            source = root / 'source.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i',
                            'testsrc2=s=160x96:r=30000/1001:d=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                            '-color_range', 'tv', '-colorspace', 'bt709', '-color_trc', 'bt709',
                            '-color_primaries', 'bt709', str(source)], check=True)
            edl = edit / 'edl.json'
            edl.write_text(json.dumps({'sources': {'s': str(source)}, 'ranges': [{'id': 'a', 'source': 's', 'start': 0, 'end': 1}]}))
            result = subprocess.run([sys.executable, str(HELPERS / 'render_cut.py'), str(edl), '--no-jcut'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            facts = probe_video(edit / 'cut.mp4')
            self.assertEqual(Fraction(facts['fps_str']), Fraction(30000, 1001))
            self.assertEqual((facts['width'], facts['height']), (160, 96))


if __name__ == '__main__':
    unittest.main()
