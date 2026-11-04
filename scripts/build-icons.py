"""Build the pixel e monogram as SVG, favicon, and home-screen icons.

All formats share the same authored 32px geometry. Requires Pillow.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PAPER = '#F4F2EB'
INK = '#3F5C48'
BERRY = '#9C4D43'
E = ('01110', '10001', '11111', '10000', '01111')
TILE = [(4,0),(28,0),(28,2),(30,2),(30,4),(32,4),(32,28),
        (30,28),(30,30),(28,30),(28,32),(4,32),(4,30),(2,30),
        (2,28),(0,28),(0,4),(2,4),(2,2),(4,2)]
PIXELS = [(4+x*4, 6+y*4, 4, 4, INK)
          for y,row in enumerate(E) for x,bit in enumerate(row) if bit == '1']
PIXELS.append((26,26,2,2,BERRY))


def make_icon(size, square=False):
    icon = Image.new('RGBA', (32,32), PAPER if square else (0,0,0,0))
    draw = ImageDraw.Draw(icon)
    if not square:
        draw.polygon([(min(x,31),min(y,31)) for x,y in TILE], fill=PAPER)
    for x,y,w,h,color in PIXELS:
        draw.rectangle((x,y,x+w-1,y+h-1), fill=color)
    return icon.resize((size,size), Image.Resampling.NEAREST)


rects = ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}"/>'
                for x,y,w,h,color in PIXELS)
outline = 'M'+' '.join(f'{x} {y}' for x,y in TILE)+'Z'
(ROOT/'favicon.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">'
    '<title>Erica Lin — pixel e</title>'
    f'<path d="{outline}" fill="{PAPER}"/>{rects}</svg>\n', encoding='utf-8')
make_icon(32).save(ROOT/'favicon-32.png')
make_icon(64).save(ROOT/'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)],
                   append_images=[make_icon(size) for size in (16,32,48)])
make_icon(180,square=True).save(ROOT/'apple-touch-icon.png')
make_icon(512).save(ROOT/'assets/studio/erica-logo.png')
print('Exported matching pixel SVG, ICO, 32px favicon, 180px touch icon and 512px logo.')
