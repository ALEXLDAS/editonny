import { applyPreset, createPrompt, filterPrompts, filterScenes, scenePrompt } from './model.mjs';
import { prompts } from './prompts.mjs';
import catalog from './catalog.json' with { type: 'json' };
const $ = selector => document.querySelector(selector);
const form = $('#prompt-form');
let selectedScene = null;
let scenes = [];
let detailScene = null;
let statusTimer;
function notify(message) {
  clearTimeout(statusTimer);
  (document.querySelector('dialog[open]') || document.body).append($('#status'));
  $('#status').textContent = message;
  $('#status').hidden = false;
  statusTimer = setTimeout(() => { $('#status').hidden = true; }, 5000);
}
function navigate() {
  const requested = location.hash.slice(1);
  const page = ['home', 'create', 'catalog', 'examples', 'installation'].includes(requested) ? requested : 'home';
  document.querySelectorAll('[data-page]').forEach(section => { section.hidden = section.id !== page; });
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const titles = { home: 'Give your story a rhythm', create: 'Create a prompt', catalog: 'Visual catalog', examples: 'Examples and prompts', installation: 'Installation' };
  document.title = `editonny — ${titles[page]}`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}
window.addEventListener('hashchange', () => { navigate(); $('#main').focus({ preventScroll: true }); });
navigate();
function updatePrompt() {
  const values = Object.fromEntries(new FormData(form));
  if (values.effects === 'no visual scenes or additional effects') selectedScene = null;
  if (selectedScene) values.scene = `${selectedScene.name} (${selectedScene.id})`;
  $('#prompt-result').value = createPrompt(values);
  $('#selected-scene').hidden = !selectedScene;
  $('#selected-scene span').textContent = selectedScene ? `Scene: ${selectedScene.name}` : '';
}
form.addEventListener('input', updatePrompt);
form.addEventListener('change', updatePrompt);
form.addEventListener('submit', event => event.preventDefault());
$('#remove-scene').addEventListener('click', () => { selectedScene = null; updatePrompt(); });
updatePrompt();
async function copyElement(element) {
  const text = element.value ?? element.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    notify('Copied. Paste it into your agent.');
  } catch {
    if (typeof element.select === 'function') {
      element.focus();
      element.select();
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    notify('Automatic copy unavailable. The text is selected: use Ctrl+C or ⌘C.');
  }
}
document.querySelectorAll('[data-copy-target]').forEach(button => {
  button.addEventListener('click', () => copyElement(document.getElementById(button.dataset.copyTarget)));
});
function useExample(example) {
  const values = applyPreset(Object.fromEntries(new FormData(form)), example);
  for (const key of ['goal', 'effects', 'format']) form.elements[key].value = values[key];
  selectedScene = null;
  updatePrompt();
  location.hash = 'create';
  notify(`“${example.title}” applied. Adapt the request to your footage.`);
}
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  useExample(prompts.find(example => example.id === button.dataset.example));
}));
let detailPrompt = null;
function openExample(example) {
  detailPrompt = example;
  $('#example-title-detail').textContent = example.title;
  $('#example-category-detail').textContent = example.category;
  $('#example-when').textContent = example.when;
  $('#example-preview').value = createPrompt(applyPreset(Object.fromEntries(new FormData(form)), example));
  $('#example-tips').replaceChildren();
  for (const tip of example.tips) {
    const item = document.createElement('li');
    item.textContent = tip;
    $('#example-tips').append(item);
  }
  $('#example-dialog').showModal();
}
function renderExamples() {
  const filtered = filterPrompts(prompts, $('#example-search').value, $('#example-category').value);
  $('#example-count').textContent = `${filtered.length} of ${prompts.length} examples`;
  const list = $('#example-list');
  list.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No requests found. Try other words or choose all categories.';
    list.append(empty);
    return;
  }
  for (const example of filtered) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'prompt-card';
    card.setAttribute('aria-label', `View example: ${example.title}`);
    card.innerHTML = '<span class="prompt-card-category"></span><h2></h2><p></p><span class="prompt-card-action">View request and tips <span aria-hidden="true">↗</span></span>';
    card.querySelector('.prompt-card-category').textContent = example.category;
    card.querySelector('h2').textContent = example.title;
    card.querySelector('p').textContent = example.summary;
    card.addEventListener('click', () => openExample(example));
    list.append(card);
  }
}
for (const category of [...new Set(prompts.map(example => example.category))].sort((a, b) => a.localeCompare(b, 'en'))) {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  $('#example-category').append(option);
}
$('#example-search').addEventListener('input', renderExamples);
$('#example-category').addEventListener('change', renderExamples);
$('#close-example').addEventListener('click', () => $('#example-dialog').close());
$('#copy-example').addEventListener('click', () => copyElement($('#example-preview')));
$('#use-example').addEventListener('click', () => {
  $('#example-dialog').close();
  useExample(detailPrompt);
});
renderExamples();
function renderScenes() {
  const filtered = filterScenes(scenes, $('#search').value, $('#category').value);
  $('#catalog-count').textContent = `${filtered.length} of ${scenes.length} scenes`;
  const list = $('#scene-list');
  list.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No scenes found. Try another word or choose all categories.';
    list.append(empty);
    return;
  }
  for (const scene of filtered) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scene-card';
    button.setAttribute('aria-label', `View scene: ${scene.name}`);
    button.innerHTML = '<div class="scene-art" aria-hidden="true"><span></span><div class="motif"><i></i><i></i><i></i></div><small>VISUAL DIAGRAM ↗</small></div><h2></h2><p></p>';
    button.querySelector('.scene-art>span').textContent = `${scene.format || 'FLEXIBLE'} / ${scene.duration ?? '—'}s`;
    button.querySelector('h2').textContent = scene.name;
    button.querySelector('p').textContent = scene.category;
    button.addEventListener('click', () => openScene(scene));
    list.append(button);
  }
}
function openScene(scene) {
  detailScene = scene;
  $('#scene-title').textContent = scene.name;
  $('#scene-group').textContent = scene.category;
  $('#scene-description').textContent = scene.whenToUse;
  $('#scene-meta').replaceChildren();
  for (const [label, value] of [['Reference duration', `${scene.duration ?? '—'} s`], ['Source format', scene.format || 'Not specified'], ['Composition', scene.layout || 'Not specified'], ['Captions during the scene', scene.hidesCaptions ? 'Hidden' : 'Kept']]) {
    const pair = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    pair.append(term, description);
    $('#scene-meta').append(pair);
  }
  $('#scene-prompt').value = scenePrompt(scene, form.elements.agent.value);
  $('#scene-dialog').showModal();
}
$('#close-dialog').addEventListener('click', () => $('#scene-dialog').close());
$('#scene-dialog').addEventListener('click', event => {
  if (event.target === $('#scene-dialog')) {
    const bounds = event.target.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.target.close();
  }
});
$('#use-scene').addEventListener('click', () => {
  selectedScene = detailScene;
  if (form.elements.effects.value === 'no visual scenes or additional effects') form.elements.effects.selectedIndex = 0;
  updatePrompt();
  $('#scene-dialog').close();
  location.hash = 'create';
});
$('#copy-scene').addEventListener('click', () => copyElement($('#scene-prompt')));
$('#search').addEventListener('input', renderScenes);
$('#category').addEventListener('change', renderScenes);
try {
  if (!Array.isArray(catalog.scenes)) throw new Error('Invalid catalog');
  scenes = catalog.scenes;
  const groups = [...new Set(scenes.map(scene => scene.category))].sort((a, b) => a.localeCompare(b, 'en'));
  for (const group of groups) {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    $('#category').append(option);
  }
  renderScenes();
} catch {
  $('#catalog-error').hidden = false;
  $('#catalog-count').textContent = 'Catalog unavailable';
}
