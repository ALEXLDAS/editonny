# Working on editonny

Open-source local video editing through conversation. One portable skill owns the engine and visual library; the browser guide helps users build requests.

## Map

- `skills/editonny/SKILL.md`: portable agent entry point. Do not create per-agent engine copies.
- `skills/editonny/engine/`: locked Python/FFmpeg/Whisper engine, preview, references, and HyperFrames project template.
- `skills/editonny/visuals/`: scenes, catalog, bundled media, recipes, and scene application.
- `skills/editonny/visuals/media.json`: original-video manifest. `media status` verifies the bundled paths, sizes, and hashes; projects receive only clips they use.
- `install.py`: shared installation and agent registration through links.
- `skills/editonny/scripts/editonny.py`: canonical CLI; root `editonny.py` is the launcher.
- `web/`: standalone HTML/CSS/JS guide. Run `npm run build` after editing source to regenerate the bundle and catalog. Never edit `web/app.js` manually.
- `web/prompts.mjs`: canonical example entry point, composed from `web/prompts/`; do not duplicate example records.
- `web/model.mjs`: shared prompt builder and default editing-cleanup policy.
- `PRODUCT.md`, `docs/architecture.md`, `docs/design.md`: scope, structure, and interface.
- `docs/installation.md`, `docs/validation.md`, `docs/setup.md`: onboarding, quality evidence, and development tooling. Do not create competing sources.
- `graphify-out/graph.json`: local code/document index; workflow and coverage in `docs/setup.md`.
- `.work/`: temporary test artifacts. Remove task-owned outputs after inspection.

## Language and contracts

First-party names, code, comments, commands, schema, paths, prompts, descriptions, defaults, and interface text use English. `README.md` is primary; `README.pt-BR.md` and `README.es.md` are the explicit translation exceptions. Preserve upstream names, licenses, speech lexicons, and user-supplied text as data. Do not force English transcription or translate recorded speech without a request.

New projects use `project.json` and English contracts. Do not add compatibility readers or aliases for previous experimental formats. Use descriptive identifiers without inherited product-edition labels.

All full edits default to removing unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions. Preserve complete words, natural pacing, intentional pauses, meaning, originals, and the requested editing scope. Caption-only or interval revisions must not silently recut unrelated content.

## Verify

```sh
npm ci --ignore-scripts
npm run build
npm run check
python3 editonny.py doctor
```

`npm run test:browser` checks the guide through `file://` and requires agent-browser and its browser. Engine/preview changes also need `npm run test:engine`, `npm run test:preview`, and `python3 scripts/smoke_engine.py` with sample inspection. The smoke needs FFmpeg, Node/npx, and network on first use. Guide-only changes do not need another video render.

Preserve dependency pins and third-party notices. New render evidence applies only to the tested scenes and environment; never infer universal validation from one sample. Keep `docs/validation.md` aligned with observed results and limits.

## Boundaries

Preserve user footage, `.env`, projects, libraries, and unrelated local changes. Test installers with a temporary `--home`. Do not include virtual environments, caches, secrets, personal media, graph exports, or development artifacts in public site packages. The site contains only `web/` or the generated site ZIP. First-party MIT licensing does not replace third-party resource terms.

Do not publish, transmit media to external services, spend credits, send messages to others, or change personal installations without authorization. Existing tools do not imply authorization. Do not add Git hooks or impose a branch/worktree; respect the requested checkout.

## Execution agreements

Read relevant code and instructions before edits. State assumptions, acceptance criteria, and checks. Use the smallest complete change; preserve validations, meaningful errors, accessibility, and working capabilities. Fix shared causes once and update callers, tests, fixtures, configuration, exports, and the responsible documentation together. Reproduce bugs and prove regression when feasible.

Answer status requests and continue authorized work. Pause only affected dependencies; respect cancellation. On resumption, inspect checkout, files, checks, and processes before trusting a handoff. Temporary progress belongs in `docs/superpowers/`; durable knowledge belongs in canonical docs with source, date, and invalidation conditions.

Use installed Ponytail full and Caveman for focused changes and concise conversation when available; code, docs, commits, and accessibility keep normal clear wording. Use Superpowers proportionally and preserve existing authorization. Use Context7 for current library/API documentation when needed, without private data in queries. Use the existing RTK hook for supported shell commands; do not add wrappers. UI review uses web-design-guidelines when available. Reusable security-review policy belongs in `docs/validation.md`.

All project LLM work uses native Codex, `gpt-6-astra`, and ChatGPT authentication. Select that model explicitly in supported delegation; no proxy, API-key billing, external provider, or silent model switch. Delegate when isolation or independent review justifies it: one writer per file, read-only reviewers, independent or serialized resources. The coordinator controls Git, lockfiles, and integration, then verifies diffs and checks before accepting results.

Non-trivial work receives independent review of the exact range and working tree with concrete scenarios and evidence. Additional rounds require an explicit request or unresolved risk/finding. Reviews never justify weakening tests to hide a real defect.

## Local graph

Use the graph for navigation, then inspect current source. Exclude secrets, media, vendor files, environments, generated bundles, and exports. `npm run graph:update` prepares `.work/graphify/pending.json`; native Codex agents complete assigned extraction tasks and community labels, then the command is repeated until promotion. No terminal command starts an LLM or selects another provider. Coverage and provenance belong in `graphify-out/run.json`; unknown native token counters remain unknown. Details and recovery are in `docs/setup.md`.
