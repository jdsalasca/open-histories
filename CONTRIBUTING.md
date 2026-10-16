# Cómo sumar un cuento (o un idioma)

## Un cuento nuevo

1. **Elige una obra de dominio público** (autor fallecido hace más de 70–80 años) y consigue el original (p. ej. Project Gutenberg).
2. **Traduce completo** al español y crea `stories/<id>.js` (copia `stories/perico-conejo.js` como plantilla):
   - `scenes`: funciones que devuelven SVG con las piezas de `assets/kit.js` (`K.ly`, `K.paper`, `K.tree`, `K.rabbit`…).
   - `pages`: `{ scene, title, text: [párrafos], word?, think? }`. Usa `{{palabra|significado}}` para subrayar vocabulario.
   - Un protagonista por escena y movimiento sobrio (nada de destellos masivos).
3. **Chino e inglés** (opcional pero bienvenido): escribe `content/<id>.zh.json` y `content/<id>.en.json` con el
   **mismo número de párrafos por página** que el español. El chino debe ser *graduado* (frases cortas, HSK 1–4).
   - Genera los archivos del sitio: `uv run --with pypinyin python tools/pinyin.py content/<id>.zh.json`
     (calcula el pinyin; las excepciones van en `tools/pinyin-overrides.json`).
   - Revisa lecturas dudosas: `python tools/pinyin_review.py stories/<id>.zh.js`.
4. **Añade el libro** a `stories/catalog.js` (estante, nivel, título en es/zh/en, archivos) y su emblema en `index.html`.
5. **Valida**: `node --test tests/*.test.js && node tools/validate.js`. Debe salir en verde.
6. Abre un *pull request*.

## Un idioma nuevo

Sumar un idioma no toca la lógica del motor. En corto: entrada en `assets/langs.js`, `content/<id>.<código>.json` (mismas páginas y párrafos que el español), `uv run --with pypinyin python tools/pinyin.py content/<id>.<código>.json`, y catálogo (`langs`, `files`, `title.<código>`). Las cadenas de interfaz son opcionales (caen a español). La receta completa está en `AGENTS.md` §5c.

## Reglas

Texto fiel al original, nada que no sea de dominio público, y avisa del contenido sensible (`warning`) en los cuentos del
Rincón del terror. Los textos en chino pasan por revisión nativa antes de considerarse definitivos.
