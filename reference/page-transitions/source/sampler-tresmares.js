// Per-frame sampler: records transform/opacity/position of every child of #app
// plus html classes and scrollY, for 3s after install. Read back from window.__s.
(() => {
  window.__s = [];
  const t0 = performance.now();
  const app = document.getElementById("app");
  const tick = () => {
    const t = performance.now() - t0;
    const kids = [...app.children].map((c) => {
      const cs = getComputedStyle(c);
      const r = c.getBoundingClientRect();
      return { slug: c.dataset.taxiSlug, tf: cs.transform, op: cs.opacity, pos: cs.position, top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) };
    });
    window.__s.push({ t: Math.round(t), appOp: getComputedStyle(app).opacity, html: document.documentElement.className.replace(/wf-\S+|desktop|mac|chrome/g, "").trim(), sy: Math.round(scrollY), url: location.pathname, kids });
    if (t < (window.__dur || 3000)) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
