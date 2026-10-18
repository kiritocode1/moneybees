#!/usr/bin/env bash
# Starts the dev server, captures each changed section at 1440 and 390, measures the nav bar, then stops only the server it started.
set -u
cd /Users/blank/Desktop/CREATE/moneybees
OUT=$PWD/.plannotator/finish-doc-gaps/shots; mkdir -p "$OUT"
portless run ./node_modules/.bin/next dev > /tmp/moneybees-dev.log 2>&1 &
SPID=$!
until grep -q "Ready in" /tmp/moneybees-dev.log; do sleep 0.5; kill -0 $SPID 2>/dev/null || { echo DIED; tail -20 /tmp/moneybees-dev.log; exit 1; }; done
U=https://moneybees.localhost:1355
ab() { agent-browser --session fin --ignore-https-errors "$@"; }
shot() { # path anchor width height name
  ab set viewport "$3" "$4" >/dev/null
  ab open "$U$1" >/dev/null; ab wait --load networkidle >/dev/null
  if [ -n "$2" ]; then ab eval "document.querySelector('$2').scrollIntoView({block:'start'}); window.scrollBy(0,-90); 'ok'" >/dev/null; sleep 0.4; ab eval "window.scrollBy(0,1); 'ok'" >/dev/null; fi
  sleep 3.2
  ab screenshot "$OUT/$5.png" >/dev/null
  echo "$5 overflow=$(ab eval 'document.documentElement.scrollWidth > innerWidth')"
}
shot / "#get-started" 1440 900 home-get-started-1440
shot / "#get-started" 390 844 home-get-started-390
shot /about "#timeline" 1440 900 about-timeline-1440
shot /about "#timeline" 390 844 about-timeline-390
shot /aif "#structure" 1440 900 aif-structure-1440
shot /aif "#structure" 390 844 aif-structure-390
shot /aif "#opportunity" 1440 900 aif-opportunity-1440
shot /pms "#why" 1440 900 pms-why-1440
shot /careers "#life" 1440 900 careers-life-1440
shot /careers "#life" 390 844 careers-life-390
shot /contact "" 1440 900 contact-hero-1440
shot /contact "" 390 844 contact-hero-390
shot /insights "" 1440 900 insights-hero-1440
shot /insights "#notes" 1440 900 insights-cards-1440
shot /insights "" 390 844 insights-hero-390
shot /case-studies "#uni-abex" 1440 900 case-uni-abex-1440
for w in 900 1024 1280 1440; do
  ab set viewport $w 800 >/dev/null; ab open "$U/about" >/dev/null; ab wait --load networkidle >/dev/null; sleep 0.5
  echo "nav $w: $(ab eval "(() => { const l = document.querySelector('.om-logo').getBoundingClientRect(); const v = document.querySelector('.om-visible-links').getBoundingClientRect(); const t = document.querySelector('.om-toggler').getBoundingClientRect(); return JSON.stringify({logoRight: Math.round(l.right), linksLeft: Math.round(v.left), linksRight: Math.round(v.right), togglerLeft: Math.round(t.left), wraps: [...document.querySelectorAll('.om-visible-links a')].filter(a => a.offsetParent && a.getClientRects().length > 1).map(a => a.textContent)}) })()")"
  ab screenshot "$OUT/nav-$w.png" >/dev/null
done
grep -iE "error|warn" /tmp/moneybees-dev.log | grep -v "Fast Refresh" | head -10
ab close >/dev/null
kill $SPID; wait $SPID 2>/dev/null; echo stopped
