# Studio assets — 2026-11-03

The cat, chalk and eraser were generated with the built-in imagegen tool, with transparent backgrounds. No external API key or fallback CLI was used. Original game artwork and Erica's portrait remain unchanged in `../images/`.

## Final files

- `cat-idle.webp`, `cat-blink.webp`, `cat-pet.webp`, `cat-sleep.webp`: 272 × 272 transparent frames, prepared from `cat-source.png`.
- `chalk.webp`: the website's transparent chalk prop, prepared from `chalk-source.png`.
- `eraser.webp`: the website's transparent wood-and-felt eraser, prepared from `eraser-source.png`.

Original generated PNGs are retained alongside the web assets. Alpha trimming, consistent sprite placement, resizing and WebP encoding were applied for the website.

## Prompt set — production specifications

1. **Pixel kitten / stylized-concept.** Create an original cute gray-and-white tabby kitten for a desktop companion, inspired by the warmth of 1990s Japanese virtual pets. A clean 2 × 2 sprite sheet, with the same kitten in four states: idle with open eyes, blinking and smiling, enjoying a pet with one raised paw, and sleeping curled up. Charcoal outlines, ivory fur, gray markings, soft pink ears, a compact rounded silhouette and a friendly face. True transparent background. No text, UI icons, accessories or CSS-style geometric placeholder shapes. Keep the character identity and scale consistent between states.
2. **Blackboard eraser / product-mockup.** An isolated realistic school chalkboard eraser, warm honey-beech wood on top and thick charcoal felt underneath. Three-quarter view from slightly above, long axis horizontal, subtle chalk dust, softly worn edges and visible material texture. Soft studio lighting, transparent background, no hand, surrounding scene, text, logo or watermark.
3. **White chalk / product-mockup.** One isolated off-white piece of classroom chalk, resting horizontally with a slight natural tilt. Powdery matte surface, subtly worn ends, rounded cylindrical form and realistic chalk texture. Soft studio lighting, transparent background, no packaging, text, surrounding scene or watermark.

These are original generated assets guided by the user's references; no Framer template asset was extracted or bundled.

## Small Christmas accents

`holiday-ornaments.svg`, `holly-stamp.svg` and `pixel-present.svg` are original code-authored vector decorations, added for Erica's love of Christmas and her long-standing red-and-green hair palette. Their palette uses muted berry red, pine green and cream. The ornaments sit outside the chalk drawing layer; decorative images do not intercept pointer input or add screen-reader noise. The corner sway is disabled with reduced motion. Red-and-green paper tape and small interface accents are defined in `studio.css`.

## Erica's e. monogram

`erica-logo.png` is a 512px export of the original code-authored `../../favicon.svg`: a rounded, handwritten lowercase e in pine green, with a berry-red dot on cream. `scripts/build-icons.py` exports matching browser favicon and home-screen PNG/ICO sizes from the same path geometry. This vector logo is not AI-generated raster artwork and uses no font dependency.

## Felt eraser interaction

The chalkboard eraser uses a 92×34 CSS-pixel, softly worn rectangular felt footprint. Pressure varies across fibres, pigment is lifted gradually with distance-based strength, and a small amount of existing chalk is dragged into a faint smudge. Repeated passes also lift the residue. Empty board areas do not generate new dust. The cursor is clipped to the board/frame bounds so wiping or resizing cannot widen a mobile page.
