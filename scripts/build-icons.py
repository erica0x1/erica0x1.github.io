"""Build Erica's little Christmas tree as SVG, favicon, and home-screen icons.

All formats share the same authored 32px geometry. Requires Pillow.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PAPER = '#F4F2EB'
PINE = '#38513F'
LEAF = '#628265'
LIGHT = '#8DA17B'
BERRY = '#B96559'
GOLD = '#CCAA5F'
WOOD = '#84634B'
TILE = [(4,0),(28,0),(28,2),(30,2),(30,4),(32,4),(32,28),
        (30,28),(30,30),(28,30),(28,32),(4,32),(4,30),(2,30),
        (2,28),(0,28),(0,4),(2,4),(2,2),(4,2)]
# A 2px grid keeps the star, stepped boughs and baubles readable at 16px.
PIXELS = [
    (14,26,4,4,WOOD),
    (14,8,4,2,PINE), (12,10,8,2,PINE), (10,12,12,2,PINE),
    (8,14,16,2,PINE), (10,16,12,2,PINE), (8,18,16,2,PINE),
    (6,20,20,2,PINE), (8,22,16,2,PINE), (6,24,20,2,PINE),
    (4,26,24,2,PINE),
    (14,10,4,2,LEAF), (12,12,8,2,LEAF), (10,14,10,2,LEAF),
    (12,16,6,2,LEAF), (10,18,10,2,LEAF), (8,20,14,2,LEAF),
    (10,22,10,2,LEAF), (8,24,14,2,LEAF), (6,26,16,2,LEAF),
    (14,10,2,2,LIGHT), (10,18,2,2,LIGHT), (8,24,2,2,LIGHT),
    (12,12,2,2,BERRY), (18,18,2,2,BERRY), (12,24,2,2,BERRY),
    (16,14,2,2,PAPER), (10,20,2,2,GOLD), (20,24,2,2,GOLD),
    (14,2,4,2,GOLD), (12,4,8,2,GOLD), (14,6,4,2,GOLD),
]


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
    '<title>Erica Lin — little Christmas tree</title>'
    f'<path d="{outline}" fill="{PAPER}"/>{rects}</svg>\n', encoding='utf-8')
make_icon(32).save(ROOT/'favicon-32.png')
make_icon(64).save(ROOT/'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)],
                   append_images=[make_icon(size) for size in (16,32,48)])
make_icon(180,square=True).save(ROOT/'apple-touch-icon.png')
make_icon(512).save(ROOT/'assets/studio/erica-logo.png')
print('Exported matching pixel SVG, ICO, 32px favicon, 180px touch icon and 512px logo.')
