# Subpixel edge extraction for flat-colour polygons (lit / shade / paper) and least-squares line fits.
# Usage: python3 edges.py image.png  -> prints fits for requested edge specs (edited per image below)
import sys, json
import numpy as np
from PIL import Image

COL = {'P': np.array([242, 239, 232.]), 'L': np.array([223, 41, 20.]), 'S': np.array([124, 31, 23.])}

def load(src):
    a = np.array(Image.open(src).convert('RGB')).astype(float)
    keys = list(COL)
    d = np.stack([((a - COL[k]) ** 2).sum(-1) for k in keys], -1)
    cls = np.array(keys)[d.argmin(-1)]
    return a, cls

def frac(pix, A, B):
    """fraction of colour A in pixel (projection onto segment B->A)."""
    v = A - B
    return float(np.clip(((pix - B) @ v) / (v @ v), 0, 1))

def vcross(a, cls, x, y_lo, y_hi, A, B):
    """subpixel y where column x changes from class A (above) to class B (below) within [y_lo,y_hi].
    Returns y of the boundary (pixel rows are [j, j+1))."""
    col = a[:, x]
    ys = [j for j in range(y_lo, y_hi) if cls[j, x] == A and cls[j + 1, x] == B]
    if not ys:
        return None
    j = ys[0]
    s = 0.0
    for k in range(j - 2, j + 4):
        s += frac(col[k], COL[A], COL[B])
    return (j - 2) + s

def hcross(a, cls, y, x_lo, x_hi, A, B):
    row = a[y]
    xs = [j for j in range(x_lo, x_hi) if cls[y, j] == A and cls[y, j + 1] == B]
    if not xs:
        return None
    j = xs[0]
    s = 0.0
    for k in range(j - 2, j + 4):
        s += frac(row[k], COL[A], COL[B])
    return (j - 2) + s

def fitline(pts):
    pts = np.array(pts, float)
    x, y = pts[:, 0], pts[:, 1]
    A = np.vstack([x, np.ones_like(x)]).T
    (m, c), *_ = np.linalg.lstsq(A, y, rcond=None)
    r = y - (m * x + c)
    return m, c, float(np.sqrt((r ** 2).mean())), len(pts)

def fitv(pts):
    """fit x = m*y + c (near-vertical)."""
    pts = np.array(pts, float)
    m, c, rms, n = fitline(pts[:, ::-1])
    return m, c, rms, n
