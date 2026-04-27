"""
Preview animations for the polar_city engine.

Reads the sliced sprite frames in img/polar_city/ and builds:
  - walk.gif              — walk cycle at engine speed
  - build_sequence.gif    — igloo construction sequence
  - comparison_*.png      — side-by-side sprite scale checks (feet-aligned)
  - actions_contact.png   — all 22 action poses on one sheet

Outputs to test/polar_city/out/. Run:
    python3 test/polar_city/preview_animations.py

The `ENGINE` constants below mirror the JS engine's animationSpeed values.
Change them here when tuning — keep the two in sync until we add a shared
JSON config for timing.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'img' / 'polar_city'
OUT = Path(__file__).resolve().parent / 'out'
OUT.mkdir(exist_ok=True)

# --- Engine timing (mirror of AgentView.js + render ticker @ 60fps) --------
TICKER_FPS = 60
WALK_ANIM_SPEED = 0.12                       # AgentView.js: walk.animationSpeed
WALK_MS = int(1000 / (TICKER_FPS * WALK_ANIM_SPEED))  # ms per frame

BUILD_MS = 220   # construction feels right slower than walk

# --- Pose config: loaded from js/polar_city/pose_scales.json --------------
# Single source of truth shared with the JS engine. Edit that file, not here.
import json
_POSE_CFG_PATH = ROOT / 'js' / 'polar_city' / 'pose_scales.json'
with open(_POSE_CFG_PATH) as _f:
    _POSE_CFG = json.load(_f)
POSE_SCALES = _POSE_CFG['pose_scales']
ACTION_POSE = _POSE_CFG.get('action_pose', {})
# ---------------------------------------------------------------------------


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert('RGBA')


def scaled(img: Image.Image, factor: float) -> Image.Image:
    if factor == 1.0:
        return img
    w, h = max(1, int(img.width * factor)), max(1, int(img.height * factor))
    return img.resize((w, h), Image.LANCZOS)


def pad_to_common(frames: list[Image.Image]) -> list[Image.Image]:
    """Paste each frame onto a shared canvas, feet-aligned to the bottom.
    Keeps the bear from jittering due to per-frame bbox differences."""
    w = max(f.width for f in frames)
    h = max(f.height for f in frames)
    out = []
    for f in frames:
        canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        canvas.paste(f, ((w - f.width) // 2, h - f.height), f)
        out.append(canvas)
    return out


def save_gif(path: Path, frames: list[Image.Image], duration_ms: int) -> None:
    """Save a transparent, looping GIF. PIL's GIF writer needs palette mode;
    we quantize each frame independently to keep alpha edges clean."""
    palettized = []
    for f in frames:
        # 'RGBA' -> 'P' with alpha kept via transparent index
        p = f.convert('RGBA')
        # Quantize color channels, keep alpha as binary transparency
        alpha = p.split()[3]
        rgb = p.convert('RGB').quantize(colors=255, dither=Image.Dither.NONE)
        rgb.paste(255, mask=alpha.point(lambda a: 255 if a < 128 else 0))
        rgb.info['transparency'] = 255
        palettized.append(rgb)
    palettized[0].save(
        path, save_all=True, append_images=palettized[1:],
        duration=duration_ms, loop=0, disposal=2,
        transparency=255, optimize=False,
    )


# ---------------------------------------------------------------------------


def walk_gif():
    frames = [load_rgba(p) for p in sorted((ASSETS / 'walk').glob('walk_*.png'))]
    frames = pad_to_common(frames)
    save_gif(OUT / 'walk.gif', frames, WALK_MS)
    print(f'walk.gif: {len(frames)} frames @ {WALK_MS}ms ({1000/WALK_MS:.1f} fps)')


def build_sequence_gif():
    frames = [load_rgba(p) for p in sorted((ASSETS / 'building_sequence').glob('build_*.png'))]
    frames = pad_to_common(frames)
    save_gif(OUT / 'build_sequence.gif', frames, BUILD_MS)
    print(f'build_sequence.gif: {len(frames)} frames @ {BUILD_MS}ms')


def comparison_sheet():
    """Feet-aligned side-by-side with POSE_SCALES applied. Shows the bears
    at the size they'll actually render in the engine."""
    walk_raw = load_rgba(ASSETS / 'walk' / 'walk_01.png')
    walk = scaled(walk_raw, POSE_SCALES['walk'])
    references = [(f'walk_01 x{POSE_SCALES["walk"]:.2f}', walk)]
    for p in sorted((ASSETS / 'actions').glob('action_*.png')):
        pose = ACTION_POSE.get(p.stem)
        factor = POSE_SCALES.get(pose, 1.0) if pose else 1.0
        label = f'{p.stem} x{factor:.2f}'
        references.append((label, scaled(load_rgba(p), factor)))

    # Layout: walk on the left, each action to its right, grouped into rows of 6.
    cell_w = max(f.width for _, f in references) + 16
    cell_h = max(f.height for _, f in references) + 28  # room for label
    cols = 6
    rows = (len(references) + cols - 1) // cols
    W = cols * cell_w
    H = rows * cell_h
    sheet = Image.new('RGBA', (W, H), (40, 40, 48, 255))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 11)
    except Exception:
        font = ImageFont.load_default()
    # Reference baseline = bottom of tallest sprite, so feet line up across cells.
    baseline_y_in_cell = cell_h - 22
    for i, (name, img) in enumerate(references):
        r, c = divmod(i, cols)
        cx = c * cell_w + cell_w // 2
        top = baseline_y_in_cell - img.height + r * cell_h
        sheet.paste(img, (cx - img.width // 2, top), img)
        draw.text((c * cell_w + 6, r * cell_h + cell_h - 18),
                  name, fill=(230, 230, 230, 255), font=font)
    sheet.convert('RGB').save(OUT / 'comparison_walk_vs_actions.png')
    print(f'comparison_walk_vs_actions.png: {len(references)} cells, baseline-aligned')


def actions_contact():
    """Plain contact sheet of all action poses at native size."""
    files = sorted((ASSETS / 'actions').glob('action_*.png'))
    imgs = [load_rgba(p) for p in files]
    cell_w = max(i.width for i in imgs) + 12
    cell_h = max(i.height for i in imgs) + 22
    cols = 8
    rows = (len(imgs) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * cell_w, rows * cell_h), (40, 40, 48, 255))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 10)
    except Exception:
        font = ImageFont.load_default()
    for i, (p, img) in enumerate(zip(files, imgs)):
        r, c = divmod(i, cols)
        x = c * cell_w + (cell_w - img.width) // 2
        y = r * cell_h + (cell_h - 18 - img.height)
        sheet.paste(img, (x, y), img)
        draw.text((c * cell_w + 4, r * cell_h + cell_h - 14),
                  p.stem, fill=(230, 230, 230, 255), font=font)
    sheet.convert('RGB').save(OUT / 'actions_contact.png')
    print(f'actions_contact.png: {len(imgs)} poses')


def main():
    walk_gif()
    build_sequence_gif()
    comparison_sheet()
    actions_contact()
    print(f'\nOutputs in {OUT}')


if __name__ == '__main__':
    main()
