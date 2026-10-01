#!/bin/bash
# usage: render.sh in.svg W H out.png "font query"   (font query = Google Fonts css2 family params, e.g. "family=Inter:wght@400;500;600")
SVG="$1"; W="$2"; H="$3"; OUT="$4"; FQ="$5"
HTML="${OUT%.png}.html"
{
echo '<!doctype html><html><head><meta charset="utf-8">'
[ -n "$FQ" ] && echo "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?$FQ&display=block\">"
echo "<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style></head><body style=\"margin:0\">"
cat "$SVG"
echo '</body></html>'
} > "$HTML"
agent-browser --session vl-a set viewport "$W" "$H" >/dev/null
agent-browser --session vl-a open "file://$HTML" >/dev/null
agent-browser --session vl-a wait 1200 >/dev/null 2>&1
agent-browser --session vl-a eval "document.fonts.ready.then(()=>document.fonts.size)" >/dev/null 2>&1
agent-browser --session vl-a screenshot "$OUT" >/dev/null
python3 -c "from PIL import Image; im=Image.open('$OUT'); print('$OUT', im.size)"
