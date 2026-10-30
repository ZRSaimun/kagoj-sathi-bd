import {OPTIONS} from './passport-model.js';

// Only three non-identifying, pre-defined choices travel in the URL fragment.
// No free-text questions, document details or IDs are ever encoded.
const KEYS = ['location', 'age', 'request'];
export const CHECKLIST_PAGE = './passport-guide.html';

export function validScenario(choice) {
  return Boolean(choice && typeof choice === 'object' && !Array.isArray(choice) &&
    KEYS.every(key => typeof choice[key] === 'string' && OPTIONS[key].includes(choice[key])));
}

export function checklistLink(choice) {
  if (!validScenario(choice)) return CHECKLIST_PAGE;
  const params = new URLSearchParams([['v', '1'], ...KEYS.map(key => [key, choice[key]])]);
  return CHECKLIST_PAGE + '#' + params.toString();
}

export function scenarioFromFragment(fragment) {
  if (typeof fragment !== 'string' || !fragment.startsWith('#') || fragment.length > 120) return null;
  const params = new URLSearchParams(fragment.slice(1));
  const keys = [...params.keys()];
  if (keys.length !== 4 || new Set(keys).size !== 4 ||
      keys.some(key => !['v', ...KEYS].includes(key)) || params.get('v') !== '1') return null;
  const choice = Object.fromEntries(KEYS.map(key => [key, params.get(key)]));
  return validScenario(choice) ? choice : null;
}
