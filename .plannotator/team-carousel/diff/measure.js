// Reads the team carousel's geometry and type from either page. Boxes are relative to the region's top-left.
(() => {
  const ref = !!document.querySelector('[x-data^=teamCarousel]');
  const R = ref ? document.querySelector('[x-data^=teamCarousel]') : document.querySelector('[role=region][aria-label="Team carousel"]');
  const o = R.getBoundingClientRect();
  const box = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x - o.x), Math.round(b.y - o.y), Math.round(b.width), Math.round(b.height)]; };
  const css = (el, props) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]]));
  const T = ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'color'];
  const row = ref ? R.querySelector('.flex.w-full.gap-gap') : R.children[1];
  const [left, main, right] = row.children;
  const thumbs = [...left.lastElementChild.children];
  const bio = ref ? [...R.querySelectorAll('[x-show]')].find((e) => getComputedStyle(e).display !== 'none') : left.firstElementChild.firstElementChild;
  const action = bio.querySelector(ref ? 'button' : 'a');
  const arrow = main.querySelector('button');
  const section = R.closest('section');
  return JSON.stringify({
    section: css(section, ['backgroundColor', 'color', 'paddingTop', 'paddingBottom']),
    region: { box: box(R), ...css(R, ['paddingLeft', 'paddingRight', 'rowGap']) },
    h2: { box: box(R.querySelector('h2')), ...css(R.querySelector('h2'), T) },
    left: box(left), main: box(main), right: box(right), thumbFar: box(thumbs[0]), thumbNear: box(thumbs[1]),
    thumbOpacity: [getComputedStyle(thumbs[0]).opacity, getComputedStyle(thumbs[1]).opacity, getComputedStyle(right).opacity],
    bio: { box: box(bio), ...css(bio, ['rowGap']) },
    name: { box: box(bio.querySelector('h3')), ...css(bio.querySelector('h3'), T) },
    role: { box: box(bio.querySelector('h3').nextElementSibling), ...css(bio.querySelector('h3').nextElementSibling, [...T, 'marginTop']) },
    body: css(bio.querySelector('p ~ *, .portable-text-wrapper') ? (ref ? bio.querySelector('.portable-text-wrapper') : bio.querySelector('p.mb-\\[1\\.35em\\]').parentElement) : bio, T),
    action: { ...css(action, [...T, 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderTopColor', 'transitionDuration']), h: Math.round(action.getBoundingClientRect().height) },
    actionIcon: css(action.firstElementChild, ['opacity', 'left']),
    arrows: { box: box(arrow.parentElement), arrow: box(arrow), ...css(arrow, ['backgroundColor', 'transitionDuration']) },
    arrowSvg: css(arrow.querySelector('svg'), ['width', 'height']),
  });
})()
