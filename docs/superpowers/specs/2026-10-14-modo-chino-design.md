# Modo chino — Lectura + Estudio (Fase 1 de 4)

> Estado: **diseño aprobado · pendiente de implementación** · 2026-10-14
> Contexto: primera fase de la visión "biblioteca plantilla": **Fase 1** lector chino (este documento) · **Fase 2** N idiomas · **Fase 3** plantilla de cuentos · **Fase 4** motor de arte. Cada fase: spec → plan → rondas → publicación.

## 1. Objetivo

Que leer en chino en open-histories se sienta como estudiar en HelloChinese sin perder la lectura "de libro":

1. **Modo Lectura** (párrafos, como hoy) — más lindo: pinyin legible y aireado, traducción elegante, ritmo cuidado.
2. **Modo Estudio** (nuevo) — la página se desglosa en **frases**: caracteres + pinyin + audio por frase, traducción por párrafo.
3. **Conmutables y recordados**; nada de la experiencia actual se rompe (es/en también se benefician del pulido).

### Decisiones tomadas (con la persona usuaria)

| Tema | Decisión |
|---|---|
| Destino | El trabajo va en **open-histories** (lo publicado); el prototipo `librus/index.html` queda pausado |
| Experiencia | **Lectura + Estudio** en dos rondas |
| Traducción en Estudio | **Por párrafo** — se midió zh↔es y solo alinean frase a frase en 60,1% de los párrafos (149/248, 6 cuentos); no se inventan emparejamientos |
| Publicación | Al cerrar cada ronda que pase el control de calidad → `git push` + `./deploy.sh` (prod: library.eridu.top) |

## 2. Experiencia

### 2.1 Modo Lectura (pase de belleza)

Sin cambios funcionales; se pule lo que ya existe:

- **Pinyin (rt)**: más legible y aireado (tamaño, color, espaciado; no se monta sobre la línea superior); legible en tema claro y oscuro.
- **Traducción (.subt)**: rediseño — bloque suave y elegante (hoy: itálica apretada con barrita dorada); con aire y jerarquía clara respecto del texto principal.
- **Ritmo del texto**: espaciado entre párrafos, títulos y contenedor `.txt`; hover del párrafo táctil más claro.
- **Coherencia**: S / M / L / XL, temas claro y oscuro, móvil.

Los criterios finos se validan con capturas en la ronda (si algo no se ve bien, se ajusta ahí).

### 2.2 Modo Estudio (nuevo)

Una página de texto se muestra como una lista de tarjetas:

```
┌─ 一天晚上，一只小燕子飞过这座城市。   ▶ ─┐   ← caracteres + pinyin arriba
├─ 他的朋友们六个星期以前就飞去埃及了…   ▶ ─┤
│ ── 译: Una noche voló sobre la ciudad… ── │   ← traducción del párrafo (bloque suave)
├─ …                                        ┤
```

Reglas:

- **Pinyin siempre visible** en Estudio (es el punto del modo); el ajuste `pinyin` afecta solo a Lectura.
- **Audio por frase**: `speechSynthesis` con la voz del idioma principal (zh-CN para chino) y la velocidad de la voz de los ajustes; un botón ▶/⏹ por frase; una sola reproducción a la vez; se cancela al cambiar de página, de modo o de ajustes.
- **Traducción por párrafo**: si hay subtítulo elegido (`sub ≠ none`), cada grupo de frases lleva su bloque de traducción, siempre visible (el ajuste `subMode` afecta solo a Lectura). Marca discreta del idioma (ES / EN).
- **Palabras**: tocar una palabra subrayada = pinyin + significado + ⭐ guardar (igual que hoy).
- **Navegación**: igual que hoy (páginas, flechas, dedos, puntos); dentro de la página se hace scroll.
- **Conmutador**: control segmentado `📖 Lectura | 🎓 Estudio` en la fila de herramientas de la página; también como ajuste en la ruedita ⚙; se recuerda.
- Funciona con cualquier idioma principal; está pensado para chino.
- Sin auto-play ni colas (fuera de alcance).

## 3. Diseño técnico

### 3.1 Ajustes (`assets/settings.js`, `assets/panel.js`)

- Nuevo ajuste `view: 'read' | 'study'` (default `read`) en `DEFAULTS`, `ENUMS` y `normalize` (los ajustes guardados viejos no se migran: la clave entra con su default).
- Fila nueva en la ruedita: `Modo de lectura` con segmentado `[Lectura][Estudio]` (después de la fila de Pinyin).
- El lector acepta `?view=…` para depuración (se agrega a la lista de parámetros que se guardan como ajustes) y expone `stage.dataset.view`.

### 3.2 Texto (`assets/text.js`, puro y testeado)

- `splitSentences(text)` → `string[]`:
  - Parte después de terminadores (。！？…?!.) **fuera** de etiquetas `<b>/<i>` y de marcas `{{palabra|definición}}` (una definición puede contener puntos);
  - los cierres de cita (」』”"…) se pegan a su frase;
  - invariante: `splitSentences(t).join('') === t`.
- `sentencesWithPy(text, py)` → `[{ t, py }]`:
  - `py` es el trozo de pinyin que le toca a esa frase (se recorre con `walk` consumiendo pinyin, sin re-alinear a mano), así `mainHTML` se reutiliza tal cual por frase;
  - para es/en basta `py = ''` (el trozo queda vacío).
- Ambas se agregan al export de `OH.text` y a `module.exports`.

### 3.3 Lector (`assets/reader.js`)

- `renderCopy` de páginas de texto: si `view === 'study'` renderiza `.study` (grupos por párrafo: frases + bloque de traducción) en lugar de `.txt`/`.para`.
- Reutiliza el pipeline existente: `markGlossary` + glosario (`data-d`, ⭐ vía `OH.words`), `vocab()` para la traducción, `titleHTML`, y el diccionario `TTS`.
- Reproducción por frase: extensión de `listen()` (misma mecánica de estado: se cancela al navegar; textos limpios de marcas/etiquetas para la voz).
- Fila de herramientas: conmutador de modo (i18n, `aria-pressed`); `applySettings()` sincroniza `stage.dataset.view`.

### 3.4 Interfaz (`assets/i18n.js`, `assets/book.css`)

- Claves nuevas: `view` (etiqueta), `view_read`, `view_study` (es / zh / en).
- `book.css`: estilos `.study/.sent/.sent-main/.sent-sub` + botón; pase de belleza de `rt`, `.subt`, `.para`, `.txt`, títulos; paridad tema claro/oscuro y S/M/L/XL.

### 3.5 No se toca

- Contenido (`stories/*`, `content/*`), `tools/validate.js`, `kit.js`, `sw.js` (la versión de caché la estampa `tools/stage.sh` al publicar), servidor (§8 de AGENTS.md).

## 4. Rondas (cada una publicable)

### R1 — Lectura linda

- **Entregable**: modo Lectura más lindo (pinyin, traducción, ritmo) sin romper es/en/zh.
- **DoD**: `node --test` verde · validador verde · capturas antes/después (zh + es; claro/oscuro; S/M/L/XL; móvil; calidad baja) · consola limpia · commit + push + deploy + verificación post-deploy (hash de `build.js`, cuento abierto en 3 idiomas, `hotel.eridu.top` en 200).

### R2 — Modo Estudio

- **Entregable**: conmutador + frases con pinyin y audio + traducción por párrafo + ajuste en la ruedita + i18n + tests de segmentación.
- **DoD**: igual que R1 + tests nuevos (`splitSentences`, `sentencesWithPy`, `view` en settings) + smoke del lector extendido (`tests/reader-smoke.md`).

## 5. Testing

- `node --test tests/*.test.js`:
  - `text.test.js`: zh con 。！？…, diálogos 「」, etiquetas `<b>`, marcas `{{…}}` con puntuación dentro, invariante de concatenación; es con .!?…; alineación py por frase (1 sílaba por carácter).
  - `settings.test.js`: `view` default `read` y normalización (valor inválido → default).
- `node tools/validate.js` sin cambios (no se toca contenido).
- Visual manual por ronda con capturas; calidad baja y móvil.

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Alineación de pinyin por frase | `sentencesWithPy` con el invariante 1 sílaba/carácter + casos de contenido real en tests |
| Más nodos DOM en Estudio | tarjetas sin animaciones; reutiliza render perezoso; medir con `?perf=1` |
| Voz zh-CN ausente en algunos equipos | comportamiento actual del TTS (cae a la voz por defecto); documentado |
| El pase de belleza afecta a es/en | capturas de regresión en ambos idiomas y temas |
| Ajustes guardados viejos | `view` entra con default; `normalize` ya ignora claves desconocidas |

## 7. Fuera de alcance

- Pinyin en títulos/metadatos (requiere regenerar el contenido; futuro).
- Traducción frase a frase (se haría al **crear** cuentos, Fase 3).
- Fases 2–4: N idiomas, plantilla de cuentos, motor de arte.
- Auto-play continuo, audio grabado, repaso espaciado.
