# Trace a soft coverage map (0..1 per pixel) into an SVG path via marching squares at 0.5 on a
# bilinearly upsampled grid, then Ramer-Douglas-Peucker simplification. Coordinates are SVG px.
import numpy as np

def upsample(cov, s):
    h, w = cov.shape
    ys = (np.arange(h * s) + 0.5) / s - 0.5
    xs = (np.arange(w * s) + 0.5) / s - 0.5
    y0 = np.clip(np.floor(ys).astype(int), 0, h - 1); y1 = np.clip(y0 + 1, 0, h - 1)
    x0 = np.clip(np.floor(xs).astype(int), 0, w - 1); x1 = np.clip(x0 + 1, 0, w - 1)
    fy = np.clip(ys - np.floor(ys), 0, 1)[:, None]; fx = np.clip(xs - np.floor(xs), 0, 1)[None, :]
    a = cov[y0][:, x0]; b = cov[y0][:, x1]; c = cov[y1][:, x0]; d = cov[y1][:, x1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy

def contours(g, thr=0.5):
    """marching squares; returns list of polylines in grid-vertex coordinates (x, y)."""
    g = np.pad(g, 1)
    h, w = g.shape
    segs = {}
    def interp(p1, p2, v1, v2):
        t = (thr - v1) / (v2 - v1)
        return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))
    edges = []
    for y in range(h - 1):
        for x in range(w - 1):
            tl, tr, br, bl = g[y, x], g[y, x + 1], g[y + 1, x + 1], g[y + 1, x]
            idx = (tl > thr) * 8 + (tr > thr) * 4 + (br > thr) * 2 + (bl > thr)
            if idx in (0, 15):
                continue
            T = interp((x, y), (x + 1, y), tl, tr) if (tl > thr) != (tr > thr) else None
            R = interp((x + 1, y), (x + 1, y + 1), tr, br) if (tr > thr) != (br > thr) else None
            B = interp((x, y + 1), (x + 1, y + 1), bl, br) if (bl > thr) != (br > thr) else None
            L = interp((x, y), (x, y + 1), tl, bl) if (tl > thr) != (bl > thr) else None
            pts = [p for p in (T, R, B, L) if p is not None]
            if len(pts) == 2:
                edges.append((pts[0], pts[1]))
            elif len(pts) == 4:
                edges.append((T, R)); edges.append((B, L))
    # chain
    from collections import defaultdict
    key = lambda p: (round(p[0], 4), round(p[1], 4))
    adj = defaultdict(list)
    for i, (p, q) in enumerate(edges):
        adj[key(p)].append(i); adj[key(q)].append(i)
    used = [False] * len(edges); polys = []
    for i in range(len(edges)):
        if used[i]:
            continue
        used[i] = True
        p, q = edges[i]; line = [p, q]
        while True:
            k = key(line[-1]); nxt = None
            for j in adj[k]:
                if not used[j]:
                    nxt = j; break
            if nxt is None:
                break
            used[nxt] = True
            a_, b_ = edges[nxt]
            line.append(b_ if key(a_) == k else a_)
        polys.append([(x - 1, y - 1) for x, y in line])  # undo pad
    return polys

def rdp(pts, eps):
    pts = np.array(pts)
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    ab = b - a; n = np.hypot(*ab)
    if n == 0:
        d = np.hypot(*(pts - a).T)
    else:
        d = np.abs(ab[0] * (pts[:, 1] - a[1]) - ab[1] * (pts[:, 0] - a[0])) / n
    i = int(np.argmax(d))
    if d[i] > eps:
        l = rdp(pts[:i + 1], eps); r = rdp(pts[i:], eps)
        return np.vstack([l[:-1], r])
    return np.array([a, b])

def trace(cov, ox, oy, s=4, eps=0.12, min_area=0.8):
    """cov: 2D array cropped at image offset (ox, oy). Returns SVG path d string."""
    g = upsample(cov, s)
    out = []
    for poly in contours(g):
        if len(poly) < 4:
            continue
        P = np.array(poly)
        # grid index i covers pixel coordinate (i+0.5)/s in crop space
        P = (P + 0.5) / s + np.array([ox, oy])
        area = 0.5 * abs(np.dot(P[:, 0], np.roll(P[:, 1], 1)) - np.dot(P[:, 1], np.roll(P[:, 0], 1)))
        if area < min_area:
            continue
        Q = rdp(P, eps)
        out.append('M' + ' '.join(f'{x:.2f},{y:.2f}' for x, y in Q) + 'Z')
    return ' '.join(out)
