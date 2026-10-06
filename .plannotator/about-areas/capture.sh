#!/usr/bin/env bash
# Proposed preview of What the group does: end state at 1440 and 390, a frame strip at 1440, and the page around it.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/about-areas/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
crop() { # url selector width height name: full-page capture cropped to the element
  ab set viewport "$3" "$4" >/dev/null
  ab open "$B$1" >/dev/null && ab wait --load networkidle >/dev/null
  ab eval "(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(f => setTimeout(f, 120)); } })()" >/dev/null
  ab wait 4000 >/dev/null
  box=$(ab eval "(() => { const r = document.querySelector('$2').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), Math.round(r.left + scrollX), Math.round(r.top + scrollY)].join(' '); })()" | tr -d '"')
  read -r w h x y <<<"$box"
  ab screenshot --full "$S/full.png" >/dev/null
  magick "$S/full.png" -crop "${w}x${h}+${x}+${y}" +repage "$S/$5.png" && rm "$S/full.png"
  echo "$5 ${w}x${h}"
}
crop /preview/about-areas "#group" 1440 900 proposed-1440
crop /preview/about-areas "#group" 390 844 proposed-390
crop /about "#group" 1440 900 current-1440
# Frame strip: land on the section fresh, then capture as the drawings play.
ab set viewport 1440 900 >/dev/null
ab open "$B/preview/about-areas" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#group ul').scrollIntoView({block:'center'})" >/dev/null
start=$(python3 -c 'import time; print(time.time())')
for i in 0 1 2 3 4 5; do
  ab screenshot "$S/frame-$i.png" >/dev/null
  echo "frame-$i $(python3 -c "import time; print(round(time.time() - $start, 2))")s"
  sleep 0.45
done
# The page around the section: key team members above, the grey timeline below.
ab eval "(() => { const r = document.querySelector('#group').getBoundingClientRect(); scrollTo(0, r.top + scrollY - 180); })()" >/dev/null; ab wait 1500 >/dev/null
ab screenshot "$S/proposed-context-top-1440.png" >/dev/null; echo proposed-context-top-1440
ab eval "(() => { const r = document.querySelector('#timeline').getBoundingClientRect(); scrollTo(0, r.top + scrollY - 520); })()" >/dev/null; ab wait 1500 >/dev/null
ab screenshot "$S/proposed-context-bottom-1440.png" >/dev/null; echo proposed-context-bottom-1440
