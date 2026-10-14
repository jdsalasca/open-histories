# Lista de verificación del lector (manual)

Servir el repo (`python -m http.server 8777`) y abrir:

1. `read.html?s=perico-conejo&lang=es&sub=none` → idéntico a v1; sin aviso.
2. `read.html?s=fixture-mini&base=tests/fixtures/&lang=zh&sub=es&subMode=always&pinyin=always`
   → caracteres con ruby (pinyin), subtítulo en español bajo cada párrafo, glosario con tooltip "pinyin · significado", interfaz en chino.
3. `read.html?s=perico-conejo&lang=zh&sub=en` → aviso de idioma no disponible y texto en español.
4. Tocar un párrafo con `subMode=tap` / `pinyin=tap` muestra subtítulo y pinyin.
5. Tras las pruebas, restaurar: `OH.settings.set({lang:'es',sub:'none',pinyin:'tap',subMode:'tap'})`.
