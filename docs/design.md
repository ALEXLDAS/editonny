# Guide interface

Sources: `web/src/app/`, `web/src/components/`, `web/src/features/`, `web/messages/`, `web/content/`, and the design-system components they use. Reviewed on 2026-10-19; CSS, markup, content, and interaction changes require verification of affected states.

## Visual language

The guide uses the design system's dark studio theme by default: ink surfaces, fog text, an orange accent, volt highlights, Figtree for text, and Anton for kinetic display type. A header toggle switches to the light paper theme and remembers the choice. The home page is a single landing ported from the owner's Claude Design export (2026-10-19): an aurora hero with the creator, a rotating headline keyword, and a workbench where a request edits a 9:16 sample step by step (chapters jump to a step); a marquee tape; an edit pulled apart into four layers; the Editor and Motion services; a lab that shows input, request, and result for cutting, captions, motion, and framing; how it works with requirements and third-party costs; the library of every ready-made request and motion scene; the installation guide with the canonical installation request and the FAQ; the editor-versus-Editonny comparison with the open-source offer; and, below 1100 px, a bottom bar once the hero scrolls away. The workbench, layers, lab stages, race, and scene previews are illustrations of a workflow; they are neither rendered videos nor players.

Every color, font family, size, spacing, and radius comes from [`DESIGN.md`](../DESIGN.md) tokens through `@editonny/design-system/styles.css`; page layouts use CSS Modules that the `design/tokens` lint rule checks, and TypeScript rejects raw hex, pixel, and font literals. Components come from the library; the page-level compositions were ported from the export's guide template, which the app replaced.

The interface is available in English (`/en`), Brazilian Portuguese (`/pt-br`), and Spanish (`/es`), chosen from the browser on the first visit and changeable from the header. The header links to the home sections (Demo, Features, Lab, Library, Guide, Open source) from every page and offers the repository; below 1100 px those links move into a menu dialog that also lists the standalone pages (Home, Create a request, Catalog, Examples, Install). The footer links every page. The home library, the lab's catalog scene, and the guide's first-video button steer one another inside the page; its agent choice is the visitor's saved brief, shared with Create a request. Layouts are verified at 1440 px and on a Pixel 7 viewport without horizontal overflow, including very long unbroken input.

## Interaction and accessibility

- Each page has one `h1`, a skip link to `main`, landmarks, and visible focus. Active links use `aria-current`.
- Fields have labels and descriptions; format and agent choices are radio groups with arrow-key movement; categories use native selects.
- Scene and example dialogs use the native `<dialog>`: accessible names, Escape and backdrop closing, and focus return. On the Catalog and Examples pages a URL parameter makes the view shareable and Back closes a dialog opened in the page; the home library keeps its search, filters, and open dialog in page state, and its section shortcuts move focus to the library.
- Copy success is announced in a polite live region; without clipboard access the request text is selected and an alert explains manual copying. On phones a sticky copy bar appears while the request card is out of view.
- Reduced motion stops loops and shows revealed content immediately; without JavaScript, revealed sections stay visible.
- The logo link and language button keep their visible text inside their accessible names (WCAG 2.5.3). Text on orange surfaces uses the 78% ink token for at least 4.5:1 contrast.
- User content is rendered as text, never as HTML. The guide does not read or upload personal footage; the folder is a typed path stored only in the visitor's browser.

## Editing requests

One builder supplies custom requests, scene requests, example previews, copying, and personalization, in the interface language. Every editing request includes standard removal of unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions, while preserving complete words, intentional pauses, natural pacing, and meaning.

Scope remains explicit: a caption-only correction or a specified interval does not authorize recutting unrelated content. Originals, factuality, sample review, and permission for costs/media transmission remain part of the request. Turning visual scenes off removes a selected catalog scene from the brief.

## Verification

`npm run test:browser` covers locale detection and switching, navigation, the request builder and its persistence, catalog and example dialogs, preferences under blocked or corrupted storage, and an axe WCAG 2.1 AA scan of every page in both themes on desktop and phone. Inspect screenshots of changed states as well; automated scans and still captures do not establish complete accessibility or motion correctness. Current measured results and limitations belong in [validation](validation.md).

## Design system boundary

New interface work comes from `@editonny/design-system`; its showcase runs at `/design-system` on the guide. The skill's edit preview keeps its own styles until a preview redesign is validated.

## README presentation

Reviewed on 2026-10-19. The three root READMEs use the guide's dark studio identity from `DESIGN.md`: ink surfaces, orange `#ff4f12` highlight boxes, volt `#d4ff3a` and sun `#ffd60a` accents, Figtree headlines, Anton kinetic captions, and monospace eyebrows. Each README shows eleven animated SVG banners in its own language from `docs/assets/readme/<locale>/`: the hero with the guide's rotating headline beside a replica of the self-editing workbench (request chips, checklist, chapters, phone badge, caption, three-step scene, and a timeline whose pause gaps close under a moving playhead), crossing marquee tapes, the agent terminal receiving the install request, how it works, the exploded anatomy stack, the Editor and Motion cards with Lucide icons, the raw × edited lab, four caption lettering styles with a word highlight, four reframing formats, four motion scene motifs, and the library counters.

`scripts/readme-art/` generates every banner from the guide's interface text (`web/messages/<locale>.json`) and the `DESIGN.md` colors, so README art never keeps its own copy of site text; the only README-specific strings are the illustrative agent report lines and the bundled-video label. It measures text with the static Figtree and Anton TrueType files and embeds the guide's Latin WOFF2 subsets as data URIs, which GitHub renders inside `<img>`. Banners contain no scripts, external references, footage, or secrets. Every animated element rests in its final state, and an internal `prefers-reduced-motion` rule stops animation and shows that state. Main sequences loop every 6 to 46 seconds and small accents (a pulse and a terminal caret) every 1 to 1.6 seconds; animation is decorative, and all instructions remain selectable Markdown text, including the install request.

The install request in each README is the guide's `Install.askRequest` for that locale, verbatim, and names the repository URL so an agent can install or update without a manual download. `web/src/features/install/readme.test.ts` enforces that match and that each README references only existing banners of its locale; `tests/readme-art.test.mjs` fails when a committed banner differs from the generator.

The stars badge reads the actual public GitHub count; Star History supplies the theme-aware chart. These external images have text/link alternatives and depend on their providers. They do not represent a global popularity ranking. The plugin archive includes only the named README artwork directory in addition to its existing content.

Interface text, `DESIGN.md` colors, font subsets, or generator changes require `npm run readme:art`; banner, Markdown, or package-boundary changes invalidate the corresponding README rendering evidence in `validation.md`. Do not add scripts, external fonts, private footage, or secrets to the artwork.
