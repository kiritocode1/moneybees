// Clicks Next and samples the main window's entering and leaving portraits every frame for 800ms.
(async () => {
  const ref = !!document.querySelector('[x-data^=teamCarousel]');
  const R = ref ? document.querySelector('[x-data^=teamCarousel]') : document.querySelector('[role=region][aria-label="Team carousel"]');
  const row = ref ? R.querySelector('.flex.w-full.gap-gap') : R.children[1];
  const main = row.children[1];
  const win = main.firstElementChild;
  const imgs = [...win.children];
  const btn = main.querySelector('button[aria-label="Next team member"]');
  const w = win.getBoundingClientRect().width;
  const tx = (el) => {
    // Tailwind 4 moves with the translate property, our inline style with transform; read both.
    const c = getComputedStyle(el);
    const first = c.translate === 'none' ? '0' : c.translate.split(' ')[0];
    const t = first.endsWith('%') ? (parseFloat(first) / 100) * w : parseFloat(first);
    return (new DOMMatrix(c.transform).m41 + t) / w;
  };
  const op = (el) => +getComputedStyle(el).opacity;
  const exit = imgs.findIndex((el) => op(el) > 0.99);
  const samples = [];
  const t0 = performance.now();
  btn.click();
  await new Promise((done) => {
    const frame = () => {
      const t = performance.now() - t0;
      samples.push([t, imgs.map(tx), imgs.map(op)]);
      if (t < 850) requestAnimationFrame(frame); else done();
    };
    requestAnimationFrame(frame);
  });
  const last = samples[samples.length - 1];
  const enter = last[2].findIndex((o, i) => o > 0.99 && i !== exit);
  return JSON.stringify(samples.map((s) => [+s[0].toFixed(1), s[1][enter], s[2][enter], s[1][exit], s[2][exit]]));
})()
