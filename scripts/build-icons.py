"""Export the code-authored e. monogram to browser and home-screen formats.

Requires Pillow. The geometry matches favicon.svg; no fonts are needed.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SCALE = 16
PAPER = '#F4F2EB'
INK = '#3F5C48'
BERRY = '#9C4D43'


def curve(start, c1, c2, end):
    points = []
    for i in range(1, 81):
        t = i / 80
        points.append(tuple((1-t)**3*start[k] + 3*(1-t)**2*t*c1[k]
                            + 3*(1-t)*t*t*c2[k] + t**3*end[k]
                            for k in (0, 1)))
    return points


def make_icon(square=False):
    image = Image.new('RGBA', (64*SCALE, 64*SCALE), PAPER if square else (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    if not square:
        draw.rounded_rectangle((SCALE, SCALE, 63*SCALE, 63*SCALE), radius=15*SCALE,
                               fill=PAPER, outline='#D8D8CD', width=round(1.5*SCALE))
    points = [(17.5, 32.5), (38, 32.5)]
    for c1, c2, end in [((43, 32.5), (44, 28), (41.5, 23.5)),
                        ((38, 17.5), (30, 16.5), (24, 20)),
                        ((17, 24), (14.5, 33), (18, 39.5)),
                        ((22.5, 48), (34, 49), (42, 41))]:
        points.extend(curve(points[-1], c1, c2, end))
    pixels = [(round(x*SCALE), round(y*SCALE)) for x, y in points]
    draw.line(pixels, fill=INK, width=6*SCALE, joint='curve')
    for x, y in (pixels[0], pixels[-1]):
        draw.ellipse((x-3*SCALE, y-3*SCALE, x+3*SCALE, y+3*SCALE), fill=INK)
    draw.ellipse(tuple(round(v*SCALE) for v in (44.5, 42.5, 53.5, 51.5)), fill=BERRY)
    return image


icon = make_icon()
icon.resize((32, 32), Image.Resampling.LANCZOS).save(ROOT/'favicon-32.png')
icon.resize((64, 64), Image.Resampling.LANCZOS).save(ROOT/'favicon.ico',
                                                sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
make_icon(square=True).resize((180, 180), Image.Resampling.LANCZOS).save(ROOT/'apple-touch-icon.png')
icon.resize((512, 512), Image.Resampling.LANCZOS).save(ROOT/'assets/studio/erica-logo.png')
print('Exported SVG-matched ICO, 32px favicon, 180px home-screen icon and 512px logo.')
