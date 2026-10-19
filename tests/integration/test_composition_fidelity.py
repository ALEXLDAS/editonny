from fractions import Fraction
import json
from pathlib import Path
import sys
import tempfile
import unittest

HELPERS = Path(__file__).resolve().parents[2] / 'skills/editonny/engine/helpers'
sys.path.insert(0, str(HELPERS))
from common import probe_video
from media_fixtures import make_patches
from compose_final import build_plan, run_video


class CompositionFidelityTests(unittest.TestCase):
    def test_no_effect_composition_preserves_full_range_and_matrix(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'source.mp4'; make_patches(source, True, 'smpte170m')
            data = root / 'edit_data.json'
            data.write_text(json.dumps({'base': str(source), 'captions': {'enabled': False}}))
            output = root / 'composed.mp4'
            plan = build_plan(data, str(output), False)
            plan.renders.mkdir(parents=True)
            run_video(plan, [], {}, None, output)
            facts = probe_video(output)
            self.assertEqual(facts['color_range'], 'pc')
            self.assertEqual(facts['color_space'], 'smpte170m')


if __name__ == '__main__':
    unittest.main()
