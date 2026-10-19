# Installation and recovery

Reviewed on 2026-10-18 against the repository installer and CLI. Run commands from the complete checkout unless a different path is shown. `python3` may be named `python` or `py` on your system; the launcher needs Python 3.9+.

## Requirements

| Tool | Purpose |
|---|---|
| Python 3.9+ | Installer and root CLI |
| uv | Locked engine environment and compatible Python selection |
| Python >=3.10,<3.14 inside uv | Engine runtime |
| FFmpeg and ffprobe on PATH | Cuts, audio, media processing, and inspection |
| Node.js 22.13+ or 24+, with npx | HyperFrames rendering and developer checks |
| Configured Codex or Claude Code | Conversation and skill execution |

The installer does not install system programs. Obtain them from the official [uv](https://docs.astral.sh/uv/getting-started/installation/), [Python](https://www.python.org/downloads/), [Node.js](https://nodejs.org/en/download), and [FFmpeg](https://ffmpeg.org/download.html) sources. First use may download dependencies, the rendering browser, or transcription models. Installed instructions alone do not validate tool availability or rendering.

## Register the shared skill

```sh
python3 install.py --target both
```

Use `--target codex` or `--target claude` for one agent. The package lives once at `~/.local/share/editonny`. Codex uses a link at `~/.agents/skills/editonny`; Claude Code uses `~/.claude/skills/editonny`. A real-home installation respects `CLAUDE_CONFIG_DIR`. General agent settings are not rewritten.

Start a new conversation. Invoke `$editonny` in Codex or `/editonny` in Claude Code. These local registrations do not automatically install the skill, its tools, or its media in cloud sessions or on a phone.

```sh
python3 install.py --target both --dry-run
python3 install.py --target both --home "/tmp/editonny-isolated" --no-sync
```

`--dry-run` reports destinations without writing. `--home` isolates registration under a temporary home. `--no-sync` prepares files only; repeat without it to prepare the engine. Do not confuse a files-only installation with a working editor.

## Check the environment

```sh
python3 ~/.local/share/editonny/scripts/editonny.py doctor
python3 ~/.local/share/editonny/scripts/editonny.py doctor --json
python3 ~/.local/share/editonny/scripts/editonny.py media status
```

`doctor` checks system tools, engine imports, and catalog files; it does not transcribe, render, or test external services. `media status` separately validates bundled video hashes. To repair a missing environment:

```sh
uv sync --locked --directory ~/.local/share/editonny/engine
```

For a development checkout, use `skills/editonny/engine` and `python3 editonny.py doctor`. Developer setup belongs in [setup](setup.md); reproducible checks and observed limits in [validation](validation.md).

## Bundled media

The complete plugin archive includes all 79 original videos inside `visuals/`, together with scenes, images, fonts, and audio. Of 145 catalog scenes, 35 reference bundled clips. No external media-library configuration or separate media download is required. Clips retain their original bytes, dimensions, and transparency unless an explicitly documented local asset rebuild is needed.

`media status --json` checks English paths, sizes, and SHA-256 from `visuals/media.json`. Missing or invalid files return status 1. Reinstall the complete package or recover missing files from a complete valid backup:

```sh
python3 ~/.local/share/editonny/scripts/editonny.py media import "/path/to/backup/skills/editonny/visuals"
```

Recovery validates the sources before copying, preserves originals, refuses destination conflicts, and can resume already valid copies. Normal installation already includes these files.

`scene --project PATH --use SCENE --start SECONDS --end SECONDS` materializes only the referenced clips. Existing project files are preserved, regardless of their modification time. New copies are verified in temporary files and published complete without overwrite, requiring hard-link support on the destination volume. A failure must not leave an accepted partial resource or write the scene configuration prematurely.

## Update and unregister

Run the installer from the new checkout. It compares source and installed content, refuses foreign destinations, preserves `.env` and `engine/.env`, and backs up the previous copy under `~/.local/share/editonny-backups/`. Reinstallation also repairs missing or modified package resources while retaining the previous installation in backup.

Keep personal projects and footage outside the installed skill. Other personal files inside it remain in the backup rather than merging into the new package. Verify the update before removing any backup. No conversion of previous experimental project formats is provided.

```sh
python3 install.py --target both --uninstall --dry-run
python3 install.py --target both --uninstall
```

Unregistering removes only the selected agent links. Shared files, settings, backups, and projects remain. It does not uninstall system tools. Inspect foreign destination conflicts rather than forcing an overwrite.

## Load as a local plugin

```sh
claude --plugin-dir "/path/to/editonny"
```

In that session the skill is `/editonny:editonny`; the standalone skill is `/editonny`. Avoid duplicate loading. Plugin metadata does not prove marketplace installation or publication. System video tools and the engine environment are still required.

## Open the guide

Open `web/index.html` directly with its complete `web/` folder. The distributed bundle includes examples and catalog data, so browsing needs neither a server nor Node.

```sh
python3 editonny.py guide
python3 editonny.py guide --port 0 --no-open
```

The server binds only to `127.0.0.1`. The default port is 4173; port 0 selects a free port. The standalone skill installation omits the guide; use the complete checkout or site archive.

## Platform limits

The current environment is macOS Apple Silicon. Windows and Linux require their own validation. Windows directory links may require Developer Mode or elevated local permissions; failures must be reported rather than silently creating a second engine copy. Model downloads, long recordings, and optional external generation require separate verification on the actual machine.
