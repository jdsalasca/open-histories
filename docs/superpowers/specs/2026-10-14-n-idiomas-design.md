# N idiomas — motor de idiomas data-driven (Fase 2 de 4)

> Estado: **aprobada por pedido directo ("go") · en implementación** · 2026-10-14
> Contexto: Fase 2 de la visión. Fase 1 (modo chino) ✅ publicada. Fases 3 (plantilla de cuentos) y 4 (motor de arte) siguen.
> Publicación: al cerrar cada ronda → `git push origin main` + `deploy.sh` a prod + verificación (pedido explícito de la persona usuaria).

## 1. Objetivo

**Sumar un idioma = config + archivos, sin cambios de lógica.** El sistema deja de tener `es/zh/en` fijos en el motor: un registro central declara los idiomas y sus particularidades (voz TTS, anotación tipo pinyin, idioma base), y todas las superficies (ajustes, ruedita, lector, repisa, sin conexión, validador, herramientas) lo consumen. `es/zh/en` deben quedar **idénticos** para quien ya usa el sitio.

## 2. Decisión central: `assets/langs.js` (registro `OH.lingo`)

Nuevo módulo puro, cargado antes que `settings.js` en `index.html` y `read.html`, usable en Node (`require`):

```js
OH.lingo = {
  META,            // { es: {name:'Español', tts:'es-ES', base:true}, zh: {name:'中文', tts:'zh-CN', annotate:'pinyin'}, en: {...} }
  codes(),         // ['es','zh','en'] — orden de presentación
  base(),          // 'es' — idioma del texto fuente (stories/<id>.js)
  annotated(),     // ['zh'] — idiomas con anotación (pinyin por carácter)
  get(code)        // entrada (o {})
}
```

- Sin colisión con `OH.langs` (que es el **almacén de datos** de cuentos que usa `OH.lang(...)`): el registro se llama **`OH.lingo`** y un test lo asegura.
- En Node, `settings.js` y `text.js` lo consumen vía `require('./langs.js')`; en el navegador vía `root.OH.lingo` con **fallback estático** `['es','zh','en']` por robustez de orden de carga.
- `codes()` es función (no array fijo) para que los tests prueben "agregar una entrada al META basta".

## 3. Superficies a generalizar (mapa del grep)

| Superficie | Hoy (fijo) | Después |
|---|---|---|
| `settings.js` | `ENUMS.lang=['es','zh','en']`, `sub=['es','en','none']`; swap `sub` a es/en | ENUMS desde `lingo.codes()`; swap `sub` = primer código ≠ main |
| `text.js` `resolveLangs` | arrays `['es','zh','en']` | parámetro `codes` (default estático por compatibilidad); fallback main = base/primero disponible |
| `panel.js` | segmentos con los 3 botones fijos | segmentos desde el registro (nombres **endónimos**); sub = demás idiomas + none |
| `reader.js` | `TTS` fijo; `L !== 'zh'`; `lang.main === 'zh'`; `dataOf('zh')`; `L === 'es'` en la portada | TTS y `annotate` desde el registro; `dataOf(base())`; glosario del idioma anotado; portada con clave i18n nueva `by_author` |
| `i18n.js` | `lang_es/zh/en`; `t()` no admite cadena vacía | nombres viven en el registro (se retiran `lang_*`); `t()` acepta `''`; clave `by_author` (es='Un cuento de ', zh='', en='') |
| `offline.js` | `langsWanted()` = `['zh','en']` fijo | extras = códigos ≠ base, filtrados por `lang`/`sub`; `shellFiles()` suma `assets/langs.js` |
| `index.html` / `read.html` | fallback `title.es`; sin registro | `<script langs.js>`; fallback `title[base()]` |
| `tools/validate.js` | itera `['zh','en']`; `L === 'zh'` para pinyin; loader regex `(zh|en)` | itera los idiomas del catálogo (según registro); pinyin solo para `annotate`; glosario del idioma anotado; loader genérico |
| `tools/pinyin.py` | regex `<id>.(zh|en).json` | cualquier `<id>.<code>.json`; anotación pinyin solo para `zh` (documentado) |
| `words` | significado `w[sub] \|\| w.es` | igual, documentado (los glosarios agregan claves por idioma) |

## 4. Prueba de "sin tocar código"

1. `tests/langs.test.js`: **agregar solo la entrada** `META.fr = {name:'Français', tts:'fr-FR'}` (config) y verificar que `settings` (ENUMS/normalize), `text.resolveLangs` y el validador aceptan `fr` — sin editar lógica.
2. Receta en `AGENTS.md` (+ mención en `CONTRIBUTING`): **Añadir un idioma** = 1) entrada en `assets/langs.js`; 2) `content/<id>.<code>.json`; 3) `uv run --with pypinyin python tools/pinyin.py content/<id>.<code>.json` (genera sin `py` si no es zh); 4) catálogo (`langs`, `files`, `title.<code>`); 5) cadenas de UI opcionales (fallback a español). **Cero cambios de lógica.**
3. Fuera de alcance: **traducir contenido nuevo** — es tarea de contenido; el motor queda listo y la receta lo cubre.

## 5. Rondas (cada una publicable)

- **R3 — Registro + motor**: `langs.js`; settings/text/panel/reader/offline/i18n; páginas; tests; capturas de regresión de `es/zh/en` (lectura + estudio). Publicar.
- **R4 — Contenido + receta**: `validate.js` genérico; `pinyin.py` genérico; prueba de idioma config-only; receta en docs; smokes. Publicar.

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Regresión de es/zh/en | tests actuales (55) + capturas zh/es/en lectura y estudio antes/después |
| Colisión `OH.langs` (datos) vs registro | nombre `OH.lingo` + aserción en tests |
| Orden de carga del registro | fallback estático + `langs.js` antes de `settings.js` en ambas páginas |
| `t()` con cadenas vacías | cambio de semántica acotado (`typeof === 'string'`) con test |
| Caché sin conexión | `shellFiles()` + estampado de `stage.sh` ya existentes; test de sw actualizado si corresponde |

## 7. Fuera de alcance

Traducciones reales nuevas (tarea de contenido), RTL, archivos i18n externos por idioma, Fases 3 y 4.
