# Compare a Chrome render of replica.svg with the original PNG.
# usage: diff.py original.png render.png outdir mode masks.json
#   mode = solid (06/07: flat fills) | line (05: hairlines)
#   masks.json = {"rects": [[x0,y0,x1,y1,label], ...]}  excluded from MAE / %diff (text, tiny figures)
# Writes outdir/diff.png (heatmap), outdir/iou.png (red-mask overlay), outdir/metrics.json
import json, sys
import numpy as np
from PIL import Image

orig_p, rend_p, outdir, mode, masks_p = sys.argv[1:6]
A = np.array(Image.open(orig_p).convert('RGB')).astype(float)
B = np.array(Image.open(rend_p).convert('RGB')).astype(float)
assert A.shape == B.shape, (A.shape, B.shape)
H, W, _ = A.shape
M = json.load(open(masks_p))
keep = np.ones((H, W), bool)
for x0, y0, x1, y1, *_ in M['rects']:
    keep[max(0, y0):min(H, y1), max(0, x0):min(W, x1)] = False

d = np.abs(A - B)
dmax = d.max(-1)
mae = float(d[keep].mean())
pct = float((dmax[keep] > 24).mean() * 100)
mae_all = float(d.mean()); pct_all = float((dmax > 24).mean() * 100)

COL = {'P': (242, 239, 232), 'L': (223, 41, 20), 'S': (124, 31, 23), 'K': (20, 20, 20)}
def classify(X):
    keys = list(COL)
    dd = np.stack([((X - np.array(COL[k])) ** 2).sum(-1) for k in keys], -1)
    return np.array(keys)[dd.argmin(-1)]

def iou(a, b):
    return float((a & b).sum() / max(1, (a | b).sum()))

def dilate(m, r=1):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out

res = {'mask_rects': M['rects'], 'masked_fraction_pct': float((~keep).mean() * 100),
       'mae_unmasked_0_255': mae, 'pct_pixels_maxchannel_diff_gt24_unmasked': pct,
       'mae_all_0_255': mae_all, 'pct_gt24_all': pct_all}
if mode == 'solid':
    ca, cb = classify(A), classify(B)
    ra = ((ca == 'L') | (ca == 'S')) & keep
    rb = ((cb == 'L') | (cb == 'S')) & keep
    res['red_mask_def'] = 'nearest of {paper F2EFE8, lit DF2914, shade 7C1F17, ink 141414} is lit or shade; text/figure rects excluded'
    res['iou_red_solid'] = iou(ra, rb)
    res['iou_lit'] = iou((ca == 'L') & keep, (cb == 'L') & keep)
    res['iou_shade'] = iou((ca == 'S') & keep, (cb == 'S') & keep)
else:
    def redcov(X):
        R, G, Bc = X[..., 0], X[..., 1], X[..., 2]
        c = np.clip((239 - G) / (239 - 41), 0, 1)
        c[(R - G) < 25] = 0
        return c
    ca, cb = redcov(A) * keep, redcov(B) * keep
    ra = (A[..., 0] - (A[..., 1] + A[..., 2]) / 2 > 40) & keep
    rb = (B[..., 0] - (B[..., 1] + B[..., 2]) / 2 > 40) & keep
    res['red_mask_def'] = 'R-(G+B)/2 > 40 (hard); soft = sum(min)/sum(max) of red coverage clip((239-G)/198) where R-G>=25'
    res['iou_red_hard'] = iou(ra, rb)
    res['iou_red_soft'] = float(np.minimum(ca, cb).sum() / max(1e-9, np.maximum(ca, cb).sum()))
    rec = float((ra & dilate(rb, 1)).sum() / max(1, ra.sum()))
    prec = float((rb & dilate(ra, 1)).sum() / max(1, rb.sum()))
    res['tol1px_recall'] = rec; res['tol1px_precision'] = prec
    res['tol1px_F'] = 2 * rec * prec / max(1e-9, rec + prec)
    res['iou_red_hard_1px_dilated'] = iou(dilate(ra, 1) & keep, dilate(rb, 1) & keep)

# diff heatmap: white = equal, black = >= 85 difference; masked regions tinted blue
v = np.clip(255 - dmax * 3, 0, 255)
img = np.stack([v, v, v], -1)
img[~keep] = img[~keep] * 0.55 + np.array([120, 160, 235]) * 0.45
Image.fromarray(img.astype(np.uint8)).save(f'{outdir}/diff.png')
# iou overlay: both = grey, original only = blue, replica only = orange
ov = np.full((H, W, 3), 255.0)
ov[ra & rb] = (150, 150, 150); ov[ra & ~rb] = (30, 90, 255); ov[rb & ~ra] = (255, 140, 0)
ov[~keep] = ov[~keep] * 0.6 + np.array([200, 220, 255]) * 0.4
Image.fromarray(ov.astype(np.uint8)).save(f'{outdir}/iou.png')
json.dump(res, open(f'{outdir}/metrics.json', 'w'), indent=1)
for k, val in res.items():
    if k != 'mask_rects':
        print(f'{k}: {val:.4f}' if isinstance(val, float) else f'{k}: {val}')
