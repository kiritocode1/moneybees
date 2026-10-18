#!/usr/bin/env bash
# Recaptures the sections changed after the first review and measures the nav bar at four widths.
set -u
cd /Users/blank/Desktop/CREATE/moneybees
OUT=$PWD/.plannotator/finish-doc-gaps/shots
portless run ./node_modules/.bin/next dev > /tmp/moneybees-dev.log 2>&1 &
SPID=$!
until grep -q "Ready in" /tmp/moneybees-dev.log; do sleep 0.5; kill -0 $SPID 2>/dev/null || { echo DIED; exit 1; }; done
U=https://moneybees.localhost:1355
ab() { agent-browser --session fin --ignore-https-errors "$@"; }
shot() {
  ab set viewport "$3" "$4" >/dev/null
  ab open "$U$1" >/dev/null; ab wait --load networkidle >/dev/null
  if [ -n "$2" ]; then ab eval "document.querySelector('$2').scrollIntoView({block:'start'}); window.scrollBy(0,-90); 'ok'" >/dev/null; sleep 0.4; ab eval "window.scrollBy(0,1); 'ok'" >/dev/null; fi
  sleep 3.2; ab screenshot "$OUT/$5.png" >/dev/null; echo "$5 overflow=$(ab eval 'document.documentElement.scrollWidth > innerWidth')"
}



PROBE='(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); const shown = [...document.querySelectorAll(".om-visible-links a")].filter((a) => a.offsetParent); return JSON.stringify({ logoRight: Math.round(r(".om-logo").right), firstLink: Math.round(shown[0].getBoundingClientRect().left), ctaRight: Math.round(r(".om-cta").right), toggler: Math.round(r(".om-toggler").left), links: shown.map((a) => a.textContent), wrapped: shown.filter((a) => a.getBoundingClientRect().height > 30 && !a.classList.contains("om-cta")).map((a) => a.textContent) }); })()'
for w in 600 900 1000; do
  ab set viewport $w 800 >/dev/null; ab open "$U/about" >/dev/null; ab wait --load networkidle >/dev/null; sleep 0.5
  echo "nav $w: $(ab eval "$PROBE")"
  ab screenshot "$OUT/nav-$w.png" >/dev/null
done
ab close >/dev/null
kill $SPID; wait $SPID 2>/dev/null; echo stopped
