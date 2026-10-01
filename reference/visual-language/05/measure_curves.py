# Trace the 12 red curves of 05-converging-lines.png column by column and fit Beziers.
import json
import numpy as np
from PIL import Image

SRC = '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/05-converging-lines.png'
a = np.array(Image.open(SRC).convert('RGB')).astype(float)
Y = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
PAPER_Y = 0.299 * 242 + 0.587 * 239 + 0.114 * 232
ink = np.clip(PAPER_Y - Y, 0, None)  # luma drop, 146 = one px of solid #DF2914
RED_DROP = PAPER_Y - (0.299 * 223 + 0.587 * 41 + 0.114 * 20)

def peaks(x, lo=232, hi=520, thr=20):
    v = ink[lo:hi, x]
    out = []
    y = 0
    while y < len(v):
        if v[y] > thr:
            y0 = y
            while y < len(v) and v[y] > thr:
                y += 1
            # widen by one px each side to catch AA tails
            s0, s1 = max(0, y0 - 1), min(len(v), y + 1)
            seg = np.arange(s0, s1)
            w = v[s0:s1]
            out.append(((seg * w).sum() / w.sum() + lo, w.sum()))
        y += 1
    return out

tracks = {i: [] for i in range(12)}
counts = {}
for x in range(289, 420):
    p = peaks(x)
    counts[x] = len(p)
    if len(p) == 12:
        for i, (yc, mass) in enumerate(p):
            tracks[i].append((x, yc, mass))

print('columns with 12 separable crossings:', sum(1 for c in counts.values() if c == 12), 'x range',
      min(x for x, c in counts.items() if c == 12), max(x for x, c in counts.items() if c == 12))

# start points: extrapolate first samples
for i in range(12):
    t = np.array(tracks[i])
    print(i, 'first', t[0][:2].round(2), 'n', len(t))

# ---- Bezier fitting by distance minimisation (Nelder-Mead, numpy only) ----
def bez(P, n=400):
    t = np.linspace(0, 1, n)[:, None]
    if len(P) == 3:
        return (1 - t) ** 2 * P[0] + 2 * (1 - t) * t * P[1] + t ** 2 * P[2]
    return (1 - t) ** 3 * P[0] + 3 * (1 - t) ** 2 * t * P[1] + 3 * (1 - t) * t ** 2 * P[2] + t ** 3 * P[3]

def dist(P, pts):
    C = bez(P, 800)
    d = np.sqrt(((pts[:, None, :] - C[None, :, :]) ** 2).sum(-1)).min(1)
    return d

def nm(f, x0, step, iters=4000):
    n = len(x0)
    S = [np.array(x0, float)] + [np.array(x0, float) + np.eye(n)[i] * step[i] for i in range(n)]
    F = [f(s) for s in S]
    for _ in range(iters):
        o = np.argsort(F); S = [S[i] for i in o]; F = [F[i] for i in o]
        c = np.mean(S[:-1], 0)
        xr = c + (c - S[-1]); fr = f(xr)
        if fr < F[0]:
            xe = c + 2 * (c - S[-1]); fe = f(xe)
            S[-1], F[-1] = (xe, fe) if fe < fr else (xr, fr)
        elif fr < F[-2]:
            S[-1], F[-1] = xr, fr
        else:
            xc = c + 0.5 * (S[-1] - c); fc = f(xc)
            if fc < F[-1]:
                S[-1], F[-1] = xc, fc
            else:
                S = [S[0] + 0.5 * (s - S[0]) for s in S]; F = [f(s) for s in S]
        if np.std(F) < 1e-9: break
    i = int(np.argmin(F)); return S[i], F[i]

CONV = np.array([462.0, 375.25])  # refined below
results = []
for i in range(12):
    t = np.array(tracks[i])
    pts = t[:, :2]
    y0 = pts[0, 1]
    # quadratic: P0=(289.5,y0 free), P1 free, P2=(xe free, 375.25)
    def fq(v):
        P = np.array([[289.5, v[0]], [v[1], v[2]], [v[3], 375.25]])
        return (dist(P, pts) ** 2).mean()
    vq, eq = nm(fq, [y0, 370, 375, 460], [2, 10, 5, 10])
    # cubic with horizontal end tangent: P0=(289.5,y0), P1 free, P2=(x2, 375.25), P3=(xe,375.25)
    def fc(v):
        P = np.array([[289.5, v[0]], [v[1], v[2]], [v[3], 375.25], [v[4], 375.25]])
        return (dist(P, pts) ** 2).mean()
    vc, ec = nm(fc, [y0, 330, (y0 + 375) / 2, 400, 465], [2, 10, 10, 10, 10])
    Pq = np.array([[289.5, vq[0]], [vq[1], vq[2]], [vq[3], 375.25]])
    Pc = np.array([[289.5, vc[0]], [vc[1], vc[2]], [vc[3], 375.25], [vc[4], 375.25]])
    dq = dist(Pq, pts); dc = dist(Pc, pts)
    results.append({'i': i, 'n': len(pts),
                    'quad': Pq.round(2).tolist(), 'quad_rms': round(float(np.sqrt((dq**2).mean())), 3), 'quad_max': round(float(dq.max()), 3),
                    'cubic': Pc.round(2).tolist(), 'cubic_rms': round(float(np.sqrt((dc**2).mean())), 3), 'cubic_max': round(float(dc.max()), 3)})
    print(i, 'quad', Pq.round(1).tolist(), 'rms', results[-1]['quad_rms'], '| cubic', Pc.round(1).tolist(), 'rms', results[-1]['cubic_rms'])

# stroke width estimate: integrated ink across a crossing, times cos(theta), / RED_DROP
widths = []
for i in range(12):
    t = np.array(tracks[i])
    sel = t[(t[:, 0] >= 300) & (t[:, 0] <= 360)]
    for k in range(1, len(sel) - 1):
        slope = (sel[k + 1, 1] - sel[k - 1, 1]) / (sel[k + 1, 0] - sel[k - 1, 0])
        widths.append(sel[k, 2] * np.cos(np.arctan(slope)) / RED_DROP)
print('stroke width (px, luma-mass method): median %.3f  IQR %.3f-%.3f n=%d' % (np.median(widths), *np.percentile(widths, [25, 75]), len(widths)))
json.dump({'tracks': {k: v for k, v in tracks.items()}, 'fits': results, 'stroke_width_median': float(np.median(widths))},
          open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/05/curve_fits.json', 'w'), indent=1)
