#!/bin/zsh
# Render an SVG exactly as the web will: inline it in an HTML page (Google Fonts linked), open it in
# Chrome through agent-browser (session vl-b, viewport = SVG size, DPR 1) and screenshot to PNG.
# usage: render.sh /abs/in.svg /abs/out.png [width height]
set -e
svg=$1; png=$2; W=${3:-736}; H=${4:-736}
html="${svg%.svg}.render.html"
{
  echo '<!doctype html><html><head><meta charset="utf-8">'
  echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  echo '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Instrument+Serif&family=Rethink+Sans:wght@400;500;600&family=Geist+Mono:wght@400;500&display=block" rel="stylesheet">'
  echo "<style>html,body{margin:0;padding:0;width:${W}px;height:${H}px;overflow:hidden;background:#fff}svg{display:block}</style></head><body>"
  cat "$svg"
  echo '</body></html>'
} > "$html"
agent-browser --session vl-b set viewport $W $H >/dev/null
agent-browser --session vl-b open "file://$html?t=$(date +%s%N)" >/dev/null
agent-browser --session vl-b wait 1200 >/dev/null
agent-browser --session vl-b eval 'document.fonts.ready.then(()=>document.fonts.size)' >/dev/null
agent-browser --session vl-b screenshot "$png" >/dev/null
python3 -c "from PIL import Image; im=Image.open('$png'); print('rendered', im.size)"
