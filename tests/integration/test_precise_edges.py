"""Edge refinement must keep intervals marked "dry": false exactly as specified."""
from pathlib import Path
import sys
import unittest

import numpy as np

HELPERS = Path(__file__).resolve().parents[2] / 'skills/editonny/engine/helpers'
sys.path.insert(0, str(HELPERS))


class PreciseEdgesTests(unittest.TestCase):
    def test_preserved_intervals_keep_their_boundaries(self):
        from precise_edges import refine_edl
        db = np.full(300, -80.0)
        db[20:90] = db[120:190] = -20.0          # Speech inside both intervals, silence around them.
        edl = {'sources': {'main': 'main.mp4'}, 'ranges': [
            {'id': 'r1', 'source': 'main', 'start': 0.0, 'end': 1.0, 'dry': False},
            {'id': 'r2', 'source': 'main', 'start': 1.1, 'end': 2.0, 'dry': False}]}
        refine_edl(edl, {'main': (db, -80.0)}, log=lambda *_: None)
        self.assertEqual([(r['start'], r['end']) for r in edl['ranges']], [(0.0, 1.0), (1.1, 2.0)])


if __name__ == '__main__':
    unittest.main()
