#!/usr/bin/env bash
# Captures Home's Get Started cards at 1440, 820 and 390, checks the AIF card's link, then stops only the server it started.
set -u
cd /Users/blank/Desktop/CREATE/moneybees
OUT=$PWD/.plannotator/finish-doc-gaps/shots
portless run ./node_modules/.bin/next dev > /tmp/moneybees-dev.log 2>&1 &
SPID=$!
until grep -q "Ready in" /tmp/moneybees-dev.log; do sleep 0.5; kill -0 $SPID 2>/dev/null || { echo DIED; exit 1; }; done
U=https://moneybees.localhost:1355
ab() { agent-browser --session fin --ignore-https-errors "$@"; }
for spec in "1440 900" "820 1180" "390 844"; do
  set -- $spec
  ab set viewport $1 $2 >/dev/null; ab open "$U/" >/dev/null; ab wait --load networkidle >/dev/null
  ab eval "document.querySelector('#get-started').scrollIntoView({block:'start'}); window.scrollBy(0,-40); 'ok'" >/dev/null; sleep 0.4; ab eval "window.scrollBy(0,1); 'ok'" >/dev/null
  sleep 3; ab screenshot "$OUT/home-get-started-cards-$1.png" >/dev/null
  echo "$1 overflow=$(ab eval 'document.documentElement.scrollWidth > innerWidth')"
done
ab eval "document.querySelector('#get-started a[href*=\"enquiry=aif\"]').click(); 'clicked'" >/dev/null; sleep 3; ab wait --load networkidle >/dev/null
echo "after click: $(ab get url) selected=$(ab eval "[...document.querySelectorAll('#enquiry [aria-selected=\"true\"]')].map(e => e.textContent).join('|')")"
ab close >/dev/null
kill $SPID; wait $SPID 2>/dev/null; echo stopped
