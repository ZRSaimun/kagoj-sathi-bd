import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checklistLink, scenarioFromFragment, validScenario, CHECKLIST_PAGE} from './scenario-link.js';

const choice = {location:'mission', age:'under18', request:'lost'};
test('assistant link carries only allowlisted scenario values', () => {
  const link = checklistLink(choice);
  assert.ok(link.startsWith(CHECKLIST_PAGE + '#v=1&'));
  assert.deepEqual(scenarioFromFragment(link.slice(link.indexOf('#'))), choice);
  assert.doesNotMatch(link, /name|nid|passport-number|question|email|password/i);
});
test('all supported combinations round-trip without user text', () => {
  for (const location of ['bd','mission']) for (const age of ['under18','18to20','over20']) for (const request of ['new','reissue','lost']) {
    const selected = {location,age,request};
    const link = checklistLink(selected);
    assert.deepEqual(scenarioFromFragment(link.slice(link.indexOf('#'))), selected);
  }
});
test('incomplete or invalid selections produce a plain checklist link', () => {
  for (const input of [null,{},[],{...choice,request:''},{...choice,age:'99'},{...choice,location:'javascript:alert(1)'}]) {
    assert.equal(validScenario(input), false);
    assert.equal(checklistLink(input), CHECKLIST_PAGE);
  }
});
test('tampered, duplicate, unrelated, long and unsupported fragments fail closed', () => {
  const invalid = ['', '#main', '#v=2&location=bd&age=over20&request=new', '#v=1&location=bd&age=over20&request=new&nid=1234', '#v=1&location=bd&location=mission&age=over20&request=new', '#v=1&location=other&age=over20&request=new', '#v=1&location=bd&age=over20&request=%3Cscript%3E', '#'.padEnd(500,'x'), '#v=1&location=bd&age=over20', '#v=1&location=bd&age=over20&request=new&request=lost'];
  for (const fragment of invalid) assert.equal(scenarioFromFragment(fragment), null, fragment);
});
test('prototype-looking keys are rejected', () => {
  assert.equal(scenarioFromFragment('#v=1&location=bd&age=over20&__proto__=lost'), null);
});
test('the assistant and checklist actually import the same handoff contract', () => {
  const assistant = readFileSync(new URL('./assistant.js', import.meta.url), 'utf8');
  const checklist = readFileSync(new URL('./passport-guide.js', import.meta.url), 'utf8');
  assert.match(assistant, /from '\.\/scenario-link\.js'/);
  assert.match(assistant, /checklistLink\(scenario\)/);
  assert.match(checklist, /from '\.\/scenario-link\.js'/);
  assert.match(checklist, /scenarioFromFragment\(window\.location\.hash\)/);
});
