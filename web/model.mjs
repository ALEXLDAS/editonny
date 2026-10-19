export function normalize(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en');
}
export function filterScenes(scenes, query = '', group = '') {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return scenes.filter(scene => (!group || scene.category === group) && terms.every(term => normalize(`${scene.name} ${scene.id} ${scene.category} ${scene.whenToUse}`).includes(term)));
}
export const editingCleanup = 'Remove unnecessary pauses, audible breaths, mistakes, false starts, and redundant repetitions. Preserve complete words, natural pacing, intentional pauses, and the meaning of the speech. Measure cuts against the actual recording and review transitions so speech is not clipped. For targeted revisions, apply cleanup only within the requested editing scope; preserve unrelated content and approved timing.';
export function createPrompt(values) {
  const entry = values.agent === 'claude' ? '/editonny' : '$editonny';
  const folder = String(values.folder || '').trim() || '[enter the video folder]';
  return `${entry}\n\nEdit the videos in: ${folder}\nGoal: ${String(values.goal || '').trim() || 'turn the footage into a clear, engaging video'}.\nFormat: ${values.format || '9:16 (vertical)'}.\nPace: ${values.pace || 'natural, preserving intentional pauses'}.\nCaptions: ${values.captions || 'readable, with subtle emphasis on important words'}.\nVisuals: ${values.effects || 'subtle, only when they help explain the speech'}.${values.scene ? `\nCatalog reference: ${values.scene}. Adapt the text to the actual footage.` : ''}\n\nStandard editing cleanup: ${editingCleanup}\n\nFirst check the environment and files. Preserve the originals, spoken words, and meaning. Do not invent prices, results, or testimonials. Prepare an 8–15 second sample for me to review before finishing the full video. Do not use paid services or upload media to third parties without my authorization. When finished, report the output file and the checks performed.`;
}
export function scenePrompt(scene, agent = 'codex') {
  return createPrompt({ agent, scene: `${scene.name} (${scene.id})`, goal: 'edit my video using this visual reference' });
}
export function filterPrompts(prompts, query = '', category = '') {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return prompts.filter(prompt => (!category || prompt.category === category) && terms.every(term => normalize([prompt.id, prompt.title, prompt.category, prompt.summary, prompt.when, prompt.goal, prompt.format, prompt.effects, ...prompt.tips].join(' ')).includes(term)));
}
export function applyPreset(values, preset) {
  const result = { ...values, scene: undefined };
  for (const key of ['goal', 'effects', 'format']) {
    if (preset[key]) result[key] = preset[key];
  }
  return result;
}
