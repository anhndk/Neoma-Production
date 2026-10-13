#!/usr/bin/env python3
"""Bungkus SVG animasi (corner, gunungan, aksen, frame) dadi assets/js/art.js
supaya undangan tetep mlaku nalika dibukak langsung seko file:// (tanpa fetch).
Jalanke maneh saben ngganti file SVG:   python3 tools/embed_svg.py
"""
import re, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
files = {"corner": "corner.svg", "gunungan": "gunungan.svg", "aksen": "aksen.svg", "frame": "frame galeri.svg"}
out = {}
for key, name in files.items():
    s = (root / "assets/svg" / name).read_text(encoding="utf-8")
    s = re.sub(r"<\?xml[^>]*\?>", "", s)
    s = re.sub(r"<!DOCTYPE[^>]*>", "", s)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r"<metadata[^>]*/>", "", s)
    s = re.sub(r'\s(width|height)="[^"]*px"', "", s, count=2)
    s = re.sub(r"\s+", " ", s).strip()
    out[key] = s
(root / "assets/js/art.js").write_text("window.ART=" + json.dumps(out, ensure_ascii=False) + ";\n", encoding="utf-8")
print("art.js ok", {k: len(v) for k, v in out.items()})
