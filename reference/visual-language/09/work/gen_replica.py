# Replica of 09-process-diagram-sheet.png (564 x 1056) from the measurements in STUDY.md.
# At this pin's scale a 1px source hairline has become a ~1.3px grey blur, so strokes are drawn
# at their apparent width/level (ring stroke 1.31px @ #ABABAB, rule 1.5px @ #C4C4C4).
W,H=564,1056
BG='#F2F2F2'; FILL='#333333'
INKLINE='stroke="#ABABAB" stroke-width="1.31" fill="none"'
DOT='stroke="#6E6E6E" stroke-width="1.3" stroke-dasharray="1.1 1.1" fill="none"'
RULE='stroke="#C4C4C4" stroke-width="1.5" fill="none"'
FONT='font-family="Noto Sans KR"'
o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',f'<rect width="{W}" height="{H}" fill="{BG}"/>']
# section rules
for y in (70.5,285.5,508.5,739.5): o.append(f'<line x1="24" y1="{y}" x2="540.5" y2="{y}" {RULE}/>')
def chev(ax,ay,dx,dy,style=INKLINE):
    return f'<polyline points="{ax-dx:.2f},{ay-dy:.2f} {ax:.2f},{ay:.2f} {ax-dx:.2f},{ay+dy:.2f}" {style}/>'
# 1 chain of five rings
o.append(f'<g {INKLINE}>'+''.join(f'<circle cx="{153.73+64.13*k:.2f}" cy="186.35" r="34.40"/>' for k in range(5))+'</g>')
# 2 venn -> dotted -> node -> chevron -> dotted box -> chevron -> square
o.append(f'<g {INKLINE}><circle cx="125.45" cy="388.00" r="32.34"/><circle cx="100.72" cy="430.27" r="32.34"/><circle cx="150.22" cy="430.28" r="32.34"/></g>')
o.append(f'<circle cx="125.5" cy="415.4" r="1.2" fill="{FILL}"/>')
Y2=415.65
o.append(f'<g {DOT}><line x1="126.5" y1="{Y2}" x2="214.0" y2="{Y2}"/><line x1="281.1" y1="{Y2}" x2="326.1" y2="{Y2}"/><line x1="383.9" y1="{Y2}" x2="428.7" y2="{Y2}"/>'
         f'<rect x="326.14" y="367.89" width="57.77" height="95.37"/></g>')
o.append(chev(309.5,Y2,9.0,8.2)+chev(410.5,Y2,9.0,8.2))
o.append(f'<circle cx="247.58" cy="415.59" r="33.56" fill="{FILL}"/><rect x="428.74" y="383.37" width="64.07" height="64.07" fill="{FILL}"/>')
# 3 targeting ring, arrows, edm box, feedback
Y3=625.84; r3=26.43
o.append(f'<g {INKLINE}>'+''.join(f'<circle cx="{x}" cy="{y}" r="{r3}"/>' for x,y in [(83.71,Y3),(208.81,Y3),(342.01,671.87),(437.23,Y3),(481.71,Y3)])+'</g>')
o.append(f'<circle cx="208.86" cy="{Y3}" r="65.22" {DOT}/>')
o.append(f'<rect x="298.7" y="565.5" width="86.61" height="144.83" {DOT}/>')
o.append(f'<circle cx="342.01" cy="{Y3}" r="26.46" fill="{FILL}"/>')
o.append(f'<g {INKLINE}><line x1="110.1" y1="{Y3}" x2="179.5" y2="{Y3}"/><line x1="235.2" y1="{Y3}" x2="312.5" y2="{Y3}"/><line x1="410.8" y1="{Y3}" x2="372.5" y2="{Y3}"/>'
         f'<polyline points="315.6,671.85 209.1,671.85 209.1,656.2"/></g>')
o.append(chev(179.5,Y3,5.0,4.6)+chev(312.5,Y3,5.0,4.6)+chev(372.5,Y3,-5.0,4.6))
o.append(f'<polyline points="204.5,661 209.1,656.2 213.7,661" {INKLINE}/>')
# 4 half-rings on a baseline
CX,CY=281.10,916.03
o.append(f'<line x1="36" y1="915" x2="526" y2="915" {RULE}/>')
o.append(f'<g {RULE}><polyline points="{CX},796.5 425.06,796.5 425.06,915"/><line x1="{CX}" y1="889.0" x2="425.06" y2="889.0"/></g>')
o.append(f'<g stroke="#6E6E6E" stroke-width="1.3" stroke-dasharray="1.17 1.17" fill="none">'+''.join(f'<path d="M{CX-r:.2f} {CY} A{r} {r} 0 0 1 {CX+r:.2f} {CY}"/>' for r in (57.91,88.74,119.59))+'</g>')
o.append(f'<path d="M{CX-27.2:.2f} {CY} A27.2 27.2 0 0 1 {CX+27.2:.2f} {CY} Z" fill="{FILL}"/>')
o.append(f'<line x1="261.9" y1="896.9" x2="186.6" y2="820.6" stroke="#939393" stroke-width="1.3"/><path d="M184.3 818.3 L190.4 820.9 L186.9 824.4 Z" fill="{FILL}"/>')
# text (masked out of the metrics)
t=[f'<g fill="#2B2B2B" {FONT}>',
   '<text x="282" y="46.5" font-size="14.2" font-weight="700" text-anchor="middle">Brand Communication Process</text>']
heads=[(94,'1','Research &amp; Analysis','조사 및 분석'),(310.5,'2','Brand concept','브랜드 컨셉'),(533,'3','Brand Plan','브랜드 설계'),(764,'4','Brand Experience','브랜드 경험')]
for y,n,en,ko in heads:
    t.append(f'<text x="36" y="{y}" font-size="12.5" font-weight="700">{n}</text><text x="51.5" y="{y}" font-size="12.2" font-weight="400">{en}</text>'
             f'<text x="53" y="{y+13.5}" font-size="8" font-weight="500">{ko}</text>')
labels1=[('내부 데이터','수집'),('내부 데이터','분석'),('유학 시장의','흐름 조사'),('외부 데이터','수집'),('외부 데이터','수집')]
for k,(a,b) in enumerate(labels1):
    x=153.73+64.13*k; t.append(f'<text x="{x:.1f}" y="184" font-size="7.4" text-anchor="middle">{a}</text><text x="{x:.1f}" y="195.5" font-size="7.4" text-anchor="middle">{b}</text>')
for x,y,a,b in [(125.45,380,'소비자','데이터'),(97,422,'내부','데이터'),(154,422,'외부','데이터')]:
    t.append(f'<text x="{x}" y="{y}" font-size="7.4" text-anchor="middle">{a}</text><text x="{x}" y="{y+12}" font-size="7.4" text-anchor="middle">{b}</text>')
t.append('<g fill="#F2F2F2" font-size="8.6" text-anchor="middle"><text x="247.6" y="413.5">Common</text><text x="247.6" y="426">Data</text><text x="460.8" y="413.5">Brand</text><text x="460.8" y="426">Concept</text><text x="342" y="629">Brand</text><text x="281.1" y="911" font-size="11" font-weight="700">1</text></g>')
for i,s in enumerate(['Story','Style','Contents','Spot']): t.append(f'<text x="355" y="{391+18.6*i:.1f}" font-size="8.6" text-anchor="middle">{s}</text>')
t.append('<text x="83.7" y="629" font-size="7.4" text-anchor="middle">소비자</text><text x="208.8" y="629" font-size="8.6" text-anchor="middle">Contents</text>'
         '<text x="208.8" y="587" font-size="8" text-anchor="middle">Targeting Spot</text><text x="342" y="586" font-size="9.2" font-weight="700" text-anchor="middle">edm</text>'
         '<text x="342" y="669" font-size="8.6" text-anchor="middle">Brand</text><text x="342" y="681" font-size="8.6" text-anchor="middle">Journal</text>'
         '<text x="437.2" y="629" font-size="8.6" text-anchor="middle">Story</text><text x="481.7" y="629" font-size="8.6" text-anchor="middle">Style</text>')
t.append('<text x="184.5" y="811" font-size="7.6" text-anchor="middle">Flexibility</text><text x="431.5" y="802.5" font-size="7.6">Brand Identity</text><text x="431.5" y="895" font-size="7.6">Brandmark</text>')
for n,y in (('4',815),('3',846),('2',877)): t.append(f'<text x="281.1" y="{y}" font-size="11" font-weight="700" text-anchor="middle">{n}</text>')
cols=[(32,'1.','Core',['Brandmark','Wordmark','Signature','Basic identity guide manual']),(168,'2.','Supporting',['Stationery','Printed materia','Interior Guide','Infographics']),
      (296,'3.','Platform',['Website','SNS','Blog','Mobile']),(432,'4.','Action',['Campaign','Promotion','Event'])]
for x,n,h,items in cols:
    t.append(f'<text x="{x}" y="944.6" font-size="10.6"><tspan font-weight="700">{n}</tspan> {h}</text>')
    for i,s in enumerate(items): t.append(f'<text x="{x}" y="{963.5+13*i:.1f}" font-size="7.4" fill="#555">{s}</text>')
t.append('</g>')
o+=t; o.append('</svg>')
open('../replica.svg','w').write('\n'.join(o))
