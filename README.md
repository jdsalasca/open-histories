# open-histories 📚✂️

Una repisa de **cuentos clásicos de dominio público**, completos y animados en **papel recortado** (papercraft).
Se leen en el navegador, **sin instalar nada**, y ahora también **para aprender chino**: cada cuento se puede leer
en español, en 中文 (graduado, con pinyin) o en English, con subtítulos.

> **Léelo ahora:** https://library.eridu.top · espejo: https://jdsalasca.github.io/open-histories/
> o abre `index.html` en local y toca un libro.

## En la repisa

| Cuento | Autor | Año | 中文 | EN | Estado |
|---|---|---|---|---|---|
| Perico, el conejo travieso | Beatrix Potter | 1902 | HSK 1–3 | ✅ | ✅ completo |
| El Gigante Egoísta | Oscar Wilde | 1888 | HSK 2–3 | ✅ | ✅ completo |
| El Príncipe Feliz | Oscar Wilde | 1888 | HSK 3 | ✅ | ✅ completo |
| El pastor y la tejedora (牛郎织女) | Leyenda tradicional china | — | HSK 2–3 | ✅ | ✅ completo |
| El Ruiseñor y la Rosa | Oscar Wilde | 1888 | — | — | 🛠 en camino |
| La niña de los fósforos | H. C. Andersen | 1845 | — | — | 🛠 en camino |
| Caperucita Roja | Hermanos Grimm | 1812 | — | — | 🛠 en camino |

### 🎃 Rincón del terror (+12)

| Cuento | Autor | Año | 中文 | EN | Estado |
|---|---|---|---|---|---|
| El corazón delator | Edgar Allan Poe | 1843 | HSK 3 | ✅ | ✅ completo |
| La máscara de la muerte roja | Edgar Allan Poe | 1842 | HSK 4 | ✅ | ✅ completo |
| El gato negro | Edgar Allan Poe | 1843 | — | — | 🛠 en camino |
| La pata de mono | W. W. Jacobs | 1902 | — | — | 🛠 en camino |

## Qué trae cada libro

- **Texto completo** (no resumen), traducido al español a partir del original de dominio público.
- **Para aprender chino**: texto en chino simplificado *graduado* (frases cortas, vocabulario básico), **pinyin** sobre cada
  carácter, **subtítulos** en español o inglés (siempre, al tocar u ocultos), glosario por cuento y voz en `zh-CN`.
- **Mis palabras**: toca una palabra subrayada para ver su pinyin y significado, y guárdala para repasarla.
- **Ilustraciones animadas** en cartón recortado: capas que se arman como un libro pop-up, sombras de papel en dos capas,
  profundidad de campo, bordes que "hierven" a pasos (stop-motion), personajes que parpadean, luciérnagas, niebla y
  parallax con el cursor.
- **Didáctica**: palabras con su significado, preguntas para pensar, enseñanza final y un mini-quiz.
- **Sonido de papel** (generado con ffmpeg; se puede silenciar) y lectura en voz alta del navegador.

## La ruedita ⚙

En la repisa y en el lector: idioma principal, subtítulos y cuándo mostrarlos, pinyin, tamaño de letra, velocidad de la voz,
sonido, **calidad** (Auto / Alta / Media / Baja), tema claro u oscuro, mostrar u ocultar el Rincón del terror,
descargas sin conexión y tu lista de palabras. Se guarda en tu navegador.

## Rendimiento

El lector dibuja solo la página actual y la siguiente. La calidad **Auto** mide los cuadros por segundo y baja sola si
tu equipo va justo (también puedes fijarla). Añade `?perf=1` a la dirección para ver el nivel y el número de nodos.

## Sin conexión

- **Instalable** como app (PWA) y con **descargas**: un cuento, o toda la biblioteca, desde la ruedita.
- **Paquete `.zip`** (en cada *release*) para abrir `index.html` con doble clic, sin servidor.
- Los *service workers* solo funcionan con HTTPS o `localhost`; con doble clic sobre el `.zip` todo funciona igual, sin instalación.

## Estructura

```
index.html            la repisa              read.html          el lector (?s=<id>)
sw.js, manifest       modo sin conexión      assets/            kit, lector, ajustes, i18n, texto, rendimiento…
stories/<id>.js       escenas + español      stories/<id>.zh.js / .en.js   texto por idioma (generado)
stories/catalog.js    metadatos de la repisa content/<id>.<lang>.json      fuente del chino e inglés
tools/                pinyin, validador, empaquetado   tests/            pruebas (node --test, unittest)
```

No hay compilación: son archivos estáticos. Para verlo en local:

```bash
python -m http.server 8000   # y abre http://localhost:8000
```

Pruebas y validación:

```bash
node --test tests/*.test.js
uv run --with pypinyin python -m unittest tests.test_pinyin
node tools/validate.js
```

## Licencias

- **Textos originales**: dominio público (fuentes: [Project Gutenberg](https://www.gutenberg.org)).
- **Traducciones al español, chino graduado, inglés de las versiones propias, ilustraciones y sonidos**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
- **Código**: [MIT](LICENSE) · **Fuentes** Playfair Display y Nunito: [SIL OFL 1.1](assets/fonts/OFL.txt).

> Los cuentos se mantienen fieles a sus originales, con el lenguaje de su época.
> **El chino lo escribió una IA y no ha tenido revisión nativa todavía**: si eres hablante nativo y ves algo raro,
> abre un *issue* o un *pull request* con la corrección en `content/`.

¿Quieres sumar un cuento, un idioma o poesía? Lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Publicación

- **GitHub Pages**: se publica solo desde `main`.
- **library.eridu.top**: `./deploy.sh usuario@host:/ruta` copia los archivos estáticos (con la versión de caché estampada);
  un servicio de usuario de systemd los sirve y un túnel de Cloudflare propio los expone.
