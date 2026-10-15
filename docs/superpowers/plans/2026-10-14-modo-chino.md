# Plan de implementación — Modo chino (Lectura + Estudio)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el lector de open-histories tenga un modo Lectura más bello y un modo Estudio de chino (frases con pinyin, audio por frase y traducción por párrafo), publicados a GitHub y a producción al cerrar cada ronda.

**Architecture:** Todo vive en el motor estático existente: `text.js` gana dos utilidades puras y testeadas (`splitSentences`, `sentencesWithPy`); `settings.js`/`panel.js` un ajuste nuevo `view`; `reader.js` renderiza el modo Estudio reutilizando el pipeline de ruby/glosario/voz; `i18n.js` y `book.css` cubren textos y estilos. Ronda 1 es solo CSS (pase de belleza); Ronda 2 agrega la funcionalidad de Estudio.

**Tech Stack:** JavaScript vanilla (sin build), `node --test` (Node 24), CSS plano en `assets/book.css`, `speechSynthesis` del navegador, sitio estático desplegado con `deploy.sh` (bash) + Chrome headless para capturas.

**Spec:** `docs/superpowers/specs/2026-10-14-modo-chino-design.md`

## Global Constraints

- Comandos de calidad (siempre los tres, en verde antes de cada commit de ronda):
  - `node --test tests/*.test.js`
  - `node tools/validate.js`
  - `uv run --with pypinyin python -m unittest tests.test_pinyin`
- Windows: `PYTHONIOENCODING=utf-8` si algo imprime chino. No instalar ni agregar dependencias.
- No tocar: contenido (`stories/`, `content/`, `tools/pinyin.py`, `tools/validate.js`), el servidor y otros sitios (§8 de AGENTS.md), secretos. Subagentes: nunca Opus ni Fable (§2.7).
- Commits pequeños y descriptivos en `main`. **Push y deploy solo al cerrar la ronda, con todo verde** (pedido explícito de publicación de la persona usuaria).
- Deploy: `bash deploy.sh atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories` · rollback: `bash deploy.sh --rollback atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories` · verificación post-deploy obligatoria (hash de `build.js`, cuento en 3 idiomas, `hotel.eridu.top` 200).
- Evidencia visual obligatoria en las tareas de estilo (Anexo A). `_shot.html` es temporal: **jamás se commitea**.
- Cada cadena de UI nueva debe existir en `es`, `zh` y `en` (i18n).
- Estilos: solo en `assets/book.css`, siguiendo sus secciones comentadas.

## Review Focus

1. `splitSentences` con marcas `{{…}}` (definiciones con puntos), etiquetas `<b>/<i>`, ristras (……, ！？) y cierres (」』) — test en Task 4.
2. Alineación de pinyin 1 sílaba por carácter al partir por frase, sobre contenido real — test de corpus en Task 5.
3. Regresión visual de es/en por el pase de belleza — capturas con `lang=es` en Tasks 1–2 y 8.
4. Voz por frase: no duplicar episodios al navegar y restaurar ▶ — smoke en Task 7 + verificación manual al publicar (Task 9).
5. Ajustes viejos sin `view`: entran con default `read` — test en Task 6.

---

## Anexo A — Capturas (evidencia visual)

1. Servidor local, desde la raíz del repo: `python -m http.server 8124` (si está ocupado, 8125).
2. Crear `_shot.html` en la raíz (temporal; borrar al terminar):

```html
<!doctype html><meta charset="utf-8"><title>shot</title>
<script>
try {
  localStorage.setItem('oh-settings', JSON.stringify(SEED));
  localStorage.setItem('oh-page-principe-feliz', '2'); /* 0=portada, 2=capítulo */
} catch (e) { }
</script>
<iframe src="read.html?s=principe-feliz" title="shot" style="width:1280px;height:900px;border:0;display:block"></iframe>
```

`SEED` base (cambiar según la variante):

```json
{ "v": 1, "lang": "zh", "sub": "es", "subMode": "always", "pinyin": "always", "size": "M",
  "rate": 1, "sound": false, "quality": "alta", "motion": "auto", "theme": "light", "terror": true, "view": "read" }
```

Variantes: `theme` light/dark · `size` S/M/L/XL · `view` read/study · `lang` es (regresión) · móvil con `--window-size=430,932`.

3. Capturar (PowerShell):

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-first-run `
  --user-data-dir="$env:TEMP\oh-shot" --hide-scrollbars --window-size=1280,900 --virtual-time-budget=15000 `
  --screenshot="C:\Users\jdsal\AppData\Local\Temp\opencode\shots\<nombre>.png" "http://localhost:8124/_shot.html"
```

4. Borrar `_shot.html` y frenar el servidor. Las capturas se guardan **fuera del repo** (temp).

---

## Ronda 1 — Lectura linda

### Task 1: Pinyin legible + traducción elegante (`book.css`)

**Files:**
- Modify: `assets/book.css` (sección `/* ── idiomas: párrafos, subtítulos y pinyin ── */`, ~líneas 251–268)

**Interfaces:**
- Consumes: nada nuevo.
- Produces: nada de código; puntos de estilo que Task 8 reutiliza (`.para .subt` y `rt` ya pulidos).

- [ ] **Paso 1: Capturas "antes"** (Anexo A): zh claro M · zh oscuro M · zh S · zh XL · es claro M.

- [ ] **Paso 2: Editar `rt` y el aire del texto zh**

Primera pasada (ajustar si las capturas del Paso 4 muestran choques con la línea de arriba):

```css
rt{display:none;font-family:var(--sans);font-size:.55em;letter-spacing:.02em;color:#9a7850;font-weight:600;line-height:1;font-style:normal}
.para .main.lang-zh{font-family:var(--zh);font-size:1.28rem;line-height:2.3}
:is(.terror,.dark) rt{color:#cbb2f5}
```

- [ ] **Paso 3: Rediseñar `.para .subt`** (bloque suave, sin itálica):

```css
.para .subt{display:none;margin:.5em 0 0;padding:8px 12px;border-left:3px solid var(--gold);border-radius:0 10px 10px 0;background:rgba(233,185,66,.1);font-size:.9rem;line-height:1.6;font-style:normal;opacity:1}
:is(.terror,.dark) .para .subt{background:rgba(155,120,255,.12);border-left-color:#9b7cff}
```

- [ ] **Paso 4: Capturas "después"** (mismas variantes) y comparar: pinyin legible sin chocar, traducción con aire; es/en sin cambios indeseados.

- [ ] **Paso 5: Verificar y commitear**

Run: `node --test tests/*.test.js` y `node tools/validate.js` → verde.
Commit: `style: pinyin y traducción más legibles (lectura zh)`

```bash
git add assets/book.css && git commit -m "style: pinyin y traducción más legibles (lectura zh)"
```

### Task 2: Ritmo del texto y affordance de lectura (`book.css`)

**Files:**
- Modify: `assets/book.css`

**Interfaces:**
- Consumes: los valores de Task 1.
- Produces: la base visual que el modo Estudio (Task 8) respeta.

- [ ] **Paso 1: Capturas "antes"** (zh claro XL · zh oscuro M · móvil 430).

- [ ] **Paso 2: Editar ritmo**

```css
.para{margin:0 0 1em;padding:2px 6px;border-radius:10px;cursor:pointer;transition:background .15s}
.para:hover{background:rgba(233,185,66,.16)}
.txt{max-height:min(48vh,470px);overflow:auto;padding-right:10px;scrollbar-width:thin;scrollbar-color:#d8bf8d transparent}
```

Títulos zh: revisar `h2` en las capturas; si el título se ve apretado, subir su `line-height` a ~1.25 (y solo eso). No tocar el resto de la tipografía base.

- [ ] **Paso 3: Capturas "después"** (mismas variantes + móvil) y comparar.

- [ ] **Paso 4: Verificar y commitear**

Run: `node --test tests/*.test.js` y `node tools/validate.js` → verde.
Commit: `style: ritmo y respiración del lector`

```bash
git add assets/book.css && git commit -m "style: ritmo y respiración del lector"
```

### Task 3: Publicar R1

**Files:** ninguno (solo git + deploy).

- [ ] **Paso 1: Gate completo**

Run: `node --test tests/*.test.js` · `node tools/validate.js` · `uv run --with pypinyin python -m unittest tests.test_pinyin` → los tres en verde.

- [ ] **Paso 2: `git status` limpio y log revisado** (`git status --short`; `git log --oneline -5`).

- [ ] **Paso 3: Push**

```bash
git push origin main
```

- [ ] **Paso 4: Deploy** (corre sus propios tests; si falla, frenar y diagnosticar)

```bash
bash deploy.sh atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories
```

- [ ] **Paso 5: Verificación post-deploy**

```bash
bash -c 'curl -s "https://library.eridu.top/assets/build.js?x=$(date +%s)"'   # debe mostrar el hash corto de HEAD
bash -c 'curl -s -o /dev/null -w "%{http_code}" "https://library.eridu.top/read.html?s=principe-feliz&lang=zh"'
bash -c 'curl -s -o /dev/null -w "%{http_code}" https://hotel.eridu.top'
```

Esperado: hash == `git rev-parse --short HEAD`; 200; 200. Si algo se ve mal: `bash deploy.sh --rollback atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories` **primero**, depurar después.

---

## Ronda 2 — Modo Estudio

### Task 4: `splitSentences` (`text.js` + tests)

**Files:**
- Modify: `assets/text.js`
- Test: `tests/text.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `OH.text.splitSentences(text: string) -> string[]` y `module.exports.splitSentences` (Task 5 la usa).

- [ ] **Paso 1: Tests que fallan** (agregar a `tests/text.test.js`, estilo `node:test` existente)

```js
const { splitSentences } = require('../assets/text.js');
test('parte oraciones en chino', () => assert.deepEqual(
  splitSentences('一天晚上，一只小燕子飞过这座城市。他的朋友们走了。'),
  ['一天晚上，一只小燕子飞过这座城市。', '他的朋友们走了。']));
test('no parte dentro de etiquetas <b>/<i>', () => assert.deepEqual(
  splitSentences('他<b>哭</b>了。第二句。'), ['他<b>哭</b>了。', '第二句。']));
test('no parte dentro de marcas {{…}} aunque la definición lleve puntos', () => assert.deepEqual(
  splitSentences('{{迁徙|鸟儿飞到别的地方，找更暖和的天气。}}小燕子走了。'),
  ['{{迁徙|鸟儿飞到别的地方，找更暖和的天气。}}', '小燕子走了。']));
test('cierres pegados y ristras de terminadores', () => {
  assert.deepEqual(splitSentences('「我可以爱你吗？」小燕子说。'), ['「我可以爱你吗？」', '小燕子说。']);
  assert.deepEqual(splitSentences('他走了……后来呢？'), ['他走了……', '后来呢？']);
});
test('es: punto seguido de espacio', () => assert.deepEqual(
  splitSentences('Hola. ¿Y vos?'), ['Hola.', ' ¿Y vos?']));
test('invariante: la concatenación es el texto original', () => {
  const t = '天黑啦，小燕子说：「我要去埃及……」。第二段。';
  assert.equal(splitSentences(t).join(''), t);
});
```

- [ ] **Paso 2: Correr y ver fallar**

Run: `node --test tests/text.test.js`
Expected: FAIL (`splitSentences is not a function`).

- [ ] **Paso 3: Implementar en `assets/text.js`**

```js
const TERM = new Set([...'。！？…?!.']);
const CLOSE = new Set([...'」』”"’）)']);
const TAG_AT = /^<\/?[bi]>/;

function splitSentences(text) {
  const s = String(text == null ? '' : text);
  const out = []; let buf = '', i = 0;
  while (i < s.length) {
    const tag = TAG_AT.exec(s.slice(i, i + 5));
    if (tag) { buf += s.slice(i, i + tag[0].length); i += tag[0].length; continue; }
    if (s.startsWith('{{', i)) {
      const end = s.indexOf('}}', i + 2); const stop = end === -1 ? s.length : end + 2;
      buf += s.slice(i, stop); i = stop; continue;
    }
    buf += s[i]; i++;
    if (TERM.has(s[i - 1])) {
      while (i < s.length && TERM.has(s[i])) { buf += s[i]; i++; }
      while (i < s.length && CLOSE.has(s[i])) { buf += s[i]; i++; }
      out.push(buf); buf = '';
    }
  }
  if (buf) out.push(buf);
  return out;
}
```

- [ ] **Paso 4: Correr y ver pasar**

Run: `node --test tests/text.test.js` → PASS. Luego `node --test tests/*.test.js` → todo verde.

- [ ] **Paso 5: Commit**

```bash
git add assets/text.js tests/text.test.js && git commit -m "feat: splitSentences (segmentación zh/es) con tests"
```

### Task 5: `sentencesWithPy` (`text.js` + tests)

**Files:**
- Modify: `assets/text.js`
- Test: `tests/text.test.js`

**Interfaces:**
- Consumes: `splitSentences` (Task 4), `walk` (interna de `text.js`).
- Produces: `OH.text.sentencesWithPy(text, py) -> [{t, py}]` y `module.exports.sentencesWithPy` (Task 7 la usa; la spec ya dice `[{t, py}]`).

- [ ] **Paso 1: Tests que fallan**

```js
const { sentencesWithPy, rubyCheck } = require('../assets/text.js');
test('reparte el pinyin por frase', () => assert.deepEqual(
  sentencesWithPy('他走了。你呢？', 'tā zǒu le。nǐ ne？'),
  [{ t: '他走了。', py: 'tā zǒu le。' }, { t: '你呢？', py: 'nǐ ne？' }]));
test('py vacío para es/en', () => assert.deepEqual(
  sentencesWithPy('Hola. ¿Y vos?', '').map(x => x.py), ['', '']));
test('corpus real: concatenación y 1 sílaba por carácter', () => {
  let data = null; const prevOH = globalThis.OH;
  globalThis.OH = { lang: (id, l, d) => { data = d; } };
  require('../stories/principe-feliz.zh.js');
  globalThis.OH = prevOH;
  for (const pg of data.pages) {
    (pg.text || []).forEach((tx, j) => {
      const sents = sentencesWithPy(tx, (pg.py || [])[j] || '');
      assert.equal(sents.map(s => s.t).join(''), tx);
      for (const s of sents) assert.equal(rubyCheck(s.t, s.py).missing, 0);
    });
  }
});
```

- [ ] **Paso 2: Correr y ver fallar**

Run: `node --test tests/text.test.js`
Expected: FAIL (`sentencesWithPy is not a function`).

- [ ] **Paso 3: Implementar**

```js
function sentencesWithPy(text, py) {
  let rest = String(py == null ? '' : py);
  return splitSentences(text).map(t => {
    const w = walk(t, rest);
    const slice = rest.slice(0, rest.length - w.rest.length);
    rest = w.rest;
    return { t, py: slice };
  });
}
```

Exportar junto al resto en `api` y en `module.exports`.

- [ ] **Paso 4: Correr y ver pasar**

`node --test tests/*.test.js` → todo verde (incluido el test de corpus).

- [ ] **Paso 5: Commit**

```bash
git add assets/text.js tests/text.test.js && git commit -m "feat: sentencesWithPy (pinyin alineado por frase) con tests"
```

### Task 6: Ajuste `view` + i18n (`settings.js`, `panel.js`, `i18n.js` + tests)

**Files:**
- Modify: `assets/settings.js` · `assets/panel.js` · `assets/i18n.js`
- Test: `tests/settings.test.js`

**Interfaces:**
- Produces: ajuste `view: 'read' | 'study'` (default `read`) en `OH.settings`; claves i18n `view`, `view_read`, `view_study` (Task 7 las usa).

- [ ] **Paso 1: Tests que fallan** (en `tests/settings.test.js`)

```js
test('view entra por defecto en read', () => assert.equal(normalize({}).view, 'read'));
test('view acepta study y rechaza valores raros', () => {
  assert.equal(normalize({ view: 'study' }).view, 'study');
  assert.equal(normalize({ view: 'nope' }).view, 'read');
});
```

- [ ] **Paso 2: Correr y ver fallar**

Run: `node --test tests/settings.test.js` → FAIL (`view` undefined).

- [ ] **Paso 3: Implementar**

- `settings.js`: `DEFAULTS` agrega `view: 'read'`; `ENUMS` agrega `view: ['read', 'study']`.
- `panel.js`: fila nueva después de Pinyin — `row(t('view'), seg('view', [['read', t('view_read')], ['study', t('view_study')]], s.view))`.
- `i18n.js` (en los tres idiomas, junto a las claves de pinyin):
  - es: `view: 'Modo de lectura', view_read: 'Lectura', view_study: 'Estudio'`
  - zh: `view: '阅读模式', view_read: '阅读', view_study: '学习'`
  - en: `view: 'Reading mode', view_read: 'Reading', view_study: 'Study'`

- [ ] **Paso 4: Correr y ver pasar**

`node --test tests/*.test.js` → verde.

- [ ] **Paso 5: Commit**

```bash
git add assets/settings.js assets/panel.js assets/i18n.js tests/settings.test.js && git commit -m "feat: ajuste de modo de lectura (Lectura/Estudio)"
```

### Task 7: Render de Estudio + audio por frase (`reader.js` + smoke)

**Files:**
- Modify: `assets/reader.js` · `tests/reader-smoke.md`
- Sin tests unitarios (DOM): se cubre con capturas + smoke.

**Interfaces:**
- Consumes: `sentencesWithPy` (Task 5), `settings.view` y claves i18n (Task 6), `mainHTML`/`vocab`/`TTS`/`listen` existentes.
- Produces: modo `view === 'study'` operativo; `stage.dataset.view`.

- [ ] **Paso 1: `reader.js` — parámetros y estado**

- Lista de parámetros de depuración: `['lang', 'sub', 'subMode', 'pinyin', 'view']`.
- `const studyText = new Map();` junto a `mounted`; `studyText.clear()` al inicio de `refresh()`.
- Reset de voz: en `go()` y en `refresh()`, además de `[data-listen]`, restaurar `[data-say]` a `▶` y limpiar `.playing`.

- [ ] **Paso 2: `reader.js` — render de la página de texto en modo Estudio**

En la rama `text` de `renderCopy`, si `S.get().view === 'study'` armar el cuerpo así (reutilizando `mainHTML` por frase; `pgL`/`pgS` ya existen en la función):

```js
const body = pgL.text.map((tx, j) => {
  const sents = TX.sentencesWithPy(tx, pgL.py && pgL.py[j]);
  const rows = sents.map((s, k) => {
    const key = `${i}-${j}-${k}`;
    studyText.set(key, String(s.t).replace(/\{\{(.+?)\|.+?\}\}/g, '$1').replace(/<[^>]+>/g, ''));
    return `<div class="sent"><button type="button" class="say" data-say="${key}" aria-label="${t('listen')}">▶</button><div class="sent-main lang-${L}">${mainHTML(s.t, s.py, L, gl)}</div></div>`;
  }).join('');
  const sub = (pgS && pgS.text && pgS.text[j]) ? `<div class="sent-sub lang-${lang.sub}"><span class="slang">${esc(lang.sub)}</span>${vocab(pgS.text[j])}</div>` : '';
  return `<div class="sgroup">${rows}${sub}</div>`;
}).join('');
```

El contenedor sigue siendo el `.txt` (scroll), con clase extra: `<div class="txt study" tabindex="0">…</div>`.

- [ ] **Paso 3: `reader.js` — conmutador y voz por frase**

- `modeSeg()`: se inserta al inicio de la fila `.tools` (solo páginas de texto):

```js
const modeSeg = () => {
  const v = S.get().view;
  return `<span class="modes" role="group" aria-label="${t('view')}">
    <button type="button" class="chip mode${v === 'read' ? ' on' : ''}" data-mode="read" aria-pressed="${v === 'read'}">📖 ${t('view_read')}</button>
    <button type="button" class="chip mode${v === 'study' ? ' on' : ''}" data-mode="study" aria-pressed="${v === 'study'}">🎓 ${t('view_study')}</button></span>`;
};
```
- Delegación de clic: `[data-mode]` → `S.set({ view: v })` (el re-render lo hace `S.onChange` → `refresh`); `[data-say]` → `speakSentence(btn)`.
- `speakSentence(btn)`: si suena ese botón → `speechSynthesis.cancel()` y restaurar; si suena otro → cancelar y arrancar; texto = `studyText.get(btn.dataset.say)`, `u.lang = TTS[lang.main]`, `u.rate = S.get().rate`; `onend/onerror` → restaurar `▶`; mientras suena: texto `⏹` y clase `.playing`.
- `applySettings()`: agrega `stage.dataset.view = S.get().view;`.
- `listen` de página completa: sin cambios.

- [ ] **Paso 4: `tests/reader-smoke.md` — nuevos checks**

- `?view=study`: frases con pinyin siempre visible + bloque de traducción por párrafo + un `▶` por frase.
- Con voz: el `▶` suena, cambia a `⏹`, y al cambiar de página se corta y se restaura.
- es/en: lectura intacta; `view` se recuerda al recargar.

- [ ] **Paso 5: Capturas (Anexo A)**

Variantes: `view:'study'` zh claro M · zh oscuro M · zh S · zh XL · móvil 430 · es claro M (regresión).

- [ ] **Paso 6: Verificar y commitear**

Run: `node --test tests/*.test.js` y `node tools/validate.js` → verde.
Commit: `feat: modo Estudio (frases con pinyin, audio por frase y traducción por párrafo)`

```bash
git add assets/reader.js tests/reader-smoke.md && git commit -m "feat: modo Estudio (frases con pinyin, audio por frase y traducción por párrafo)"
```

### Task 8: CSS del modo Estudio (`book.css`)

**Files:**
- Modify: `assets/book.css` (sección nueva después de "idiomas")

**Interfaces:**
- Consumes: el marcado de Task 7 (`.study`, `.sgroup`, `.sent`, `.say`, `.sent-main`, `.sent-sub`, `.slang`, `.modes`, `.chip.mode.on`).

- [ ] **Paso 1: Capturas "antes"** (las de Task 7 Paso 5 sirven).

- [ ] **Paso 2: Escribir la sección** (primera pasada; ajustar con capturas)

```css
/* ── modo estudio ── */
.modes{display:inline-flex;gap:6px}
.chip.mode.on{background:var(--gold);box-shadow:0 3px 0 #b98a1e}
/* estudio: pinyin siempre visible (le gana al ajuste 'off'; esta sección va después de "idiomas") */
.stage[data-view="study"] rt{display:ruby-text!important}
.study{display:flex;flex-direction:column;gap:2px}
.sgroup{display:flex;flex-direction:column;gap:4px;padding:0 0 12px;margin:0 0 12px;border-bottom:1px dashed rgba(150,110,60,.3)}
.sgroup:last-child{border-bottom:0;margin-bottom:0}
.sent{display:flex;gap:8px;align-items:flex-start}
.say{flex:0 0 auto;width:30px;height:30px;margin-top:.4em;border:0;border-radius:999px;background:#f1dfae;color:#5a3d12;font-weight:800;font-size:.72rem;box-shadow:0 2px 0 #cfb06a;cursor:pointer}
.say.playing{background:var(--gold);box-shadow:0 2px 0 #b98a1e}
.sent-main{font-family:var(--zh);font-size:1.24rem;line-height:2.2}
.sent-sub{margin:6px 0 0 38px;padding:8px 12px;border-left:3px solid var(--gold);border-radius:0 10px 10px 0;background:rgba(233,185,66,.1);font-size:.9rem;line-height:1.6}
.slang{display:inline-block;margin-right:6px;font-size:.62rem;font-weight:800;letter-spacing:.08em;color:#a98a58;text-transform:uppercase}
:is(.terror,.dark) .chip.mode.on{background:#9b1c31;box-shadow:0 3px 0 #5e0f20}
:is(.terror,.dark) .sgroup{border-bottom-color:rgba(190,120,255,.25)}
:is(.terror,.dark) .say{background:#33224a;color:#ecdcff;box-shadow:0 2px 0 #170c24}
:is(.terror,.dark) .say.playing{background:#9b1c31;box-shadow:0 2px 0 #5e0f20}
:is(.terror,.dark) .sent-sub{background:rgba(155,120,255,.12);border-left-color:#9b7cff}
:is(.terror,.dark) .slang{color:#b79ad6}
@media (max-width:820px){.sent-sub{margin-left:0}}
```

- [ ] **Paso 3: Capturas "después"** (las mismas variantes, más `pinyin:'off'` + `view:'study'`: el pinyin debe verse igual) y comparar; ajustar si algo se ve apretado o roto.

- [ ] **Paso 4: Verificar y commitear**

Run: `node --test tests/*.test.js` y `node tools/validate.js` → verde.
Commit: `style: tarjetas del modo Estudio`

```bash
git add assets/book.css && git commit -m "style: tarjetas del modo Estudio"
```

### Task 9: Publicar R2

**Files:** ninguno (solo git + deploy).

- [ ] **Paso 1: Gate completo** — los tres comandos de Global Constraints en verde.
- [ ] **Paso 2: `git status` limpio y `git log --oneline -8` revisado.**
- [ ] **Paso 3: `git push origin main`.**
- [ ] **Paso 4: `bash deploy.sh atopnuc@192.168.1.100:/home/atopnuc/sitios/open-histories`.**
- [ ] **Paso 5: Verificación post-deploy**

```bash
bash -c 'curl -s "https://library.eridu.top/assets/build.js?x=$(date +%s)"'          # hash == HEAD
bash -c 'curl -s -o /dev/null -w "%{http_code}" "https://library.eridu.top/read.html?s=principe-feliz&lang=zh&view=study"'
bash -c 'curl -s -o /dev/null -w "%{http_code}" https://hotel.eridu.top'              # 200
```

- [ ] **Paso 6: Verificación manual de voz** en el navegador real (`?lang=zh&view=study`, tocar un `▶`, cambiar de página): reportar en el cierre qué se verificó y qué no. Rollback disponible si algo se ve mal.

---

## Cierre de fase

- Mensaje final con: qué se hizo, comandos y salida, capturas antes/después, qué no se pudo verificar (p. ej. voces del sistema), y estado de las fases 2–4.
- Opcional (no requerido para prod): `bash tools/pack.sh` para refrescar el paquete offline de un release.
