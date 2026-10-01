# ../moneybee.svg: the Unit8 poster system as four black bands in Moneybee's palette.
# Poster-local geometry is carried over from the measurements in STUDY.md.
import json, math, random
W,H=736,992
PW,PH=300,420
POS=[(56,56),(380,56),(56,498),(380,498)]          # measured poster origins, rounded
WHITE='#FFFFFF'; BLACK='#000000'; ORANGE='#F6A11A'; GREY='#9D9EA1'
SW=2.15                                             # ring stroke (0.72% of panel width)
CY=170.0                                            # vertical centre of the grid-type figures
o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="Portfolio, PMS and AIF, team, compounding">',
   f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']
def panel(i, word, figure):
    x,y=POS[i]
    s=[f'<g id="panel-{i+1}" transform="translate({x} {y})">',f'<rect width="{PW}" height="{PH}" fill="{BLACK}"/>']
    s+=figure
    s.append(f'<text x="20" y="31" font-family="Instrument Serif" font-size="17" fill="{WHITE}">Moneybee</text>')
    s.append(f'<text x="{PW-20}" y="29" font-family="Geist Mono" font-size="7" letter-spacing="0.4" text-anchor="end" fill="{WHITE}">0{i+1} / 04</text>')
    s.append(f'<text transform="translate({PW-22} 391.6) rotate(-90)" font-family="Geist Mono" font-size="7" letter-spacing="0.4" fill="{WHITE}">moneybee.in</text>')
    s.append(f'<text x="19" y="391.6" font-family="Instrument Serif" font-size="48" fill="{WHITE}">{word}</text>')
    s.append('</g>'); return s
# 1 portfolio: an 8 x 6 universe (pitch 30, same 240 x 180 box as the 4 x 3 reference grid); 18 picked
cols,rows,p=10,7,24.0
r=p/2-SW/2                      # centreline radius so outer edges touch, as in the reference
x0=(PW-cols*p)/2+p/2; y0=CY-rows*p/2+p/2
random.seed(7); picked=set(random.sample(range(cols*rows),18))
f1=[f'<g fill="none" stroke="{WHITE}" stroke-width="1.3">']
f1+= [f'<circle cx="{x0+(k%cols)*p:.2f}" cy="{y0+(k//cols)*p:.2f}" r="{p/2-0.65:.2f}"/>' for k in range(cols*rows) if k not in picked]
f1.append('</g>'); f1.append(f'<g fill="{ORANGE}">')
f1+= [f'<circle cx="{x0+(k%cols)*p:.2f}" cy="{y0+(k//cols)*p:.2f}" r="{p/2:.2f}"/>' for k in sorted(picked)]
f1.append('</g>')
# 2 PMS · AIF: two identical rings (r 81.72, centre distance 87.79 = the reference pair), side by side;
#   the shared lens is the one orange element
R2,D2=81.72,87.79
ax,bx=PW/2-D2/2,PW/2+D2/2
f2=[f'<defs><clipPath id="lensA"><circle cx="{ax:.2f}" cy="{CY}" r="{R2}"/></clipPath></defs>',
    f'<circle cx="{bx:.2f}" cy="{CY}" r="{R2}" fill="{ORANGE}" clip-path="url(#lensA)"/>',
    f'<g fill="none" stroke="{WHITE}" stroke-width="{SW}"><circle cx="{ax:.2f}" cy="{CY}" r="{R2}"/><circle cx="{bx:.2f}" cy="{CY}" r="{R2}"/></g>',
    f'<g font-family="Geist Mono" font-size="9" letter-spacing="0.6" fill="{WHITE}" text-anchor="middle">'
    f'<text x="{(ax-R2+bx-R2)/2:.2f}" y="{CY+3.2}">PMS</text><text x="{(ax+R2+bx+R2)/2:.2f}" y="{CY+3.2}">AIF</text></g>']
# 3 team: 3 x 2 rings, pitch 73.4; r = pitch/sqrt2 so four rings meet exactly at the two shared points
p3=73.4; r3=p3/math.sqrt(2)
cx3=[PW/2-p3,PW/2,PW/2+p3]; cy3=[CY-p3/2,CY+p3/2]
f3=[f'<g fill="none" stroke="{WHITE}" stroke-width="{SW}">']+[f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r3:.2f}"/>' for y in cy3 for x in cx3]+['</g>',
    f'<g fill="{ORANGE}">'+''.join(f'<circle cx="{(cx3[i]+cx3[i+1])/2:.2f}" cy="{CY}" r="4"/>' for i in range(2))+'</g>']
# 4 compounding: 13 rings r 73.64 stepped (-8.145,+8.155); opaque greys (N-k)/N from black to white; front ring orange
R4=json.load(open('p4rings.json')); N=len(R4)
fx,fy=582.11-379.67,645.69-499.53           # front ring centre in poster-local coords
def grey(a): v=round(a*255); return f'#{v:02X}{v:02X}{v:02X}'
f4=['<g fill="none" stroke-width="2.15">']
for k in reversed(range(N)):
    col=ORANGE if k==0 else grey((N-k)/N)
    f4.append(f'<circle cx="{fx-8.145*k:.2f}" cy="{fy+8.155*k:.2f}" r="73.64" stroke="{col}"/>')
f4.append('</g>')
o+=panel(0,'portfolio',f1)+panel(1,'PMS · AIF',f2)+panel(2,'team',f3)+panel(3,'compounding',f4)
o.append('</svg>')
open('../moneybee.svg','w').write('\n'.join(o))
print('picked',len(picked))
