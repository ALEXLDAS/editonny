// README hero: the guide's headline with its rotating keyword beside an animated replica of the self-editing workbench.
import { C, CREATOR, esc, fit, icon, measure, svg, wrap } from './lib.mjs';

const LOOP = 12; // seconds; stages: raw, pauses, captions, motion, result
const B = [0, 16, 38, 58, 79]; // stage starts in % of the loop

/** Keyframes: `onN` shows from stage N to the loop end, `onlyN` only during stage N, `cap` hides during the motion scene. */
function stageCss() {
  const css = [];
  for (let n = 1; n < 5; n++) css.push(`@keyframes on${n}{0%,${B[n]}%{opacity:0}${B[n] + 2}%,97%{opacity:1}100%{opacity:0}}.on${n}{animation:on${n} ${LOOP}s infinite}`);
  for (let n = 0; n < 5; n++) {
    const end = B[n + 1] ?? 100;
    const frames = n === 0 ? `0%,${end - 1}%{opacity:1}${end}%,100%{opacity:0}` : `0%,${B[n]}%{opacity:0}${B[n] + 1}%,${end - 1}%{opacity:1}${end}%,100%{opacity:0}`;
    css.push(`@keyframes only${n}{${frames}}.only${n}{animation:only${n} ${LOOP}s infinite${n < 4 ? ';opacity:0' : ''}}`);
  }
  css.push(`@keyframes cap{0%,${B[2]}%{opacity:0}${B[2] + 2}%,${B[3]}%{opacity:1}${B[3] + 2}%,${B[4]}%{opacity:0}${B[4] + 2}%,97%{opacity:1}100%{opacity:0}}.cap{animation:cap ${LOOP}s infinite}`);
  for (let n = 1; n < 4; n++) css.push(`@keyframes ink${n}{0%,${B[n]}%{fill:${C['fog-400']}}${B[n] + 2}%,97%{fill:${C['ink-950']}}100%{fill:${C['fog-400']}}}.ink${n}{fill:${C['ink-950']};animation:ink${n} ${LOOP}s infinite}`);
  css.push(`@keyframes close{0%,${B[1]}%{transform:translateX(0)}${B[1] + 5}%,97%{transform:translateX(var(--d))}100%{transform:translateX(0)}}.clip{transform:translateX(var(--d));animation:close ${LOOP}s cubic-bezier(.2,.7,.2,1) infinite}`);
  css.push(`@keyframes gap{0%,${B[1]}%{transform:scaleX(1);opacity:1}${B[1] + 5}%,97%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:1}}.gap{transform-box:fill-box;transform-origin:left;transform:scaleX(0);opacity:0;animation:gap ${LOOP}s cubic-bezier(.2,.7,.2,1) infinite}`);
  css.push(`@keyframes play{from{transform:translateX(0)}to{transform:translateX(var(--run))}}.head{transform:translateX(calc(var(--run) * .8));animation:play ${LOOP}s linear infinite}`);
  css.push(`@keyframes rise{0%,${B[3]}%{opacity:0;transform:translateY(26px)}${B[3] + 3}%,${B[4]}%{opacity:1;transform:none}${B[4] + 2}%,100%{opacity:0;transform:none}}.card{opacity:0;animation:rise ${LOOP}s cubic-bezier(.2,.7,.2,1) infinite}`);
  css.push('@keyframes word{0%{opacity:0;transform:translateY(28px)}4%,22%{opacity:1;transform:none}26%,100%{opacity:0;transform:translateY(-28px)}}.word{animation:word 9.6s cubic-bezier(.2,.7,.2,1) infinite both}.word0{animation-fill-mode:none}');
  css.push('@keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}.pulse{animation:pulse 1.6s ease-in-out infinite}');
  return css.join('\n');
}

function headline(t, x, top, width) {
  const words = t.hero.words.split('|');
  const lines = [t.hero.line1, t.hero.line2, ...words];
  const size = fit(lines, width - 30, { weight: 800, tracking: -0.05 }, 96);
  const ls = -0.05 * size;
  const y1 = top + size * 0.86, y2 = y1 + size * 0.98, y3 = y2 + size * 1.06;
  const rotating = words.map((word, i) => {
    const w = measure(word, { size, spacing: ls });
    return `<g class="word word${i}" style="animation-delay:${i * 2.4}s${i ? ';opacity:0' : ''}"><rect x="${x - 4}" y="${y3 - size * 0.84}" width="${w + 26}" height="${size * 1.04}" rx="${size * 0.13}" class="or"/><text x="${x + 9}" y="${y3}" font-size="${size}" font-weight="800" letter-spacing="${ls}" class="ink">${esc(word)}</text></g>`;
  }).join('');
  return { bottom: y3 + size * 0.24, markup: `<text x="${x}" y="${y1}" font-size="${size}" font-weight="800" letter-spacing="${ls}">${esc(t.hero.line1)}</text>
<text x="${x}" y="${y2}" font-size="${size}" font-weight="800" letter-spacing="${ls}">${esc(t.hero.line2)}</text>${rotating}` };
}

function copyColumn(t, nav, x) {
  const parts = [];
  const name = 'Matheus Gomes';
  const chipW = Math.max(measure(name, { size: 15 }) + measure(t.hero.creatorRole, { size: 13, weight: 500 }) + 10, t.hero.creatorStatus.length * 7.2 + 16) + 76;
  parts.push(`<clipPath id="me"><circle cx="${x + 32}" cy="86" r="20"/></clipPath>
<rect x="${x}" y="56" width="${chipW}" height="60" rx="30" fill="${C['ink-900']}" stroke="${C['ink-700']}"/>
<circle cx="${x + 32}" cy="86" r="23" fill="none" stroke="${C['orange-500']}" stroke-width="2"/>
<image href="${CREATOR}" x="${x + 12}" y="66" width="40" height="40" clip-path="url(#me)"/>
<text x="${x + 64}" y="82" font-size="15" font-weight="700">${esc(name)}<tspan dx="10" class="dim" font-size="13" font-weight="500">${esc(t.hero.creatorRole)}</tspan></text>
<circle cx="${x + 68}" cy="98" r="3" class="vo"/><text x="${x + 76}" y="102" class="mono vo" font-size="10.5">${esc(t.hero.creatorStatus.toUpperCase())}</text>
<circle cx="${x + 8}" cy="155" r="5" class="vo pulse"/><text x="${x + 22}" y="160" class="mono dim" font-size="12">${esc(t.hero.eyebrow.toUpperCase())}</text>`);
  const head = headline(t, x, 184, 540);
  parts.push(head.markup);
  const lines = wrap([{ text: t.hero.leadA, tone: 'dim' }, { text: t.hero.leadHighlight, tone: '' }, { text: t.hero.leadB, tone: 'dim' }], 520, { size: 19, weight: 500 });
  let y = head.bottom + 40;
  for (const line of lines) {
    parts.push(`<text y="${y}" font-size="19" font-weight="500">${line.map(word => `<tspan x="${x + word.x}"${word.run.tone ? ` class="${word.run.tone}"` : ''}>${esc(word.text)}</tspan>`).join('')}</text>`);
    y += 30;
  }
  y += 16;
  const cta = nav.getSkill, explore = t.hero.explore;
  const w1 = measure(cta, { size: 17 }) + 78, w2 = measure(explore, { size: 17 }) + 56;
  parts.push(`<rect x="${x}" y="${y}" width="${w1}" height="54" rx="27" class="or"/>${icon('github', x + 24, y + 16, 22, C['ink-950'])}<text x="${x + 56}" y="${y + 33}" font-size="17" font-weight="800" class="ink">${esc(cta)}</text>
<rect x="${x + w1 + 12}" y="${y}" width="${w2}" height="54" rx="27" fill="none" stroke="${C['ink-600']}" stroke-width="1.5"/><text x="${x + w1 + 12 + w2 / 2}" y="${y + 33}" text-anchor="middle" font-size="17" font-weight="800">${esc(explore)}</text>`);
  parts.push(`<text x="${x}" y="${y + 92}" class="mono faint" font-size="11">${esc([t.hero.metaFree, t.hero.metaOpen, t.hero.metaAgents].join('  ·  ').toUpperCase())}</text>`);
  return parts.join('\n');
}

function phone(t, x, y) {
  const w = 196, h = 352, cx = x + w / 2;
  const capA = t.anatomy.captionA.trim(), capB = t.anatomy.captionB.trim(), capC = t.anatomy.captionC.trim();
  const capSize = 24;
  const line2 = `${capB}  ${capC}`;
  const wB = measure(capB, { family: 'Anton', size: capSize }), w2 = measure(line2, { family: 'Anton', size: capSize });
  const l2x = cx - w2 / 2;
  const badge = (label, cls, fill, tone) => `<g class="${cls}"><rect x="${x + 18}" y="${y + 20}" width="${label.length * 7.6 + 22}" height="22" rx="11" fill="${fill}"/><text x="${x + 29}" y="${y + 35}" class="mono" font-size="10.5" fill="${tone}" style="fill:${tone}">${esc(label)}</text></g>`;
  const steps = [t.bench.step1, t.bench.step2, t.bench.step3];
  return `<clipPath id="screen"><rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" rx="24"/></clipPath>
<radialGradient id="stage" cx="50%" cy="34%" r="70%"><stop offset="0" stop-color="${C['orange-500']}"/><stop offset=".42" stop-color="${C['orange-700']}"/><stop offset=".95" stop-color="${C['ink-950']}"/></radialGradient>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="32" fill="${C['ink-950']}" stroke="${C['ink-700']}"/>
<g clip-path="url(#screen)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#stage)"/>
<circle cx="${cx}" cy="${y + 138}" r="40" class="ink"/><ellipse cx="${cx}" cy="${y + 300}" rx="124" ry="104" class="ink"/>
<g class="cap"><text x="${cx}" y="${y + 268}" text-anchor="middle" class="k" font-size="${capSize}">${esc(capA)}</text>
<rect x="${l2x - 4}" y="${y + 276}" width="${wB + 8}" height="${capSize * 1.18}" rx="5" fill="${C['sun-400']}"/>
<text x="${l2x}" y="${y + 300}" class="k" font-size="${capSize}"><tspan class="ink">${esc(capB)}</tspan><tspan dx="7">${esc(capC)}</tspan></text></g>
${steps.map((step, i) => `<g class="card" style="animation-delay:${i * 0.18}s"><rect x="${x + 22}" y="${y + 182 + i * 46}" width="${w - 44}" height="38" rx="10" fill="${[C['orange-500'], C['fog-50'], C['volt-400']][i]}"/><text x="${x + 36}" y="${y + 207 + i * 46}" class="k ink" font-size="17">${`0${i + 1}`} ${esc(step.toUpperCase())}</text></g>`).join('')}
<g class="card"><text x="${cx}" y="${y + 170}" text-anchor="middle" class="mono" font-size="9.5">${esc(t.bench.method)}</text></g>
</g>
${badge(t.bench.badgeRaw, 'only0', C['fog-50'], C['ink-950'])}${[1, 2, 3].map(n => badge(t.bench.badgeEditing, `only${n}`, C['fog-50'], C['ink-950'])).join('')}${badge(t.bench.badgeFinal, 'only4', C['volt-400'], C['ink-950'])}
<rect x="${x + w - 62}" y="${y + 20}" width="44" height="22" rx="11" fill="${C['ink-950']}" opacity=".75"/><text x="${x + w - 40}" y="${y + 35}" text-anchor="middle" class="mono" font-size="10.5" style="letter-spacing:0">0:31</text>`;
}

function requestPanel(t, x, y, width) {
  const b = t.bench;
  const runs = [{ text: `“${b.req1}`, chip: 1 }, { text: b.req2 }, { text: b.req3, chip: 2 }, { text: b.req4 }, { text: b.req5, chip: 3 }, { text: `${b.req6}”` }];
  const size = 17, lead = 28, pad = 18;
  const lines = wrap(runs, width - pad * 2, { size, weight: 600 });
  const height = lines.length * lead + pad * 2 - 6;
  const parts = [`<text x="${x}" y="${y}" class="mono dim" font-size="11">${esc(b.request)}</text>`,
    `<rect x="${x}" y="${y + 14}" width="${width}" height="${height}" rx="18" fill="${C['ink-850']}" stroke="${C['ink-700']}"/>`];
  lines.forEach((line, row) => {
    const base = y + 14 + pad + 16 + row * lead;
    for (const chip of [1, 2, 3]) {
      const words = line.filter(word => word.run.chip === chip);
      if (!words.length) continue;
      const start = words[0].x, end = words.at(-1).x + words.at(-1).w;
      parts.push(`<rect x="${x + pad + start - 3}" y="${base - 17}" width="${end - start + 6}" height="24" rx="6" class="or on${chip}"/>`);
    }
    parts.push(`<text y="${base}" font-size="${size}" font-weight="600">${line.map(word => `<tspan x="${x + pad + word.x}"${word.run.chip ? ` class="ink${word.run.chip}"` : ''}>${esc(word.text)}</tspan>`).join('')}</text>`);
  });
  let cy = y + 14 + height + 18;
  [b.check1, b.check2, b.check3, b.check4].forEach((label, i) => {
    const mid = cy + 18;
    parts.push(`<line x1="${x}" x2="${x + width}" y1="${cy}" y2="${cy}" stroke="${C['ink-700']}"/>
<circle cx="${x + 12}" cy="${mid}" r="10" fill="${C['ink-700']}"/><line x1="${x + 8}" x2="${x + 16}" y1="${mid}" y2="${mid}" stroke="${C['fog-500']}" stroke-width="1.5"/>
<g class="on${i + 1}"><circle cx="${x + 12}" cy="${mid}" r="10" class="vo"/><path d="M${x + 7} ${mid}l3.5 3.5 6.5-7" fill="none" stroke="${C['ink-950']}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
<text x="${x + 32}" y="${mid + 5}" font-size="14" font-weight="500" class="dim">${esc(label)}</text><text x="${x + 32}" y="${mid + 5}" font-size="14" font-weight="500" class="on${i + 1}">${esc(label)}</text>`);
    cy += 37;
  });
  // Chapter pills, wrapped to the panel width.
  let px = x, py = cy + 18;
  [b.chapterRaw, b.chapterPauses, b.chapterCaptions, b.chapterMotion, b.chapterResult].forEach((label, n) => {
    const w = measure(label, { size: 13, weight: 700 }) + 26;
    if (px + w > x + width) { px = x; py += 42; }
    parts.push(`<rect x="${px}" y="${py}" width="${w}" height="32" rx="16" fill="none" stroke="${C['ink-600']}"/><g class="only${n}"><rect x="${px}" y="${py}" width="${w}" height="32" rx="16" class="or"/></g>
<text x="${px + w / 2}" y="${py + 21}" text-anchor="middle" font-size="13" font-weight="700">${esc(label)}</text><text x="${px + w / 2}" y="${py + 21}" text-anchor="middle" font-size="13" font-weight="700" class="ink only${n}">${esc(label)}</text>`);
    px += w + 8;
  });
  return parts.join('\n');
}

function timeline(t, x, y, width) {
  const label = 82, inner = width - label - 18, left = x + label;
  const clips = [118, 90, 132, 104];
  const gap = (inner - clips.reduce((a, b) => a + b, 0)) / 3;
  const rows = { video: y + 50, voice: y + 84, caption: y + 112, motion: y + 140 };
  const parts = [`<rect x="${x}" y="${y}" width="${width}" height="168" rx="20" fill="${C['ink-950']}" stroke="${C['ink-800']}"/>`];
  ['00:00', '00:10', '00:20', '00:31'].forEach((time, i) => parts.push(`<text x="${left + (inner * i) / 3}" y="${y + 24}" text-anchor="${i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}" class="mono dim" font-size="10" style="letter-spacing:.05em">${time}</text>`));
  [[t.bench.trackVideo, rows.video], [t.bench.trackVoice, rows.voice], [t.bench.trackCaption, rows.caption], [t.bench.trackMotion, rows.motion]].forEach(([name, ry]) => parts.push(`<text x="${x + 16}" y="${ry + 4}" class="mono dim" font-size="9.5" style="letter-spacing:.1em">${esc(name)}</text>`));
  let cx = left;
  clips.forEach((w, i) => {
    const shift = -gap * i;
    const bars = [];
    for (let b = 0; b < Math.floor(w / 7); b++) {
      const h = 4 + Math.round(Math.abs(Math.sin((cx + b * 7) * 0.37) * Math.cos(b * 0.9)) * 14);
      bars.push(`<rect x="${cx + 2 + b * 7}" y="${rows.voice - h / 2}" width="4" height="${h}" rx="2"/>`);
    }
    parts.push(`<g class="clip" style="--d:${shift.toFixed(1)}px"><rect x="${cx}" y="${rows.video - 14}" width="${w}" height="28" rx="6" fill="${C['ink-700']}"/>${Array.from({ length: Math.floor(w / 24) }, (_, f) => `<line x1="${cx + 24 * (f + 1)}" x2="${cx + 24 * (f + 1)}" y1="${rows.video - 14}" y2="${rows.video + 14}" stroke="${C['ink-800']}"/>`).join('')}
<g class="or">${bars.join('')}</g><g class="on2"><rect x="${cx + 6}" y="${rows.caption - 7}" width="${w - 12}" height="14" rx="4" class="vo"/></g></g>`);
    if (i < 3) parts.push(`<g class="gap"><rect x="${cx + w + 3}" y="${rows.video - 14}" width="${gap - 6}" height="28" rx="5" fill="url(#hatch)"/><line x1="${cx + w + 4}" x2="${cx + w + gap - 4}" y1="${rows.voice}" y2="${rows.voice}" stroke="${C['ink-600']}" stroke-width="2" stroke-dasharray="3 4"/></g>`);
    cx += w + gap;
  });
  const chip = t.bench.motionChip;
  const chipW = measure(chip, { size: 12, weight: 700 }) + 24;
  parts.push(`<g class="on3"><rect x="${left + 150}" y="${rows.motion - 12}" width="${chipW}" height="24" rx="12" class="or"/><text x="${left + 162}" y="${rows.motion + 4}" font-size="12" font-weight="700" class="ink">${esc(chip)}</text></g>`);
  const run = inner - 4;
  parts.push(`<g class="head" style="--run:${run}px"><line x1="${left}" x2="${left}" y1="${y + 34}" y2="${y + 156}" stroke="${C['volt-400']}" stroke-width="2"/><rect x="${left - 5}" y="${y + 30}" width="10" height="10" rx="3" class="vo"/></g>`);
  return parts.join('\n');
}

/** Complete hero banner for one locale. */
export function hero(t, nav) {
  const wx = 620, wy = 48, ww = 616, wh = 684;
  const body = `${copyColumn(t, nav, 64)}
<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="30" fill="${C['ink-900']}" stroke="${C['ink-700']}"/>
<circle cx="${wx + 28}" cy="${wy + 34}" r="5" fill="${C['rec-400']}"/><circle cx="${wx + 46}" cy="${wy + 34}" r="5" fill="${C['ink-500']}"/><circle cx="${wx + 64}" cy="${wy + 34}" r="5" fill="${C['ink-500']}"/>
<text x="${wx + 86}" y="${wy + 38}" class="mono dim" font-size="11">${esc(t.bench.title)}</text>
<rect x="${wx + ww - 24 - (t.bench.badge.length * 7 + 24)}" y="${wy + 22}" width="${t.bench.badge.length * 7 + 24}" height="24" rx="12" fill="${C['ink-800']}" stroke="${C['ink-600']}"/><text x="${wx + ww - 24 - (t.bench.badge.length * 7 + 24) / 2}" y="${wy + 38}" text-anchor="middle" class="mono" font-size="10" style="letter-spacing:.06em">${esc(t.bench.badge)}</text>
${phone(t, wx + 24, wy + 70)}
${requestPanel(t, wx + 244, wy + 86, ww - 268)}
${timeline(t, wx + 24, wy + 496, ww - 48)}
<text x="${wx + 24}" y="${wy + wh + 30}" font-size="12" class="faint">${esc(t.bench.note)}</text>`;
  return svg({
    width: 1280, height: 780, css: stageCss(), fonts: ['figtree', 'anton'],
    title: `editonny — ${t.hero.line1} ${t.hero.line2} ${t.hero.words.split('|')[0]}`,
    description: `${t.hero.leadA}${t.hero.leadHighlight}${t.hero.leadB} ${t.bench.note}`,
    body,
  });
}
