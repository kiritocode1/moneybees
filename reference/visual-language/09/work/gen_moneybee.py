# ../moneybee.svg: Moneybee "Our Approach" as one process sheet, in the geometry of 09.
# Carried over from STUDY.md: 564px sheet, rules x 24-540, text column x 36/51, heading baseline
# 23.5px under each rule, figure axis on x=282, ring chain r 34.40 pitch 64.13, small chevron
# 5 x +-4.6 with a 3.7px gap to its ring, half-ring radii core + k*step with core/step = 0.88,
# leaders to x=425 and labels at x=431.5, list line pitch 13px.
W,H=564,672
INK='#000000'; GREY='#9D9EA1'; ORANGE='#F6A11A'; WHITE='#FFFFFF'
SERIF='font-family="Instrument Serif"'; SANS='font-family="Rethink Sans"'; MONO='font-family="Geist Mono"'
LINE=f'stroke="{INK}" stroke-width="1" fill="none"'
DOT=f'stroke="{INK}" stroke-width="1" stroke-dasharray="1.1 1.1" fill="none"'
RULE=f'stroke="{GREY}" stroke-width="1" fill="none"'
AX=282.0
o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="Our approach: stock selection process, risk management, what we look for and what we don\'t do">',
   f'<rect width="{W}" height="{H}" fill="{WHITE}"/>',
   f'<text x="{AX}" y="46.5" {SERIF} font-size="22" text-anchor="middle" fill="{INK}">Our Approach</text>']
def stage(rule_y,n,titles):
    s=[f'<line x1="24" y1="{rule_y}" x2="540" y2="{rule_y}" {RULE}/>']
    s.append(f'<text x="36" y="{rule_y+23.5}" {SERIF} font-size="17" fill="{INK}">{n}</text>')
    for x,t in titles: s.append(f'<text x="{x}" y="{rule_y+23.5}" {SERIF} font-size="17" fill="{INK}">{t}</text>')
    return s
def chev_up(x,y):   # apex at (x,y), pointing up
    return f'<polyline points="{x-4.6:.2f},{y+5:.2f} {x:.2f},{y:.2f} {x+4.6:.2f},{y+5:.2f}" {LINE}/>'
# 1 Stock selection process: six rings, Exit is the one filled (orange) node
R1,P1=34.40,64.13
Y1=70.5+116
steps=[('SCREEN',),('SHORTLIST',),('ANALYSE',),('DECISION','MAKING'),('MONITOR',),('EXIT',)]
cx=[AX+(k-2.5)*P1 for k in range(6)]
o+=stage(70.5,'1',[(51.5,'Stock Selection Process')])
o.append(f'<circle cx="{cx[5]:.2f}" cy="{Y1}" r="{R1+0.5}" fill="{ORANGE}"/>')
o.append(f'<g {LINE}>'+''.join(f'<circle cx="{x:.2f}" cy="{Y1}" r="{R1}"/>' for x in cx[:5])+'</g>')
g=[f'<g {MONO} font-size="7.4" letter-spacing="0.4" fill="{INK}" text-anchor="middle">']
for x,lab in zip(cx,steps):
    if len(lab)==1: g.append(f'<text x="{x:.2f}" y="{Y1+2.6:.2f}">{lab[0]}</text>')
    else: g.append(f'<text x="{x:.2f}" y="{Y1-3.2:.2f}">{lab[0]}</text><text x="{x:.2f}" y="{Y1+8.4:.2f}">{lab[1]}</text>')
g.append('</g>'); o+=g
# Monitor loops back to Analyse: dotted path under the chain, solid chevron 3.7px under the ring
LOOP=Y1+R1+24; LOOP_TO=2
o.append(f'<polyline points="{cx[4]:.2f},{Y1+R1+3.7:.2f} {cx[4]:.2f},{LOOP:.2f} {cx[LOOP_TO]:.2f},{LOOP:.2f} {cx[LOOP_TO]:.2f},{Y1+R1+3.7:.2f}" {DOT}/>')
o.append(chev_up(cx[LOOP_TO],Y1+R1+3.7))
# 2 Risk management: orange core + four dotted half-rings on a baseline, leaders to labels
o+=stage(285.5,'2',[(51.5,'Risk Management')])
CORE,STEP=24.0,27.0
BASE=474.5
radii=[CORE+STEP*k for k in range(1,5)]
risks=['LIQUIDITY RISK','VALUATION RISK','MARKET RISK','CONCENTRATION RISK']
o.append(f'<line x1="36" y1="{BASE}" x2="526" y2="{BASE}" {RULE}/>')
o.append(f'<path d="M{AX-CORE} {BASE} A{CORE} {CORE} 0 0 1 {AX+CORE} {BASE} Z" fill="{ORANGE}"/>')
o.append(f'<g {DOT}>'+''.join(f'<path d="M{AX-r:.2f} {BASE} A{r} {r} 0 0 1 {AX+r:.2f} {BASE}"/>' for r in radii)+'</g>')
LX=425.0
o.append(f'<g {RULE}>'+''.join(f'<line x1="{AX}" y1="{BASE-r:.2f}" x2="{LX}" y2="{BASE-r:.2f}"/>' for r in radii)+f'<line x1="{LX}" y1="{BASE-radii[-1]:.2f}" x2="{LX}" y2="{BASE}"/></g>')
o.append(f'<g {MONO} font-size="7.4" letter-spacing="0.4" fill="{INK}">'+''.join(f'<text x="431.5" y="{BASE-r+2.6:.2f}">{t}</text>' for r,t in zip(radii,risks))+'</g>')
bands=[CORE]+radii
o.append(f'<g {SERIF} font-size="15" fill="{INK}" text-anchor="middle">'+''.join(f'<text x="{AX}" y="{BASE-(bands[k]+bands[k+1])/2+5:.2f}">{k+1}</text>' for k in range(4))+'</g>')
o.append(f'<text x="{AX}" y="{BASE-8:.2f}" {MONO} font-size="7" letter-spacing="0.4" fill="{INK}" text-anchor="middle">PORTFOLIO</text>')
# 3 What we look for / what we don't do: list columns
R3=509.5
o+=stage(R3,'3',[(51.5,'What We Look For'),(296,'What We Don&#8217;t Do')])
look=['Disproportionate beneficiaries of economic growth','Robust fundamentals','Quality management','Competitive advantage','Favourable risk-reward','Reasonable valuations']
dont=['Derivatives and F&amp;O','Trading and short-term investments','Chasing hot stocks','Impulsive investment decisions',['Following market noise or external platforms','without independent research']]
def col(x,items):
    s=[f'<g {SANS} font-size="9" fill="{INK}">']; y=R3+23.5+19
    for it in items:
        lines=it if isinstance(it,list) else [it]
        for i,l in enumerate(lines): s.append(f'<text x="{x}" y="{y:.1f}">{l}</text>'); y+=13 if i<len(lines)-1 else 0
        y+=13+4
    s.append('</g>'); return s
o+=col(51.5,look)+col(296,dont)
o.append('</svg>')
open('../moneybee.svg','w').write('\n'.join(o))
print('ring cx',[round(v,2) for v in cx],'outer r',radii[-1])
