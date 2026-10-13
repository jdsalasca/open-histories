# Cómo sumar un cuento

1. **Elige una obra de dominio público** (autor fallecido hace más de 70–80 años) y consigue el texto original (p. ej. en Project Gutenberg).
2. **Traduce completo** al español (o aporta una traducción que también sea de dominio público o con licencia libre).
3. Copia `stories/perico-conejo.js` como plantilla y cámbiale el `id`, el texto, las escenas y el quiz.
   - `scenes`: funciones que devuelven SVG usando las piezas de `assets/kit.js` (`K.ly`, `K.paper`, `K.tree`, `K.rabbit`…).
   - `pages`: lista de `{ scene, title, text: [párrafos], word?, think? }`. Usa `{{palabra|significado}}` para subrayar vocabulario.
4. Añade el libro al arreglo `BOOKS` de `index.html` (color, emblema, tooltip).
5. Prueba en local y abre un *pull request*.

Reglas: texto fiel al original, sin contenido que no sea de dominio público, y animaciones sobrias (un protagonista por escena, nada de destellos masivos).
