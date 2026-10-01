import sys; sys.path.insert(0,'/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/work')
from figs import *
W,H=735,453
CARDS=[43.91,210.18,376.2,542.28]; CW=149.2; CT=125.5; CH=202.0; CR=4
TITLES=[['A modern alternative to','direct debit'],['A digital payment solution'],['Improved business processes'],['Payment of eInvoices']]
DESCS=[['PayTo can be used as a modern','alternative to direct debit.'],['PayTo can be used for in-app and e-','commerce transactions.'],
       ['PayTo can be used to enable more','efficient business processes.'],['PayTo can be used to support eInvoicing','so businesses get paid faster.']]
def svg(text=True):
    bg=open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/work/bg_uri.txt').read()
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       f'<image href="{bg}" x="0" y="0" width="{W}" height="{H}" preserveAspectRatio="none"/>',
       f'<rect y="452" width="{W}" height="1" fill="#C9C9C9"/>']
    for x in CARDS: o.append(f'<rect x="{x}" y="{CT}" width="{CW}" height="{CH}" rx="{CR}" fill="#4B4B4B"/>')
    o.append(cylinder(118.45,223.1,rx=21.35,ry=5.8,pitch=11.87,frame=(84.83,207.05,152.5,274.9)))
    o.append(fan(260,250.03,324.5,330.5,[-39.25,-24.88,-12.98,13.02,24.9,39.21],arrow_x=241))
    o.append(burst(450.48,248.37))
    o.append('<g transform="translate(0.5 0.5)">'+distribute((576.0,251.3),[(638.1,229.65),(659.6,251.2),(620.5,267.2)],
                        arrows=[((589,245.2),(626.2,233.2)),((589,251.3),(646.8,251.3)),((589,258.2),(608.4,263.8))])+'</g>')
    if text:
        o.append('<g font-family="Inter, sans-serif">')
        for k,x in enumerate(CARDS):
            tx=x+18.1
            for i,t in enumerate(TITLES[k]): o.append(f'<text x="{tx:.1f}" y="{155+11*i}" font-size="9.6" fill="#EDEDED">{t}</text>')
            db=155+11*(len(TITLES[k])-1)+15.5
            for i,t in enumerate(DESCS[k]): o.append(f'<text x="{tx:.1f}" y="{db+10*i:.1f}" font-size="7.2" fill="#B9B9B9">{t}</text>')
            o.append(f'<text x="{tx:.1f}" y="311.5" font-size="7.6" fill="#D2D2D2">See Use Case</text>')
            o.append(f'<rect x="{x+62.6:.1f}" y="305.3" width="5.6" height="5.6" rx="0.8" fill="none" stroke="#C8C8C8" stroke-width="0.8"/>')
        o.append('</g>')
    o.append('</svg>'); return '\n'.join(o)
if __name__=='__main__':
    open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/replica.svg','w').write(svg())
    open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/04/work/replica_notext.svg','w').write(svg(False))
