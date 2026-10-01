import sys; sys.path.insert(0,'work')
from common import *
from geom import wedge
c=(589.5,584.2)
names=['Happiness','Awe','Admiration','Surprise','Sadness','Fear','Anger','Anticipation']
nums=[12,10,5,12,6,4,2,5]
Rv=[361.02,321.75,282.57,360.87,277.92,219.34,167.06,282.42]; RT=391.6
RC_V=29.0; RC_T=30.0; RHO=31.5; Hh=1.15
# gradient fit (value fill), rgb = c0 + gx*x + gy*y  (lstsq over 215k value pixels)
C0=np.array([243.8934,233.9051,194.9958]); GX=np.array([-0.0206,-0.0188,0.0206]); GY=np.array([-0.0171,-0.0167,0.0195])
ang=np.radians(41.3); half=553.8
P1=np.array(c)-half*np.array([np.cos(ang),np.sin(ang)]); P2=np.array(c)+half*np.array([np.cos(ang),np.sin(ang)])
col=lambda p: C0+GX*p[0]+GY*p[1]
hexc=lambda v: '#%02X%02X%02X'%tuple(int(round(min(255,max(0,t)))) for t in v)
TRACK_OPACITY=0.295
# text: (x centre, number baseline, label baseline)
TXT={'Anticipation':(472.0,294,326),'Happiness':(705.3,294,326),'Anger':(314.8,484,516),'Awe':(864.5,484,516),
     'Fear':(314.8,674,705),'Admiration':(864.5,674,705),'Sadness':(471.5,863.5,895),'Surprise':(705.5,863,895)}
def svg(num_size=37.5,lab_size=21.4,num_w=500,lab_w=500,ink='#1A1616',text=True,font='Inter'):
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       '<defs>',
       f'<linearGradient id="fill" gradientUnits="userSpaceOnUse" x1="{P1[0]:.1f}" y1="{P1[1]:.1f}" x2="{P2[0]:.1f}" y2="{P2[1]:.1f}">',
       f'<stop offset="0" stop-color="{hexc(col(P1))}"/><stop offset="1" stop-color="{hexc(col(P2))}"/></linearGradient>',
       '</defs>',
       f'<rect width="{W}" height="{H}" fill="#232323"/>',
       f'<rect y="1171.6" width="{W}" height="{H-1171.6:.1f}" fill="#0A1015"/>',
       f'<g fill="url(#fill)" fill-opacity="{TRACK_OPACITY}">']
    for k in range(8):
        d,_=wedge(c,np.radians(45*k),np.radians(45*k+45),RT,RC_T,RHO,Hh); o.append(f'<path d="{d}"/>')
    o.append('</g><g fill="url(#fill)">')
    for k in range(8):
        d,_=wedge(c,np.radians(45*k),np.radians(45*k+45),Rv[k],RC_V,RHO,Hh); o.append(f'<path d="{d}"/>')
    o.append('</g>')
    if text:
        o.append(f'<g fill="{ink}" text-anchor="middle" font-family="{font}, sans-serif">')
        for k,n in enumerate(names):
            x,nb,lb=TXT[n]
            o.append(f'<text x="{x}" y="{nb}" font-size="{num_size}" font-weight="{num_w}">{nums[k]}</text>')
            o.append(f'<text x="{x}" y="{lb}" font-size="{lab_size}" font-weight="{lab_w}" letter-spacing="-0.5">{n}</text>')
        o.append('</g>')
    o.append('</svg>')
    return '\n'.join(o)
if __name__=='__main__':
    print('gradient',P1.round(1),hexc(col(P1)),'->',P2.round(1),hexc(col(P2)))
    open('replica.svg','w').write(svg())
    open('work/replica_notext.svg','w').write(svg(text=False))
