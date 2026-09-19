import fs from 'fs';
const p = new URL('./src/style.css', import.meta.url);
const css = fs.readFileSync(p, 'utf8');
const lines = css.split('\n');
let rootEnd = 0, inRoot = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(':root')) inRoot = true;
  if (inRoot && /^\}/.test(lines[i])) { rootEnd = i + 1; break; }
}
const tokenBlock = lines.slice(0, rootEnd).join('\n');
const outside = lines.slice(rootEnd).join('\n');
const colorRe = /#([0-9a-fA-F]{3,8})\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
function norm(c) {
  let s = c.toLowerCase().replace(/\s+/g, '').replace(/,\s*/g, ',');
  if (/^#[0-9a-f]{3}$/.test(s)) {
    s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  }
  return s;
}
function collect(text) {
  const set = new Set();
  let m;
  while ((m = colorRe.exec(text))) set.add(norm(m[0]));
  return set;
}
const tokens = collect(tokenBlock);
const outsideColors = collect(outside);
console.log('rootEndLine', rootEnd);
console.log('tokensInRoot', tokens.size, [...tokens].sort().join(' | '));
console.log('distinctOutsideRoot', outsideColors.size);
console.log('varUsage', (css.match(/var\(--[a-zA-Z0-9-]+\)/g) || []).length);

const mediaRe = /@media\s*\(([^)]+)\)/g;
const mediaCounts = {};
let mm;
while ((mm = mediaRe.exec(css))) {
  const q = mm[1].trim();
  mediaCounts[q] = (mediaCounts[q] || 0) + 1;
}
console.log('\nMEDIA BREAKPOINTS:');
Object.entries(mediaCounts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(v, k));

// duplicate selectors (simple: lines starting with . or # before {)
const selRe = /^([^{]+)\{/gm;
const selCounts = {};
let sm;
while ((sm = selRe.exec(css))) {
  const sel = sm[1].trim().replace(/\s+/g, ' ');
  if (sel.includes('@') || sel.startsWith('from') || sel.startsWith('to')) continue;
  selCounts[sel] = selCounts[sel] || [];
  const line = css.slice(0, sm.index).split('\n').length;
  selCounts[sel].push(line);
}
const dups = Object.entries(selCounts).filter(([, locs]) => locs.length > 1);
console.log('\nDUPLICATE SELECTORS (count>1):', dups.length);
dups.sort((a, b) => b[1].length - a[1].length).slice(0, 25).forEach(([sel, locs]) => {
  console.log(locs.length, 'x', sel.slice(0, 80), 'lines:', locs.join(', '));
});

const fontSizes = [...css.matchAll(/font-size:\s*([^;]+);/g)].map(m => m[1].trim());
const fsCounts = {};
fontSizes.forEach(f => { fsCounts[f] = (fsCounts[f] || 0) + 1; });
console.log('\nUNIQUE font-size values:', Object.keys(fsCounts).length);
console.log('Top font-size values:');
Object.entries(fsCounts).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([k, v]) => console.log(v, k));

const radii = [...css.matchAll(/border-radius:\s*([^;]+);/g)].map(m => m[1].trim());
const rCounts = {};
radii.forEach(r => { rCounts[r] = (rCounts[r] || 0) + 1; });
console.log('\nUNIQUE border-radius values:', Object.keys(rCounts).length);

const weights = [...css.matchAll(/font-weight:\s*([^;]+);/g)].map(m => m[1].trim());
const wCounts = {};
weights.forEach(w => { wCounts[w] = (wCounts[w] || 0) + 1; });
console.log('\nfont-weight values:', Object.entries(wCounts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${v}x ${k}`).join(', '));
