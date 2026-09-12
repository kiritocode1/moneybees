"""Adapt the pinned Lottie with a persistent orange segment and moving boundary."""
import base64
import copy
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
source = json.loads((ROOT / 'reference/medusmo/chart.json').read_text())
output = ROOT / 'public/preview/moneybee/orange-frames'
output.mkdir(parents=True, exist_ok=True)

def decode(asset):
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(asset['p'].split(',')[1]))).convert('RGB'), dtype=float)

# Both materials come from the original animation, including its baked grain.
orange_material = decode(source['assets'][0])
grey_material = decode(source['assets'][116])
y, x = np.mgrid[:source['h'], :source['w']]
dx, dy = x - 282, 270 - y
radius = np.hypot(dx, dy)
angle = np.mod(np.arctan2(dx, dy), 2 * np.pi)
right = (dx >= 0) & (radius <= 140.5)
edge = np.clip(140.5 - radius, 0, 1)

def sample(material, angles):
    px = np.clip(282 + radius * np.sin(angles), 0, source['w'] - 1.001)
    py = np.clip(270 - radius * np.cos(angles), 0, source['h'] - 1.001)
    xi, yi = np.floor(px).astype(int), np.floor(py).astype(int)
    fx, fy = (px - xi)[..., None], (py - yi)[..., None]
    return (material[yi, xi] * (1-fx) * (1-fy) + material[yi, xi+1] * fx * (1-fy)
            + material[yi+1, xi] * (1-fx) * fy + material[yi+1, xi+1] * fx * fy)

adapted = copy.deepcopy(source)
assets = {asset['id']: asset for asset in adapted['assets']}
frames = []
layers = sorted((layer for layer in source['layers'] if layer['ty'] == 2), key=lambda layer: layer['ip'])
widths = []
for index, layer in enumerate(layers):
    progress = index / (len(layers) - 1)
    # Smooth motion, with no opacity change or new segment appearing at the end.
    eased = progress * progress * (3 - 2 * progress)
    width_degrees = 180 - 176 * eased
    width = np.deg2rad(width_degrees)
    widths.append(width_degrees)
    asset = assets[layer['refId']]
    original = decode(asset)
    orange = sample(orange_material, np.clip(angle / width, 0, 1) * np.pi)
    orange *= np.array([0.98, 0.64, 0.10])
    orange += np.array([12.75, 7.65, 3.825])
    # The adjacent grey face expands into the space released by the orange face.
    grey_angles = np.pi / 2 + np.clip((angle - width) / max(np.pi - width, 1e-8), 0, 1) * np.pi / 2
    grey = sample(grey_material, grey_angles)
    coverage = np.clip((width - angle) * radius + 0.5, 0, 1)[..., None]
    surface = orange * coverage + grey * (1 - coverage)
    alpha = (right * edge)[..., None]
    result = np.clip(original * (1 - alpha) + surface * alpha, 0, 255).astype('uint8')
    buffer = io.BytesIO()
    Image.fromarray(result).save(buffer, format='PNG', optimize=True)
    data = buffer.getvalue()
    name = f"{layer['refId']}.png"
    (output / name).write_bytes(data)
    asset['p'] = 'data:image/png;base64,' + base64.b64encode(data).decode()
    frames.append({'src': f'/preview/moneybee/orange-frames/{name}', 'start': layer['ip'], 'end': layer['op']})

assert widths[0] == 180 and widths[-1] == 4
assert all(a > b for a, b in zip(widths, widths[1:]))
manifest = {'width': source['w'], 'height': source['h'], 'start': source['ip'], 'end': source['op'],
            'fps': source['fr'], 'scale': 1.03, 'frames': frames}
(ROOT / 'app/preview/homepage/orange-chart-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
(ROOT / 'public/preview/moneybee/chart-orange.json').write_text(json.dumps(adapted, separators=(',', ':')))
print(f'Updated {len(frames)} Lottie frames: orange is present throughout, narrowing continuously from 180 to 4 degrees.')
