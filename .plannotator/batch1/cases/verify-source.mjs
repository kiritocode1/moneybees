import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const source = readFileSync("reference/visual-language/07/moneybee.svg", "utf8");
const hero = readFileSync("components/case-studies-v3/journey-hero.tsx", "utf8");
const pinnedPanel = source.split('<g transform="translate(736 0)">')[0];
const pinnedFaces = [...pinnedPanel.matchAll(/<polygon points="([^"]+)" fill="(#F6A11A|#8C5E22)"/g)]
  .map(([, points, fill]) => ({ points, shade: fill === "#8C5E22" }));
const faces = [...hero.matchAll(/points: "([^"]+)", shade: (true|false)/g)]
  .map(([, points, shade]) => ({ points, shade: shade === "true" }));
assert.equal(pinnedFaces.length, 9);
assert.deepEqual(faces, pinnedFaces);

const leaders = [...hero.matchAll(/leader: "([^"]+)"/g)].map(([, path]) => path);
assert.equal(leaders.length, 3);
for (const path of leaders) assert.ok(source.includes(`d="${path}"`));
for (const element of [
  '<path d="M267.50,505.93 314.70,519.02 314.70,524.16 267.50,511.07Z"',
  '<circle cx="268.29" cy="471.76" r="2.77"',
  '<rect x="263.55" y="476.11" width="8.69" height="15.80" rx="2.77"',
  '<polygon points="263.94,489.54 268.29,489.54 263.55,508.50 260.00,508.50"',
  '<polygon points="266.71,489.54 271.45,489.54 275.40,508.50 271.85,508.50"',
]) {
  assert.ok(source.includes(element));
  assert.ok(hero.includes(element));
}
assert.ok(hero.includes('shade ? "#B77613" : "#F6A11A"'));
console.log("PASS: 9 face polygons and painter order, 3 measured leaders, walker and shadow match pinned study 07 exactly.");
console.log("Intentional difference: shaded faces use brief-mandated #B77613 rather than the study's #8C5E22.");

if (process.argv.includes("--runtime")) {
  const pms = readFileSync("lib/pms.ts", "utf8");
  const copy = readFileSync("lib/case-studies.ts", "utf8");
  const financials = new Map([...pms.matchAll(/"([^"]+)": years\(\[([^\]]+)\], \[([^\]]+)\], \[([^\]]+)\]\)/g)]
    .map(([, name, revenue, ebidta, pat]) => [name, [revenue, ebidta, pat].map(values => values.split(",").map(Number))]));
  const studies = [...copy.matchAll(/entry\("([^"]+)", \{([\s\S]*?)\}\)/g)].map(([, key, fields]) => {
    const value = property => fields.match(new RegExp(`${property}: "([^"]+)"`))?.[1];
    return { id: value("id"), name: value("name"), facts: [value("business"), value("edge"), value("growth")], financials: financials.get(key) };
  });
  assert.equal(studies.length, 3);
  const expectedDisclaimer = copy.match(/export const CASE_DISCLAIMER =\s*"([^"]+)"/)?.[1];
  const expression = `(() => {
    const studies = ${JSON.stringify(studies)};
    const maximum = Math.max(...studies.flatMap(study => study.financials[2]));
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    assert(document.querySelectorAll('.cv3-story').length === studies.length, 'One story per company');
    for (const study of studies) {
      const article = document.getElementById(study.id);
      assert(article.querySelector('h2').textContent === study.name, study.id + ' name');
      assert(JSON.stringify([...article.querySelectorAll('dd')].map(el => el.textContent)) === JSON.stringify(study.facts), study.id + ' copy');
      const charts = [...article.querySelectorAll('.cv3-financial-grid svg')];
      assert(charts.length === 3, study.id + ' chart count');
      charts.forEach((chart, metric) => {
        const groups = [...chart.querySelectorAll(':scope > g')].filter(g => g.querySelector('circle'));
        assert(groups.length === 5, study.id + ' five years');
        groups.forEach((group, year) => {
          const value = study.financials[metric][year];
          assert(Number(group.querySelector('text').textContent.replaceAll(',', '')) === value, study.id + ' metric value');
          assert(group.querySelector('circle').getAttribute('fill') === (year === 4 ? '#F6A11A' : '#000'), study.id + ' latest year');
        });
        const ticks = [...chart.querySelectorAll(':scope > g')].filter(g => !g.querySelector('circle'));
        assert(ticks[0].querySelector('text').textContent === '0', study.id + ' zero baseline');
        const ceiling = Number(ticks[2].querySelector('text').textContent);
        groups.forEach((group, year) => assert(Math.abs(Number(group.querySelector('circle').getAttribute('cy')) - (154 - study.financials[metric][year] / ceiling * 115)) < 1e-8, study.id + ' linear scale'));
      });
    }
    const markers = [...document.querySelectorAll('.cv3-marker-box svg')];
    const values = studies.flatMap(study => study.financials[2]);
    assert(markers.length === values.length, 'Timeline marker count');
    markers.forEach((marker, index) => assert(Math.abs((parseFloat(marker.style.width) / 100) ** 2 * maximum - values[index]) < 1e-4, 'Area-true PAT marker ' + index));
    assert(document.querySelector('main aside p').textContent === ${JSON.stringify(expectedDisclaimer)}, 'Verbatim disclaimer');
    assert(!document.querySelector('main').textContent.includes('\\u2014'), 'No em dashes');
    assert(document.documentElement.scrollWidth === innerWidth, 'No horizontal overflow');
    return { stories: studies.length, financialValues: 45, areaTrueMarkers: markers.length, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, result: 'PASS' };
  })()`;
  const response = JSON.parse(execFileSync("agent-browser", ["--session", "pi-cases", "eval", expression, "--json"], { encoding: "utf8" }));
  assert.equal(response.success, true, JSON.stringify(response.error));
  console.log(JSON.stringify(response.data.result, null, 2));
}
