#!/bin/zsh
cd /Users/blank/Desktop/CREATE/moneybees
out=$PWD/.plannotator/people-figures/verified
log=/tmp/moneybees-people-dev.log
portless run ./node_modules/.bin/next dev > $log 2>&1 &
srv=$!
for i in {1..120}; do grep -q "Ready in" $log && break; sleep 0.5; done
ab() { agent-browser --session people --ignore-https-errors "$@"; }
ab set viewport 1440 900 >/dev/null
ab open https://moneybees.localhost:1355/pms >/dev/null
ab wait --load networkidle >/dev/null 2>&1
ab eval "document.getElementById('selection').scrollIntoView({block:'start'})" >/dev/null
for step in {1..14}; do ab scroll down 120 >/dev/null; sleep 0.5; done
sleep 4
ab eval "(() => { const p = [...document.querySelectorAll('path')].find(e => e.getAttribute('d')?.startsWith('M-7.4 -87C-8 -87.2')); p.closest('svg').scrollIntoView({block:'center'}); })()" >/dev/null
sleep 3
rect=$(ab eval "(() => { const p = [...document.querySelectorAll('path')].find(e => e.getAttribute('d')?.startsWith('M-7.4 -87C-8 -87.2')); const r = p.parentElement.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), getComputedStyle(p.closest('[data-late]')).opacity].join(' '); })()" | tr -d '"')
echo "rect $rect"
ab screenshot $out/pms-selection-page.png >/dev/null
read x y w h op <<< "$rect"
magick $out/pms-selection-page.png -crop $(( w + 2*h ))x$(( 3*h ))+$(( x - h ))+$(( y - h )) +repage -filter point -resize 400% $out/pms-selection-zoom.png
ab close >/dev/null
kill $srv; sleep 1; pkill -P $srv 2>/dev/null
