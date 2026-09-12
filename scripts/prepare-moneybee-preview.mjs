import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Extract the source frames without re-encoding their baked-in grain.
const check = process.argv.includes('--check');
const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('reference/medusmo/chart.json', root), 'utf8'));
const output = new URL('public/preview/moneybee/', root);
await mkdir(new URL('frames/', output), { recursive: true });
const hash = value => createHash('sha256').update(value).digest('hex');
async function emit(url, content) {
  if (check) assert.equal(hash(await readFile(url)), hash(content), `Source differs: ${url.pathname}`);
  else await writeFile(url, content);
}
const parent = source.layers.find(layer => layer.ty === 3);
const frames = [];
for (const layer of source.layers.filter(layer => layer.ty === 2).sort((a, b) => a.ip - b.ip)) {
  const asset = source.assets.find(asset => asset.id === layer.refId);
  const name = `frames/${layer.refId}.png`;
  const bytes = Buffer.from(asset.p.split(',')[1], 'base64');
  await emit(new URL(name, output), bytes);
  frames.push({ src: `/preview/moneybee/${name}`, start: layer.ip, end: layer.op });
}
const manifest = {
  width: source.w, height: source.h, start: source.ip, end: source.op,
  fps: source.fr, scale: parent.ks.s.k[0] / 100, frames,
};
await emit(new URL('app/preview/homepage/chart-manifest.json', root), JSON.stringify(manifest, null, 2) + '\n');
const footer = await readFile(new URL('reference/footer-pulse/source.html', root), 'utf8');
const svg = footer.match(/<svg\b[\s\S]*?<\/svg>/)[0]
  .replace(/<filter id="tf0"[\s\S]*?<\/filter>/, '')
  .replace(/<g id="Moneybee"[\s\S]*?<\/g>/, '');
assert.equal((svg.match(/<linearGradient /g) ?? []).length, 6);
assert.equal((svg.match(/<stop /g) ?? []).length, 192);
await emit(new URL('footer-pulse.svg', output), svg + '\n');
console.log(`${check ? 'Verified' : 'Extracted'} ${frames.length} original PNGs, source timeline/transform, and 6 footer gradients with 192 unchanged stops.`);
const hero = await readFile(new URL('reference/hero-bars/source.html', root), 'utf8');
const heroSvg = hero.match(/<svg\b[\s\S]*?<\/svg>/)[0]
  .replace(/<filter id="tf0"[\s\S]*?<\/filter>/, '')
  .replace(/<g id="Moneybee"[\s\S]*?<\/g>/, '');
assert.equal((heroSvg.match(/<linearGradient /g) ?? []).length, 14);
assert.equal((heroSvg.match(/<stop /g) ?? []).length, 448);
await emit(new URL('hero-bars.svg', output), heroSvg + '\n');
console.log(`${check ? 'Verified' : 'Extracted'} hero artwork: 14 bars and 448 unchanged gradient stops.`);

// Preserve the supplied ascending profile. A broad, low-amplitude wave moves
// across it slowly; every interpolated frame must retain left-to-right growth.
const duration = 36;
const samples = 181;
const baseTops = [...heroSvg.matchAll(/<linearGradient id="bar\d+"[^>]*y1="([\d.]+)"/g)].map(match => Number(match[1]));
const motionTops = baseTops.map((top, index) => Array.from({ length: samples }, (_, sample) => {
  const height = 1472 - top;
  const phase = (sample / (samples - 1)) * Math.PI * 2 - index * 0.075;
  return Number((top - height * 0.035 * Math.sin(phase)).toFixed(2));
}));
for (let sample = 0; sample < samples; sample++) {
  for (let index = 1; index < motionTops.length; index++) {
    assert(motionTops[index][sample] < motionTops[index - 1][sample], 'Column heights must increase left to right');
  }
}
let movingHero = heroSvg;
function animation(attribute, values) {
  return `<animate attributeName="${attribute}" dur="${duration}s" repeatCount="indefinite" calcMode="linear" values="${values.join(';')}"/>`;
}
for (const [index, tops] of motionTops.entries()) {
  movingHero = movingHero.replace(new RegExp(`(<linearGradient id="bar${index}"[^>]*>)([\\s\\S]*?)(</linearGradient>)`),
    (_, start, stops, end) => start + stops + animation('y1', tops) + end);
  movingHero = movingHero.replace(new RegExp(`<rect ([^>]*fill="url\\(#bar${index}\\)"[^>]*)/>`),
    (_, attributes) => `<rect ${attributes}>${animation('y', tops)}${animation('height', tops.map(top => Number((1472 - top).toFixed(2))))}</rect>`);
}
assert.equal((movingHero.match(/<animate /g) ?? []).length, 42);
await emit(new URL('hero-bars-motion.svg', output), movingHero + '\n');
console.log(`${check ? 'Verified' : 'Generated'} 36-second wave: 3.5% height variation, ascending columns at all 181 keyframes, fixed bottom edges.`);
