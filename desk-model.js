import {services, prompts} from './model.js';

const IDS = Object.keys(services);
export function isService(id) { return typeof id === 'string' && Object.hasOwn(services, id); }
export function normalizeProgress(value) {
  const result = Object.fromEntries(IDS.map(id => [id, []]));
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  for (const id of IDS) {
    const rows = value[id];
    if (!Array.isArray(rows)) continue;
    result[id] = [...new Set(rows.filter(n => Number.isInteger(n) && n >= 0 && n < prompts.length))];
  }
  return result;
}
export function completionFor(id, progress) {
  if (!isService(id)) return {done: 0, total: prompts.length};
  const safe = normalizeProgress(progress);
  return {done: safe[id].length, total: prompts.length};
}
