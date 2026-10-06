#!/usr/bin/env bash
# Bounded run: start the dev server, capture the Recognition previews, stop only that server.
cd /Users/blank/Desktop/CREATE/moneybees
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/about-recognition/shots
B=https://moneybees.localhost:1355
LOG=/tmp/moneybees-capture.log
portless run ./node_modules/.bin/next dev > "$LOG" 2>&1 &
SERVER=$!
trap 'pkill -P $SERVER 2>/dev/null; kill $SERVER 2>/dev/null; wait $SERVER 2>/dev/null' EXIT
until grep -qE "Ready in|Error|EADDRINUSE" "$LOG"; do sleep 0.5; done
grep -m1 -E "Ready in|Error" "$LOG"
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
# Warm the routes so the first capture is not a cold compile.
for p in /preview/about-recognition /preview/home-no-recognition /; do curl -s -o /dev/null --max-time 120 --cacert /Users/blank/.portless/ca.pem "$B$p"; done
crop() { # url selector width height name
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
top() { # url name: the first 2400px of a page at 1440
  ab set viewport 1440 900 >/dev/null
  ab open "$B$1" >/dev/null && ab wait --load networkidle >/dev/null
  ab eval "(async () => { for (let y = 0; y < 2600; y += 450) { scrollTo(0, y); await new Promise(f => setTimeout(f, 150)); } scrollTo(0, 0); })()" >/dev/null
  ab wait 2500 >/dev/null
  ab screenshot --full "$S/full.png" >/dev/null
  magick "$S/full.png" -crop 1440x2400+0+0 +repage -resize 50% "$S/$2.png" && rm "$S/full.png"
  echo "$2"
}
crop /preview/about-recognition "#recognition" 1440 900 proposed-1440
crop /preview/about-recognition "#recognition" 390 844 proposed-390
crop / "section[aria-labelledby=recognition-heading]" 1440 900 current-1440
top / home-current-top
top /preview/home-no-recognition home-proposed-top
# Frame strip: land on the panel fresh and capture as the lists play.
ab set viewport 1440 900 >/dev/null
ab open "$B/preview/about-recognition" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#recognition ol').scrollIntoView({block:'center'})" >/dev/null
for i in 0 1 2 3 4 5; do ab screenshot "$S/frame-$i.png" >/dev/null; sleep 0.4; done
for i in 0 1 2 3 4 5; do magick "$S/frame-$i.png" -crop 1440x620+0+140 +repage "$S/strip-$i.png"; done
magick $S/strip-0.png $S/strip-1.png $S/strip-2.png $S/strip-3.png $S/strip-4.png $S/strip-5.png -background '#dddddd' -splice 0x8 -append -resize 60% "$S/frame-strip.png"
rm $S/strip-[0-9].png $S/frame-[0-9].png 2>/dev/null; ls "$S"
# Seam: What the group does above, Timeline below.
ab open "$B/preview/about-recognition" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(f => setTimeout(f, 120)); } const r = document.querySelector('#recognition').getBoundingClientRect(); scrollTo(0, r.top + scrollY - 300); })()" >/dev/null
ab wait 2500 >/dev/null; ab screenshot "$S/seam-top-1440.png" >/dev/null
ab eval "(() => { const r = document.querySelector('#timeline').getBoundingClientRect(); scrollTo(0, r.top + scrollY - 450); })()" >/dev/null
ab wait 1500 >/dev/null; ab screenshot "$S/seam-bottom-1440.png" >/dev/null
magick $S/seam-top-1440.png $S/seam-bottom-1440.png -background '#dddddd' -splice 0x8 -append -resize 50% "$S/context-1440.png" && rm $S/seam-*.png
ab close >/dev/null
echo done
