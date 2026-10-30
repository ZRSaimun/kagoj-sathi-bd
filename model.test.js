import {test} from 'node:test';
import assert from 'node:assert/strict';
import {serviceFor,services} from './model.js';
import {escapeHTML} from './common.js';
test('core workflow and failure cases',()=>{assert.equal(serviceFor('bad').name,'Passport'); assert.equal(Object.keys(services).length,3); for(const s of Object.values(services))assert.ok(s.url.startsWith('https://'));});
test('escape untrusted text',()=>{assert.equal(escapeHTML('<script>'), '&lt;script&gt;');});
