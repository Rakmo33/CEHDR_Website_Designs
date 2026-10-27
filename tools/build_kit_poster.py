from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(
    "/Users/rakmo33/.codex/generated_images/"
    "019f75e9-3488-7401-be6d-7176533bc794/"
    "exec-a9e38a2b-2c2b-4ec2-9455-54828bc6d3a3.png"
)
OUTPUT = ROOT / "output/posters/cehdr-community-forum-kit-poster-17x11-vibrant.png"

WIDTH, HEIGHT = 5100, 3300
HEADER_H = 620
ACCENT_H = 26

NAVY = "#062B57"
ORANGE = "#F6A623"
WHITE = "#FFFFFF"
GOLD = "#F6C43A"

FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, start: int) -> ImageFont.FreeTypeFont:
    size = start
    while size > 24:
        font = ImageFont.truetype(FONT, size)
        if draw.textbbox((0, 0), text, font=font)[2] <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(FONT, size)


def centered(draw: ImageDraw.ImageDraw, text: str, y: int, font: ImageFont.FreeTypeFont, fill: str) -> None:
    box = draw.textbbox((0, 0), text, font=font)
    x = (WIDTH - (box[2] - box[0])) // 2
    draw.text((x, y), text, font=font, fill=fill)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    photo = Image.open(SOURCE).convert("RGB")

    # Use the original one-pass edit and crop away unused wall space. The crop
    # is sized to fill the poster's photo area without stretching.
    photo_h = HEIGHT - HEADER_H - ACCENT_H
    target_ratio = WIDTH / photo_h
    crop_w = photo.width
    crop_h = round(crop_w / target_ratio)
    bottom = photo.height
    top = max(0, bottom - crop_h)
    photo = photo.crop((0, top, crop_w, bottom))
    photo = photo.resize((WIDTH, photo_h), Image.Resampling.LANCZOS)

    poster = Image.new("RGB", (WIDTH, HEIGHT), NAVY)
    poster.paste(photo, (0, HEADER_H + ACCENT_H))
    draw = ImageDraw.Draw(poster)

    # Gold divider between header and photograph.
    draw.rectangle((0, HEADER_H, WIDTH, HEADER_H + ACCENT_H - 1), fill=GOLD)

    # Equal empty navy logo-placement zones occupy 13% on each side.
    text_width = round(WIDTH * 0.72)
    event_line_1 = "COMMUNITY FORUM ON HEALTHY LONGEVITY,"
    event_line_2 = "CAREGIVING, AND EMERGENCY PREPAREDNESS"
    event_font = fit_font(draw, event_line_2, text_width, 118)
    main_font = fit_font(draw, "CEHDR PREPAREDNESS KIT", text_width, 225)

    centered(draw, event_line_1, 52, event_font, ORANGE)
    centered(draw, event_line_2, 160, event_font, ORANGE)
    centered(draw, "CEHDR PREPAREDNESS KIT", 300, main_font, WHITE)

    poster.save(OUTPUT, dpi=(300, 300), optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
