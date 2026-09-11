from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / 'android' / 'app' / 'src' / 'main' / 'res'

SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

FG_SIZES = {
    'mipmap-mdpi': 108,
    'mipmap-hdpi': 162,
    'mipmap-xhdpi': 216,
    'mipmap-xxhdpi': 324,
    'mipmap-xxxhdpi': 432,
}

def rounded_rect(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)

def draw_app_icon(size: int, with_padding: bool = True) -> Image.Image:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Brand colors aligned with public/app-icon.svg
    bg = '#123b67'
    bg_dark = '#0e3155'
    card = '#f8fbff'
    green = '#21b486'
    light = '#d8fff1'
    ink = '#123b67'
    muted = '#b9cbe0'

    padding = int(size * 0.08) if with_padding else 0
    inner = (padding, padding, size - padding, size - padding)
    radius = int(size * 0.22)
    rounded_rect(d, inner, radius, bg)

    # bottom wave
    d.polygon([
        (0, int(size * 0.76)),
        (int(size * 0.18), int(size * 0.71)),
        (int(size * 0.39), int(size * 0.69)),
        (int(size * 0.58), int(size * 0.72)),
        (int(size * 0.81), int(size * 0.75)),
        (size, int(size * 0.70)),
        (size, size),
        (0, size),
    ], fill=bg_dark)

    # document card
    card_box = (
        int(size * 0.21),
        int(size * 0.17),
        int(size * 0.79),
        int(size * 0.82),
    )
    rounded_rect(d, card_box, int(size * 0.06), card)

    # top pill/header
    pill_box = (
        int(size * 0.34),
        int(size * 0.13),
        int(size * 0.66),
        int(size * 0.23),
    )
    rounded_rect(d, pill_box, int(size * 0.05), green)
    d.rounded_rectangle(
        (
            int(size * 0.40), int(size * 0.17),
            int(size * 0.60), int(size * 0.19)
        ),
        radius=max(1, int(size * 0.01)),
        fill=light
    )

    # lines
    def line(y, x1, x2, color, h):
        d.rounded_rectangle((x1, y, x2, y + h), radius=h // 2, fill=color)

    line(int(size * 0.32), int(size * 0.33), int(size * 0.67), ink, max(2, int(size * 0.03)))
    line(int(size * 0.43), int(size * 0.33), int(size * 0.74), muted, max(1, int(size * 0.02)))
    line(int(size * 0.54), int(size * 0.33), int(size * 0.66), muted, max(1, int(size * 0.02)))
    line(int(size * 0.65), int(size * 0.33), int(size * 0.55), muted, max(1, int(size * 0.02)))

    # success badge
    r = int(size * 0.13)
    cx = int(size * 0.68)
    cy = int(size * 0.71)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=green)
    d.line((cx - int(r * 0.45), cy, cx - int(r * 0.08), cy + int(r * 0.35)), fill='white', width=max(2, int(size * 0.03)))
    d.line((cx - int(r * 0.08), cy + int(r * 0.35), cx + int(r * 0.48), cy - int(r * 0.28)), fill='white', width=max(2, int(size * 0.03)))

    return img

def main():
    for folder, size in SIZES.items():
        folder_path = RES / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        icon = draw_app_icon(size, with_padding=False)
        icon.save(folder_path / 'ic_launcher.png')
        icon.save(folder_path / 'ic_launcher_round.png')

    for folder, size in FG_SIZES.items():
        folder_path = RES / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        fg = draw_app_icon(size, with_padding=True)
        fg.save(folder_path / 'ic_launcher_foreground.png')

    print('Generated Android launcher icons from app brand colors.')

if __name__ == '__main__':
    main()