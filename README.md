# open-histories 📚✂️

Una repisa de **cuentos clásicos de dominio público**, completos, en español y animados en **papel recortado** (papercraft).
Se leen en el navegador: sin instalar nada, sin servidor, sin anuncios.

> **Léelo ahora:** https://library.eridu.top · espejo: https://jdsalasca.github.io/open-histories/
> o abre `index.html` en local y toca un libro.

## En la repisa

| Cuento | Autor | Año | Estado |
|---|---|---|---|
| Perico, el conejo travieso | Beatrix Potter | 1902 | ✅ completo |
| El Gigante Egoísta | Oscar Wilde | 1888 | ✅ completo |
| El Príncipe Feliz | Oscar Wilde | 1888 | ✅ completo |
| El Ruiseñor y la Rosa | Oscar Wilde | 1888 | 🛠 en camino |
| La niña de los fósforos | H. C. Andersen | 1845 | 🛠 en camino |
| Caperucita Roja | Hermanos Grimm | 1812 | 🛠 en camino |

### 🎃 Rincón del terror (+12)

| Cuento | Autor | Año | Estado |
|---|---|---|---|
| El corazón delator | Edgar Allan Poe | 1843 | ✅ completo |
| La máscara de la muerte roja | Edgar Allan Poe | 1842 | 🛠 en camino |
| El gato negro | Edgar Allan Poe | 1843 | 🛠 en camino |
| La pata de mono | W. W. Jacobs | 1902 | 🛠 en camino |

## Qué trae cada libro

- **Texto completo** (no resumen), traducido al español a partir del original en inglés de dominio público.
- **Ilustraciones animadas** en cartón recortado: capas que se arman como un libro pop-up, sombras de papel en dos capas, profundidad de campo, bordes que "hierven" a pasos (stop-motion), personajes que parpadean, luciérnagas, niebla y parallax con el cursor.
- **Didáctica**: palabras subrayadas con su significado, preguntas para pensar, enseñanza final y un mini-quiz.
- **Sonido de papel** (generado con ffmpeg; se puede silenciar) y lectura en voz alta del navegador.

## Estructura

```
index.html          la repisa
read.html           el lector (?s=<id-del-cuento>)
assets/kit.js       piezas de cartón (árboles, conejos, casas, cielos…)
assets/reader.js    lector: páginas, quiz, sonido, parallax
assets/*.css        estilos de la repisa y del libro
stories/<id>.js     un cuento = texto + escenas (OH.story({...}))
audio/              sonidos de papel
```

No hay compilación: son archivos estáticos. Para verlo en local:

```bash
python -m http.server 8000   # y abre http://localhost:8000
```

## Licencias

- **Textos originales**: dominio público (fuentes: [Project Gutenberg](https://www.gutenberg.org)).
- **Traducciones al español, ilustraciones y sonidos**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
- **Código**: [MIT](LICENSE).

> Los cuentos se mantienen fieles a sus originales, con el lenguaje de su época.

¿Quieres sumar un cuento? Lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Publicación

- **GitHub Pages**: se publica solo desde `main`.
- **library.eridu.top**: servidor propio. `./deploy.sh usuario@host:/ruta` copia los archivos estáticos; un servicio
  de usuario de systemd los sirve y un túnel de Cloudflare propio los expone (independiente de otros sitios del servidor).
