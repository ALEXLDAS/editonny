// Shared pieces of the README art: DESIGN.md colors, embedded fonts, text measurement, layout, and icons.
import { readFileSync } from 'node:fs';

export const ROOT = new URL('../../', import.meta.url);
const read = (path, encoding) => readFileSync(new URL(path, ROOT), encoding);

/** DESIGN.md primitive colors by token name, e.g. C['orange-500']. */
export const C = Object.fromEntries([...read('DESIGN.md', 'utf8').matchAll(/^ {2}([a-z]+-\d+|white): "(#[0-9a-f]{6})"$/gm)].map(([, name, hex]) => [name, hex]));

/** Interface text of the guide for one locale; README art never carries its own copy of site text. */
export const messages = locale => JSON.parse(read(`web/messages/${locale}.json`, 'utf8'));

/** Catalog and library sizes, counted from their sources like the guide does. */
export const COUNTS = {
  scenes: JSON.parse(read('skills/editonny/visuals/catalog.json', 'utf8')).scenes.length,
  requests: Object.keys(JSON.parse(read('web/content/examples/en-US.json', 'utf8'))).length,
  videos: JSON.parse(read('skills/editonny/visuals/media.json', 'utf8')).videos.length,
};

/** Replaces ICU-style `{name}` placeholders with COUNTS (the README art only uses simple arguments). */
export const fill = text => text.replace(/\{(\w+)\}/g, (_, name) => String(COUNTS[name] ?? `{${name}}`));

const face = (family, file, weight) => `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${read(`web/src/app/fonts/${file}`).toString('base64')}) format('woff2');font-weight:${weight}}`;
/** Latin WOFF2 subsets served by the guide, embedded so GitHub renders the brand faces inside <img>. */
export const FONTS = {
  figtree: face('Figtree', 'figtree-latin.woff2', '300 900'),
  anton: face('Anton', 'anton-latin.woff2', '400'),
  montserrat: face('Montserrat', 'montserrat-latin.woff2', '100 900'),
  caveat: face('Caveat', 'caveat-latin.woff2', '400 700'),
  marker: face('Permanent Marker', 'permanent-marker-latin.woff2', '400'),
};
export const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

/** Advance-width reader for a static TrueType font (cmap format 4 + hmtx); kerning is ignored. */
function metrics(path) {
  const bytes = read(path);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tables = {};
  for (let i = 0; i < view.getUint16(4); i++) tables[bytes.toString('latin1', 12 + i * 16, 16 + i * 16)] = view.getUint32(20 + i * 16);
  const unitsPerEm = view.getUint16(tables.head + 18);
  const hMetrics = view.getUint16(tables.hhea + 34);
  let format4 = 0;
  for (let i = 0; i < view.getUint16(tables.cmap + 2); i++) {
    const at = tables.cmap + view.getUint32(tables.cmap + 8 + i * 8);
    if (view.getUint16(at) === 4) format4 = at;
  }
  const segments = view.getUint16(format4 + 6);
  const ends = format4 + 14, starts = ends + segments + 2, deltas = starts + segments, offsets = deltas + segments;
  const glyph = code => {
    for (let i = 0; i < segments; i += 2) {
      if (code > view.getUint16(ends + i)) continue;
      const start = view.getUint16(starts + i);
      if (code < start) return 0;
      const delta = view.getInt16(deltas + i), offset = view.getUint16(offsets + i);
      if (!offset) return (code + delta) & 0xffff;
      const id = view.getUint16(offsets + i + offset + 2 * (code - start));
      return id ? (id + delta) & 0xffff : 0;
    }
    return 0;
  };
  const advance = id => view.getUint16(tables.hmtx + 4 * Math.min(id, hMetrics - 1));
  return (text, size, spacing = 0) => [...text].reduce((sum, char) => sum + advance(glyph(char.codePointAt(0))) / unitsPerEm * size + spacing, 0) - (text ? spacing : 0);
}

const figtree800 = metrics('web/src/app/fonts/figtree-800-latin.ttf');
const figtree600 = metrics('web/src/app/fonts/figtree-600-latin.ttf');
const anton = metrics('skills/editonny/engine/assets/fonts/anton/Anton-Regular.ttf');
/** Text width in pixels. Weights below 700 use the 600 instance, a slight overestimate for regular text. */
export const measure = (text, { size, weight = 800, spacing = 0, family = 'Figtree' }) => {
  if (family === 'Anton') return anton(text, size, spacing);
  if (family === 'mono') return [...text].length * (size * 0.6 + spacing);
  return (weight >= 700 ? figtree800 : figtree600)(text, size, spacing);
};

/** Largest size (step 0.5) at which every line fits `width`. */
export const fit = (lines, width, options, largest) => {
  let size = largest;
  while (size > 10 && Math.max(...lines.map(line => measure(line, { ...options, size, spacing: (options.tracking ?? 0) * size }))) > width) size -= 0.5;
  return size;
};

/**
 * Greedy word wrap of styled runs. Returns lines of positioned words: { text, x, run } where `run` is the source run,
 * so callers can draw chip backgrounds per line fragment.
 */
export function wrap(runs, width, options) {
  const lines = [[]];
  let x = 0;
  const space = measure(' ', options);
  for (const run of runs) {
    for (const [i, word] of run.text.split(/\s+/).filter(Boolean).entries()) {
      const w = measure(word, { ...options, weight: run.weight ?? options.weight });
      // Punctuation that starts a run (", ") sticks to the previous word.
      const glued = i === 0 && /^[,.;:!?]/.test(word);
      const gap = x === 0 || glued ? 0 : space;
      if (x > 0 && x + gap + w > width && !glued) { lines.push([]); x = 0; }
      const line = lines.at(-1);
      const start = x === 0 ? 0 : x + gap;
      line.push({ text: word, x: start, w, run });
      x = start + w;
    }
  }
  return lines;
}

export const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS = Object.fromEntries([...read('design-system/components/core/icon-data.ts', 'utf8').matchAll(/^ {2}'([a-z0-9-]+)': '(.*)',$/gm)].map(([, name, body]) => [name, body]));
/** A Lucide icon from the design system, drawn at (x, y) with the given size and stroke color. */
export const icon = (name, x, y, size, color, extra = '') => {
  if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
  return `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra}>${ICONS[name]}</g>`;
};

/** Small square portrait of the creator, embedded as data. */
export const CREATOR = `data:image/jpeg;base64,${read('docs/assets/readme/creator.jpg').toString('base64')}`;

/**
 * Wraps banner content in a standalone animated SVG: dark rounded card, embedded fonts, shared classes, and a
 * reduced-motion rule. Every animated element's resting style is its final state, so disabling animation shows it.
 */
export function svg({ width, height, title, description, fonts = ['figtree'], css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(description)}</desc>
<style>${fonts.map(name => FONTS[name]).join('')}
text{font-family:Figtree,system-ui,sans-serif;fill:${C['fog-50']}}
.mono{font-family:${MONO};font-weight:600;letter-spacing:.16em}
.k{font-family:Anton,Impact,sans-serif}
.dim{fill:${C['fog-400']}}.faint{fill:${C['fog-500']}}.ink{fill:${C['ink-950']}}.or{fill:${C['orange-500']}}.vo{fill:${C['volt-400']}}
${css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<defs>
<radialGradient id="glow" cx="80%" cy="35%" r="70%"><stop offset="0" stop-color="${C['orange-900']}"/><stop offset=".65" stop-color="${C['ink-950']}"/></radialGradient>
<pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="${C['ink-800']}"/><rect width="3" height="8" fill="${C['rec-400']}" opacity=".55"/></pattern>
</defs>
<rect width="${width}" height="${height}" rx="32" fill="url(#glow)"/>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="31.5" fill="none" stroke="${C['ink-700']}"/>
${body}
</svg>
`;
}

/** Section heading as on the guide: indexed eyebrow, then a headline whose last part sits in a highlight box. */
export function heading({ x, y, index, eyebrow, titleA, highlight, size = 64, width = 1100, tone = C['orange-500'] }) {
  const tracking = -0.05;
  const a = titleA.trim();
  const opts = { size, spacing: tracking * size };
  const wa = a ? measure(a, opts) : 0;
  const wh = measure(highlight, opts);
  const inline = !a || wa + 22 + wh + 28 <= width;
  const base = y + 48 + size * 0.86;
  const hx = inline && a ? x + wa + 22 : x;
  const hy = inline ? base : base + size * 1.1;
  const parts = [];
  if (index) parts.push(`<rect x="${x}" y="${y}" width="28" height="20" rx="5" class="or"/><text x="${x + 14}" y="${y + 14.5}" text-anchor="middle" class="mono ink" font-size="11" style="letter-spacing:0">${index}</text>`);
  parts.push(`<text x="${x + (index ? 40 : 0)}" y="${y + 15}" class="mono dim" font-size="12">${esc(eyebrow.toUpperCase())}</text>`);
  if (a) parts.push(`<text x="${x}" y="${base}" font-size="${size}" font-weight="800" letter-spacing="${tracking}em">${esc(a)}</text>`);
  parts.push(`<rect x="${hx - 10}" y="${hy - size * 0.86}" width="${wh + 22}" height="${size * 1.06}" rx="${size * 0.14}" fill="${tone}" class="hl"/>`);
  parts.push(`<text x="${hx + 1}" y="${hy}" font-size="${size}" font-weight="800" letter-spacing="${tracking}em" class="ink">${esc(highlight)}</text>`);
  return { markup: parts.join('\n'), bottom: hy + size * 0.3 };
}

/** Wrapped paragraph as one <text> per line. */
export function paragraph(text, x, y, width, { size = 15, weight = 500, lead = 1.5, cls = 'dim', anchor = 'start' } = {}) {
  const lines = wrap([{ text }], width, { size, weight });
  const markup = lines.map((line, i) => `<text x="${x}" y="${y + i * size * lead}" font-size="${size}" font-weight="${weight}"${cls ? ` class="${cls}"` : ''}${anchor === 'middle' ? ' text-anchor="middle"' : ''}>${esc(line.map(word => word.text).join(' '))}</text>`).join('\n');
  return { markup, bottom: y + (lines.length - 1) * size * lead, lines: lines.length };
}
