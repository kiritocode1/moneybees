#!/bin/zsh
# usage: render.sh file.svg out.png W H
set -e
svg=$1; out=$2; W=$3; H=$4
html="${0:A:h}/$(basename ${svg:r}).render.html"
cat > "$html" <<HTML
<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Rethink+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800;900&family=Manrope:wght@500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=block" rel="stylesheet">
<style>html,body{margin:0;padding:0;overflow:hidden;width:${W}px;height:${H}px}svg{display:block}</style></head>
<body style="margin:0">$(cat "$svg")</body></html>
HTML
agent-browser --session vl-c set viewport $W $H >/dev/null
agent-browser --session vl-c open "file://$html" >/dev/null
agent-browser --session vl-c eval "document.fonts.ready.then(()=>document.fonts.size)" >/dev/null
agent-browser --session vl-c wait 400 >/dev/null
agent-browser --session vl-c screenshot "$out" >/dev/null
magick identify "$out"
