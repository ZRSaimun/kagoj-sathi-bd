import {checklistFor, reviewState, SOURCES, REVIEWED_ON, REVIEW_DUE} from './passport-model.js';
import {scenarioFromFragment} from './scenario-link.js';
const form = document.querySelector('#planner');
const error = document.querySelector('#form-error');
const results = document.querySelector('#results');
const area = document.querySelector('#checklist');
const progress = document.querySelector('#progress');
let selected = new Set();
let items = [];
const date = new Date();
const today = Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
const state = reviewState(today);
const status = document.querySelector('#review-status');
status.textContent = state === 'stale' ? `সতর্কতা: ${REVIEW_DUE} তারিখের কনটেন্ট পর্যালোচনা শেষ হয়ে গেছে। আগে সরকারি উৎস যাচাই করুন।` : state === 'unknown' ? 'ডিভাইসের তারিখ যাচাই করা যাচ্ছে না। আগে সরকারি উৎস যাচাই করুন।' : `তথ্য পর্যালোচনা: ${REVIEWED_ON}। এটি লাইভ নিয়ম বা অফিসের বর্তমান অবস্থা নয়।`;
function update() { progress.textContent = `${selected.size} / ${items.length} বিষয় যাচাই করা হয়েছে।`; }
function render() {
  area.replaceChildren();
  items.forEach(item => {
    const row = document.createElement('div'); row.className = 'check-row';
    const label = document.createElement('label');
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = selected.has(item.id);
    input.addEventListener('change', () => { if (input.checked) selected.add(item.id); else selected.delete(item.id); update(); });
    const span = document.createElement('span'); span.textContent = item.text;
    label.append(input, span); row.append(label);
    if (item.note) { const note = document.createElement('p'); note.className = 'note'; note.textContent = item.note; row.append(note); }
    const source = document.createElement('a'); source.href = SOURCES[item.source].url; source.textContent = `উৎস: ${SOURCES[item.source].label}`; source.target = '_blank'; source.rel = 'noopener noreferrer'; row.append(source);
    area.append(row);
  });
  update();
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const choice = {location: document.querySelector('#location').value, age: document.querySelector('#age').value, request: document.querySelector('#request').value};
  try { items = checklistFor(choice); selected = new Set(); error.hidden = true; error.textContent = ''; results.hidden = false; render(); document.querySelector('#result-heading').focus(); }
  catch { results.hidden = true; error.textContent = 'আবেদনস্থল, বয়স ও আবেদনের ধরন—সবগুলো নির্বাচন করুন।'; error.hidden = false; error.focus?.(); }
});
for (const field of form.querySelectorAll('select')) field.addEventListener('change', () => { results.hidden = true; selected.clear(); document.querySelector('#handoff-note').hidden = true; });
document.querySelector('#clear').addEventListener('click', () => { selected.clear(); render(); });
document.querySelector('#print').addEventListener('click', () => window.print());

// Fragment values are strict enums. Never import a question, document or identity number.
const carried = scenarioFromFragment(window.location.hash);
if (carried) {
  for (const [key, value] of Object.entries(carried)) document.querySelector('#' + key).value = value;
  document.querySelector('#handoff-note').hidden = false;
  if (typeof form.requestSubmit === 'function') form.requestSubmit();
  else form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
}
