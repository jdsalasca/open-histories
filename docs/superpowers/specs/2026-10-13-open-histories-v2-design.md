# open-histories v2 — diseño

> Estado: **implementado** (v2.0.0) · 2026-10-13
> Alcance: motor v2 (ajustes, rendimiento, idiomas, modo sin conexión), contenido en chino/inglés de los 4 cuentos actuales y 2 cuentos nuevos.

## 1. Objetivo

Que open-histories sea, a la vez:

1. **Una biblioteca bonita** de cuentos de dominio público en papercraft (ya existe).
2. **Una herramienta para aprender chino**: leer cada cuento en chino *graduado* con pinyin y subtítulos en español o inglés.
3. **Fluida** en equipos modestos.
4. **Utilizable sin conexión** y descargable.
5. **Abierta**: cualquiera puede sumar idiomas, cuentos avanzados o poesía china sin tocar el motor.

### Decisiones ya tomadas (con la persona usuaria)

| Tema | Decisión |
|---|---|
| Nivel de chino | **Lectura graduada**, chino simplificado, vocabulario HSK 1–3, frases cortas, pinyin disponible |
| Idiomas | Español (base), 中文, English |
| Estructura de contenido | **Un archivo por idioma y cuento** (opción B), cargado solo si se usa |
| Ajustes | Una **ruedita ⚙** global (repisa y lector) |
| Cuentos nuevos | **牛郎织女** (*El pastor y la tejedora*) y **La máscara de la muerte roja** (Poe) |
| Extra | **Mis palabras**: guardar vocabulario con ⭐ y repasarlo |
| Sin conexión | Modo offline + **descarga** por cuento y de toda la biblioteca |
| Futuro | Cuentos avanzados y poesía china (el modelo de datos debe dejar sitio) |

### Fuera de alcance de v2

Cuentas de usuario, servidor, sincronización entre dispositivos, tarjetas de repaso espaciado, reconocimiento de voz, traducción automática en vivo.

## 2. Arquitectura

Sigue siendo **estático, sin compilación** (carpeta que se abre con doble clic o se sirve desde cualquier hosting).

```
index.html                 repisa
read.html                  lector (?s=<id>)
sw.js                      service worker (offline)
manifest.webmanifest       instalable (PWA)
assets/
  kit.js                   piezas de cartón
  settings.js    NUEVO     ajustes: esquema, persistencia, aplicación en vivo
  i18n.js        NUEVO     textos de la interfaz (es / zh / en)
  reader.js                lector (refactor: render perezoso, idiomas)
  perf.js        NUEVO     gobernador de calidad (Auto) y utilidades
  offline.js     NUEVO     descargas y estado sin conexión
  fonts/         NUEVO     Playfair + Nunito (woff2 propios, licencia OFL)
stories/
  catalog.js     NUEVO     metadatos de la repisa (antes inline en index.html)
  <id>.js                  escenas + texto base en español
  <id>.zh.js     NUEVO     texto graduado + pinyin + glosario + quiz en chino
  <id>.en.js     NUEVO     subtítulos/texto en inglés + quiz
tools/           NUEVO
  pinyin.py                genera `py` a partir de hanzi (pypinyin) con tabla de excepciones
  validate.js              valida alineación de idiomas, pinyin, glosario, catálogo
  pack.sh                  empaqueta la biblioteca offline (.zip)
docs/superpowers/specs/    este documento
```

### 2.1 Catálogo (`stories/catalog.js`)

Una sola fuente de verdad para la repisa y para el modo offline:

```js
OH.catalog = [{
  id: 'perico-conejo',
  shelf: 'dia',                 // dia | terror | (futuro) poesia, avanzado…
  kind: 'cuento',               // cuento | fabula | poema (futuro)
  level: { zh: 'HSK1-2' },      // dificultad del chino
  title: { es:'Perico, el conejo travieso', zh:'淘气的小兔彼得', en:'Peter Rabbit' },
  author: 'Beatrix Potter', year: 1902,
  cover: { color:'#4d7a4f', emblem:'rabbit' },
  langs: ['es','zh','en'],
  minutes: 6, age: 0,
  files: ['perico-conejo.js','perico-conejo.zh.js','perico-conejo.en.js'] // para offline
}];
```

`index.html` solo renderiza el catálogo; añadir un cuento = una entrada + sus archivos.

### 2.2 Archivo de cuento (`<id>.js`)

Igual que hoy (escenas SVG y texto base en español). Se añade `langs` y se marca el idioma base. El texto en español no cambia de formato.

### 2.3 Archivo de idioma (`<id>.zh.js` / `<id>.en.js`)

```js
OH.lang('perico-conejo', 'zh', {
  title: '淘气的小兔彼得',
  tagline: '…', intro: '…', moral: '…',
  pages: [
    { text: ['从前有四只小兔子。', '…'],        // MISMO número de párrafos que la página en español
      py:   ['cóng qián yǒu sì zhī xiǎo tù zi。', '…'],  // generado por tools/pinyin.py
      word: ['…','…'], think: ['…','…'] }
  ],
  glossary: [{ h:'兔子', es:'conejo', en:'rabbit' }],   // pinyin se genera
  quiz: [{ q:'…', o:['…','…','…'], ok:'…', no:'…' }]
});
```

Reglas:

- `pages[i].text.length` **debe ser igual** al del español (la validación lo exige). Esto permite subtitular párrafo a párrafo.
- `py[i]` tiene un sílaba por carácter chino, separadas por espacios; los signos de puntuación y otros caracteres pasan tal cual. El lector empareja carácter ↔ sílaba para dibujar `<ruby>`.
- El glosario resalta en el texto toda aparición del `h` y muestra pinyin + significado en el idioma de subtítulo.

### 2.4 Resolución de idiomas en el lector

```
principal = settings.lang        // zh | es | en
subtitulo = settings.sub         // es | en | none   (nunca igual al principal)
```

Se carga `<id>.js` (siempre), `<id>.<principal>.js` si no es el base, y `<id>.<subtitulo>.js` si hace falta. Cada párrafo se pinta como un bloque:

```
┌─ 中文 con ruby (pinyin arriba, según ajuste) ─┐
│ 从前有四只小兔子。                              │
│ subtítulo (siempre | al tocar | oculto)        │
└────────────────────────────────────────────────┘
```

- **Al tocar**: tocar un párrafo despliega su subtítulo; tocar una palabra del glosario muestra pinyin y significado y permite ⭐.
- La voz usa `lang` del idioma principal (`zh-CN`, `es-ES`, `en-US`) con velocidad ajustable.

## 3. La ruedita ⚙

Botón fijo en la barra superior, en la repisa y en el lector. Abre un panel de papel con:

| Ajuste | Valores | Efecto |
|---|---|---|
| Idioma principal | 中文 · Español · English | Texto de lectura e interfaz |
| Subtítulos | Español · English · Ninguno | Segunda lengua bajo cada párrafo |
| Mostrar subtítulos | Siempre · Al tocar · Oculto | |
| Pinyin | Siempre · Al tocar · No | `<ruby>` sobre los caracteres |
| Tamaño de letra | S · M · L · XL | `--fs` en CSS |
| Voz | Velocidad 0.6×–1.2× | `SpeechSynthesis.rate` |
| Sonido | Sí / No | Sonidos de papel |
| Calidad | Auto · Alta · Media · Baja | Ver §4 |
| Reducir movimiento | Sí / No | Respeta `prefers-reduced-motion` por defecto |
| Tema | Claro · Oscuro · Auto | |
| Rincón del terror | Mostrar / Ocultar | Filtra la repisa |
| Sin conexión | Estado + botones de descarga | Ver §5 |
| Mis palabras | Lista guardada | Abrir panel de repaso |

Persistencia: `localStorage['oh-settings']` (versionado `v:1`); si no hay almacenamiento, se usan valores por defecto. Cambiar un ajuste se aplica **en vivo** (variables CSS, clases en `<body>` y re-render del párrafo actual), sin recargar.

### Mis palabras

- ⭐ en el tooltip del glosario guarda `{id-cuento, h, py, es, en}` en `localStorage['oh-words']`.
- Panel de repaso: lista con pinyin, significado, botón ocultar/mostrar significado y botón de voz. Sin repetición espaciada en v2.

## 4. Rendimiento

### Diagnóstico (hipótesis a verificar con `?perf=1`)

1. El lector dibuja **todas** las escenas del cuento al cargar (hasta ~20 SVG con ~10–15 grupos filtrados cada una).
2. Cada grupo con `feTurbulence + feDisplacementMap + sombras` se **recalcula ~7 veces por segundo** (el "temblor" del papel) y en cada movimiento de parallax.
3. Desenfoque de capas lejanas y partículas aumentan el coste en equipos modestos.
4. Fuentes remotas (Google Fonts) retrasan el primer pintado.

### Cambios

| Medida | Detalle |
|---|---|
| Render perezoso | Solo se construye el SVG de la página actual y la siguiente; las demás se descartan al alejarse |
| Niveles de calidad | ver tabla |
| Gobernador **Auto** | Mide el tiempo entre cuadros durante 3 s tras abrir una página; si la mediana supera ~28 ms baja un nivel (y lo recuerda); si pasa 10 s holgado, sugiere subir |
| Pausa | Al ocultarse la pestaña o cuando la escena no es visible, se detienen intervalos y animaciones |
| Fuentes | Playfair y Nunito propias (woff2, `font-display: swap`); el chino usa la fuente del sistema (sin descargas pesadas) |
| Medición | `?perf=1` muestra fps, nodos DOM y nivel activo |

| Nivel | Papel (bordes que "hierven") | Sombras | Desenfoque | Partículas/niebla | Parallax |
|---|---|---|---|---|---|
| **Alta** | Sí (~7 fps) | doble capa | Sí | Sí | Sí |
| **Media** | Estático | doble capa | No | Reducidas | Sí |
| **Baja** | No | sombra CSS simple | No | No | No |

Criterio de aceptación: en una página típica, **Media** mantiene ≥ 45 fps y **Baja** ≥ 55 fps en el equipo más lento que tenga la persona usuaria (se medirá con `?perf=1`); el primer pintado del lector ocurre en < 1.5 s con caché fría local.

## 5. Modo sin conexión y descarga

- **PWA instalable**: `manifest.webmanifest` + iconos SVG/PNG; botón "Instalar" cuando el navegador lo ofrezca.
- **Service worker** (`sw.js`, caché versionada `oh-v2-<hash>`):
  - *Precaché* de la cáscara: `index.html`, `read.html`, `assets/*`, fuentes, audios, catálogo.
  - *Caché al leer*: cada cuento visitado queda disponible.
  - *Descargas explícitas*: en la ruedita y en cada libro (⬇), "Descargar este cuento" (sus archivos y los idiomas elegidos) y "Descargar toda la biblioteca"; se muestra progreso y tamaño y una marca ✓ en la repisa.
  - *Actualización*: aviso "Hay una versión nueva" y recarga controlada.
- **Estado**: indicador "sin conexión" y la repisa marca qué libros están disponibles.
- **Paquete descargable**: `tools/pack.sh` genera `open-histories-offline.zip` (sitio completo, funciona abriendo `index.html` con `file://` aunque no haya service worker); se adjunta a cada *release* de GitHub.
- Limitaciones declaradas: los *service workers* requieren HTTPS o `localhost`; en `file://` la biblioteca funciona por estar todo local, pero sin instalación.

## 6. Contenido

### 6.1 Chino graduado

- Reescritura **fiel en contenido, simple en lengua**: oraciones cortas (≤ ~12 palabras), vocabulario HSK 1–3 por defecto, repetición de estructuras, nombres propios consistentes.
- Cada párrafo en chino se corresponde con el párrafo español (misma posición), aunque cambie el número de oraciones.
- Pinyin generado con `pypinyin`; casos polifónicos corregidos en `tools/pinyin-overrides.json`.
- Revisión: se recomienda que una persona hablante nativa revise antes de difundir; el README lo indica.

### 6.2 Inglés

- Texto original de dominio público (Project Gutenberg) segmentado para alinear con los párrafos españoles. Para los cuentos que no tienen original inglés (p. ej. 牛郎织女), versión propia CC BY 4.0.

### 6.3 Cuentos nuevos

| Cuento | Estante | Fuente | Escenas (≈) | Notas |
|---|---|---|---|---|
| **牛郎织女** — *El pastor y la tejedora* | día (nuevo estante "Leyendas de Oriente" opcional) | Leyenda tradicional china (dominio público); versión propia en 中/es/en | 8–10 | Buey, tejedora, río de estrellas, puente de urracas; piezas nuevas en el kit (telar, Vía Láctea, urraca) |
| **La máscara de la muerte roja** | terror (+12) | Poe, 1842 (Gutenberg #2148); traducción propia al español; chino graduado propio | 9–11 | Siete salas de colores, el reloj de ébano, la figura enmascarada; terror con tema oscuro |

### 6.4 Cuentos existentes

Perico, El Gigante Egoísta, El Príncipe Feliz y El corazón delator reciben `.zh.js` y `.en.js`. El corazón delator (+12) conserva el aviso de contenido en los tres idiomas.

## 7. Extensibilidad (no se construye en v2, pero el modelo lo permite)

- `shelf`: cualquier clave nueva crea un estante (p. ej. `poesia`, `avanzado`) con título i18n en el catálogo.
- `kind: 'poema'`: páginas con `lines: [{ h, py, es, en }]` en lugar de `text`; el lector ya trata cada línea como un bloque subtitulable.
- `level.zh`: permitirá filtrar "HSK 1–3 / 4–5 / 6+" y ofrecer versiones fieles de un mismo cuento (`<id>.zh.js` frente a `<id>.zh-hsk5.js`).
- Más idiomas: añadir `<id>.<código>.js` y su entrada en `i18n.js`; no se toca el motor.

## 8. Validación y pruebas

`tools/validate.js` (Node, sin dependencias) falla si:

- el número de párrafos difiere entre idiomas de una misma página;
- `py` no tiene una sílaba por carácter chino, o hay `py` sin `text`;
- una palabra del glosario no aparece en el texto del cuento;
- un cuento del catálogo no tiene sus archivos, o un archivo no está en el catálogo;
- hay URLs externas no permitidas (solo se acepta lo declarado);
- algún archivo supera el presupuesto de tamaño acordado.

Verificación manual (lista en el PR): abrir cada cuento en los 3 idiomas, probar los 3 niveles de calidad, descargar un cuento, cortar la red y releerlo, instalar como PWA, probar con `prefers-reduced-motion`, móvil estrecho y teclado.

## 9. Hitos

1. **Motor v2**: catálogo, ajustes (ruedita), i18n de la interfaz, render perezoso, calidad (Alta/Media/Baja/Auto), fuentes propias, `?perf=1`.
2. **Offline**: service worker, descargas, manifest, `pack.sh`, validador.
3. **Chino + inglés** de los 4 cuentos actuales, pinyin, glosarios, "Mis palabras".
4. **Dos cuentos nuevos**, ya trilingües, con escenas y pruebas.
5. **Publicación**: repo, GitHub Pages, `library.eridu.top`, *release* con el zip offline.

Cada hito deja el sitio funcionando y publicable.

## 10. Riesgos

| Riesgo | Mitigación |
|---|---|
| Pinyin polifónico incorrecto | Tabla de excepciones + revisión de glosarios |
| Voces `zh-CN` ausentes en algunos sistemas | Detectar voces y avisar; el texto sigue siendo legible |
| Caché obsoleta del *service worker* | Versión en el nombre de caché y aviso de actualización |
| Calidad del chino sin revisión nativa | Marcar en README; abrir issues de corrección |
| Rendimiento distinto según equipo | Auto + `?perf=1` + niveles manuales |
| Tamaño total offline | Mostrar peso antes de descargar; audio mínimo; sin imágenes rasterizadas |
