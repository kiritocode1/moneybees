import sys; sys.path.insert(0,'work')
from common import *
P=np.load('work/polar.npy'); r=np.arange(0,420,0.5)
S=np.deg2rad(22.5)
names=['Happiness','Awe','Admiration','Surprise','Sadness','Fear','Anger','Anticipation']
def boundary(R,rc,h,d):
    # radius of the rounded-sector boundary at local angle d (rad, from bisector), symmetric
    d=abs(d); a=S-d  # work in side-local frame: rotate so side ray is at angle 0, wedge interior at negative
    # local coords: side ray along +x, inward normal -y. Fillet centre:
    s=np.sqrt((R-rc)**2-(h+rc)**2); fx,fy=s,-(h+rc)
    ang_f=np.arctan2(-fy,fx)            # angle of fillet centre measured into wedge from side
    tl=np.arctan2(h,s)                  # angle of line tangent point
    if a>=ang_f: return R
    if a<=tl:  # on the side line: y=-h -> r=h/sin(a)
        return h/np.sin(a) if a>0 else np.inf
    ux,uy=np.cos(a),-np.sin(a)
    b=ux*fx+uy*fy; c=fx*fx+fy*fy-rc*rc
    return b+np.sqrt(b*b-c)
def apex(rho,h,d):
    # apex rounded with circle radius rho tangent to both sides (inset h): centre on bisector at (rho+h)/sin(S)
    x0=(rho+h)/np.sin(S); d=abs(d)
    ux,uy=np.cos(d),np.sin(d); b=ux*x0; c=x0*x0-rho*rho
    disc=b*b-c
    if disc<0: return np.nan
    return b-np.sqrt(disc)
def crossings(prof,lo_hi_mid,start,stop,direction):
    mid=lo_hi_mid; out=[]
    for i in range(start,stop):
        a,b=prof[i],prof[i+1]
        if (direction<0 and a>=mid>b) or (direction>0 and a<=mid<b): out.append(r[i]+(a-mid)/(a-b)*0.5)
    return out
if __name__=='__main__':
    # apex fit over all 8 sectors
    ds=np.arange(-20.5,20.51,0.25); data=[]
    for d in ds:
        rs=[]
        for k in range(8):
            ai=int(round((22.5+45*k+d)*10))%3600; c=crossings(P[:,ai],126,0,300,+1)
            if c: rs.append(c[0])
        data.append(np.mean(rs))
    data=np.array(data)
    best=None
    for rho in np.arange(28,36,0.05):
        for h in np.arange(0.4,1.6,0.05):
            m=np.array([apex(rho,h,np.deg2rad(d)) for d in ds]); e=np.nanmean((m-data)**2)
            if best is None or e<best[0]: best=(e,rho,h)
    print('apex fit rho=%.2f h=%.2f rms=%.3f px'%(best[1],best[2],np.sqrt(best[0])), 'apex r at bisector', apex(best[1],best[2],0))
