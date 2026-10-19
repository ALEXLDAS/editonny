# Web font subsets

Latin WOFF2 subsets of the fonts bundled with the engine (`skills/editonny/engine/assets/fonts/`), made for the guide so pages download about 215 KB instead of about 1.5 MB of TrueType files. Variable weight axes are kept.

| File | Source | License |
|---|---|---|
| `figtree-latin.woff2` | `figtree/Figtree-Variable.ttf` | SIL OFL 1.1 (`OFL-figtree.txt`) |
| `anton-latin.woff2` | `anton/Anton-Regular.ttf` | SIL OFL 1.1 (`OFL-anton.txt`) |
| `montserrat-latin.woff2` | `montserrat/Montserrat-Variable.ttf` | SIL OFL 1.1 (`OFL-montserrat.txt`) |
| `caveat-latin.woff2` | `caveat/Caveat-Variable.ttf` | SIL OFL 1.1 (`OFL-caveat.txt`) |
| `permanent-marker-latin.woff2` | `permanentmarker/PermanentMarker-Regular.ttf` | Apache License 2.0 (`LICENSE-permanent-marker.txt`) |

These are modified versions (subset and converted); none of the OFL fonts declares a Reserved Font Name, and the Apache-licensed font's change is this subsetting. Regenerate after changing a source font (fonttools 4.60.1):

```sh
uvx --from 'fonttools[woff]==4.60.1' pyftsubset skills/editonny/engine/assets/fonts/<dir>/<file>.ttf \
  --unicodes='U+0000-017F,U+0237,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD' \
  --layout-features='*' --flavor=woff2 --output-file=web/src/app/fonts/<name>-latin.woff2
```

Characters outside these ranges fall back to the system font stack in the tokens.

The Open Graph renderer (Satori) reads neither WOFF2 nor variable axes, so `[locale]/opengraph-image.tsx` uses static TrueType instances with the same subset, plus the engine's static `Anton-Regular.ttf`:

| File | Source | License |
|---|---|---|
| `figtree-800-latin.ttf`, `figtree-600-latin.ttf` | `figtree/Figtree-Variable.ttf` at `wght=800` and `wght=600` | SIL OFL 1.1 (`OFL-figtree.txt`) |
| `jetbrains-mono-700-latin.ttf` | `engine/project-template/assets/fonts/JetBrainsMono.ttf` at `wght=700` | SIL OFL 1.1 (`OFL-jetbrains-mono.txt`) |

```sh
uvx --from 'fonttools[woff]==4.60.1' fonttools varLib.instancer <source>.ttf wght=<weight> -o /tmp/instance.ttf
uvx --from 'fonttools[woff]==4.60.1' pyftsubset /tmp/instance.ttf --unicodes='<same ranges as above>' \
  --layout-features='*' --output-file=web/src/app/fonts/<name>-<weight>-latin.ttf
```

The README art generator (`scripts/readme-art/`) embeds the WOFF2 subsets above in its SVGs and measures text with the static Figtree instances.
