import numpy as np
W,H=736,920
CARD=(46.8,279.7,641.1,360.1)
G1=(103.83,368.34); G2=(312.33,367.33); G3=(520.5,367.5)
def glyph_triangles(cx,cy,n=7,r=16.06,side=10.4,fill='#F9F9F9'):
    R=side/np.sqrt(3); o=[]
    for k in range(n):
        a=np.radians(360/n*k); px,py=cx+r*np.sin(a),cy-r*np.cos(a)
        pts=[(px+R*np.sin(a+np.radians(120*i)),py-R*np.cos(a+np.radians(120*i))) for i in range(3)]
        o.append('<path d="M%s Z"/>'%' L'.join('%.2f %.2f'%p for p in pts))
    return f'<g fill="{fill}">'+''.join(o)+'</g>'
def glyph_orbit(cx,cy,ring=19.75,sw=1.66,disc=11.0,dot=2.9,dot_ang=121,dot_r=19.5,col='#F9F9F9'):
    a=np.radians(dot_ang)
    return (f'<g><circle cx="{cx}" cy="{cy}" r="{ring}" fill="none" stroke="{col}" stroke-width="{sw}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{disc}" fill="{col}"/>'
            f'<circle cx="{cx+dot_r*np.sin(a):.2f}" cy="{cy-dot_r*np.cos(a):.2f}" r="{dot}" fill="{col}"/></g>')
def glyph_burst(cx,cy,n=12,hub=4.6,r0=5.5,r1=16.6,tip=18.4,tipr=1.8,sw=1.8,col='#F9F9F9'):
    o=[f'<g fill="none" stroke="{col}" stroke-width="{sw}"><circle cx="{cx}" cy="{cy}" r="{hub}"/>']
    for k in range(n):
        a=np.radians(360/n*k); s,c=np.sin(a),-np.cos(a)
        o.append(f'<path d="M{cx+r0*s:.2f} {cy+r0*c:.2f} L{cx+r1*s:.2f} {cy+r1*c:.2f}"/>')
        o.append(f'<circle cx="{cx+tip*s:.2f}" cy="{cy+tip*c:.2f}" r="{tipr}"/>')
    return ''.join(o)+'</g>'
HEAD=[(83,[['Gender Identity,'],['Expression &amp; Sexuality'],['as a Source of ',('Joy',)]]),
      (291,[['Space is a'],[('Collective',)],['Commons']]),
      (499.5,[['Artificial Intelligence'],[('Enhances',),' Life'],['(Including its Own)']])]
BODY=[(83,[["All gender identities and expressions (&amp; none), and all sexual","orientations (&amp; none) should be experienced as a joy in the","absence of exclusion, exploitation or violence."],
          ["The LGBTQIA+ experience is absent and neglected in the","SDGs. This caused a tension in developing the AAGs – as","we cleaved closely to the SDGs but know and commit to the","LGBTQIA+ experience and rights being fully accounted for","and supported. Therefore, we propose this additional AAG","on gender identity, expression and sexual orientation."]]),
      (291,[["The resources and wonder of space beyond the earth's","atmosphere should be held as collective right and property","of all humanity. The benefits accruing to those institutions","and individuals able to access space should be distributed."],
           ["At the time of the SDG adoption, billionaires did not yet","dominate space exploitation. The Outer Space Treaty of 1967","places the Moon, the planets, and other celestial bodies under","international law, however in reality, the benefits of space","exploration and exploitation are held inequitably. Therefore,","we propose this additional AAG on equitable benefit and","protection of space."]]),
      (499.5,[["AI should always be programmed for the benefit of life.","AI algorithms should be transparent and independently","testable – especially in high-consequence scenarios such","as defence, healthcare, policing and justice."],
             ["Artificial Intelligence algorithms already impact daily lives","(and in the case of weapons systems – end lives). The","moral compass of AI is, so far, dependent upon the human","programming them and the data models they curate to","train them, with growing urgency for oversight."],
             ["The possibilities for AI extend much further, perhaps","even to sentience, at which point AI welfare should also","be considered."]])]
HEAD_BASE=[417,436,455]; BODY_BASE=486; BODY_LH=7.1; PARA_GAP=5.6
def text_block(font='Inter Tight',hs=16.8,bs=7.3,ink='#F9F9F9',body_ink='#E6E6E6'):
    o=[f'<g fill="{ink}" font-family="{font}, sans-serif" font-size="{hs}" letter-spacing="-0.2">']
    for x,lines in HEAD:
        for i,parts in enumerate(lines):
            spans=''.join(f'<tspan font-style="italic">{p[0]}</tspan>' if isinstance(p,tuple) else p for p in parts)
            o.append(f'<text x="{x}" y="{HEAD_BASE[i]}">{spans}</text>')
    o.append('</g>')
    o.append(f'<g fill="{body_ink}" font-family="{font}, sans-serif" font-size="{bs}">')
    for x,paras in BODY:
        y=BODY_BASE
        for p in paras:
            for line in p: o.append(f'<text x="{x}" y="{y:.1f}">{line}</text>'); y+=BODY_LH
            y+=PARA_GAP
    o.append('</g>')
    o.append(f'<g fill="{ink}" font-family="{font}, sans-serif" font-size="9.4" font-weight="500"><text x="57" y="296" letter-spacing="0.2">FUTERRA</text><text x="57" y="631" letter-spacing="0.6">97</text></g>')
    return ''.join(o)
def svg(text=True):
    x,y,w,h=CARD
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       f'<rect width="{W}" height="{H}" fill="#19171A"/>',f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#222222"/>',
       glyph_triangles(*G1), glyph_orbit(*G2), glyph_burst(*G3),
       '<circle cx="672.9" cy="294.7" r="1.9" fill="#F0F0F0"/>',
       '<path d="M675.6 623.2 L678.2 626.2 M675.6 623.2 L673 626.2 M675.6 623.4 L675.6 629.4" stroke="#C8C8C8" stroke-width="1.2" fill="none"/>']
    if text: o.append(text_block())
    o.append('</svg>'); return '\n'.join(o)
if __name__=='__main__':
    open('replica.svg','w').write(svg()); open('work/replica_notext.svg','w').write(svg(False))
