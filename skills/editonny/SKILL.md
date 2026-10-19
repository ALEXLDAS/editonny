---
name: editonny
description: Use when editing local videos, Reels, ads, sales videos, lessons, combining takes, adding captions or visual scenes, adapting a reference, or refining an existing edit.
---

# editonny

One portable entry point for local video editing and visual storytelling. Follow the user's conversation language. Preserve recorded speech and its language unless translation was requested; prompt language does not identify speech language.

## Every new editing job starts with confirmation

**Inspect → present the complete proposed settings → wait for a subsequent explicit user reply → create the workspace and edit.** This applies even to a detailed prompt or “decide everything and continue.” The initial prompt cannot approve its own summary. Never fabricate confirmation, timestamps, message IDs or a reply.

Before that reply, allow only read-only local probes, hashes, representative frames and bounded speech-language sampling (up to 30 seconds per source, three sources, cached local models only). Keep observations in temporary session files. No full transcription, editorial render, treatment, upload or permanent workspace yet.

Present one readable summary, using the actual request and observed facts, covering:

1. Goal, scope and pacing.
2. Selected sources and order; unresolved media issues.
3. Image: preserve original brightness, tone, contrast, saturation and color interpretation; **no automatic filter, grade, HDR/SDR conversion or “enhancement.”** HDR is not automatically better. Disclose unknown or conflicting metadata.
4. Dimensions, aspect ratio, crop/contain, orientation, exact FPS/VFR, codec, container, precision and output variants.
5. Conversation, detected speech, transcription, caption and translation languages separately. Show uncertain detection; do not invent a regional locale.
6. Captions, style, density, placement/accessibility and SRT/VTT files.
7. Cleanup, intentional pauses and protected source intervals.
8. Voice level, noise removal, music, effects, tracks and encoded peak ceiling.
9. Scenes, camera movement, transitions, graphics and background treatment.
10. Sample reviewer, final checks, destination, filenames and organization.

Mark requested, observed, proposed and unknown choices. Defaults are **proposals**, not permission: source appearance/geometry/FPS, standard editorial cleanup, faithful captions on (up to three words), voice normalization at -14 LUFS, processing headroom -1.5 dBTP, encoded ceiling -1 dBTP, denoise/music/effects/scenes/camera motion off, agent sample review. Respect narrower scopes: captions-only does not normalize audio or recut speech. Explain unsupported combinations before acceptance; offer concrete choices without silently changing them.

End with “Approve these settings, or tell me what to change.” Wait. After changes, show the revised summary and wait for its acceptance.

## Resolve the package

`<EDITONNY>` is the physical directory containing this file, resolving any symlink. `<ENGINE>` is `<EDITONNY>/engine`; `<VISUALS>` is `<EDITONNY>/visuals`. The root CLI is `<EDITONNY>/scripts/editonny.py`. Do not assume another skill or global engine is installed.

Use absolute media paths when a command changes directories. Prefer structured subprocess arguments; never interpolate speech or filenames into shell commands. Your current agent directs the edit using its native session; the package does not require an LLM API key.

```text
python3 <EDITONNY>/scripts/editonny.py doctor
python3 <EDITONNY>/scripts/editonny.py catalog "three steps"
python3 <EDITONNY>/scripts/editonny.py media status
python3 <EDITONNY>/scripts/editonny.py inspect /selected/video.mp4 --json
python3 <EDITONNY>/scripts/editonny.py scene --project /path/project --use three-steps --start 5 --end 9
```

If requirements are missing, read [setup](references/setup.md). Loading instructions does not prove the engine is installed or can render. Install the single package rather than creating separate processing or scene installations.

## Standard editing cleanup

Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions. Preserve complete words, natural pacing, intentional pauses, and the meaning of the speech. Measure cuts against the actual recording and review transitions so speech is not clipped. For targeted revisions, apply cleanup only within the requested editing scope; preserve unrelated content and approved timing.

This is the default for every full edit even when the user did not enumerate cleanup tasks. Explicit instructions to preserve a breath, pause, take, or approved interval override the default. Do not apply one silence threshold blindly or infer mistakes from a written script without listening to the recording.

## Start or resume

1. Resolve the physical package and run `doctor`; its fingerprint distinguishes this checkout from an older personal installation. Never update personal installations automatically.
2. Read [the engine workflow](engine/WORKFLOW.md), inspect only selected footage, prepare the complete summary above, and wait for explicit confirmation.
3. After acceptance, use `workspace init` with the real summary/reply record. Default local root: `~/Downloads/editonny/YYYY-MM-DD-title/revisions/v001/{edit,project,exports}`. Only finals, requested subtitles and delivery manifests enter `exports/`; working files stay in the revision. Never scatter intermediates in Downloads, deliver a cache path or overwrite a previous final.
4. Verify the execution host. A remote host's Downloads is not the person's Mac. Explain actual access and obtain a concrete destination/transfer choice; no upload or cache-download fallback by assumption. A denied/full Downloads folder is an actionable error, not permission to choose another folder.
5. Resume with `workspace status --project <PROJECT> --json`. Read canonical `project/project.json`, observed `edit/source_manifest.json` and evidence `edit/state.json`. New decisions use `workspace revise` and a delta summary/confirmation; accepted decisions remain valid for in-scope work. Revisions own independent files. Do not manually forge state or mutate a parent revision.

## Edit and compose

Read the engine workflow and only the references needed for the current step. Local tools provide transcription, take comparison, waveform cutting, captions, face tracking, reframing, multiple cameras, noise reduction, music, preview, and review.

- Time every cut and visual entrance against measured speech, not estimates from a script.
- Verify names, numbers, negations, and corrections before building scenes. A sample template is not evidence of a result, price, testimonial, or offer.
- Prepare a representative **8–15 second** sample containing speech, captions, and a visual change. Review it yourself when autonomous execution was authorized; wait when the user requested sample approval.
- Keep faces and important content unobstructed. Captions need contrast, readable size, safe placement, and enough reading time.
- Keep previous exports and record the format, duration, decisions, and output paths.

## Use visual scenes

Search with `catalog` and choose scenes by `whenToUse`, category, and duration instead of loading the entire catalog into context. Prefer visuals that clarify a list, relationship, value, step, or demonstration.

- Use local code animation when it serves the request. Realistic bundled videos are already in `<VISUALS>`; `media status` verifies their integrity. Use `media import FOLDER` only to recover missing files from a complete valid bundle or backup.
- Apply a scene through `scene --project ... --use ...`. Customize the project copy, never the package template.
- Application materializes only the clips a scene references and preserves existing project videos. When changing an object source, copy the corresponding original into the project too. Keep personal media in the edit or an external personal library.
- Replace illustrative names, brands, ratings, prices, offers, and numbers with supplied facts. Omit unsupported elements instead of inventing them.
- Adjust camera, captions, and sounds after scene placement. Inspect beginning, middle, and end in motion, including backward seeking when applicable.
- Optional SVG/3D and external media workflows are described in [integrations](references/integrations.md). They are not mandatory dependencies. Media transmission and costs need authorization matching the request.

## Export and verify

Prefer the cut-only master when it already satisfies the request; another composition encode is unnecessary. Choose a supported route using the workflow's media policy. Native visual composition is CFR; HDR overlays and unsupported SDR profiles are blocked until conformance evidence exists. VFR cut-only keeps timestamps with hard joins. Offer a confirmed conversion or supported alternative when needed; never downgrade silently.

For native composition, use `build.py hf lint`, `build.py hf check`, and the pinned renderer with an explicit new candidate output path. Review the representative sample, record its exact evidence with `workspace review`, and record user-approved before/after references with `workspace reference` for requested image treatment. Agent autonomy applies to sample review only after initial settings acceptance; user sample review remains mandatory when selected.

Use `quality_gate.py` and `workspace export` for actual-media verification and publication. Required checks marked failed, blocked or not_checked prevent delivery. Source/candidate bytes, composition dependencies, appearance outside measured overlay bounds, timing, audio and caption layout must match current evidence. Interpret expressive pauses, original darkness and silent footage in context, documenting any intentional exceptions. Do not call unchecked media validated.

Inspect the exported MP4 for playback, voice and music, duration, captions, framing, text, cut edges, and synchronization. A still frame checks layout but cannot prove motion or timing. Record exceptions and unavailable checks honestly. Finish with the video and project paths, a concise change report, checks performed, and remaining limitations.

First-party code is MIT licensed. Bundled third-party code, fonts, models, and media keep their own terms and notices.

## Author and contact

Created and maintained by **Matheus Gomes**. [Instagram: @matheusgomes](https://instagram.com/matheusgomes) · [Email: eu@matheusgom.es](mailto:eu@matheusgom.es) · [GitHub](https://github.com/soumatheusgomes/editonny).
