#!/usr/bin/env bash
# Genera dist/open-histories-offline.zip: el sitio completo, que funciona abriendo index.html (file://).
set -euo pipefail
cd "$(dirname "$0")/.."
bash tools/stage.sh
PY=$(command -v python3 || command -v python)
"$PY" - <<'PY'
import os, zipfile
src = 'dist/site'
out = 'dist/open-histories-offline.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(src):
        for f in files:
            p = os.path.join(root, f)
            z.write(p, os.path.join('open-histories', os.path.relpath(p, src)))
print(out, os.path.getsize(out), 'bytes')
PY
