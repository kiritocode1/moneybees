#!/bin/zsh
# Starts the dev server, captures every placement of the scale figures, stops only that server.
cd /Users/blank/Desktop/CREATE/moneybees
out=$PWD/.plannotator/people-figures/verified
log=/tmp/moneybees-people-dev.log
portless run ./node_modules/.bin/next dev > $log 2>&1 &
srv=$!
for i in {1..120}; do grep -q "Ready in" $log && break; sleep 0.5; done
grep -q "Ready in" $log || { echo "server did not start"; tail -20 $log; kill $srv; exit 1; }
base=https://moneybees.localhost:1355
ab() { agent-browser --session people --ignore-https-errors "$@"; }
ab set viewport 1440 900 >/dev/null
shot() { # page prefix name
  ab open "$base$1" >/dev/null
  ab wait --load networkidle >/dev/null 2>&1
  ab eval "(() => { const p = [...document.querySelectorAll('path')].find(e => e.getAttribute('d')?.startsWith('$2')); if (!p) return 'missing'; p.closest('svg').scrollIntoView({block:'center'}); return 'ok'; })()"
  sleep 4
  rect=$(ab eval "(() => { const p = [...document.querySelectorAll('path')].find(e => e.getAttribute('d')?.startsWith('$2')); const r = p.parentElement.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), devicePixelRatio].join(' '); })()" | tr -d '"')
  ab screenshot $out/$3-page.png >/dev/null
  echo "$3 $rect"
  read x y w h dpr <<< "$rect"
  pad=$(( h > 30 ? h : 30 ))
  magick $out/$3-page.png -crop $(( (w + 2*pad) * dpr ))x$(( (h + 2*pad) * dpr ))+$(( (x - pad) * dpr ))+$(( (y - pad) * dpr )) +repage -filter point -resize 400% $out/$3-zoom.png
}
shot /pms "M-7.4 -87C-8 -87.2" pms-selection
shot /pms "M-7.2 -87.6C-7.8" pms-risk
shot /our-approach "M-7.4 -87C-8 -87.2" approach-philosophy
shot /performance "M-7.4 -87C-8 -87.2" performance-wealth
shot /about "M-1 -79.7C0 -78.5" about-timeline
ab close >/dev/null
kill $srv; sleep 1; pkill -P $srv 2>/dev/null
grep -iE "error|warn" $log | head -5
