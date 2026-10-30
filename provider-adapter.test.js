import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PROVIDER_MODE,requestModelAnswer,ProviderUnavailableError} from './provider-adapter.js';
test('unconfigured provider never makes network requests',async()=>{
  assert.equal(PROVIDER_MODE,'disabled');
  await assert.rejects(requestModelAnswer({question:'What is my fee?'}),ProviderUnavailableError);
});
