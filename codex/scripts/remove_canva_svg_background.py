#!/usr/bin/env python3
"""Remove Canva's duplicate full-canvas white background paths from an SVG."""

from pathlib import Path
import sys


BACKGROUND = (
    '<path fill="#ffffff" d="M 0.117188 0 L 917.882812 0 L 917.882812 963.5 '
    'L 0.117188 963.5 Z M 0.117188 0 " fill-opacity="1" fill-rule="nonzero"/>'
)


def main(source: Path, destination: Path) -> None:
    svg = source.read_text(encoding="utf-8")
    count = svg.count(BACKGROUND)
    if count != 2:
        raise SystemExit(f"Expected 2 Canva background paths, found {count}; no file written.")
    svg = svg.replace(
        "</defs>",
        '<clipPath id="trim-canva-edge-artifacts"><rect x="0" y="40" width="918" height="870"/></clipPath></defs>',
        1,
    )
    svg = svg.replace(
        '<g mask="url(#01a34f6aed)">',
        '<g clip-path="url(#trim-canva-edge-artifacts)" mask="url(#01a34f6aed)">',
        1,
    )
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(svg.replace(BACKGROUND, ""), encoding="utf-8")
    print(f"Removed {count} full-canvas white background paths from {destination}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: remove_canva_svg_background.py INPUT.svg OUTPUT.svg")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
