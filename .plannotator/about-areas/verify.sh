#!/usr/bin/env bash
# Verified implementation on /about: section order and labels, the areas at 1440 and 390, and reduced motion.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/about-areas/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
crop() { # selector width height name
  ab set viewport "$2" "$3" >/dev/null
  ab open "$B/about" >/dev/null && ab wait --load networkidle >/dev/null
  ab eval "(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(f => setTimeout(f, 120)); } })()" >/dev/null
  ab wait 4000 >/dev/null
  box=$(ab eval "(() => { const r = document.querySelector('$1').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), Math.round(r.left + scrollX), Math.round(r.top + scrollY)].join(' '); })()" | tr -d '"')
  read -r w h x y <<<"$box"
  ab screenshot --full "$S/full.png" >/dev/null
  magick "$S/full.png" -crop "${w}x${h}+${x}+${y}" +repage "$S/$4.png" && rm "$S/full.png"
  echo "$4 ${w}x${h}"
}
ab set media light >/dev/null
crop "#group" 1440 900 verified-1440
ab eval "JSON.stringify([...document.querySelectorAll('main > section, main > div > section')].map(s => [s.id || '(hero)', getComputedStyle(s).backgroundColor, (s.querySelector('h2') || {}).textContent?.trim().slice(0, 32)]))"
crop "#group" 390 844 verified-390
# Reduced motion: land on the section and capture at once; every drawing should already be finished.
ab set media light reduced-motion >/dev/null
ab set viewport 1440 900 >/dev/null
ab open "$B/about" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#group ul').scrollIntoView({block:'center'})" >/dev/null; ab wait 300 >/dev/null
ab screenshot "$S/verified-reduced-motion-1440.png" >/dev/null; echo verified-reduced-motion-1440
ab set media light >/dev/null
