"""Cached waveform measurements must belong to the source they describe."""
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

HELPERS = Path(__file__).resolve().parents[2] / 'skills/editonny/engine/helpers'
sys.path.insert(0, str(HELPERS))


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'FFmpeg is required')
class WaveformCacheTests(unittest.TestCase):
    def test_a_remapped_source_never_reuses_another_take(self):
        from waveform_cut import envelope
        with tempfile.TemporaryDirectory(prefix='editonny waveform ') as temporary:
            root = Path(temporary)
            loud, quiet = root / 'take_a.wav', root / 'take_b.wav'
            for path, volume in ((loud, 1.0), (quiet, 0.01)):
                subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1',
                                '-af', f'volume={volume}', str(path)], check=True)
            os.utime(quiet, (1_000_000_000, 1_000_000_000))   # The older take maps to the same source key later.
            cache = root / 'regions/waveform_main.npy'
            first = envelope(loud, cache)
            second = envelope(quiet, cache)
            self.assertGreater(float(first.mean()) - float(second.mean()), 20)
            self.assertEqual(float(envelope(loud, cache).mean()), float(first.mean()))


if __name__ == '__main__':
    unittest.main()
