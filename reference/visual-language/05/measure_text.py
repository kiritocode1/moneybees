# Row/column profiles of dark text pixels in a region; prints ink runs (lines of text) and their x extents.
import sys
import numpy as np
from PIL import Image
src, x0, x1, y0, y1 = sys.argv[1], *map(int, sys.argv[2:6])
thr = float(sys.argv[6]) if len(sys.argv) > 6 else 150
a = np.array(Image.open(src).convert('RGB')).astype(float)
Y = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
m = Y[y0:y1, x0:x1] < thr
rows = m.sum(1)
y = 0
while y < len(rows):
    if rows[y]:
        s = y
        while y < len(rows) and rows[y]:
            y += 1
        sub = m[s:y]
        cols = np.nonzero(sub.any(0))[0]
        # darkest value in run
        dk = Y[y0 + s:y0 + y, x0:x1][sub].min()
        print(f'rows {y0+s}-{y0+y-1} (h={y-s})  x {x0+cols.min()}-{x0+cols.max()}  px={sub.sum()}  darkestY={dk:.0f}')
    y += 1
