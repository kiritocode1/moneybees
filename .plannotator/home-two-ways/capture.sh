#!/usr/bin/env bash
# Proposed preview: the section at 1440 and 390, with a card hovered, and the seams with the hero and the founder band.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/home-two-ways/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
crop() { # url selector width height name
  ab set viewport "$3" "$4" >/dev/null
  ab open "$B$1" >/dev/null && ab wait --load networkidle >/dev/null
  ab eval "(async () => { for (let y = 0; y < 3000; y += innerHeight / 2) { scrollTo(0, y); await new Promise(f => setTimeout(f, 150)); } })()" >/dev/null
  ab wait 2500 >/dev/null
  box=$(ab eval "(() => { const r = document.querySelector('$2').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), Math.round(r.left + scrollX), Math.round(r.top + scrollY)].join(' '); })()" | tr -d '"')
  read -r w h x y <<<"$box"
  ab screenshot --full "$S/full.png" >/dev/null
  magick "$S/full.png" -crop "${w}x${h}+${x}+${y}" +repage "$S/$5.png" && rm "$S/full.png"
  echo "$5 ${w}x${h}"
}
crop /preview/home-two-ways "#invest" 1440 900 proposed-1440
crop /preview/home-two-ways "#invest" 390 844 proposed-390
# Hover the PMS card: its mark closes.
ab set viewport 1440 900 >/dev/null
ab open "$B/preview/home-two-ways" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#invest').scrollIntoView({block:'start'})" >/dev/null; ab wait 1500 >/dev/null
ab hover "a.tw-card[href='/pms']" >/dev/null; ab wait 1200 >/dev/null
ab screenshot "$S/proposed-hover-pms-1440.png" >/dev/null; echo proposed-hover-pms-1440
# Seams: the hero above, the founder band below.
ab eval "(() => { const r = document.querySelector('#invest').getBoundingClientRect(); scrollTo(0, r.top + scrollY - 350); })()" >/dev/null; ab wait 1500 >/dev/null
ab screenshot "$S/seam-top.png" >/dev/null
ab eval "(() => { const r = document.querySelector('#invest').getBoundingClientRect(); scrollTo(0, r.bottom + scrollY - 500); })()" >/dev/null; ab wait 1500 >/dev/null
ab screenshot "$S/seam-bottom.png" >/dev/null
magick "$S/seam-top.png" "$S/seam-bottom.png" -background '#dddddd' -splice 0x8 -append -resize 50% "$S/context-1440.png" && rm "$S/seam-top.png" "$S/seam-bottom.png"; echo context-1440
