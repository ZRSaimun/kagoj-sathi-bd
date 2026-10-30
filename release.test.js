import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildSite} from './scripts/build.mjs';
async function fixture(t) {
 const root=await mkdtemp(join(tmpdir(),'website-release-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 return root;
}
test('release includes linked browser files, not tests or private files',async t=>{
 const root=await fixture(t);
 await writeFile(join(root,'index.html'),'<script type="module" src="./app.js"></script><link href="./style.css" rel="stylesheet">');
 await writeFile(join(root,'app.js'),"import {x} from './model.js';");
 await writeFile(join(root,'model.js'),'export const x=1;');
 await writeFile(join(root,'style.css'),'body{}');
 for(const name of ['model.test.js','.env','README.md'])await writeFile(join(root,name),'private test fixture');
 const files=await buildSite(root);
 assert.equal(files.length,5);
 assert.deepEqual((await readdir(join(root,'dist'))).sort(),['.nojekyll','app.js','index.html','model.js','style.css']);
});
test('missing module rejects a release and preserves the previous build',async t=>{
 const root=await fixture(t);await writeFile(join(root,'index.html'),'<h1>Good</h1>');await buildSite(root);
 await writeFile(join(root,'app.js'),"import './missing.js';");
 await assert.rejects(buildSite(root),/unpublished local reference/);
 assert.equal(await readFile(join(root,'dist','index.html'),'utf8'),'<h1>Good</h1>');
});
test('root-relative and parent paths are rejected for project Pages sites',async t=>{
 const root=await fixture(t);
 for(const ref of ['/app.js','../outside.js']){
 await writeFile(join(root,'index.html'),'<script src="'+ref+'"></script>');
 await assert.rejects(buildSite(root),/unpublished local reference/);
 }
});
