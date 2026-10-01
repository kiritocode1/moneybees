# Classify pixels into paper / lit / shade / ink and print vertical runs per column (or horizontal per row).
import sys
import numpy as np
from PIL import Image
src = sys.argv[1]; axis = sys.argv[2]; idxs = [int(v) for v in sys.argv[3].split(',')]
a = np.array(Image.open(src).convert('RGB')).astype(float)
P = {'.': (242, 239, 232), 'L': (223, 41, 20), 'S': (124, 31, 23), 'K': (20, 20, 20)}
keys = list(P)
d = np.stack([((a - np.array(P[k])) ** 2).sum(-1) for k in keys], -1)
cls = np.array(keys)[d.argmin(-1)]
for i in idxs:
    line = cls[:, i] if axis == 'x' else cls[i, :]
    runs = []
    s = 0
    for j in range(1, len(line) + 1):
        if j == len(line) or line[j] != line[s]:
            if line[s] != '.' or True:
                runs.append(f'{line[s]}{s}-{j-1}')
            s = j
    print(axis, i, ' '.join(r for r in runs if not r.startswith('.')))
