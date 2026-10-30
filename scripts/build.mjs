import {readdir, readFile, mkdir, writeFile, rm} from 'node:fs/promises';
import {resolve, dirname, basename, posix} from 'node:path';
import {fileURLToPath} from 'node:url';

export async function buildSite(root) {
  root = resolve(root);
  const names = (await readdir(root)).filter(name =>
    /\.(html|css|js|jpg)$/.test(name) && !name.endsWith('.test.js'));
  if (!names.includes('index.html')) throw new Error('Missing index.html');
  const files = new Map(await Promise.all(names.map(async name => [name, await readFile(resolve(root, name), name.endsWith('.jpg') ? undefined : 'utf8')])));
  for (const [name, source] of files) {
    const refs = name.endsWith('.html')
      ? [...source.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)].map(m => m[1])
      : name.endsWith('.js')
        ? [...source.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)].map(m => m[1])
        : [];
    for (const ref of refs) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(ref)) continue;
      const clean = ref.split(/[?#]/)[0];
      if (!clean) continue;
      const target = posix.normalize(posix.join(posix.dirname(name), clean));
      if (clean.startsWith('/') || target.startsWith('../') || !files.has(target))
        throw new Error(name + ': unpublished local reference ' + ref);
    }
  }
  // Validate first, so a bad source change does not erase an existing build.
  const output = resolve(root, 'dist');
  await rm(output, {recursive: true, force: true});
  await mkdir(output);
  for (const [name, source] of files) await writeFile(resolve(output, name), source);
  await writeFile(resolve(output, '.nojekyll'), '');
  return [...files.keys(), '.nojekyll'];
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = await buildSite(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  console.log('Built ' + files.length + ' public files in dist/');
}

