# open-histories v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship v2 of open-histories: chino graduado con subtítulos, ruedita de ajustes, rendimiento medible, modo sin conexión descargable, "Mis palabras", y 2 cuentos nuevos, todo trilingüe y publicado.

**Architecture:** Sitio estático sin compilación. Módulos puros (ajustes, texto, rendimiento, desc. offline, palabras) en `assets/*.js` con exportación CommonJS condicional para probarlos con `node --test`; el DOM (lector, repisa, panel) los consume. El contenido se separa por idioma (`stories/<id>.<lang>.js`) y un catálogo único (`stories/catalog.js`).

**Tech Stack:** HTML/CSS/JS clásico (sin bundler), SVG, Service Worker + Cache Storage, `node --test` (Node 24), Python 3.13 + `pypinyin` vía `uv run --with pypinyin`, ffmpeg (ya usado), `gh`.

**Spec:** `docs/superpowers/specs/2026-10-13-open-histories-v2-design.md`

## Global Constraints

- Estático, **sin compilación**; todo funciona abriendo `index.html` (file://) o desde un hosting estático.
- Idiomas: Español (base), 中文 (simplified), English. Nunca el subtítulo igual al idioma principal.
- Chino **graduado, HSK 1–3**, oraciones cortas (≤ ~12 palabras), pinyin con **una sílaba por carácter chino**.
- `pages[i].text.length` **igual** en es, zh y en para cada página.
- Persistencia: `localStorage['oh-settings']` con `v:1`; `localStorage['oh-words']`.
- Calidad: Alta / Media / Baja / Auto; Auto baja un nivel si la **mediana entre cuadros > 28 ms** durante 3 s; en Media ≥ 45 fps, en Baja ≥ 55 fps; primer pintado del lector < 1.5 s en local.
- Fuentes propias `Playfair Display` y `Nunito` (woff2, `font-display: swap`, licencia OFL); el chino usa fuentes del sistema.
- Caché del service worker: `oh-v2-<hash>`.
- Licencias: código MIT; traducciones, arte y sonidos CC BY 4.0; originales en dominio público.
- Todo se publica en el repo público `jdsalasca/open-histories` y en `library.eridu.top`.

## Review Focus

- Glosario con palabras que se solapan o que no aparecen en una página: el marcado no debe romperse (gana la coincidencia más larga).
- `localStorage` bloqueado o con JSON corrupto: la app arranca con valores por defecto, sin excepción.
- Texto chino con letras latinas, números o signos entre medias: `py` los deja pasar tal cual y el emparejamiento carácter↔sílaba no se desfasa.
- Subtítulo o idioma elegido sin archivo de idioma para ese cuento: cae al idioma base/sin subtítulo, con aviso, sin error.
- Gobernador **Auto** que oscila entre niveles, o navegador sin voz `zh-CN`: histéresis (no vuelve a subir antes de 10 s) y mensaje claro, sin bloquear la lectura.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `stories/catalog.js` | Metadatos de todos los cuentos (fuente única) |
| `assets/settings.js` | Esquema, normalización, persistencia, suscripción de ajustes |
| `assets/i18n.js` | Textos de interfaz es/zh/en |
| `assets/text.js` | Funciones puras de texto: ruby, glosario, resolución de idiomas |
| `assets/perf.js` | Niveles de calidad, gobernador Auto, `?perf=1` |
| `assets/words.js` | "Mis palabras": almacenamiento |
| `assets/offline.js` | Lista de archivos por cuento, descarga, estado |
| `assets/panel.js` | Ruedita ⚙ (UI de ajustes + descargas + palabras) |
| `assets/reader.js` | (modificar) render perezoso, idiomas, subtítulos |
| `sw.js`, `manifest.webmanifest` | Service worker e instalación |
| `tools/validate.js` | Validador de contenido |
| `tools/pinyin.py`, `tools/pinyin-overrides.json` | Generación de pinyin |
| `tools/pack.sh` | Paquete offline `.zip` |
| `tests/*.test.js`, `tests/test_pinyin.py` | Pruebas |

---

## Phase A — Motor v2

### Task 1: Catálogo único y validador base

**Files:**
- Create: `stories/catalog.js`, `tools/validate.js`, `tests/validate.test.js`
- Modify: `index.html` (renderiza desde `OH.catalog`)

**Interfaces:**
- Produces: `OH.catalog: Array<{id, shelf:'dia'|'terror', kind:'cuento', level:{zh?:string}, title:{es,zh,en}, author, year, cover:{color,emblem}, langs:string[], age:number, files:string[], soon?:true}>`
- Produces: `validateCatalog(catalog, fileExists: (path)=>boolean): string[]` (lista de errores) en `tools/validate.js`.

- [ ] **Step 1:** Escribir `tests/validate.test.js` con `catalog_ok_when_all_files_exist`, `catalog_error_when_story_file_missing`, `catalog_error_on_duplicate_id`.
- [ ] **Step 2:** `node --test tests/validate.test.js` → FAIL (módulo inexistente).
- [ ] **Step 3:** Implementar `validateCatalog` y mover la lista `DAY`/`NIGHT` de `index.html` a `stories/catalog.js` (títulos zh/en provisionales = es). `index.html` genera estantes a partir de `shelf`.
- [ ] **Step 4:** `node --test tests/validate.test.js` → PASS; abrir `index.html` y confirmar que se ven los 10 libros como antes.
- [ ] **Step 5:** Commit `feat: catálogo único y validador base`.

### Task 2: Módulo de ajustes

**Files:**
- Create: `assets/settings.js`, `tests/settings.test.js`

**Interfaces:**
- Produces: `OH.settings = { DEFAULTS, normalize(raw:any):Settings, load():Settings, save(s):void, get():Settings, set(patch:Partial<Settings>):Settings, onChange(fn:(s:Settings)=>void):()=>void }`
- `Settings = {v:1, lang:'es'|'zh'|'en', sub:'es'|'en'|'none', subMode:'always'|'tap'|'hidden', pinyin:'always'|'tap'|'off', size:'S'|'M'|'L'|'XL', rate:number(0.6–1.2), sound:boolean, quality:'auto'|'alta'|'media'|'baja', motion:'auto'|'reduce', theme:'auto'|'light'|'dark', terror:boolean}`

- [ ] **Step 1:** Tests: `normalize_fills_defaults_for_empty`, `normalize_clamps_rate_and_rejects_unknown_enums`, `sub_never_equals_lang` (lang `zh`, sub `zh` → `es`; lang `es`, sub `es` → `en`), `load_survives_corrupt_json_and_missing_storage` (storage que lanza), `set_persists_and_notifies_once`.
- [ ] **Step 2:** `node --test tests/settings.test.js` → FAIL.
- [ ] **Step 3:** Implementar con exportación `module.exports` condicional y almacenamiento inyectable (`globalThis.localStorage` en el navegador).
- [ ] **Step 4:** Tests → PASS.
- [ ] **Step 5:** Commit `feat: módulo de ajustes con normalización y persistencia`.

### Task 3: Textos de interfaz (i18n)

**Files:**
- Create: `assets/i18n.js`, `tests/i18n.test.js`

**Interfaces:**
- Produces: `OH.i18n = { STRINGS:{es:{},zh:{},en:{}}, t(key:string, lang:'es'|'zh'|'en'):string }` (clave ausente → devuelve la clave en `es`, nunca lanza).

- [ ] **Step 1:** Tests: `all_keys_exist_in_all_langs`, `t_falls_back_to_es_then_key`.
- [ ] **Step 2:** Correr → FAIL.
- [ ] **Step 3:** Definir claves de la ruedita, lector, repisa, descargas, calidad, "Mis palabras" (≈50 claves) en los 3 idiomas; reemplazar textos fijos de `index.html`/`read.html`/`reader.js` por `t()`.
- [ ] **Step 4:** Tests → PASS; la interfaz sigue en español por defecto.
- [ ] **Step 5:** Commit `feat: i18n de la interfaz (es/zh/en)`.

### Task 4: Funciones puras de texto (ruby, glosario, idiomas)

**Files:**
- Create: `assets/text.js`, `tests/text.test.js`

**Interfaces:**
- Produces: `OH.text.rubyPairs(text:string, py:string): Array<{c:string, p:string|null}>` — cada carácter CJK toma la siguiente sílaba; el resto lleva `p:null`.
- Produces: `OH.text.markGlossary(text:string, glossary:Array<{h:string}>): Array<{t:string, g:number|null}>` — coincidencia más larga primero, sin solapes; `g` = índice en el glosario.
- Produces: `OH.text.resolveLangs(settings:Settings, available:{es:true, zh?:true, en?:true}): {main:'es'|'zh'|'en', sub:'es'|'en'|null, notes:string[]}`

- [ ] **Step 1:** Tests: `ruby_aligns_chars_and_syllables`, `ruby_passes_through_latin_digits_punct` (p.ej. `"HSK1 很好。"`), `ruby_throws_never_when_py_is_short` (devuelve `p:null` en el resto), `glossary_prefers_longest_match`, `glossary_no_overlap_and_no_match_returns_single_chunk`, `resolve_falls_back_when_lang_file_missing`, `resolve_sub_never_equals_main`.
- [ ] **Step 2:** Correr → FAIL.
- [ ] **Step 3:** Implementar (sin DOM).
- [ ] **Step 4:** Tests → PASS.
- [ ] **Step 5:** Commit `feat: utilidades puras de texto (ruby, glosario, idiomas)`.

### Task 5: Carga de idiomas y render del lector

**Files:**
- Modify: `assets/kit.js` (añadir `OH.lang(id, code, data)` y registro `OH.langs[id][code]`), `assets/reader.js`, `assets/book.css`
- Create: `tests/fixtures/mini.zh.js`

**Interfaces:**
- Consumes: `OH.settings.get()`, `OH.text.*`, `OH.i18n.t`.
- Produces: `OH.lang(id:string, code:'zh'|'en', data:{title,tagline,intro,moral,pages:Array<{text:string[],py?:string[],word?:[string,string],think?:[string,string]}>,glossary?:Array<{h,es,en}>,quiz:Array<{q,o:string[],ok,no}>}):void`

- [ ] **Step 1:** Escribir prueba de humo `tests/reader-smoke.md` (checklist manual con criterio: *con `?s=perico-conejo` y `lang=es`, la salida es idéntica a v1*).
- [ ] **Step 2:** `reader.js`: cargar `<id>.<main>.js` y `<id>.<sub>.js` con `<script>` solo si hacen falta; si no existen, usar `resolveLangs().notes`.
- [ ] **Step 3:** Pintar cada párrafo como bloque (principal + subtítulo); `subMode` `always|tap|hidden`; `<ruby>` según `pinyin`; glosario como `.v` con tooltip y ⭐ (llama a `OH.words` cuando exista, ver Task 8).
- [ ] **Step 4:** Verificar a mano: cambiar `settings.lang` a `zh` con el fixture muestra caracteres con ruby y subtítulo al tocar; `lang=es` no cambia nada.
- [ ] **Step 5:** Commit `feat: lector multilingüe con subtítulos y ruby`.

### Task 6: Rendimiento — render perezoso, niveles y gobernador

**Files:**
- Create: `assets/perf.js`, `tests/perf.test.js`
- Modify: `assets/reader.js`, `assets/book.css`, `assets/kit.js` (respetar `data-q`)

**Interfaces:**
- Produces: `OH.perf.nextTier(current:'alta'|'media'|'baja', samplesMs:number[], lastChangeMs:number, nowMs:number): {tier:string, reason:'down'|'hold'|'up-suggest'}` — baja si `mediana(samples) > 28`; nunca sube antes de 10 000 ms desde `lastChangeMs`.
- Produces: `OH.perf.applyTier(tier)`, `OH.perf.start({onTier})` (muestrea con `requestAnimationFrame` 3 s tras cada página), `?perf=1` pinta fps/nodos/nivel.
- CSS: `html[data-q="media"]` congela el temblor (no `boil`), reduce partículas; `html[data-q="baja"]` quita filtros SVG, desenfoque, partículas, parallax.

- [ ] **Step 1:** Tests: `median_above_28_goes_down_one_tier`, `never_below_baja`, `no_up_before_10s_hysteresis`, `stable_samples_hold`.
- [ ] **Step 2:** Correr → FAIL.
- [ ] **Step 3:** Implementar `nextTier`/`applyTier`; en `reader.js` construir solo página actual ±1 y destruir el SVG de las demás; detener `setInterval` del temblor cuando `document.hidden` o tier ≠ alta.
- [ ] **Step 4:** Tests → PASS; manual: con `?perf=1`, en tier *baja* el DOM de la página no contiene `filter="url(#paper"`.
- [ ] **Step 5:** Commit `perf: render perezoso, niveles de calidad y gobernador Auto`.

### Task 7: Fuentes propias

**Files:**
- Create: `assets/fonts/*.woff2`, `assets/fonts.css`, `assets/fonts/OFL.txt`
- Modify: `read.html`, `index.html` (quitar Google Fonts), `assets/book.css`, `assets/shelf.css`

- [ ] **Step 1:** Descargar Playfair Display (600/800, normal e itálica 500/700) y Nunito (400/600/800) en woff2 (subset latino) con sus licencias OFL; registrarlos en `assets/fonts.css` con `font-display: swap`.
- [ ] **Step 2:** Definir pila para chino: `--zh: "Noto Sans SC","PingFang SC","Microsoft YaHei","Source Han Sans SC",sans-serif`.
- [ ] **Step 3:** Verificar: sin peticiones a `fonts.googleapis.com` (pestaña Red) y texto con la fuente correcta.
- [ ] **Step 4:** Commit `perf: fuentes propias sin dependencia externa`.

### Task 8: "Mis palabras"

**Files:**
- Create: `assets/words.js`, `tests/words.test.js`

**Interfaces:**
- Produces: `OH.words = { key(id,h):string, add(w:{id,h,py,es,en}):void, remove(key):void, has(key):boolean, list():Array<{...}> }` (almacenamiento inyectable, tolerante a fallos).

- [ ] **Step 1:** Tests: `add_has_remove_roundtrip`, `list_survives_corrupt_storage`, `duplicate_add_is_idempotent`.
- [ ] **Step 2:** Correr → FAIL.
- [ ] **Step 3:** Implementar y conectar la ⭐ del tooltip (Task 5).
- [ ] **Step 4:** Tests → PASS.
- [ ] **Step 5:** Commit `feat: guardar palabras (Mis palabras)`.

### Task 9: Ruedita ⚙ (panel de ajustes)

**Files:**
- Create: `assets/panel.js`
- Modify: `index.html`, `read.html`, `assets/book.css`, `assets/shelf.css`

**Interfaces:**
- Consumes: `OH.settings`, `OH.i18n`, `OH.words`, `OH.offline` (Task 10).
- Produces: `OH.panel.mount(container:HTMLElement)` (botón ⚙ + panel de papel).

- [ ] **Step 1:** Implementar el panel con todos los ajustes del spec (§3), aplicado en vivo; teclado: `Esc` cierra, foco atrapado.
- [ ] **Step 2:** Aplicar efectos: `--fs` por tamaño, `data-theme`, `data-q`, `terror` filtra la repisa, `rate` para la voz.
- [ ] **Step 3:** Verificar manual: cambiar cada ajuste actualiza repisa y lector sin recargar; recargar conserva valores; borrar `localStorage` restaura por defecto.
- [ ] **Step 4:** Commit `feat: ruedita de ajustes global`.

### Task 10: Modo sin conexión y descargas

**Files:**
- Create: `sw.js`, `manifest.webmanifest`, `assets/offline.js`, `assets/icons/icon.svg`, `tests/offline.test.js`
- Modify: `index.html`, `read.html` (registro del SW, enlace al manifest)

**Interfaces:**
- Produces: `OH.offline.filesFor(id:string, langs:string[], catalog):string[]` (rutas relativas del cuento + idiomas), `OH.offline.shellFiles():string[]`.
- Produces: `OH.offline.download(ids:string[], onProgress:(done,total)=>void):Promise<void>`, `OH.offline.status():Promise<Record<string,boolean>>`, `OH.offline.isOnline():boolean`.
- `sw.js`: caché `oh-v2-<hash>`; precache de cáscara; cache-first con actualización; mensajes `{type:'DOWNLOAD', files}`.

- [ ] **Step 1:** Tests: `filesFor_includes_story_and_requested_langs`, `filesFor_skips_missing_lang_files`, `shellFiles_lists_assets_audio_fonts_catalog`.
- [ ] **Step 2:** Correr → FAIL.
- [ ] **Step 3:** Implementar `offline.js`, `sw.js` y `manifest.webmanifest`; botones ⬇ por libro y "Descargar toda la biblioteca" con progreso y marca ✓.
- [ ] **Step 4:** Tests → PASS; manual (servidor local): descargar un cuento, cortar la red en DevTools y releerlo completo; "Hay una versión nueva" al cambiar el hash.
- [ ] **Step 5:** Commit `feat: modo sin conexión, descargas y PWA`.

### Task 11: Pinyin y validación de contenido

**Files:**
- Create: `tools/pinyin.py`, `tools/pinyin-overrides.json`, `tests/test_pinyin.py`
- Modify: `tools/validate.js`, `tests/validate.test.js`

**Interfaces:**
- Produces: `annotate(text:str, overrides:dict[str,str]) -> str` — una sílaba (con tono) por carácter CJK, separadas por espacios; el resto sin cambios.
- Produces: `validateStory(id, {es, zh?, en?}): string[]` — errores: párrafos distintos entre idiomas, `py` desalineado, glosario ausente del texto, claves faltantes.

- [ ] **Step 1:** Tests Python: `annotate_one_syllable_per_hanzi`, `annotate_keeps_latin_and_punct`, `overrides_win`. Tests JS: `story_error_when_paragraph_counts_differ`, `story_error_when_py_misaligned`, `story_error_when_glossary_word_absent`.
- [ ] **Step 2:** `uv run --with pypinyin python -m unittest tests.test_pinyin` y `node --test tests/validate.test.js` → FAIL.
- [ ] **Step 3:** Implementar ambos; CLI `node tools/validate.js` revisa todo el repo y sale con código ≠ 0 si hay errores.
- [ ] **Step 4:** Ambos → PASS.
- [ ] **Step 5:** Commit `feat: pinyin automático y validador de contenido`.

### Task 12: Empaquetado offline y publicación del motor

**Files:**
- Create: `tools/pack.sh`, `.github/workflows/release.yml`
- Modify: `README.md`, `deploy.sh` (incluir `sw.js`, `manifest.webmanifest`, `tools` excluido)

- [ ] **Step 1:** `tools/pack.sh` genera `dist/open-histories-offline.zip` con el sitio (sin `docs/`, `tests/`, `tools/`).
- [ ] **Step 2:** Workflow que, al crear un *release*, ejecuta `node tools/validate.js` y adjunta el zip.
- [ ] **Step 3:** Verificar: abrir `index.html` desde el zip descomprimido (file://) y leer un cuento.
- [ ] **Step 4:** Ejecutar `deploy.sh` y confirmar 200 en `library.eridu.top/sw.js`.
- [ ] **Step 5:** Commit `chore: empaquetado offline y release`.

---

## Phase B — Contenido en chino e inglés de los cuentos actuales

Cada tarea sigue el mismo patrón; se hacen en este orden y cada una termina con `node tools/validate.js` en verde.

### Task 13: Perico, el conejo travieso (`zh` + `en`)

**Files:**
- Create: `stories/perico-conejo.zh.js`, `stories/perico-conejo.en.js`
- Modify: `stories/catalog.js` (título zh/en, `level`), `tools/pinyin-overrides.json` si procede

**Interfaces:**
- Consumes: `OH.lang(...)` (Task 5), `annotate` (Task 11).
- Produces: patrón de archivo que reutilizan las Tasks 14–17.

- [ ] **Step 1:** Redactar el chino graduado párrafo a párrafo (mismo número que `perico-conejo.js`), glosario de ~15 palabras, cartas "palabra/piensa" y quiz en chino.
- [ ] **Step 2:** Generar `py` con `tools/pinyin.py` y revisar polifónicos; escribir `.en.js` con el texto de Potter alineado.
- [ ] **Step 3:** `node tools/validate.js` → sin errores para este cuento.
- [ ] **Step 4:** Verificación manual: leer con `lang=zh`, `sub=es`, pinyin *siempre*, y con `lang=es`, `sub=zh`.
- [ ] **Step 5:** Commit `content: perico-conejo en chino e inglés`.

### Task 14: El Gigante Egoísta (`zh` + `en`)

**Files:** `stories/gigante-egoista.zh.js`, `stories/gigante-egoista.en.js`, `stories/catalog.js`

- [ ] **Steps 1–5:** como la Task 13 (texto, `py`, glosario ~15, quiz, validación, lectura manual, commit `content: gigante-egoista zh/en`).

### Task 15: El Príncipe Feliz (`zh` + `en`)

**Files:** `stories/principe-feliz.zh.js`, `stories/principe-feliz.en.js`, `stories/catalog.js`

- [ ] **Steps 1–5:** como la Task 13; glosario ~20 palabras; mantener el aviso de lenguaje de época en el README.

### Task 16: El corazón delator (`zh` + `en`)

**Files:** `stories/corazon-delator.zh.js`, `stories/corazon-delator.en.js`, `stories/catalog.js`

- [ ] **Steps 1–5:** como la Task 13; conservar `warning` (+12) en los tres idiomas; chino graduado aunque el original sea denso (frases cortas, repetición).

---

## Phase C — Cuentos nuevos

### Task 17: 牛郎织女 — *El pastor y la tejedora* (es + zh + en)

**Files:**
- Create: `stories/pastor-tejedora.js`, `stories/pastor-tejedora.zh.js`, `stories/pastor-tejedora.en.js`
- Modify: `assets/kit.js` (piezas: telar, Vía Láctea, urraca, buey), `stories/catalog.js`, `index.html` (emblema)

**Interfaces:**
- Consumes: `OH.story`, `OH.lang`, kit actual.
- Produces: `K.loom(x,y,s)`, `K.milkyWay(y)`, `K.magpie(x,y,s,flip)` en `OH.kit`.

- [ ] **Step 1:** Redactar versión propia (es base ≈ 900–1100 palabras) con 8–10 páginas y escenas: aldea, buey, río, la tejedora, la Reina Madre, la Vía Láctea, el puente de urracas, séptima noche.
- [ ] **Step 2:** Añadir piezas al kit y componer las escenas.
- [ ] **Step 3:** Chino graduado e inglés alineados; pinyin; glosario; quiz; entrada de catálogo.
- [ ] **Step 4:** `node tools/validate.js` verde; revisar cada escena en los tres niveles de calidad.
- [ ] **Step 5:** Commit `content: 牛郎织女 trilingüe`.

### Task 18: La máscara de la muerte roja (es + zh + en)

**Files:**
- Create: `stories/mascara-muerte.js`, `stories/mascara-muerte.zh.js`, `stories/mascara-muerte.en.js`
- Modify: `assets/kit.js` (piezas: siete salas, reloj de ébano, figura enmascarada), `stories/catalog.js`

**Interfaces:**
- Produces: `K.rooms(n)`, `K.ebonyClock(x,y,s,hour)`, `K.redMask(x,y,s)` en `OH.kit`.

- [ ] **Step 1:** Traducir al español desde Gutenberg #2148 (cuento completo, aviso +12) y segmentar en 10–11 páginas.
- [ ] **Step 2:** Escenas sin imágenes gráficas (sugeridas con luz, sombras y objetos); mood `horror`.
- [ ] **Step 3:** Chino graduado, inglés (original de Poe), pinyin, glosario, quiz.
- [ ] **Step 4:** `node tools/validate.js` verde; comprobar tema oscuro y calidad *Baja*.
- [ ] **Step 5:** Commit `content: la máscara de la muerte roja trilingüe`.

### Task 19: Publicación v2

**Files:**
- Modify: `README.md`, `stories/catalog.js`, `docs/superpowers/specs/*` (estado → implementado)

- [ ] **Step 1:** README: idiomas, ruedita, offline, cómo añadir idioma/cuento/poesía, aviso de revisión nativa del chino, tabla de estado actualizada.
- [ ] **Step 2:** `node --test tests/` y `uv run --with pypinyin python -m unittest discover tests` → todo verde; `node tools/validate.js` → 0 errores.
- [ ] **Step 3:** `git push`, esperar a Pages y ejecutar `deploy.sh` al servidor; verificar 200 en `index.html`, `sw.js`, un `.zh.js`.
- [ ] **Step 4:** Crear *release* `v2.0.0` con el zip offline (`gh release create`).
- [ ] **Step 5:** Verificación final en `library.eridu.top`: cargar, descargar un cuento, desconectar y releer.
