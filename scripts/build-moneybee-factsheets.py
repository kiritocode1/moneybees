#!/usr/bin/env python3
"""Build the reviewed slide factsheets. Requires pypdf, Pillow and pdftoppm.

Run with the Codex bundled Python, or a Python environment with those packages.
Pinned PDFs and the reviewed JSON are the inputs. Renders are cached by PDF hash.
"""
from pathlib import Path
from html import escape
import base64
import hashlib
import io
import json
import math
import subprocess
import textwrap
from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs/moneybee-slide-factsheets.json'
CACHE = ROOT / 'tmp/pdfs/moneybee-factsheets'
COLORS = ['#ffce79', '#ffb23e', '#f79816', '#e57526', '#a75924']


def e(value):
    return escape(str(value), quote=True)


def image_uri(path, crop=None):
    with Image.open(path) as source:
        image = source.convert('RGB')
        if crop:
            w, h = image.size
            image = image.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(crop)))
        out = io.BytesIO()
        image.save(out, format='PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(out.getvalue()).decode()


def svg_text(x, y, label, width=28, size=16, anchor='middle', fill='#222', bold=False):
    lines = textwrap.wrap(str(label), width=width, break_long_words=False) or ['']
    spans = ''.join(f'<tspan x="{x}" dy="{0 if i == 0 else size * 1.3}">{e(line)}</tspan>' for i, line in enumerate(lines))
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{fill}" font-size="{size}" font-weight="{600 if bold else 400}">{spans}</text>'


def svg(body, title, height=420):
    return f'<svg viewBox="0 0 900 {height}" role="img" aria-label="{e(title)}" xmlns="http://www.w3.org/2000/svg"><title>{e(title)}</title>{body}</svg>'


def visual_html(v, slide, image_path):
    kind, title = v['kind'], v['title']
    body = ''
    caption = 'Reconstructed from the source labels. Diagram dimensions are illustrative.'
    if kind == 'pyramid':
        for i, (tier, label) in enumerate(v['labels']):
            y = 20 + i * 75
            top = 0 if i == 0 else 38 + i * 38
            bottom = 38 + (i + 1) * 38
            body += f'<polygon points="{240-top},{y} {240+top},{y} {240+bottom},{y+66} {240-bottom},{y+66}" fill="{COLORS[i]}"/>'
            body += svg_text(240, y + 49, tier, size=19, bold=True)
            body += f'<path d="M{240+bottom} {y+50} H520" stroke="#a7a198" stroke-dasharray="3 4"/>'
            body += svg_text(540, y + 39, label, width=34, anchor='start', size=17)
        content = svg(body, title)
    elif kind in ('bars', 'grouped-bars'):
        t = slide['tables'][v['table']]
        rows = t['rows']
        series = len(t['headers']) - 1
        maximum = max(float(n) for r in rows for n in r[1:]) * 1.15
        bottom, area = 320, 230
        for i in range(5):
            value = maximum * i / 4
            y = bottom - area * i / 4
            body += f'<path d="M65 {y} H860" stroke="#e6e2da"/>' + svg_text(53, y + 5, f'{value:.0f}', anchor='end', size=12)
        group = 770 / len(rows)
        bw = min(65, group / (series + 1.5))
        for i, row in enumerate(rows):
            center = 75 + group * (i + .5)
            for j, value in enumerate(row[1:]):
                h = float(value) / maximum * area
                x = center + (j - series / 2) * bw
                body += f'<rect x="{x}" y="{bottom-h}" width="{bw-5}" height="{h}" fill="{COLORS[min(j+1,4)]}"/>'
                body += svg_text(x + (bw - 5) / 2, bottom - h - 9, value, size=14)
            body += svg_text(center - 2, 350, row[0], width=18, size=14)
        if series > 1:
            for j, name in enumerate(t['headers'][1:]):
                x = 255 + j * 170
                body += f'<rect x="{x}" y="20" width="12" height="12" fill="{COLORS[j+1]}"/>' + svg_text(x + 22, 31, name, anchor='start', size=15)
        content = svg(body, title)
        caption = 'Reconstructed from the labelled values. Bars share a linear scale starting at zero; the complete data table follows.'
    elif kind == 'wealth':
        for i, value in enumerate(v['values']):
            x = 150 + i * 390
            height = value / max(v['values']) * 280
            body += f'<rect x="{x}" y="{330-height}" width="155" height="{height}" fill="url(#wealth-{i})"/>'
            color = '#ef8d29' if i == 0 else '#252525'
            body += f'<defs><pattern id="wealth-{i}" patternUnits="userSpaceOnUse" width="10" height="12"><path d="M0 2 H10" stroke="{color}" stroke-width="3"/></pattern></defs>'
            label = 'Rs. 2.885 crore' if i == 0 else 'Rs. 59.7 lakh'
            body += svg_text(x + 77, 330 - height - 20, label, size=25, bold=True)
            body += svg_text(x + 77, 365, v['labels'][i], size=18)
        body += '<path d="M90 330 H810" stroke="#ccc"/>'
        content = svg(body, title)
        caption = 'Added visual using the stated ending values, 1 August 2007 to 31 July 2026. Equal Rs. 10 lakh starts. Ending-value ratio is 4.83×, calculated as 28.85 ÷ 5.97. This is historical PMS performance, not a forecast.'
    elif kind == 'risk':
        labels = v['labels']
        for i, label in enumerate(labels):
            start, end = -math.pi / 2 + i * math.pi / 4, -math.pi / 2 + (i + 1) * math.pi / 4
            cx, cy, outer, inner = 190, 220, 170, 88
            points = [(cx + r * math.cos(t), cy + r * math.sin(t)) for r, t in [(outer,start),(outer,end),(inner,end),(inner,start)]]
            p = points
            body += f'<path d="M{p[0][0]} {p[0][1]} A{outer} {outer} 0 0 1 {p[1][0]} {p[1][1]} L{p[2][0]} {p[2][1]} A{inner} {inner} 0 0 0 {p[3][0]} {p[3][1]} Z" fill="{COLORS[i]}" stroke="white" stroke-width="4"/>'
            mid=(start+end)/2
            body += svg_text(cx+130*math.cos(mid),cy+130*math.sin(mid)+6,str(i+1).zfill(2),size=21)
            body += svg_text(445,90+i*86,label,anchor='start',size=23)
        content=svg(body,title,440)
    elif kind in ('radial','structure'):
        labels=v['labels']
        points=[(200,75),(700,75),(170,240),(730,240),(220,415),(680,415)]
        for i,(label,(x,y)) in enumerate(zip(labels,points)):
            body += f'<path d="M450 245 L{x} {y+15}" stroke="#d0c8bd" stroke-width="2"/>'
            body += f'<rect x="{x-145}" y="{y-30}" width="290" height="90" rx="8" fill="{COLORS[i%5]}"/>'
            body += svg_text(x,y+4,label,width=27,size=17)
        body += '<rect x="320" y="190" width="260" height="110" rx="10" fill="#252525"/>'
        body += svg_text(450,236,'Flyingbee Investment Fund' if kind=='structure' else 'Moneybee',width=23,size=20,fill='white',bold=True)
        content=svg(body,title,500)
        if kind=='structure': caption='Six counterparties and their roles. Lines show relationships; the table below preserves all 12 source directions and service/fee labels.'
    elif kind == 'steps':
        content='<ol class="steps">'+''.join(f'<li><span>{i+1:02d}</span><p>{e(label)}</p></li>' for i,label in enumerate(v['labels']))+'</ol>'
        caption='Source sequence preserved. Complete activities and qualifications remain in the facts and tables.'
    elif kind == 'source-crop':
        content=f'<img class="chart-source" src="{image_uri(image_path,v["crop"])}" alt="{e(title)}">'
        caption='Original chart retained as an image. The PDF supplies no underlying price-history dataset; a synthetic line has not been substituted.'
    else:
        raise ValueError(f'Unknown visual type: {kind}')
    return f'<figure class="visual"><h3>{e(title)}</h3>{content}<figcaption>{e(caption)}</figcaption></figure>'


def table_html(t):
    head=''.join(f'<th scope="col">{e(x)}</th>' for x in t['headers'])
    rows=''.join('<tr>'+''.join(f'<{"th scope=\"row\"" if i==0 else "td"}>{e(x)}</{"th" if i==0 else "td"}>' for i,x in enumerate(r))+'</tr>' for r in t['rows'])
    return f'<div class="table-wrap" tabindex="0" role="region" aria-label="{e(t["title"])}"><table><caption>{e(t["title"])}</caption><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>'


CSS = '''
:root{font-family:Arial,Helvetica,sans-serif;color:#24231f;background:#f6f5f1;font-size:16px;line-height:1.55;--line:#dedbd2;--orange:#c36113}*{box-sizing:border-box}body{margin:0}a{color:inherit;text-decoration-thickness:1px;text-underline-offset:3px}button,input,select{font:inherit}button,select{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #bf5a0c;outline-offset:3px}header{padding:45px 5vw 32px;border-bottom:1px solid var(--line);background:#fff}header .kicker{color:var(--orange);font-size:12px;letter-spacing:.12em;text-transform:uppercase}h1{font-size:clamp(30px,4vw,52px);font-weight:500;letter-spacing:-.035em;line-height:1.12;margin:12px 0 20px}header p{max-width:790px;color:#625f55;margin:8px 0}header .stats{display:flex;gap:28px;margin-top:24px;font-size:14px}.stats strong{font-size:22px;margin-right:6px}.shell{display:grid;grid-template-columns:285px minmax(0,1fr);max-width:1800px;margin:auto}aside{position:sticky;top:0;height:100vh;overflow:auto;border-right:1px solid var(--line);padding:24px 18px;background:#faf9f6}.controls label{display:block;font-size:12px;font-weight:600;margin-bottom:5px}.controls input,.controls select{width:100%;border:1px solid #c9c5bb;border-radius:5px;padding:10px;background:white;margin-bottom:12px}.controls button,.print{border:1px solid #c9c5bb;padding:8px 12px;border-radius:5px;background:white}.controls .count{font-size:12px;color:#666;margin:12px 0 22px}nav h2{font-size:12px;color:#856e50;margin:24px 0 10px;text-transform:uppercase;letter-spacing:.05em}nav a{display:flex;gap:9px;font-size:12px;line-height:1.4;padding:7px 5px;text-decoration:none;border-radius:4px}nav a:hover{background:#eee9dd}nav a span{color:#9a774c;min-width:19px}main{min-width:0;padding:0 40px 80px}.deck-title{font-size:23px;letter-spacing:-.02em;font-weight:500;padding:35px 0 15px;border-bottom:1px solid var(--line)}article{scroll-margin-top:20px;padding:38px 0 46px;border-bottom:1px solid var(--line)}article .page-label{color:#9c5d22;font-size:12px;letter-spacing:.08em;text-transform:uppercase}article h2{font-size:28px;line-height:1.2;letter-spacing:-.025em;font-weight:500;margin:8px 0 24px}.overview{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(260px,.85fr);gap:30px;align-items:start}.facts{margin:0;padding-left:20px}.facts li{margin:0 0 13px;padding-left:3px}.source{margin:0}.source button{display:block;padding:0;border:1px solid #ddd;background:white;width:100%;cursor:zoom-in}.source img{width:100%;height:auto;display:block}.source figcaption{font-size:12px;color:#736e64;margin-top:9px}.visual-note{font-size:13px;color:#655d51;background:#eeeae1;padding:14px 16px;margin-top:16px}.notes{border-left:3px solid #bf6f24;padding:10px 18px;margin:23px 0;background:#fff1df;font-size:14px}.notes p{margin:5px 0}.notes strong{font-size:11px;text-transform:uppercase;letter-spacing:.06em}.visual{margin:25px 0;padding:26px;background:white;border:1px solid var(--line);border-radius:5px}.visual h3{margin:0 0 15px;font-size:17px;font-weight:500}.visual svg{display:block;width:100%;max-height:560px;font-family:Arial,sans-serif}.visual figcaption{font-size:12px;color:#6b655a;max-width:800px;margin:10px 0 0}.chart-source{display:block;width:100%;height:auto}.table-wrap{overflow-x:auto;margin:26px 0;border:1px solid var(--line);border-radius:4px;background:white}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.45;text-align:left}caption{text-align:left;padding:13px 15px;font-size:13px;font-weight:600;background:#eee9de}td,th{padding:11px 14px;vertical-align:top;border-bottom:1px solid #e7e4dc;min-width:95px}thead{background:#faf5e9}th{font-weight:500}tbody tr:last-child>*{border-bottom:0}tbody tr:nth-child(even){background:#fafaf7}details{border-top:1px solid var(--line);padding:15px 0;margin-top:20px}summary{cursor:pointer;font-size:14px;color:#625749}.source-text{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.65 Arial,sans-serif;background:#fff;padding:22px;margin-top:15px}.footnotes{font-size:13px;line-height:1.6;padding:18px;background:#eeece5;margin-top:20px}.footnotes p{white-space:pre-line}.footnotes h3{font-size:13px;margin:0 0 10px}.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));list-style:none;padding:0;gap:12px}.steps li{border-top:3px solid #ed9c41;padding:14px 12px;background:#fbf6ed}.steps span{font-size:12px;color:#9b641f}.steps p{font-size:14px;margin:8px 0}.empty{padding:50px;font-size:20px}dialog{border:0;padding:15px;max-width:96vw;width:1500px;max-height:94vh;overflow:auto;background:#f5f3ed}dialog::backdrop{background:#16130de0}dialog img{display:block;width:100%;height:auto}dialog button{display:block;margin:0 0 12px auto;padding:8px 20px;border:1px solid #bbb;background:white;border-radius:4px}footer{padding:25px 0;font-size:12px;color:#777;overflow-wrap:anywhere}.skip{position:absolute;left:-9999px}.skip:focus{left:15px;top:10px;background:white;padding:10px;z-index:10}[hidden]{display:none!important}
@media(max-width:1100px){.shell{grid-template-columns:245px minmax(0,1fr)}main{padding:0 24px 60px}.overview{grid-template-columns:1fr}.source{max-width:540px}.source button{max-width:440px}}@media(max-width:700px){header{padding:30px 20px}.shell{display:block}aside{position:relative;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:18px 20px}.controls{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}.controls .count{margin:8px 0}nav{max-height:210px;overflow:auto;border-top:1px solid var(--line);margin-top:10px}nav h2{margin-top:12px}main{padding:0 18px 40px}article{padding:28px 0}article h2{font-size:25px}.visual{padding:14px}.visual svg{min-width:650px}.visual{overflow-x:auto}.overview{gap:20px}.stats{flex-wrap:wrap;gap:12px!important}.facts{font-size:15px}}
@media print{@page{size:A4;margin:14mm}body{background:white;font-size:10pt}header{padding:0 0 15px}h1{font-size:27pt}aside,.print,.skip,dialog,.empty{display:none!important}.shell{display:block}main{padding:0}article,article[hidden],.deck-title[hidden]{display:block!important}article{break-before:page;border:0;padding:0}.overview{display:block}.source{max-width:100%;margin-top:15px}.source button{max-width:100%;border:0}.source img{max-height:75mm;object-fit:contain}.visual{break-inside:avoid;padding:8px}.visual svg{max-height:90mm;min-width:0}.table-wrap{overflow:visible}table{font-size:9pt}td,th{padding:5px;min-width:0}details .source-text{display:block;white-space:pre-wrap;font-size:8pt;padding:0}details{break-before:page}summary{font-weight:bold}.notes,.footnotes{font-size:9pt}.deck-title{break-before:page}.source-text{background:white}.visual-note{font-size:9pt}tr{break-inside:avoid}}
'''

JS = '''
const articles=[...document.querySelectorAll('article')];
const links=[...document.querySelectorAll('nav a')];
const query=document.querySelector('#search');
const deck=document.querySelector('#deck');
const count=document.querySelector('#count');
function filter(){
 const term=query.value.trim().toLocaleLowerCase();
 let shown=0;
 for(const article of articles){
  const visible=(!deck.value||article.dataset.deck===deck.value)&&(!term||article.textContent.toLocaleLowerCase().includes(term));
  article.hidden=!visible;if(visible)shown++;
 }
 for(const link of links)link.hidden=document.getElementById(link.hash.slice(1)).hidden;
 for(const heading of document.querySelectorAll('.deck-title'))heading.hidden=!articles.some(a=>!a.hidden&&a.dataset.deck===heading.dataset.deck);
 for(const heading of document.querySelectorAll('nav h2'))heading.hidden=!articles.some(a=>!a.hidden&&a.dataset.deck===heading.dataset.deck);
 count.textContent=shown+' of 49 slides';document.querySelector('#empty').hidden=shown!==0;
}
query.addEventListener('input',filter);deck.addEventListener('change',filter);
document.querySelector('#reset').addEventListener('click',()=>{query.value='';deck.value='';filter();});
const dialog=document.querySelector('dialog');
for(const button of document.querySelectorAll('.source button'))button.addEventListener('click',()=>{
 const image=button.querySelector('img');const enlarged=dialog.querySelector('img');enlarged.src=image.src;enlarged.alt=image.alt;dialog.showModal();
});
dialog.querySelector('button').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
let opened=[];
window.addEventListener('beforeprint',()=>{opened=[...document.querySelectorAll('details')].map(x=>x.open);document.querySelectorAll('details').forEach(x=>x.open=true);});
window.addEventListener('afterprint',()=>document.querySelectorAll('details').forEach((x,i)=>x.open=opened[i]));
document.querySelector('#print').addEventListener('click',()=>window.print());
function revealHash(){const target=document.getElementById(location.hash.slice(1));if(target?.tagName==='ARTICLE'&&target.hidden){query.value='';deck.value='';filter();target.scrollIntoView();}}
window.addEventListener('hashchange',revealHash);revealHash();
'''


def main():
    data=json.loads(DATA.read_text())
    CACHE.mkdir(parents=True,exist_ok=True)
    sections=[]; nav=[]; md=['# Moneybee presentation factsheets','',data['sourceStatus'],'','49 slides: 32 Group Profile, 17 Flyingbee. Original page order retained.','']
    for deck in data['decks']:
        source=ROOT/deck['source']
        assert hashlib.sha256(source.read_bytes()).hexdigest()==deck['sha256'],f'Source changed: {source}'
        reader=PdfReader(source)
        assert len(reader.pages)==len(deck['slides'])
        render_key=CACHE/(deck['id']+'.sha256')
        if not render_key.exists() or render_key.read_text()!=deck['sha256']:
            subprocess.run(['pdftoppm','-scale-to','1600','-png',str(source),str(CACHE/deck['id'])],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
            render_key.write_text(deck['sha256'])
        nav.append(f'<h2 data-deck="{deck["id"]}">{e(deck["title"])}</h2>')
        sections.append(f'<h2 class="deck-title" data-deck="{deck["id"]}">{e(deck["title"])}</h2>')
        md += ['## '+deck['title'],'','Source: `'+deck['source']+'`','SHA-256: `'+deck['sha256']+'`','']
        for expected,s in enumerate(deck['slides'],1):
            assert s['page']==expected and s['checkedAgainstRenderedPage']
            assert s['sourceText']==reader.pages[expected-1].extract_text(),f'Text mismatch on {deck["id"]} {expected}'
            sid=deck['id']+'-p'+str(s['page'])
            image_path=CACHE/f'{deck["id"]}-{s["page"]:02d}.png'
            alt=f'{deck["title"]}, original slide {s["page"]}: {s["title"]}'
            nav.append(f'<a href="#{sid}"><span>{s["page"]:02d}</span>{e(s["title"])}</a>')
            facts=''.join('<li>'+e(f)+'</li>' for f in s['facts'])
            notes=''
            if s['reviewNotes']: notes='<div class="notes"><strong>Source review</strong>'+''.join('<p>'+e(n)+'</p>' for n in s['reviewNotes'])+'</div>'
            visuals=''.join(visual_html(v,s,image_path) for v in s['visuals'])
            tables=''.join(table_html(t) for t in s['tables'])
            transcription=''
            if s['imageTranscription']: transcription='<h3>Text recovered from images</h3><ul>'+''.join('<li>'+e(t)+'</li>' for t in s['imageTranscription'])+'</ul>'
            footnotes=''
            if s['footnotes']: footnotes='<div class="footnotes"><h3>Source footnotes and qualifications</h3>'+''.join('<p>'+e(t)+'</p>' for t in s['footnotes'])+'</div>'
            sections.append(f'''<article id="{sid}" data-deck="{deck['id']}">
<div class="page-label">{e(deck['title'])} / Slide {s['page']:02d}</div><h2>{e(s['title'])}</h2>
<div class="overview"><ul class="facts">{facts}</ul><figure class="source"><button type="button" aria-label="Enlarge original slide {s['page']} from {e(deck['title'])}"><img loading="lazy" width="1600" height="900" src="{image_uri(image_path)}" alt="{e(alt)}"></button><figcaption>Original slide {s['page']}. Select to enlarge.</figcaption><div class="visual-note">{e(s['visualDescription'])}</div></figure></div>
{notes}{visuals}{tables}{transcription}{footnotes}<details><summary>Complete source text · slide {s['page']}</summary><div class="source-text">{e(s['sourceText'])}</div></details></article>''')
            md += [f'### Slide {s["page"]:02d}. {s["title"]}','']+['- '+f for f in s['facts']]+['','Visual inventory: '+s['visualDescription'],'']
            for t in s['tables']:
                md += ['#### '+t['title'],'','| '+' | '.join(map(str,t['headers']))+' |','| '+' | '.join('---' for _ in t['headers'])+' |']
                md += ['| '+' | '.join(str(x).replace('|','\\|') for x in r)+' |' for r in t['rows']]+['']
            for v in s['visuals']: md += ['Visual treatment: '+v['title']+'; '+v['kind']+'.','']
            if s['reviewNotes']: md += ['Source review: '+n for n in s['reviewNotes']]+['']
            if s['imageTranscription']: md += ['#### Text recovered from images','']+['- '+x for x in s['imageTranscription']]+['']
            if s['footnotes']: md += ['#### Source footnotes and qualifications','']+s['footnotes']+['']
            md += ['<details>','<summary>Complete source text</summary>','','```text',s['sourceText'],'```','','</details>','']
    options=''.join(f'<option value="{d["id"]}">{e(d["title"])}</option>' for d in data['decks'])
    hashes=''.join(f'<p>{e(d["title"])} · SHA-256 {e(d["sha256"])}</p>' for d in data['decks'])
    html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Moneybee · Presentation factsheets</title><style>{CSS}</style></head><body>
<a class="skip" href="#main">Skip to factsheets</a><header><div class="kicker">Moneybee / Source reference / September 2026</div><h1>Presentation factsheets</h1><p>Every slide from the April Group Profile and August Flyingbee presentation, with source images, facts, tables and diagrams.</p><p>Client-supplied, dated claims. Internal working reference, not approved website copy. Original confidentiality notices and disclosures are retained.</p><div class="stats"><span><strong>49</strong> slides</span><span><strong>32</strong> Group Profile</span><span><strong>17</strong> Flyingbee</span><button class="print" id="print">Print all slides</button></div></header>
<div class="shell"><aside><div class="controls"><div><label for="search">Search slides</label><input id="search" type="search" placeholder="Company, figure or topic"></div><div><label for="deck">Presentation</label><select id="deck"><option value="">Both presentations</option>{options}</select></div><button id="reset">Clear filters</button><p class="count" id="count" role="status">49 of 49 slides</p></div><nav aria-label="Slide index">{''.join(nav)}</nav></aside><main id="main"><p class="empty" id="empty" hidden>No slides match this search.</p>{''.join(sections)}<footer><p>Reviewed against both pinned PDFs on 13 September 2026. Full source text is preserved, including original wording and typographical errors. Diagrams are readable reconstructions unless labelled as original images.</p>{hashes}</footer></main></div><dialog aria-label="Original slide"><button type="button">Close original slide</button><img alt=""></dialog><script>{JS}</script></body></html>'''
    (ROOT/'Moneybee-presentation-factsheets.html').write_text(html)
    (ROOT/'docs/moneybee-slide-factsheets.md').write_text('\n'.join(md)+'\n')
    print(json.dumps({'slides':sum(len(d['slides']) for d in data['decks']),'tables':sum(len(s['tables']) for d in data['decks'] for s in d['slides']),'visuals':sum(len(s['visuals']) for d in data['decks'] for s in d['slides']),'htmlBytes':len(html.encode()),'sourceTextChecks':'49/49 exact matches','sourceHashes':'2/2 exact matches'}))

if __name__=='__main__':
    main()
