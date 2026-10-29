#!/usr/bin/env python3
"""Trace a transparent raster into a one-color, compound-path SVG."""

from collections import deque
from pathlib import Path
import sys

from PIL import Image, ImageFilter


def clean_mask(image: Image.Image, min_component: int = 12) -> list[bytearray]:
    alpha = image.convert("RGBA").getchannel("A")
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.65))
    width, height = alpha.size
    pixels = alpha.load()
    mask = [bytearray(pixels[x, y] >= 96 for x in range(width)) for y in range(height)]

    seen = [bytearray(width) for _ in range(height)]
    for y in range(height):
        for x in range(width):
            if not mask[y][x] or seen[y][x]:
                continue
            queue = deque([(x, y)])
            seen[y][x] = 1
            component = []
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height and mask[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = 1
                        queue.append((nx, ny))
            if len(component) < min_component:
                for px, py in component:
                    mask[py][px] = 0
    return mask


def boundary_loops(mask: list[bytearray]) -> list[list[tuple[int, int]]]:
    height, width = len(mask), len(mask[0])
    outgoing: dict[tuple[int, int], list[tuple[int, int]]] = {}

    def add(a, b):
        outgoing.setdefault(a, []).append(b)

    for y in range(height):
        for x in range(width):
            if not mask[y][x]:
                continue
            if y == 0 or not mask[y - 1][x]:
                add((x, y), (x + 1, y))
            if x == width - 1 or not mask[y][x + 1]:
                add((x + 1, y), (x + 1, y + 1))
            if y == height - 1 or not mask[y + 1][x]:
                add((x + 1, y + 1), (x, y + 1))
            if x == 0 or not mask[y][x - 1]:
                add((x, y + 1), (x, y))

    loops = []
    while outgoing:
        start = next(iter(outgoing))
        current = start
        points = [start]
        while True:
            choices = outgoing.get(current)
            if not choices:
                break
            nxt = choices.pop()
            if not choices:
                del outgoing[current]
            current = nxt
            if current == start:
                break
            points.append(current)
        if current == start and len(points) >= 4:
            simplified = []
            for point in points:
                simplified.append(point)
                while len(simplified) >= 3:
                    a, b, c = simplified[-3:]
                    if (b[0] - a[0]) * (c[1] - b[1]) == (b[1] - a[1]) * (c[0] - b[0]):
                        simplified.pop(-2)
                    else:
                        break
            loops.append(simplified)
    return loops


def write_svg(source: Path, destination: Path) -> None:
    image = Image.open(source)
    width, height = image.size
    loops = boundary_loops(clean_mask(image))
    commands = []
    for loop in loops:
        commands.append(f"M{loop[0][0]} {loop[0][1]}")
        commands.extend(f"L{x} {y}" for x, y in loop[1:])
        commands.append("Z")

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        "\n".join(
            [
                '<?xml version="1.0" encoding="UTF-8"?>',
                f'<svg xmlns="http://www.w3.org/2000/svg" width="4.762in" height="5in" viewBox="0 0 {width} {height}">',
                '  <title>CEHDR Preparedness Kit — one-color white imprint</title>',
                '  <desc>Vector trace sized to fit within a 5 by 5 inch imprint area.</desc>',
                f'  <path fill="#FFFFFF" fill-rule="evenodd" d="{" ".join(commands)}"/>',
                '</svg>',
            ]
        ),
        encoding="utf-8",
    )
    print(f"Wrote {destination} with {len(loops)} closed vector contours")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: trace_one_color_svg.py INPUT.png OUTPUT.svg")
    write_svg(Path(sys.argv[1]), Path(sys.argv[2]))
