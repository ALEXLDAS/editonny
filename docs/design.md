# Guide interface

Sources: `web/index.html`, `web/styles.css`, `web/app.mjs`, and `web/model.mjs`. Reviewed on 2026-10-18; CSS, markup, content, and interaction changes require verification of affected states.

## Visual language

An editorial guide with light paper, dark ink, muted secondary text, and a lime accent. System typography, serif emphasis, and monospaced details support a calm studio feel. The studio illustration represents a workflow; it is neither a rendered video nor a player.

The product is English. The primary navigation covers Home, Create a prompt, Catalog, Examples and prompts, and Installation. The layout adapts to a 390 px viewport without horizontal overflow. Developer tooling stays outside user task flows.

## Interaction and accessibility

- Hash navigation updates active links with `aria-current` and moves keyboard focus to main content after navigation.
- Every field has a label; controls support keyboards, visible focus, a skip link, and readable empty-search feedback.
- Scene and example dialogs have accessible names, Escape closing, and focus return. Applying a preset preserves the user's folder, agent, pace, and caption choices while replacing the example's goal, effects, and optional format.
- Clipboard success is announced through a live status region. If clipboard access is unavailable, text is selected with manual copy guidance.
- Reduced-motion preferences are respected. Contrast must be evaluated against the effective background, including small timeline text and layered decorative surfaces.
- User content is assigned as text, never interpreted as HTML. The guide does not read or upload personal footage.

## Editing requests

One builder supplies custom requests, scene requests, example previews, copying, and personalization. Every editing request includes standard removal of unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions, while preserving complete words, intentional pauses, natural pacing, and meaning.

The default is explained before copying. Scope remains explicit: a caption-only correction or a specified interval does not authorize recutting unrelated content. Originals, factuality, sample review, and permission for costs/media transmission remain part of the request.

## Verification

Run the direct-file browser regression and inspect desktop/mobile navigation, empty search, dialogs, prompt content, keyboard focus, and copy fallback. Use web-design-guidelines and an accessibility scan for changed UI, then inspect inconclusive results manually. Automated scans and still screenshots do not establish complete accessibility or motion correctness. Current measured results and limitations belong in [validation](validation.md).

## README presentation

Reviewed on 2026-10-18. The three root READMEs share the guide's paper `#f4f3ed`, ink `#242721`, forest `#354935`, and lime `#d6f66b` palette. Original self-contained SVG covers and workflow panels live in `docs/assets/readme/`; their compositions reuse the site's editorial typography and studio/timeline motif. Desktop images have explicit still alternatives, and narrow viewports select readable mobile compositions. All important product instructions remain selectable Markdown text.

SVG decoration ends within 4.4 seconds. Mobile SVGs disable animation internally for reduced-motion preferences. The gallery selects PNG posters for reduced motion and otherwise plays each GIF once for approximately 4.51 seconds. Linked previews can be opened to replay them. The READMEs retain English as primary, with Portuguese and Spanish prose translations sharing English artwork.

Gallery sources are `visuals/scenes/text-chromatic.html`, `building-panel.html`, and `solar-system.html` within the portable skill. Captions use synthetic words with the scene's height and size parameters adjusted for a square excerpt; the building uses its illustrative defaults; the solar system uses the bundled `library/spinning-3d-objects/38-sun.webm`. These are silent, cropped browser renders of real scene code, not recordings of a desktop editing application. Each GIF contains 36 frames at 480×480 and approximately 8 fps. Source footage and scene templates are unchanged. Font and resource notices remain in the engine's third-party notices and asset directories.

The stars badge reads the actual public GitHub count; Star History supplies the theme-aware chart. These external images have text/link alternatives and depend on their providers. They do not represent a global popularity ranking. The plugin archive includes only the named README artwork directory in addition to its existing content; the site archive remains restricted to the public guide.

Artwork, Markdown, package-boundary, or media-query changes invalidate the corresponding README rendering evidence in `validation.md`. Edit SVG source and its matching static/mobile alternatives together; do not add scripts, external fonts, private footage, or secrets to the artwork.
