#!/usr/bin/env bash
# Prepara dist/site con SOLO lo publicable y estampa la versión de caché (assets/build.js).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=dist/site
rm -rf "$OUT"; mkdir -p "$OUT"
cp -r index.html read.html sw.js manifest.webmanifest assets stories audio LICENSE README.md "$OUT"/
BUILD=$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M)
echo "self.OH_BUILD = '$BUILD';" > "$OUT/assets/build.js"
echo "$OUT (build $BUILD)"
