#!/usr/bin/env bash
# Clicks AIF Enquiry in Home's Get Started section and reports which /contact option is selected.
set -u
cd /Users/blank/Desktop/CREATE/moneybees
portless run ./node_modules/.bin/next dev > /tmp/moneybees-dev.log 2>&1 &
SPID=$!
until grep -q "Ready in" /tmp/moneybees-dev.log; do sleep 0.5; kill -0 $SPID 2>/dev/null || { echo DIED; exit 1; }; done
ab() { agent-browser --session fin --ignore-https-errors "$@"; }
ab set viewport 1440 900 >/dev/null
ab open https://moneybees.localhost:1355/ >/dev/null; ab wait --load networkidle >/dev/null
ab eval "document.querySelector('#get-started a[href*=\"enquiry=aif\"]').click(); 'clicked'"
sleep 3
ab wait --load networkidle >/dev/null
echo "url: $(ab get url)"
echo "selected: $(ab eval "[...document.querySelectorAll('#enquiry [aria-selected=\"true\"], #enquiry [aria-pressed=\"true\"], #enquiry [aria-checked=\"true\"], #enquiry input:checked')].map(e => e.textContent || e.value).join(' | ')")"
echo "console errors: $(ab errors 2>/dev/null | head -5)"
ab close >/dev/null
kill $SPID; wait $SPID 2>/dev/null; echo stopped
