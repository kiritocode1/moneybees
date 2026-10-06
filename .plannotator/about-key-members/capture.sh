#!/usr/bin/env bash
# Current /about people section vs the proposed /preview/about-team, at 1440 and 390.
# Element screenshots of sections taller than the viewport come back blank here,
# so each shot is a full-page capture cropped to the section's box.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/about-key-members/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
shoot() { # url selector width height name
  ab set viewport "$3" "$4" >/dev/null
  ab open "$B$1" >/dev/null && ab wait --load networkidle >/dev/null
  # Scroll through the section so every reveal fires, then back to the top.
  ab eval "(async () => { const el = document.querySelector('$2'); const r = el.getBoundingClientRect(); for (let y = r.top + scrollY - innerHeight; y < r.bottom + scrollY; y += innerHeight / 2) { scrollTo(0, y); await new Promise(f => setTimeout(f, 250)); } })()" >/dev/null
  ab wait 2500 >/dev/null
  box=$(ab eval "(() => { const r = document.querySelector('$2').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), Math.round(r.left + scrollX), Math.round(r.top + scrollY)].join(' '); })()" | tr -d '"')
  read -r w h x y <<<"$box"
  ab screenshot --full "$S/full-$5.png" >/dev/null
  magick "$S/full-$5.png" -crop "${w}x${h}+${x}+${y}" +repage "$S/$5.png" && rm "$S/full-$5.png"
  echo "$5 ${w}x${h}+${x}+${y}"
}
seam() { # url name: viewport shot where the team section meets the timeline
  ab set viewport 1440 900 >/dev/null
  ab open "$B$1" >/dev/null && ab wait --load networkidle >/dev/null
  ab eval "document.querySelector('#timeline').scrollIntoView({block:'start'}); window.scrollBy(0,-450)" >/dev/null; ab wait 2500 >/dev/null
  ab screenshot "$S/$2.png" >/dev/null; echo "$2"
}
mkdir -p "$S"
shoot /about "#people" 1440 900 current-1440
shoot /preview/about-team "#key-members" 1440 900 proposed-1440
shoot /about "#people" 390 844 current-390
shoot /preview/about-team "#key-members" 390 844 proposed-390
seam /about current-seam-1440
seam /preview/about-team proposed-seam-1440
