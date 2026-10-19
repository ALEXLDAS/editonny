# Validation evidence

Reviewed on 2026-10-18 on macOS Apple Silicon with Node.js 24.22.0, launcher Python 3.9.6, and engine Python 3.13.16. Results apply to this checkout and environment; they do not establish universal scene or platform coverage.

## Observed checks

| Check | Result |
|---|---|
| `npm ci --ignore-scripts` | Passed; pinned development dependencies installed; npm reported zero vulnerabilities |
| `npm run build` | Passed; 145 scenes and the guide generated |
| `npm run check` | Passed; rule self-check, ESLint, 53 Python tests, 22 Node tests, and generated-output verification |
| `python3 editonny.py doctor` | Passed; local tools, engine interpreter, catalog, and pinned HyperFrames configuration present |
| `python3 editonny.py media status` | Passed; 79/79 bundled videos valid, zero missing or invalid |
| `npm run test:engine` | Passed; 27 integration tests |
| `npm run test:browser` | Passed; standalone `file://` navigation, request builder, scene selection, examples, and keyboard interaction |
| `npm run test:preview` | Passed; marks, trims, drafts, and approval confirmation |
| `npm run test:scenes` | Passed; covered 2D templates, parameter variants, seeking, and selected visual scenes |
| `python3 scripts/smoke_engine.py` | Passed; pinned HyperFrames lint, check, snapshots, and synthetic video render |
| `python3 scripts/package.py` | Passed; separate site and plugin ZIPs with SHA-256 files; archive contents inspected for local/private artifacts |

Browser checks used a temporary `npm exec --yes --package=agent-browser -- ...` environment because the CLI was absent from the shell PATH; the existing browser was available. An initial scene-test invocation without that prerequisite failed with `ENOENT` and was stopped before rerunning with the CLI available. No personal installation was changed.

The scene check exposed two existing defects before publication: the recovery icon used `COR` while its substitution expected `COLOR`, and the attempt counter read `success` while its public parameter was `correct`. The fixes preserve the existing validation and animation. The unchanged regression assertions failed before their corresponding fixes and passed afterward, including zero successful attempts and each numbered successful attempt. The four HTTP-client integration tests also passed after annotating their synthetic credential fixture for the secret scanner.

## Sample and interface inspection

The synthetic smoke exported a 3.000-second MP4 at 1080×1920 with a 48 kHz audio stream. Frames at 1, 1.5, and 2 seconds showed readable captions and the glow transition. Audio measurement found mean volume -21.1 dB and maximum -16.2 dB. This proves synthetic signal presence rather than speech or music quality.

The guide footer was inspected at 390×844 and 1440×1000. Author, Instagram, email, and repository links remained visible without horizontal page overflow. A footer-scoped axe 4.12.1 audit reported zero violations and zero incomplete checks; this is not a whole-site accessibility certification.

## Publication and review

A native independent read-only review examined the development history and working tree for publication risks, metadata consistency, disposable files, and retained third-party notices. It identified a different personal email in historical commit metadata and stale validation/development notes. The public repository starts from a sanitized snapshot using Matheus Gomes and `eu@matheusgom.es`; prior development history remains in local Git backup refs and is not pushed. Temporary plans, graph exports, secrets, environments, caches, test output, and distribution ZIPs are excluded from the public tree.

Gitleaks 8.30.1 was downloaded to an ignored temporary directory and checked against its release checksum. The historical scan detected one synthetic credential in the mocked HTTP-client tests; it was inspected and annotated in source with a scoped `gitleaks:allow`. The final public snapshot is scanned separately before pushing. Pattern-based scanning cannot prove the absence of every possible secret.

This publication review does not claim the five functional review cycles previously proposed in local development notes. Additional independent review of the two scene fixes is limited to their concrete regressions. Original library/model/font/audio notices remain separate from the first-party MIT license; the inventory review does not replace legal verification of every upstream resource.

Reusable security review is based on the prompt in [Vibe Coding Toolkit revision de66fe3](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/de66fe371a49f5a4d3b521759e5c401f390b6424/docs/prompts/13-security-review.md). Review actual callers and trust boundaries without secrets, production probing, code upload, or automatic external actions. A native independent reviewer is the fallback when a compatible specialized reviewer is unavailable. This document remains the canonical quality source.

## Remote CI portability

The first GitHub Actions run of the sanitized snapshot failed on Ubuntu because the rollback unit test mocked dependency synchronization but still relied on a real `uv` executable for preflight. Reproducing that test locally with `shutil.which` returning `None` produced the same failure. The test now supplies its external-tool prerequisite explicitly while continuing to exercise the real installation, failed synchronization, version restoration, and agent registration checks. Production installer validation is unchanged. The focused reproduction passes with `uv` unavailable, and the canonical local suite is rerun before pushing the fix.

GitHub Actions checks Node.js 22.13.0 and 24 using Python 3.11. Two FFmpeg-dependent voice tests are skipped when those system tools are absent; that limitation is distinct from the local engine/browser/render evidence above. Confirm the latest run on the repository's Actions page rather than interpreting an earlier failed run as the current result.

## Reproduce and invalidate

```sh
npm ci --ignore-scripts
npm run build
npm run check
python3 editonny.py doctor
python3 editonny.py media status
npm run test:engine
npm run test:browser
npm run test:preview
npm run test:scenes
python3 scripts/smoke_engine.py
python3 scripts/package.py
```

Browser checks require agent-browser and its browser on PATH. Render checks require FFmpeg/ffprobe and may download the pinned package/browser on first use. Engine tests use the locked uv environment. Test installers with a temporary home; preserve footage, secrets, and personal installations. Inspect generated samples before removing task-owned `.work/` output.

Dependency, source, schema, asset, or interface changes invalidate the corresponding evidence and require focused verification. A structural audit or successful selected-scene test does not render every scene. Local checks do not prove Windows/Linux behavior, long-video performance, remote CI, client restart discovery, external generation, or real recording quality. Remote CI and publication must be verified separately after the push.
