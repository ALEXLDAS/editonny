**English** · [Português](README.pt-BR.md) · [Español](README.es.md)

<a id="top"></a>

<p align="center">
  <picture>
    <source media="(max-width: 640px)" srcset="docs/assets/readme/hero-mobile.svg" />
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/hero-still.svg" />
    <img src="docs/assets/readme/hero.svg" alt="editonny: an editorial local video studio with an animated video, voice, and visuals timeline." width="1600" />
  </picture>
</p>

# editonny

**Your story. Your rhythm. One local editing workflow.**

Local video editing, guided by conversation. One portable skill brings together transcription, precise cutting, captions, framing, audio, and a library of **145 visual scenes** for **Codex** and **Claude Code**.

[Start editing](#install) · [See the motion](#motion) · [Explore the guide](#open-the-guide) · [Star history](#community)

<p align="center">
  <a href="https://github.com/soumatheusgomes/editonny/stargazers"><img src="https://img.shields.io/github/stars/soumatheusgomes/editonny?style=flat&amp;label=Stars&amp;color=354935&amp;labelColor=242721" alt="GitHub stars" /></a>
  <a href="https://github.com/soumatheusgomes/editonny/actions/workflows/verify.yml"><img src="https://github.com/soumatheusgomes/editonny/actions/workflows/verify.yml/badge.svg?branch=main" alt="GitHub Actions verification" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-354935?labelColor=242721" alt="MIT license for first-party code" /></a>
</p>

| Visual scenes | Editing examples | Bundled videos |
| :---: | :---: | :---: |
| **145** ways to explain | **54** starting points | **79** original clips |

## Start with one request

Install the skill, open your agent in the footage folder, and describe the edit. You direct the result; editonny brings the local tools and visual library.

```text
$editonny
Edit a 45-second vertical video from /path/to/footage.
Keep complete takes, clean pauses, breaths, and mistakes, and add clear captions.
Use visual scenes only where they explain the story.
Verify an 8–15 second sample before finishing the export.
```

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

These commands register the skill and prepare its Python environment. For a complete installation before the first edit, ask your agent to read `skills/editonny/SKILL.md` and follow its [setup procedure](skills/editonny/references/setup.md): prepare compatible local tools, the pinned renderer/browser, the default transcription model, local OCR for caption verification, bundled media, and synthetic readiness checks. Report pending downloads or failed checks before calling setup complete. Each use checks local readiness and GitHub updates; applying an update requires your acceptance.

Local transcription and rendering do not require an LLM API key. Your agent subscription is separate. External generators are optional and require authorization before costs or media transmission.

See [installation and recovery](docs/installation.md) for prerequisites, isolated installation, plugin loading, updates, and removal.

## Open the guide

The guide is the editonny website: it builds editing requests, browses the 145 motion scenes and 54 example requests, and explains installation in English, Brazilian Portuguese, or Spanish (picked from your browser; your choice and your brief stay saved in that browser). It never receives or uploads footage.

To run it locally from this repository (Node.js 22.13+ or 24+):

```sh
npm ci
python3 editonny.py guide
```

This starts the development server at `http://localhost:4173` and opens it. Stop it with `Ctrl+C`; use `--port` to choose another port and `--no-open` to skip the browser. `npm run dev` does the same on port 3000.

<a id="motion"></a>

## Words, ideas, and objects in motion

Three real scenes from the bundled library. These silent, cropped excerpts use synthetic text and illustrative scene content; they are examples, not customer footage.

<p align="center">
  <a href="docs/assets/readme/captions.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/captions-still.png" />
    <img src="docs/assets/readme/captions.gif" alt="Timed chromatic captions reveal “Your story. Your rhythm.”" width="260" loading="lazy" />
  </picture>
  </a>
  <a href="docs/assets/readme/explain.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/explain-still.png" />
    <img src="docs/assets/readme/explain.gif" alt="An illustrative building rises floor by floor beside a changing floor count." width="260" loading="lazy" />
  </picture>
  </a>
  <a href="docs/assets/readme/motion.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/motion-still.png" />
    <img src="docs/assets/readme/motion.gif" alt="Planets orbit a rotating Sun in the solar system scene." width="260" loading="lazy" />
  </picture>
  </a>
</p>

[Timed captions](skills/editonny/visuals/scenes/text-chromatic.html) · [Illustrated explanations](skills/editonny/visuals/scenes/building-panel.html) · [Spatial motion](skills/editonny/visuals/scenes/solar-system.html)

Previews play once for 4.5 seconds. Reduced-motion preferences select still images. Open a preview to replay it.

## What it does

Describe the result and point your agent at a video folder. editonny helps it inspect the recording, choose complete takes, measure cuts against the waveform, assemble a project, review a representative sample, and export a checked MP4.

Standard editing cleanup removes unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions while preserving complete words, natural pacing, intentional pauses, and meaning. Narrow revisions stay within the requested scope. Original footage is preserved. Speech can remain in its original language; an English product does not require English recordings.

The browser guide includes **54 editing examples**, a prompt builder, and the scene catalog. Every editing prompt includes the shared cleanup policy. The guide does not upload files or edit video in the browser.

## Editing workflow

<p align="center">
  <picture>
    <source media="(max-width: 640px)" srcset="docs/assets/readme/workflow-mobile.svg" />
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/workflow-still.svg" />
    <img src="docs/assets/readme/workflow.svg" alt="A local editing workflow: describe your intent, edit the footage, review an 8–15 second sample, and export a checked MP4." width="1600" />
  </picture>
</p>

1. Choose a goal in the guide, specify the footage folder, and copy the request (in the guide's language) to your agent.
2. The skill inspects selected sources, proposes every editing setting and **waits for your confirmation**, even with a detailed prompt. Defaults preserve the original image, geometry and FPS; color filters and conversions are never automatic.
3. After acceptance, work stays in **Downloads/editonny/date-title/revisions/v001/**, with separate edit, project and export folders. Review an **8–15 second** sample; select user approval if you want the agent to wait at this later step too.
4. Complete a supported render route and publish uniquely named MP4/subtitle files with a matching verification manifest. Unsupported color/timing paths block clearly; remote execution must identify an accessible destination.

Keep footage, editable projects, and personal libraries outside the installed skill. Sample numbers, offers, testimonials, and brands in scenes are illustrative and must be replaced with supplied facts. Never treat generated visuals as evidence.

## Structure

| Path | Responsibility |
|---|---|
| `skills/editonny/` | Single portable skill and CLI |
| `skills/editonny/engine/` | Local processing, preview, and English project template |
| `skills/editonny/visuals/` | Scenes, catalog, bundled media, and recipes |
| `web/` | Public guide: Next.js app with localized request builder, catalog, examples, and installation |
| `DESIGN.md` | Visual contract and source of truth for design tokens |
| `design-system/` | React component library, tokens, preview templates, showcase, and reference HTML |
| `docs/` | Canonical architecture, installation, integration, and validation references |
| `scripts/`, `tests/` | Packaging, render checks, and regression tests |

New projects use `project.json` and English commands, fields, and scene IDs. This is a clean pre-release foundation; previous experimental project formats are unsupported.

<details>
<summary><strong>Development, verification, and distribution</strong></summary>

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

`npm run test:browser` builds the guide and runs Playwright (install its Chromium once with `npx playwright install chromium`). The preview browser check (`npm run test:preview`) requires `agent-browser`. Render checks require FFmpeg and network access on the first HyperFrames use. Inspect generated samples before deleting task outputs from `.work/`. Full commands, results, and known limits belong in [validation](docs/validation.md).

The repository is an npm workspace: `web/` (`@editonny/web`) and `design-system/` (`@editonny/design-system`). `npm run build` builds the guide; `npm run check` runs lint, typechecks, unit tests, and the icon registry check (`npm run icons` regenerates it from `design-system/assets/icons/`). Open `/design-system` on the running guide to browse every component and state in both themes; new UI follows [DESIGN.md](DESIGN.md) and [the library map](design-system/README.md).

### Deploy the guide

Import the repository in Vercel and set **Root Directory** to `web`; Vercel installs the workspace from the repository root and keeps the skill's catalog available to the build. Set `NEXT_PUBLIC_SITE_URL` to the public origin (for example, a custom domain) so canonical links, `hreflang`, the sitemap, and social images use it; otherwise the Vercel production domain is used.

## Package

```sh
python3 scripts/package.py
```

This creates the plugin ZIP with a SHA-256 file in `dist/`. It includes the canonical documentation, the complete skill, and **79 bundled videos**; projects receive only clips they use. The guide is deployed as a website instead of shipping in the archive. Building the package does not publish it or update your global installation.

</details>

<a id="community"></a>

## Follow the story

If editonny helps your next video, give the project a star. Follow its progress, report a problem, or share an idea for a scene.

<a href="https://www.star-history.com/?repos=soumatheusgomes%2Feditonny&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=soumatheusgomes/editonny&amp;type=date&amp;theme=dark" />
    <img src="https://api.star-history.com/chart?repos=soumatheusgomes/editonny&amp;type=date" alt="Star history for soumatheusgomes/editonny" width="1000" loading="lazy" />
  </picture>
</a>

[Star the project](https://github.com/soumatheusgomes/editonny/stargazers) · [Report an issue](https://github.com/soumatheusgomes/editonny/issues) · [Open star history](https://www.star-history.com/?repos=soumatheusgomes%2Feditonny&type=date)

Live star history is provided by [Star History](https://www.star-history.com/blog/how-to-use-github-star-history/) and depends on that service. The badge above shows the real GitHub star count.

## Author and contact

Created and maintained by **Matheus Gomes**.

- Instagram: [@matheusgomes](https://instagram.com/matheusgomes)
- Email: [eu@matheusgom.es](mailto:eu@matheusgom.es)
- GitHub: [soumatheusgomes/editonny](https://github.com/soumatheusgomes/editonny)

## License and resources

First-party code and documentation use the [MIT License](LICENSE.md). Third-party libraries, models, fonts, audio, and media retain their own licenses and attribution; MIT does not relicense those resources. Consult the [third-party notices](skills/editonny/engine/THIRD_PARTY_NOTICES.md) and the notices beside assets before redistribution.

[Product](PRODUCT.md) · [Architecture](docs/architecture.md) · [Interface](docs/design.md) · [Integrations](docs/integrations.md) · [Development setup](docs/setup.md)

<p align="center"><strong>YOUR STORY. ITS OWN RHYTHM.</strong><br /><a href="#top">Back to top ↑</a></p>
