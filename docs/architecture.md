# editonny architecture

Source reviewed on 2026-10-18. Changes to entry points, contracts, distribution, dependencies, or resource paths invalidate this map.

## Entry points and ownership

| Entry | Responsibility |
|---|---|
| `editonny.py` | Resolve and launch the canonical CLI from any working directory |
| `skills/editonny/scripts/editonny.py` | Environment checks, catalog search, project creation, scene/media commands, helpers, and local guide |
| `skills/editonny/SKILL.md` | One portable conversation workflow with standard cleanup and scoped-edit rules |
| `skills/editonny/engine/` | Local transcription, waveform cuts, captions, audio, framing, preview, and render preparation |
| `skills/editonny/engine/project-template/` | English project contract, composition runtime, build commands, and pinned HyperFrames integration |
| `skills/editonny/visuals/` | Visual catalog, scene templates, recipes, resource materialization, and media verification |
| `install.py` | One shared installation, agent links, ownership checks, staging, backups, and rollback |

The engine Python range and dependency resolution live in `engine/pyproject.toml` and `engine/uv.lock`. The template pins HyperFrames 0.8.171. Root developer dependencies are also pinned. Renaming the engine package does not authorize dependency upgrades.

## Contracts and processing

The project configuration is `project.json`; fields, enums, generated filenames, commands, and first-party scene state use English. New experimental contracts have no backward compatibility layer. `window.__scenes` supplies per-scene configuration; HyperFrames timeline interfaces retain upstream names.

The skill directs work against actual speech and waveform measurements. Speech, Unicode paths, and supplied text remain user data. Transcription detects source language. Language-specific token sets support speech analysis; they do not expose alternative product schemas.

Processing uses an `edit/` directory for transcripts, EDLs, cut media, timing, review state, and project notes. Composition projects live alongside it, store their package origin, and use their own pinned render commands. A single project render runs at a time. The shared cleanup policy never expands the scope of a targeted revision.

## Guide and data

`web/prompts.mjs` composes 54 examples from `create.mjs`, `refine.mjs`, `audio-media.mjs`, and `deliver.mjs`. `web/model.mjs` owns search, personalization, and request generation, including one shared cleanup policy. Custom, scene, and example dialogs all use that builder. Text remains in the browser until copied.

`web/build-data.mjs` extracts public fields from `visuals/catalog.json`, validates scene IDs, and builds `web/catalog.json` and `web/app.js`. `index.html` loads the classic bundle with `defer`, supporting both `file://` and HTTP. Generated artifacts are compared without writes by `npm run check:web`.

The optional guide server binds only to `127.0.0.1`, refuses hidden paths and root escapes, and disables directory listing. Port 0 requests a free port. The standalone skill installation does not include the guide; it belongs to the full checkout, full plugin archive, or site ZIP.

## Media and visual composition

`visuals/media.json` records 79 original videos by English path, size, and SHA-256. Binary content is preserved unless an intentional local content rebuild is required. `media.py` verifies the bundle and recovers missing resources from a valid backup without network access or overwriting conflicts.

`resources.py` finds literal references in selected scene HTML and materializes only required clips. Existing project files remain untouched, regardless of their modification time. New resources are copied to a verified temporary file and published atomically without overwrite, requiring hard-link support on the destination volume. Unexpected symlinks, unknown media, and escaped paths are rejected before scene/configuration changes.

Scenes are project copies with independent IDs and timeline registrations. Customization never modifies the package template. Required runtime dependencies are copied into the project so a materialized composition uses its own media rather than reading bundled videos during render.

## Preview and rendering

The preview application separates shared state/API, playback, timeline, trims, marks, approval, and style controls. The local server has an explicit static allowlist and authenticated same-origin writes. Approval checks file versions to reject stale saves; later changes are also surfaced by the watcher.

The 3D scene runtime keeps its facade over focused timing, camera, material, text, label, media, and stage modules, sharing the same local Three.js instance. Time-driven scenes must support arbitrary seeking and preserve meaningful validation.

## Installation and distribution

Installation fingerprints source and destination, refuses foreign paths, stages a complete copy, preserves package `.env` and `engine/.env`, backs up the previous copy, and rolls back failures. Other personal files must live outside the installed skill. Unregistering removes only the selected agent links.

`scripts/package.py` builds separate site/plugin ZIPs, publishes the completed archive locally, and writes a SHA-256 file. The site includes only public web assets; the plugin uses an explicit content scope containing the skill, installer, launcher, manifests, README translations, public guide, licenses, and canonical documentation. Secrets, environments, caches, and unexpected symlinks are rejected or excluded.

The local graph is a derived navigation tool outside distribution. Its coverage and provenance do not replace current source or test evidence. See [setup](setup.md) and [validation](validation.md).
