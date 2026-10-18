// Phone carousel geometry and type, relative to the section's top-left.
(() => {
  const ref = !!document.querySelector('[data-type=team-carousel]');
  const W = ref ? document.querySelector('[data-type=team-carousel] .lg\\:hidden') : document.querySelector('#team .lg\\:hidden');
  const sec = W.closest('section');
  const o = sec.getBoundingClientRect();
  const box = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x - o.x), Math.round(b.y - o.y), Math.round(b.width), Math.round(b.height)]; };
  const css = (el, props) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]]));
  const T = ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'];
  const slides = [...W.querySelectorAll(ref ? '.embla__slide' : '[class*="flex-[0_0_var(--push-5)]"]')];
  const visible = slides.filter((s) => { const b = s.getBoundingClientRect(); return b.right > 0 && b.left < innerWidth; }).sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
  const active = visible.find((s) => getComputedStyle(s).opacity === '1');
  const next = visible[visible.indexOf(active) + 1];
  const media = (s) => (ref ? s.querySelector('.media') : s.firstElementChild.firstElementChild);
  const info = (s) => (ref ? s.querySelector('.infos') : s.children[1]);
  const h2 = W.querySelector('h2');
  return JSON.stringify({
    section: css(sec, ['paddingTop', 'paddingBottom', 'backgroundColor']),
    wrapGap: getComputedStyle(W).rowGap,
    h2: { box: box(h2), ...css(h2, T) },
    active: { box: box(active), media: box(media(active)), info: box(info(active)), opacity: getComputedStyle(info(active)).opacity, rowGap: getComputedStyle(active).rowGap },
    next: { box: box(next), media: box(media(next)), opacity: getComputedStyle(next).opacity, infoOpacity: getComputedStyle(info(next)).opacity, infoTranslate: getComputedStyle(info(next)).translate },
    name: { ...css(info(active).querySelector('h3'), T), h: Math.round(info(active).querySelector('h3').getBoundingClientRect().height) },
    role: { ...css(info(active).querySelector('h3').nextElementSibling, [...T, 'marginTop']), h: Math.round(info(active).querySelector('h3').nextElementSibling.getBoundingClientRect().height) },
    body: css(ref ? info(active).querySelector('.portable-text-wrapper') : info(active).children[1], [...T, 'webkitLineClamp']),
    action: css(info(active).querySelector(ref ? 'button' : 'a'), ['fontSize', 'lineHeight', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']),
    actionIcon: css(info(active).querySelector(ref ? 'button' : 'a').firstElementChild, ['opacity', 'left']),
    actionsGap: getComputedStyle(info(active).querySelector(ref ? 'button' : 'a').parentElement).rowGap,
  });
})()
