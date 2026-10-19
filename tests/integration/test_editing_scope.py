from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / 'skills/editonny/engine/helpers'), str(ROOT / 'tests')]
from workflow_fixtures import config
import project_contract


class EditingScopeTests(unittest.TestCase):
    def test_protected_interval_cannot_be_removed_by_edl(self):
        self.assertTrue(hasattr(project_contract, 'validate_edl_scope'), 'EDL does not enforce protected scope')
        c = config()
        c['workflow']['editing']['protectedIntervals'] = [{'sourceId': 'source', 'start': 1, 'end': 2}]
        manifest = {'sources': [{'id': 'source', 'path': '/source.mp4'}]}
        edl = {'sources': {'s': '/source.mp4'}, 'ranges': [{'source': 's', 'start': 0, 'end': 1.5}]}
        with self.assertRaisesRegex(ValueError, 'protected'):
            project_contract.validate_edl_scope(c, manifest, edl)
        edl['ranges'][0]['end'] = 3
        project_contract.validate_edl_scope(c, manifest, edl)

    def test_interval_revision_cannot_expand_accepted_scope(self):
        self.assertTrue(hasattr(project_contract, 'validate_edl_scope'), 'EDL does not enforce interval scope')
        c = config()
        c['workflow']['editing'].update(scope='intervals', intervals=[{'sourceId': 'source', 'start': 1, 'end': 2}])
        manifest = {'sources': [{'id': 'source', 'path': '/source.mp4'}]}
        edl = {'sources': {'s': '/source.mp4'}, 'ranges': [{'source': 's', 'start': 0, 'end': 2}]}
        with self.assertRaisesRegex(ValueError, 'scope'):
            project_contract.validate_edl_scope(c, manifest, edl)


if __name__ == '__main__':
    unittest.main()
