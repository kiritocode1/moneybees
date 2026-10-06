#!/usr/bin/env bash
# Current state: the homepage's Two ways section and the /pms and /aif heroes that carry each product's mark.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/home-two-ways/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
ab set viewport 1440 900 >/dev/null
ab open "$B/" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#invest').scrollIntoView({block:'start'})" >/dev/null; ab wait 2000 >/dev/null
ab screenshot "$S/current-1440.png" >/dev/null; echo current-1440
for p in pms aif; do ab open "$B/$p" >/dev/null && ab wait --load networkidle >/dev/null; ab wait 2500 >/dev/null; ab screenshot "$S/hero-$p.png" >/dev/null; echo hero-$p; done
