# Build 05/moneybee.svg: the measured 05 geometry in the Moneybee system (white page, black hairlines,
# the converged line in #F6A11A ending at a plain standing figure). Steps use the docx wording.
import json
ROOT = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language'
G = json.load(open(f'{ROOT}/05/global_fit.json'))['model']
x0, y0, d, cx, yc, k, ex = (G[n] for n in ['x0', 'y0', 'd', 'cx', 'yc', 'k', 'ex'])
N = 12
curves = ''.join(
    f'<path d="M{x0:.2f},{y0 + i * d:.2f} Q{cx:.2f},{yc + k * (y0 + i * d - yc):.2f} {ex:.2f},{yc:.2f}"/>' for i in range(N))

STEPS = [
    ('Screen', 'Start with a large universe of companies using financial information, screeners, reports, news flow and team experience.'),
    ('Shortlist', 'Review management quality, fundamentals, external events and timing.'),
    ('Analyse', 'Conduct management meetings, plant visits, competitive analysis, peer comparison and financial modelling.'),
    ('Decision Making', 'Review liquidity, sector exposure, macro trends, valuation and risk-reward.'),
]
PITCH = 77.0            # measured numeral pitch
TOP = 241.0             # measured first numeral cap top
steps = []
for i, (name, desc) in enumerate(STEPS):
    t = TOP + PITCH * i
    steps.append(f'<text x="96" y="{t + 16:.1f}" font-family="Instrument Serif" font-size="22" fill="#000">0{i + 1}</text>')
    steps.append(f'<foreignObject x="122" y="{t - 3:.1f}" width="156" height="74">'
                 f'<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Instrument Serif;font-size:16px;line-height:17px;color:#000;margin:0 0 4px">{name}</div>'
                 f'<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Rethink Sans;font-size:7.6px;line-height:10.5px;color:#000;opacity:.72">{desc}</div>'
                 f'</foreignObject>')

FX, FH = 564.0, 42.0     # measured feet x and figure height (333.75 -> 375.8)
r = 0.07 * FH
fig = (f'<g fill="#000"><circle cx="{FX:.2f}" cy="{yc - FH + r:.2f}" r="{r:.2f}"/>'
       f'<rect x="{FX - 0.12 * FH:.2f}" y="{yc - 0.82 * FH:.2f}" width="{0.24 * FH:.2f}" height="{0.40 * FH:.2f}" rx="{0.07 * FH:.2f}"/>'
       f'<rect x="{FX - 0.11 * FH:.2f}" y="{yc - 0.50 * FH:.2f}" width="{0.10 * FH:.2f}" height="{0.50 * FH:.2f}"/>'
       f'<rect x="{FX + 0.01 * FH:.2f}" y="{yc - 0.50 * FH:.2f}" width="{0.10 * FH:.2f}" height="{0.50 * FH:.2f}"/></g>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="736" height="736" viewBox="0 0 736 736">
  <rect width="736" height="736" fill="#FFFFFF"/>
  <text x="119" y="146" font-family="Instrument Serif" font-size="30" fill="#000">Stock selection</text>
  {"".join(steps)}
  <g fill="none" stroke="#000" stroke-width="0.75">{curves}</g>
  <line x1="{ex - 12:.2f}" y1="{yc:.2f}" x2="{FX:.2f}" y2="{yc:.2f}" stroke="#F6A11A" stroke-width="2"/>
  {fig}
</svg>
'''
open(f'{ROOT}/05/moneybee.svg', 'w').write(svg)
print('ok')
