#!/usr/bin/env bash
# Publica la repisa en un servidor por SSH (solo archivos estáticos, con versión de caché estampada).
# Uso: ./deploy.sh usuario@host:/ruta/destino
set -euo pipefail
DEST="${1:?Uso: ./deploy.sh usuario@host:/ruta/destino}"
HOSTPART="${DEST%%:*}"; PATHPART="${DEST#*:}"
bash "$(dirname "$0")/tools/stage.sh" >/dev/null
OUT="$(dirname "$0")/dist/site"
ssh "$HOSTPART" "mkdir -p '$PATHPART'"
scp -r "$OUT"/* "$HOSTPART:$PATHPART/"
echo "Publicado en $DEST"
