#!/usr/bin/env python3
"""Make Canva's embedded raster artwork transparent and wrap it in a clean SVG."""

import base64
from io import BytesIO
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

from PIL import Image


SVG = "{http://www.w3.org/2000/svg}"
XLINK_HREF = "{http://www.w3.org/1999/xlink}href"


def main(source: Path, destination: Path) -> None:
    root = ET.parse(source).getroot()
    images = list(root.iter(SVG + "image"))
    if len(images) < 2:
        raise SystemExit("Expected Canva SVG to contain at least two embedded images.")
    uri = images[-1].get(XLINK_HREF)
    raw = base64.b64decode(uri.split(",", 1)[1])
    image = Image.open(BytesIO(raw)).convert("RGBA")

    cleaned = []
    for red, green, blue, alpha in image.getdata():
        brightness = max(red, green, blue)
        if brightness < 160:
            cleaned.append((red, green, blue, 0))
        else:
            cleaned.append((red, green, blue, alpha))
    image.putdata(cleaned)

    png_destination = destination.with_suffix(".png")
    png_destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(png_destination, format="PNG", optimize=True)

    trace_input = Image.new("RGB", image.size, "white")
    trace_pixels = []
    for _red, _green, _blue, alpha in image.getdata():
        trace_pixels.append((0, 0, 0) if alpha >= 32 else (255, 255, 255))
    trace_input.putdata(trace_pixels)
    trace_destination = destination.with_name(destination.stem + "_trace_black_on_white.png")
    trace_input.save(trace_destination, format="PNG", optimize=True)

    output = BytesIO()
    image.save(output, format="PNG", optimize=True)
    encoded = base64.b64encode(output.getvalue()).decode("ascii")
    width, height = image.size
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <title>CEHDR Preparedness Kit — transparent Canva artwork</title>
  <image width="{width}" height="{height}" xlink:href="data:image/png;base64,{encoded}"/>
</svg>
''',
        encoding="utf-8",
    )
    print(f"Wrote transparent PNG to {png_destination}")
    print(f"Wrote black-on-white tracing source to {trace_destination}")
    print(f"Wrote transparent SVG wrapper to {destination}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: clean_embedded_canva_svg.py INPUT.svg OUTPUT.svg")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
