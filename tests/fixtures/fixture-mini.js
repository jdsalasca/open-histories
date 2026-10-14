/* Cuento mínimo para probar el lector multilingüe (no está en el catálogo). */
(function () {
  const { paper, ly, sky, wave, svg, rabbit } = OH.kit;
  const scene = label => () => svg(label, `${sky('skyDay')}${ly(.2, 4, paper(wave(380, 12, '#7fbf6e', 1)))}${ly(.6, 9, paper(rabbit(400, 440, 2, '#b9926a')))}`);
  OH.story({
    id: 'fixture-mini', title: 'Un conejo *pequeño*', author: 'Prueba', year: 2026, orig: 'Fixture',
    trans: 'Fixture de pruebas.', tagline: 'Dos páginas.', intro: 'Cuento de prueba.', moral: 'Prueba superada.',
    scenes: { cover: scene('portada'), uno: scene('uno'), dos: scene('dos'), fin: scene('fin') },
    pages: [
      { scene: 'uno', title: 'El conejo', text: ['Había un conejo pequeño.', 'El conejo comía zanahorias.'], word: ['Conejo', 'Animal de orejas largas.'] },
      { scene: 'dos', title: 'La huerta', text: ['Llegó a la huerta y se fue a casa.'] }
    ],
    quiz: [{ q: '¿Qué comía?', o: ['Zanahorias', 'Pan', 'Nada'], a: 0, ok: '¡Sí!', no: 'No.' }]
  });
})();
