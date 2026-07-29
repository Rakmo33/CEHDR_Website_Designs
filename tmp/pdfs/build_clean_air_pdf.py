from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from pypdf import PdfReader


ROOT = Path("/Users/rakmo33/Documents/CEHDR/CEHDR_Website_Designs")
PAGE1_SOURCE = Path("/Users/rakmo33/Downloads/Kudos article website cover iimage - 2.png")
PAGE2_SOURCE = Path("/Users/rakmo33/Downloads/Clean Air, Healthy Heart.png3.png")
PAGE1_READY = ROOT / "tmp/pdfs/page-1-ready.png"
PAGE2_READY = ROOT / "tmp/pdfs/page-2-ready.png"
OUTPUT_PDF = ROOT / "output/pdf/clean-air-healthy-hearts-two-page.pdf"

TARGET_W = 1254
TARGET_H = 1568
TOP_PAD = 100
BOTTOM_PAD = TARGET_H - 1254 - TOP_PAD
ARTICLE_URL = "https://journals.plos.org/climate/article?id=10.1371/journal.pclm.0001006"


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def prepare_page_one() -> None:
    image = Image.open(PAGE1_SOURCE).convert("RGB")
    # The source is already essentially 4:5; this sub-0.1% ratio adjustment is invisible.
    image = image.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    image.save(PAGE1_READY, quality=95)


def prepare_page_two() -> None:
    source = Image.open(PAGE2_SOURCE).convert("RGB")
    if source.size != (1254, 1254):
        source = source.resize((1254, 1254), Image.Resampling.LANCZOS)

    canvas_image = Image.new("RGB", (TARGET_W, TARGET_H), "white")
    draw = ImageDraw.Draw(canvas_image)

    # Continue the existing white-to-blue header atmosphere above the source.
    left_top = (250, 250, 249)
    right_top = (99, 182, 228)
    for x in range(TARGET_W):
        t = x / (TARGET_W - 1)
        color = tuple(lerp(left_top[i], right_top[i], t) for i in range(3))
        draw.line((x, 0, x, TOP_PAD), fill=color)

    canvas_image.paste(source, (0, TOP_PAD))

    # Continue the clean white footer below the source without stretching its typography.
    footer_start = TOP_PAD + source.height
    for y in range(footer_start, TARGET_H):
        t = (y - footer_start) / max(1, BOTTOM_PAD - 1)
        shade = lerp(250, 255, t)
        draw.line((0, y, TARGET_W, y), fill=(shade, shade, shade))

    canvas_image.save(PAGE2_READY, quality=95)


def build_pdf() -> None:
    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=(TARGET_W, TARGET_H), pageCompression=1)
    pdf.setTitle("Clean Air, Healthy Hearts")
    pdf.setAuthor("Center for Environmental Health Disparities Research")

    pdf.drawImage(str(PAGE1_READY), 0, 0, width=TARGET_W, height=TARGET_H, mask="auto")
    pdf.showPage()

    pdf.drawImage(str(PAGE2_READY), 0, 0, width=TARGET_W, height=TARGET_H, mask="auto")

    # Button bounds in the original square artwork, offset by TOP_PAD.
    button_left = 1050
    button_right = 1232
    button_top_from_image = 1200 + TOP_PAD
    button_bottom_from_image = 1250 + TOP_PAD
    link_bottom = TARGET_H - button_bottom_from_image
    link_top = TARGET_H - button_top_from_image
    pdf.linkURL(
        ARTICLE_URL,
        (button_left, link_bottom, button_right, link_top),
        relative=0,
        thickness=0,
    )
    pdf.showPage()
    pdf.save()


def validate_pdf() -> None:
    reader = PdfReader(str(OUTPUT_PDF))
    if len(reader.pages) != 2:
        raise RuntimeError(f"Expected 2 pages, found {len(reader.pages)}")
    annotations = reader.pages[1].get("/Annots") or []
    urls = []
    for ref in annotations:
        annotation = ref.get_object()
        action = annotation.get("/A")
        if action and action.get("/URI"):
            urls.append(action.get("/URI"))
    if ARTICLE_URL not in urls:
        raise RuntimeError(f"Expected article URL annotation; found {urls}")
    for page in reader.pages:
        width = round(float(page.mediabox.width))
        height = round(float(page.mediabox.height))
        if (width, height) != (TARGET_W, TARGET_H):
            raise RuntimeError(f"Unexpected page size: {(width, height)}")
    print(f"Created: {OUTPUT_PDF}")
    print(f"Pages: {len(reader.pages)}")
    print(f"Page size: {TARGET_W} x {TARGET_H}")
    print(f"Verified URL: {ARTICLE_URL}")


if __name__ == "__main__":
    prepare_page_one()
    prepare_page_two()
    build_pdf()
    validate_pdf()
