#!/usr/bin/env bash
# The homepage's new joins: founder to research, research to record, record to philosophy, philosophy to picks.
S=/Users/blank/Desktop/CREATE/moneybees/.plannotator/home-order/shots
B=https://moneybees.localhost:1355
ab() { agent-browser --session lead --ignore-https-errors "$@"; }
ab set viewport 1440 900 >/dev/null
ab open "$B/" >/dev/null && ab wait --load networkidle >/dev/null
ab eval "JSON.stringify([...document.querySelectorAll('main > *')].map(el => (el.matches('section') ? el : el.querySelector('section') || el).id || el.getAttribute('aria-label') || el.tagName))"
# Scroll the whole page once so every reveal and pinned scene has run.
ab eval "(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(f => setTimeout(f, 90)); } })()" >/dev/null
ab wait 3000 >/dev/null
seam() { # selector of the section below the join, name
  ab eval "(() => { const el = document.querySelector('$1'); const r = el.getBoundingClientRect(); scrollTo(0, r.top + scrollY - 450); })()" >/dev/null
  ab wait 1800 >/dev/null
  ab screenshot "$S/$2.png" >/dev/null; echo "$2"
}
seam "#research" founder-to-research
seam "#record, #performance" research-to-record
seam "#philosophy-pillars" record-to-philosophy
seam "#picks" philosophy-to-picks
ab close >/dev/null
