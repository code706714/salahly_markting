#!/usr/bin/env node
// رندر يشتغل على ويندوز/ماك/لينكس (نفس render.sh):
//   npm run render              -> كل الفيديوهات
//   npm run render -- ac-scam   -> فيديو واحد أو أكتر
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, statSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
mkdirSync('out', {recursive: true});

const all = readdirSync('src/videos').filter((d) => statSync(join('src/videos', d)).isDirectory());
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;

const extra = [];
if (process.env.BROWSER_EXECUTABLE) extra.push(`--browser-executable=${process.env.BROWSER_EXECUTABLE}`, '--chrome-mode=chrome-for-testing');
if (process.env.CONCURRENCY) extra.push(`--concurrency=${process.env.CONCURRENCY}`);

for (const id of ids) {
  if (!all.includes(id)) {
    console.error(`!! مفيش فيديو اسمه ${id}. المتاح: ${all.join(', ')}`);
    process.exit(1);
  }
  if (!existsSync(join('src/videos', id, 'timing.json'))) {
    console.error(`!! src/videos/${id}/timing.json مش موجود — شغّل الأول: python scripts/generate_voice.py ${id}`);
    process.exit(1);
  }
  console.log(`==> rendering ${id}`);
  const r = spawnSync(
    'npx',
    ['remotion', 'render', 'src/index.ts', id, `out/${id}.mp4`, '--codec=h264', '--pixel-format=yuv420p', '--crf=18', '--audio-codec=aac', '--overwrite', ...extra],
    {stdio: 'inherit', shell: process.platform === 'win32'},
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log('Done -> out/');
