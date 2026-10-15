#!/usr/bin/env bash
# Publica la repisa en un servidor por SSH (solo archivos estáticos, con versión de caché estampada).
#   ./deploy.sh usuario@host:/ruta/destino              despliega (antes guarda copia en <ruta>.prev)
#   ./deploy.sh --rollback usuario@host:/ruta/destino   vuelve a la copia anterior (<ruta>.prev)
# ES UN SERVIDOR DE PRODUCCIÓN (library.eridu.top): prueba en local y pasa los tests antes de desplegar.
set -euo pipefail
cd "$(dirname "$0")"

MODE=deploy
if [ "${1:-}" = "--rollback" ]; then MODE=rollback; shift; fi
DEST="${1:?Uso: ./deploy.sh [--rollback] usuario@host:/ruta/destino}"
HOSTPART="${DEST%%:*}"; PATHPART="${DEST#*:}"

if [ "$MODE" = rollback ]; then
  ssh "$HOSTPART" "test -d '$PATHPART.prev' || { echo 'No hay copia anterior en $PATHPART.prev' >&2; exit 1; }; cp -a '$PATHPART.prev/.' '$PATHPART/'"
  echo "Restaurada la copia anterior en $DEST"
  exit 0
fi

# Puerta de calidad: no se despliega con pruebas rojas.
node --test tests/*.test.js >/dev/null
node tools/validate.js

bash tools/stage.sh >/dev/null
OUT="dist/site"
ssh "$HOSTPART" "mkdir -p '$PATHPART' && rm -rf '$PATHPART.prev' && cp -a '$PATHPART' '$PATHPART.prev'"
scp -r "$OUT"/* "$HOSTPART:$PATHPART/"
echo "Publicado en $DEST (copia anterior en $PATHPART.prev)"
