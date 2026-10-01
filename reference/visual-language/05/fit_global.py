# Global model for the 12 curves (SVG coordinates = pixel index + 0.5):
#   y_i = y0 + i*d,  quadratic Bezier P0=(x0, y_i), P1=(cx, yc + k*(y_i-yc)), P2=(ex, yc)
import json, sys
import numpy as np
sys.path.insert(0, '/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/05')
D = json.load(open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/05/curve_fits.json'))
tracks = [np.array(D['tracks'][str(i)])[:, :2] + 0.5 for i in range(12)]

def bez(P, n=500):
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * P[0] + 2 * (1 - t) * t * P[1] + t ** 2 * P[2]

def curves(v):
    x0, y0, d, cx, yc, k, ex = v
    out = []
    for i in range(12):
        yi = y0 + i * d
        out.append(np.array([[x0, yi], [cx, yc + k * (yi - yc)], [ex, yc]]))
    return out

def err(v, detail=False):
    tot = []; per = []
    for P, pts in zip(curves(v), tracks):
        C = bez(P, 700)
        dd = np.sqrt(((pts[:, None, :] - C[None]) ** 2).sum(-1)).min(1)
        tot.append(dd); per.append((float(np.sqrt((dd ** 2).mean())), float(dd.max())))
    allv = np.concatenate(tot)
    if detail:
        return float(np.sqrt((allv ** 2).mean())), float(allv.max()), per
    return float((allv ** 2).mean())

def nm(f, x0, step, iters=6000):
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
        if max(F) - min(F) < 1e-10: break
    i = int(np.argmin(F)); return S[i]

v0 = [290.0, 242.3, 24.28, 361.0, 375.75, 0.06, 478.0]
v = nm(err, v0, [1, 1, 0.2, 5, 1, 0.02, 5])
v = nm(err, v, [0.3, 0.3, 0.05, 2, 0.3, 0.01, 2])
rms, mx, per = err(v, True)
names = ['x0', 'y0', 'd', 'cx', 'yc', 'k', 'ex']
print('global quadratic model:', dict(zip(names, np.round(v, 3))))
print('residual rms %.3f px, max %.3f px' % (rms, mx))
for i, (r, m) in enumerate(per):
    print(f'  curve {i+1:2d}: rms {r:.3f} max {m:.3f}')
# k = 0 variant (shared control point on the axis)
def err0(w):
    return err([w[0], w[1], w[2], w[3], w[4], 0.0, w[5]])
w = nm(err0, [v[0], v[1], v[2], v[3], v[4], v[6]], [1, 1, 0.1, 4, 1, 4])
r0 = err([w[0], w[1], w[2], w[3], w[4], 0.0, w[5]], True)
print('k=0 variant:', np.round(w, 3), 'rms %.3f max %.3f' % (r0[0], r0[1]))
json.dump({'model': dict(zip(names, [float(t) for t in v])), 'rms': rms, 'max': mx, 'per_curve': per,
           'k0_model': [float(t) for t in w], 'k0_rms': r0[0], 'k0_max': r0[1]},
          open('/Users/blank/Desktop/CREATE/moneybees/reference/visual-language/05/global_fit.json', 'w'), indent=1)
