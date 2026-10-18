// Clicks Next and samples every bio's opacity and vertical offset each frame for 800ms, keyed by name.
(async () => {
  const ref = !!document.querySelector('[x-data^=teamCarousel]');
  const R = ref ? document.querySelector('[x-data^=teamCarousel]') : document.querySelector('[role=region][aria-label="Team carousel"]');
  const row = ref ? R.querySelector('.flex.w-full.gap-gap') : R.children[1];
  const holder = row.children[0].firstElementChild;
  const btn = row.children[1].querySelector('button[aria-label="Next team member"]');
  const ty = (el) => {
    const c = getComputedStyle(el);
    const parts = c.translate === 'none' ? [] : c.translate.split(' ');
    return new DOMMatrix(c.transform).m42 + (parts[1] ? parseFloat(parts[1]) : 0);
  };
  const read = () => Object.fromEntries([...holder.children].filter((el) => getComputedStyle(el).display !== 'none').map((el) => [el.querySelector('h3').textContent.trim(), [+getComputedStyle(el).opacity, ty(el), getComputedStyle(el).visibility === 'visible' ? 1 : 0]]));
  const before = Object.keys(read())[0];
  const samples = [];
  const t0 = performance.now();
  btn.click();
  await new Promise((done) => {
    const frame = () => {
      const t = performance.now() - t0;
      samples.push([t, read()]);
      if (t < 850) requestAnimationFrame(frame); else done();
    };
    requestAnimationFrame(frame);
  });
  const after = Object.keys(samples[samples.length - 1][1]).find((n) => n !== before);
  return JSON.stringify(samples.map(([t, s]) => [+t.toFixed(1), s[after] || [0, null, 0], s[before] || [0, null, 0]]));
})()
