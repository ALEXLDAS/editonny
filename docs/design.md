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
