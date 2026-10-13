#!/usr/bin/env bash
# Publica la repisa en un servidor por SSH (solo archivos estáticos).
# Uso: ./deploy.sh usuario@192.168.1.100:/ruta/web/open-histories
set -euo pipefail
DEST="${1:?Uso: ./deploy.sh usuario@host:/ruta/destino}"
HOSTPART="${DEST%%:*}"; PATHPART="${DEST#*:}"
ssh "$HOSTPART" "mkdir -p '$PATHPART'"
scp -r index.html read.html assets stories audio "$HOSTPART:$PATHPART/"
echo "Publicado en $DEST"
