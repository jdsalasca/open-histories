# AGENTS.md — guía para agentes que trabajan en open-histories

Lee esto entero antes de tocar nada. Está escrito para que **cualquier agente** (de cualquier modelo) haga bien el trabajo
y para que una revisión posterior sea rápida.

## 0. Briefing en 60 segundos (para Codex, Astra, Fable, DeepSeek, Claude… cualquiera)

**La iniciativa.** `open-histories` es una biblioteca abierta de cuentos clásicos de dominio público que se leen en el
navegador como libros de papel recortado animados, **completos** y en tres idiomas (español, 中文 graduado e inglés).
Sirve para dos cosas a la vez: leer con gusto y **aprender chino** leyendo (pinyin, subtítulos, glosario). Hay un
Rincón del terror (+12) para clásicos de miedo. La persona dueña la usa para estudiar chino y la quiere
**bonita, fluida y usable sin conexión**; más adelante crecerá con cuentos avanzados y poesía china.

**Qué se espera de ti.** Añadir cuentos (o mejorar lo existente) siguiendo la receta del §5, con la calidad del §0.2, y
publicar solo cuando el §9 esté completo. Una segunda persona/agente revisa antes de dar por bueno.

### 0.1 Cómo cargar un cuento (resumen; detalle en §5)

1. Original de dominio público (Gutenberg) → traduce al español **completo**.
2. `stories/<id>.js`: escenas SVG con el kit + `pages` + `quiz`.
3. `content/<id>.zh.json` y `<id>.en.json` con **los mismos párrafos por página**.
4. `uv run --with pypinyin python tools/pinyin.py content/<id>.zh.json` (y `.en.json`) → genera `stories/*.zh.js/.en.js`.
5. Catálogo (`stories/catalog.js`) + emblema (`index.html`) + README.
6. `node --test tests/*.test.js` · `unittest` · `node tools/validate.js` en verde y **mirar cada escena en el navegador**.

### 0.2 La calidad que se busca (si dudas, esto manda)

- **Fiel y completo**: es el cuento, no un resumen; el lenguaje de época se respeta.
- **Chino claro para estudiar**: frases cortas, vocabulario HSK 1–4, pinyin correcto (sin partículas mal leídas),
  glosario útil de ~15 palabras. Nada de chino "traducido literal" que suene raro.
- **Papercraft cuidado, no genérico**: capas con profundidad, un protagonista por escena, movimiento con intención
  (arcos, pasos tipo stop-motion), sin destellos masivos ni parpadeos en todo. Cada escena debe *contar* algo del texto.
- **Fluido**: debe ir bien en equipos modestos; respeta los niveles de calidad y no dibujes de más.
- **Accesible y didáctico**: tooltips de vocabulario, preguntas para pensar, quiz de 3 preguntas, texto legible en móvil.
- **Seguro para menores**: terror sin imágenes gráficas, con aviso y `age:12`.
- **Sin deuda**: tests verdes, validador verde, sin secretos, commits claros.

### 0.3 Cómo se publica (y por qué hay que tener cuidado)

Hay **dos destinos**, y el segundo es **PRODUCCIÓN**:

| Destino | Qué es | Cómo |
|---|---|---|
| **GitHub** (`jdsalasca/open-histories`, público) | Código y contenido; GitHub Pages es un espejo | `git push origin main` |
| **https://library.eridu.top** | **Servidor productivo real**, ya con usuarios (la persona dueña y quien reciba el enlace) | `./deploy.sh atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories` |

- El subdominio `library.eridu.top` está en Cloudflare y entra por un **túnel propio** a un servicio de usuario
  (`oh-server.py`, puerto 8090) en el servidor `192.168.1.100`. Comparte máquina con **otros sitios en producción**
  (`hotel.eridu.top`, `bogota-mitos.eridu.top`): jamás los toques.
- `deploy.sh` ya hace lo seguro: corre tests y validador (si fallan, **no despliega**), guarda la copia anterior en
  `…/open-histories.prev` y copia solo lo publicable. Reversa inmediata: `./deploy.sh --rollback atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories`.
- **Antes de desplegar**: tests/validador en verde, escenas vistas en local, `git status` limpio (todo commiteado y pusheado).
- **Después**: `curl -s "https://library.eridu.top/assets/build.js?x=$(date +%s)"` debe mostrar el hash de tu commit; abre el
  cuento nuevo en 3 idiomas; `https://hotel.eridu.top` debe seguir en 200. Si algo se ve mal: **rollback primero, depurar después**.
- No tienes (ni necesitas) `sudo`, ni acceso a Cloudflare, ni a credenciales. Si crees que lo necesitas, para y pregunta.
- La caché de Cloudflare puede mostrar archivos viejos un rato: usa `?x=<timestamp>` para comprobar y recarga con Ctrl+F5.

## 1. Qué es esto

Biblioteca web **estática** (sin compilación) de cuentos clásicos de **dominio público**, completos, en español,
**chino graduado** (para aprender) e inglés, ilustrados en **papercraft animado** (SVG). Hay una repisa (`index.html`),
un lector (`read.html?s=<id>`), ajustes (⚙), modo sin conexión y un Rincón del terror (+12).

- Repo público: `jdsalasca/open-histories` · sitio: https://library.eridu.top · espejo: GitHub Pages.
- Estado y decisiones: `docs/superpowers/specs/…-v2-design.md` (spec), `docs/superpowers/plans/…-v2.md` (plan).

## 2. Reglas de oro (no negociables)

1. **Solo dominio público.** Anota la fuente (p. ej. Project Gutenberg #). Nada de traducciones ajenas con derechos:
   las traducciones son propias (CC BY 4.0).
2. **Texto completo y fiel**, nunca un resumen. El lenguaje de época se conserva (el README lo avisa).
3. **Mismo número de párrafos por página** en es / zh / en. El validador lo exige.
4. **Chino graduado** (frases cortas, HSK 1–4), simplificado. Aun así fiel al contenido.
5. **No inventes datos ni fuentes.** Si no estás seguro de algo, dilo en el PR/commit.
6. **No toques lo que no es tuyo** (ver §8: servidor, túnel de Cloudflare, `hotel-os`).
7. **Coste:** no uses modelos caros. **Nunca Opus** (consume la cuota del equipo); tampoco Fable. Si necesitas un
   subagente, `sonnet` o `haiku`, y solo si hace falta de verdad.
8. **No metas secretos** (tokens, claves, `.env`, credenciales del túnel) en el repo ni en logs.

## 3. Estructura

```
index.html · read.html · sw.js · manifest.webmanifest
assets/   kit.js (piezas de cartón) · reader.js · settings.js · i18n.js · text.js · perf.js · words.js
          offline.js · panel.js · book.css · shelf.css · panel.css · fonts/ · build.js · icons/
stories/  catalog.js (metadatos)  ·  <id>.js (escenas + español)  ·  <id>.zh.js / <id>.en.js (GENERADOS)
content/  <id>.zh.json · <id>.en.json   ← FUENTE de chino e inglés (edita estos, no los .js generados)
tools/    validate.js · pinyin.py · pinyin-overrides.json · pinyin_review.py · outline.js · stage.sh · pack.sh · oh-server.py
tests/    *.test.js (node --test) · test_pinyin.py (unittest) · fixtures/
docs/     spec y plan
```

## 4. Comandos (todo debe quedar en verde antes de entregar)

```bash
node --test tests/*.test.js                                   # pruebas JS
uv run --with pypinyin python -m unittest tests.test_pinyin   # pinyin
node tools/validate.js                                        # catálogo + alineación es/zh/en + pinyin + glosario
python -m http.server 8000                                    # ver en local: http://localhost:8000
```

En Windows usa `PYTHONIOENCODING=utf-8` si imprimes chino. No instales Python/Node extra: usa `uv run --with …`.

## 5. Cómo añadir un cuento (receta)

1. **Original**: descárgalo (Gutenberg) a una carpeta temporal fuera del repo.
2. **Español** → `stories/<id>.js` (copia `stories/perico-conejo.js` o `gigante-egoista.js`):
   - `scenes` = funciones que devuelven SVG con el kit (`K.ly`, `K.paper`, `K.svg`, árboles, animales, `fog`, `motes`…).
     Una `cover` y una `fin` obligatorias. Un protagonista por escena; movimiento sobrio.
   - `pages` = `{ scene, title, text:[párrafos], word?, think? }`. Vocabulario con `{{palabra|significado}}`.
   - `quiz` = 3 preguntas con `a` (índice correcto), `ok`, `no`. `moral`, `tagline`, `intro`.
   - Terror: `theme:'terror'`, `warning`, `age:12` en el catálogo, y escenas **sin imágenes gráficas**.
3. **Estructura**: `node tools/outline.js <id> --text` te da páginas y nº de párrafos para alinear.
4. **Chino e inglés**: escribe `content/<id>.zh.json` y `content/<id>.en.json` (`title`, `tagline`, `intro`, `moral`,
   `pages:[{title,text[],word?,think?}]`, `glossary` (solo zh: `{h,es,en}`), `quiz` con `a`).
   - `glossary`: cada `h` **debe aparecer** en el texto zh; prefiere palabras de 2+ caracteres.
   - `*palabra*` en un título marca el acento visual.
5. **Genera**: `uv run --with pypinyin python tools/pinyin.py content/<id>.zh.json` (y `.en.json`).
6. **Revisa el pinyin**: `python tools/pinyin_review.py stories/<id>.zh.js` y corrige lecturas en
   `tools/pinyin-overrides.json` (o amplía las reglas en `tools/pinyin.py` **con una prueba**).
7. **Catálogo**: añade/activa la entrada en `stories/catalog.js` (`files`, `langs`, `level`, `title` es/zh/en) y su emblema
   en `index.html` (objeto `E`). Si es terror: `shelf:'terror'`, `age:12`.
8. **Valida** (§4) y **mira las escenas en un navegador** (cada página, 3 niveles de calidad: `OH.settings.set({quality:'baja'})`).
9. Commit pequeño y descriptivo. Para publicar, ver §7.

## 5b. Backlog (en este orden)

| Cuento | Estante | Fuente |
|---|---|---|
| El Ruiseñor y la Rosa (Wilde) | día | Gutenberg #902 (*The Happy Prince and Other Tales*) |
| La niña de los fósforos (Andersen) | día | Gutenberg #1597 |
| Caperucita Roja (Grimm) | día | Gutenberg #2591 (*Little Red-Cap*) |
| El gato negro (Poe) | terror | Gutenberg #2148 |
| La pata de mono (W. W. Jacobs) | terror | Gutenberg (buscar *The Monkey's Paw*, 1902) |
| Cuentos más avanzados y **poesía china** | nuevos estantes | ver spec §7 (extensibilidad) |

## 6. Trampas ya encontradas (no las repitas)

- **Pinyin**: `pypinyin` falla con partículas `地/得`, `只` (zhī/zhǐ), `更`, `给`, `种`, `倒`, `着`. `tools/pinyin.py` tiene
  reglas; lo que quede va a `pinyin-overrides.json`. Revisa siempre con `pinyin_review.py`.
- **HTML en párrafos zh**: `<b>`/`<i>` están permitidos; el lector los respeta (`tagMask`). Cualquier otra etiqueta se escapa.
- **`py` alineado**: una sílaba por carácter chino; Latin/dígitos/puntuación pasan tal cual. No edites `py` a mano.
- **Archivos generados**: `stories/*.zh.js` y `*.en.js` se generan; **edita `content/*.json`**, no ellos.
- **Rendimiento**: no dibujes todas las escenas; el lector solo monta la página actual ±1. Usa las piezas del kit (respetan
  `OH.kit.setQuality`); no añadas filtros SVG propios fuera de `K.paper`. No pongas animaciones continuas dentro de
  grupos con filtro (re-render caro).
- **Caché**: tras desplegar, Cloudflare puede servir archivos viejos. El servidor ya manda `Cache-Control: no-cache`;
  `build.js` se estampa en `tools/stage.sh`. Un `?x=…` rompe la caché al comprobar.
- **Service worker**: no se puede probar en el panel integrado de Claude Desktop; pruébalo en Chrome/Firefox normal
  (HTTPS o `localhost`).
- **Terror**: ni gore ni imágenes explícitas en las escenas; aviso `warning` y `age:12`.
- **Settings**: el subtítulo válido es `es | en | none` y nunca igual al idioma principal.

## 7. Publicar

Solo con la tarea terminada y los tres comandos del §4 en verde.

```bash
git push origin main                       # GitHub (y Pages se reconstruye solo)
./deploy.sh atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories   # library.eridu.top
bash tools/pack.sh                         # dist/open-histories-offline.zip (para un release)
```

Comprueba después: `curl -s https://library.eridu.top/assets/build.js` debe mostrar el hash del commit nuevo, y abre un
cuento nuevo en los 3 idiomas. `hotel.eridu.top` debe seguir en 200.

## 8. Servidor (solo lectura de contexto; no lo reconfigures)

- Host `atopnuc@192.168.1.100` (LAN, SSH con clave). El sitio vive en `~/sitios/open-histories`, servido por
  `oh-server.py` (servicio de usuario `open-histories-http`, puerto 8090) y expuesto con un **túnel propio**
  (`open-histories-tunnel`, hostname `library.eridu.top`).
- **No toques**: `~/sitios/hotel-os`, el túnel compartido de `hotel.eridu.top` / `bogota-mitos.eridu.top`, Apache, ni
  nada con `sudo`. No leas ni copies credenciales del túnel.
- Si algo del servidor falla, **para y avisa**; no improvises.

## 9. Definición de hecho (checklist para entregar)

- [ ] `node --test`, `unittest` y `validate.js` en verde (pega la salida).
- [ ] Texto es/zh/en completo, mismas páginas y párrafos; sin resúmenes.
- [ ] Pinyin revisado con `pinyin_review.py`; overrides con motivo.
- [ ] Cada escena vista en el navegador (cover, páginas, quiz) y en calidad Baja; sin errores en consola.
- [ ] Catálogo + emblema + README (tabla de estado) actualizados.
- [ ] Sin secretos, sin archivos grandes sueltos, sin tocar §8.
- [ ] Commits pequeños con mensaje claro. Avisa qué NO pudiste verificar (p. ej. service worker).

## 10. Revisión

Cuando termines, deja en tu último mensaje: qué hiciste, qué comandos corriste y su salida, qué quedó pendiente o dudoso.
Una segunda persona/agente revisará contra este documento y la spec antes de publicar.
