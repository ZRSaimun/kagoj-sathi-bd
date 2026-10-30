import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isService, normalizeProgress, completionFor} from './desk-model.js';

test('only three configured services can be selected', () => {
  for (const id of ['passport','birth','nid']) assert.equal(isService(id), true);
  for (const id of ['', 'unknown', '__proto__', null, 42]) assert.equal(isService(id), false);
});
test('corrupted saved progress fails closed', () => {
  assert.deepEqual(normalizeProgress(null), {passport:[],birth:[],nid:[]});
  assert.deepEqual(normalizeProgress([1,2]), {passport:[],birth:[],nid:[]});
  assert.deepEqual(normalizeProgress({passport:[1,1,3,-1,99,'2',2.5],birth:'bad',nid:[0]}), {passport:[1,3],birth:[],nid:[0]});
});
test('progress is isolated by service and cannot exceed task count', () => {
  const data={passport:[0,1,2,3,4,5],birth:[0],nid:[]};
  assert.deepEqual(completionFor('passport',data),{done:4,total:4});
  assert.deepEqual(completionFor('birth',data),{done:1,total:4});
  assert.deepEqual(completionFor('nid',data),{done:0,total:4});
  assert.deepEqual(completionFor('fake',data),{done:0,total:4});
});
test('desk exposes native selection, source links, empty state and privacy warning', () => {
  const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
  for (const id of ['choose','official','prepare','guide','checks','progress','print','reset','storage']) assert.match(html,new RegExp(`id="${id}"`));
  assert.equal((html.match(/type="radio" name="service"/g)||[]).length,3);
  assert.match(html,/type="module" src="\.\/app\.js"/);
  assert.match(html,/disabled>প্রস্তুতি প্রিন্ট করুন/);
  assert.match(html,/noscript/);
  assert.match(html,/issues\/new/);
  assert.match(html,/NID, পাসপোর্ট নম্বর/);
});
test('layout has distinct step rail, narrow-screen reflow, print and visible focus', () => {
  const css=readFileSync(new URL('./styles.css',import.meta.url),'utf8');
  for (const part of ['.step-rail','.desk-layout','.service-option','.guide-area',':focus-visible','@media(max-width:570px)','@media print']) assert.ok(css.includes(part));
});
