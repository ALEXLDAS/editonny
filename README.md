# editonny

Local video editing, guided by conversation. One portable skill brings together transcription, precise cutting, captions, framing, audio, and a library of **145 visual scenes** for **Codex** and **Claude Code**.

**English** · [Português](README.pt-BR.md) · [Español](README.es.md)

## What it does

Describe the result and point your agent at a video folder. editonny helps it inspect the recording, choose complete takes, measure cuts against the waveform, assemble a project, review a representative sample, and export a checked MP4.

Standard editing cleanup removes unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions while preserving complete words, natural pacing, intentional pauses, and meaning. Narrow revisions stay within the requested scope. Original footage is preserved. Speech can remain in its original language; an English product does not require English recordings.

The browser guide includes **54 editing examples**, a prompt builder, and the scene catalog. Every editing prompt includes the shared cleanup policy. The guide does not upload files or edit video in the browser.

## Open the guide

Open [web/index.html](web/index.html) directly in a current browser. Keep the complete `web/` folder together; no server or dependency installation is needed to browse it.

Alternatively, from this repository:

```sh
python3 editonny.py guide
```

This opens `http://127.0.0.1:4173`. Stop it with `Ctrl+C`; use `--port 0 --no-open` for an available port without opening a browser.

## Install

Prepare Python **3.9+** for the launcher, **uv**, **FFmpeg/ffprobe**, **Node.js 22.13+ or 24+**, and an already configured agent. The engine requires Python **>=3.10,<3.14**; uv selects a compatible interpreter. System tools must be available on `PATH`.

```sh
git clone https://github.com/soumatheusgomes/editonny.git
cd editonny
python3 install.py --target both
python3 ~/.local/share/editonny/scripts/editonny.py doctor
python3 ~/.local/share/editonny/scripts/editonny.py media status
```

Restart your agent. Invoke **`$editonny` in Codex** or **`/editonny` in Claude Code**. Use `--target codex` or `--target claude` to register one agent. One shared installation lives at `~/.local/share/editonny`; agent entries are links to it.

The first use may download dependencies, transcription models, or the rendering browser. Local transcription and rendering do not require an LLM API key. Your agent subscription is separate. External generators are optional and require authorization before costs or media transmission.

See [installation and recovery](docs/installation.md) for prerequisites, isolated installation, plugin loading, updates, and removal.

## Editing workflow

1. Choose a goal in the guide, specify the footage folder, and copy the English request to your agent.
2. The skill checks the environment, inspects speech, selects takes, and applies measured cleanup.
3. Review an **8–15 second** representative sample with speech, captions, and visual movement. Request approval explicitly if you want the agent to wait.
4. Complete the project, render using its pinned HyperFrames version, and inspect the final MP4.

Keep footage, editable projects, and personal libraries outside the installed skill. Sample numbers, offers, testimonials, and brands in scenes are illustrative and must be replaced with supplied facts. Never treat generated visuals as evidence.

## Structure

| Path | Responsibility |
|---|---|
| `skills/editonny/` | Single portable skill and CLI |
| `skills/editonny/engine/` | Local processing, preview, and English project template |
| `skills/editonny/visuals/` | Scenes, catalog, bundled media, and recipes |
| `web/` | Standalone guide, prompt library, and generated catalog |
| `docs/` | Canonical architecture, installation, integration, and validation references |
| `scripts/`, `tests/` | Packaging, render checks, and regression tests |

New projects use `project.json` and English commands, fields, and scene IDs. This is a clean pre-release foundation; previous experimental project formats are unsupported.

## Develop and validate

```sh
npm ci --ignore-scripts
uv sync --locked --directory skills/editonny/engine
npm run build
npm run check
python3 editonny.py doctor
npm run test:engine
npm run test:browser
npm run test:preview
npm run test:scenes
python3 scripts/smoke_engine.py
```

Browser checks require `agent-browser` and its browser. Render checks require FFmpeg and network access on the first HyperFrames use. Inspect generated samples before deleting task outputs from `.work/`. Full commands, results, and known limits belong in [validation](docs/validation.md).

Edit `.mjs` source and regenerate `web/app.js` and `web/catalog.json` with `npm run build`. Never edit the bundle manually. `npm run check:web` detects stale generated files without modifying them.

## Package

```sh
python3 scripts/package.py
```

This creates separate site and plugin ZIPs with SHA-256 files in `dist/`. The plugin includes the guide, canonical documentation, complete skill, and **79 bundled videos**; projects receive only clips they use. The site includes only the public guide. Distribute or host only the appropriate archive contents. Building packages does not publish them or update your global installation.

## Author and contact

Created and maintained by **Matheus Gomes**.

- Instagram: [@matheusgomes](https://instagram.com/matheusgomes)
- Email: [eu@matheusgom.es](mailto:eu@matheusgom.es)
- GitHub: [soumatheusgomes/editonny](https://github.com/soumatheusgomes/editonny)

## License and resources

First-party code and documentation use the [MIT License](LICENSE.md). Third-party libraries, models, fonts, audio, and media retain their own licenses and attribution; MIT does not relicense those resources. Consult the [third-party notices](skills/editonny/engine/THIRD_PARTY_NOTICES.md) and the notices beside assets before redistribution.

[Product](PRODUCT.md) · [Architecture](docs/architecture.md) · [Interface](docs/design.md) · [Integrations](docs/integrations.md) · [Development setup](docs/setup.md)
