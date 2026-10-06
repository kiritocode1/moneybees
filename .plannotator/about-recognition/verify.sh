#!/usr/bin/env bash
# Verified implementation: Recognition on /about, gone from the homepage. Bounded server run.
cd /Users/blank/Desktop/CREATE/moneybees
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/about-recognition/shots
B=https://moneybees.localhost:1355
LOG=/tmp/moneybees-capture.log
portless run ./node_modules/.bin/next dev > "$LOG" 2>&1 &
SERVER=$!
trap 'pkill -P $SERVER 2>/dev/null; kill $SERVER 2>/dev/null; wait $SERVER 2>/dev/null' EXIT
until grep -qE "Ready in|Error|EADDRINUSE" "$LOG"; do sleep 0.5; done
grep -m1 -E "Ready in|Error" "$LOG"
C=/Users/blank/.portless/ca.pem
for p in /about /; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 120 --cacert $C "$B$p")" "$p"; done
echo "recognition headings on /: $(curl -s --cacert $C "$B/" | grep -c 'recognition-heading')"
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
ab set media light >/dev/null
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
crop "#recognition" 1440 900 verified-1440
ab eval "JSON.stringify([...document.querySelectorAll('main section')].filter(s => s.parentElement.tagName === 'MAIN').map(s => [s.id || '(hero)', (s.querySelector('h2') || {}).textContent?.trim().slice(0, 28)]))"
crop "#recognition" 390 844 verified-390
# Reduced motion: every list should be finished the moment it is on screen.
ab set media light reduced-motion >/dev/null
ab set viewport 1440 900 >/dev/null
ab open "$B/about" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#recognition ol').scrollIntoView({block:'center'})" >/dev/null; ab wait 300 >/dev/null
ab screenshot "$S/verified-reduced-motion-1440.png" >/dev/null; echo verified-reduced-motion-1440
ab set media light >/dev/null
ab close >/dev/null
