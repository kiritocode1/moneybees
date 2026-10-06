#!/usr/bin/env bash
# Verified implementation: /about's key team members and the seam with the timeline, then the menu link.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/about-key-members/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
ab set viewport 1440 900 >/dev/null
ab open "$B/about" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#timeline').scrollIntoView({block:'start'}); window.scrollBy(0,-450)" >/dev/null; ab wait 2500 >/dev/null
ab screenshot "$S/verified-seam-1440.png" >/dev/null; echo verified-seam-1440
ab eval "document.querySelector('#key-members').scrollIntoView({block:'start'})" >/dev/null; ab wait 2500 >/dev/null
ab screenshot "$S/verified-top-1440.png" >/dev/null; echo verified-top-1440
# The menu's Our Team item, from the homepage.
ab open "$B/" >/dev/null && ab wait --load networkidle >/dev/null
ab find role button click --name "Open menu" >/dev/null; ab wait 1200 >/dev/null
ab find role link click --name "Our Team" --exact >/dev/null; ab wait 3000 >/dev/null
ab eval "JSON.stringify({ url: location.pathname + location.hash, top: Math.round(document.querySelector('#key-members').getBoundingClientRect().top) })"
ab screenshot "$S/verified-menu-link-1440.png" >/dev/null; echo verified-menu-link-1440
