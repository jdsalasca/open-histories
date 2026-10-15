# Lista de verificación del lector (manual)

Servir el repo (`python -m http.server 8777`) y abrir:

1. `read.html?s=perico-conejo&lang=es&sub=none` → idéntico a v1; sin aviso.
2. `read.html?s=fixture-mini&base=tests/fixtures/&lang=zh&sub=es&subMode=always&pinyin=always`
   → caracteres con ruby (pinyin), subtítulo en español bajo cada párrafo, glosario con tooltip "pinyin · significado", interfaz en chino.
3. `read.html?s=perico-conejo&lang=zh&sub=en` → aviso de idioma no disponible y texto en español.
4. Tocar un párrafo con `subMode=tap` / `pinyin=tap` muestra subtítulo y pinyin.
5. Tras las pruebas, restaurar: `OH.settings.set({lang:'es',sub:'none',pinyin:'tap',subMode:'tap',view:'read'})`.
6. `read.html?s=fixture-mini&base=tests/fixtures/&view=study&lang=zh&pinyin=always` → página en frases: pinyin siempre visible, un ▶ por frase (al tocar suena y pasa a ⏹; al cambiar de página se corta y vuelve a ▶) y bloque de traducción por párrafo.
7. `read.html?s=perico-conejo&view=study&lang=es&sub=en` → frases en español + traducción por párrafo; con `view=read` la lectura de párrafos queda intacta.
8. El conmutador [Lectura|Estudio] de la fila de herramientas y la fila "Modo de lectura" de la ruedita cambian el modo; se recuerda al recargar.
