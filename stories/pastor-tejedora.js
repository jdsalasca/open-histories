/* El pastor y la tejedora (牛郎织女 · Niulang y Zhinü) — leyenda tradicional china. Dominio público.
 * Versión propia en español (CC BY 4.0) a partir de la tradición oral; chino graduado e inglés en archivos aparte. */
(function () {
  const { paper, ly, sky, stars, star, wave, cloud, moon, sun, person, svg, R, motes, fog, candle, tree, bush, flower, flowers, house, cottage, bird } = OH.kit;

  /* ── piezas propias de esta historia ── */
  const ox = (x, y, s = 1, flip = 1) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})">
    <ellipse cx="0" cy="-40" rx="46" ry="26" fill="#8a5a34"/><rect x="-34" y="-30" width="11" height="32" fill="#6e4526"/><rect x="-10" y="-30" width="11" height="32" fill="#6e4526"/>
    <rect x="14" y="-30" width="11" height="32" fill="#6e4526"/><rect x="30" y="-30" width="11" height="32" fill="#6e4526"/>
    <path d="M-46,-46 Q-66,-40 -60,-18" stroke="#6e4526" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="52" cy="-52" rx="20" ry="16" fill="#9a6a40"/><ellipse cx="66" cy="-46" rx="10" ry="8" fill="#d9b58a"/>
    <path d="M44,-64 Q36,-86 22,-84 M58,-66 Q62,-90 78,-88" stroke="#f4eee0" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="-56" r="2.6" fill="#2a1d10"/></g>`;
  const fairy = (x, y, s, col, flip = 1, ribbon = '#fff') => `<g transform="translate(${x},${y}) scale(${s * flip},${s})">
    <path d="M-10,-4 Q-60,-30 -90,-8 M10,-4 Q60,-26 84,-2" stroke="${ribbon}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M-16,0 L-9,-40 L9,-40 L16,0 Z" fill="${col}"/><circle cx="0" cy="-50" r="11" fill="#f6d5b5"/>
    <path d="M-12,-52 Q0,-72 12,-52 Q0,-60 -12,-52Z" fill="#1d1a2e"/><circle cx="0" cy="-70" r="4" fill="#1d1a2e"/></g>`;
  /* el río de estrellas: banda diagonal de polvo luminoso */
  const milky = (y = 250, tilt = -14, op = .55) => `<g transform="rotate(${tilt} 400 ${y})"><rect x="-120" y="${y - 52}" width="1040" height="104" rx="52" fill="#cfd8ff" opacity="${op * .35}"/><rect x="-120" y="${y - 26}" width="1040" height="52" rx="26" fill="#fff4d6" opacity="${op * .5}"/>${Array.from({ length: 70 }, () => `<circle cx="${(-100 + R() * 1000).toFixed(0)}" cy="${(y - 46 + R() * 92).toFixed(0)}" r="${(0.8 + R() * 1.8).toFixed(1)}" fill="#fff" opacity="${(0.5 + R() * .5).toFixed(2)}"/>`).join('')}</g>`;
  const magpie = (x, y, s = 1, flip = 1) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})"><ellipse cx="0" cy="0" rx="17" ry="9" fill="#14111f"/><ellipse cx="2" cy="4" rx="10" ry="5" fill="#fff"/><circle cx="15" cy="-5" r="7" fill="#14111f"/><polygon points="20,-6 29,-3 20,-1" fill="#f0a23a"/><circle cx="17" cy="-7" r="1.5" fill="#fff"/><path d="M-14,0 L-38,6 L-16,6Z" fill="#14111f"/><g class="wing"><path d="M-2,-6 Q-6,-26 -24,-22 Q-14,-12 -2,-2Z" fill="#1d3a6a"/></g></g>`;
  const brightStar = (x, y, r, c = '#fff6c8') => `<g class="glow"><circle cx="${x}" cy="${y}" r="${r * 3}" fill="${c}" opacity=".35"/></g>${star(x, y, r, c, 0)}`;

  OH.story({
    id: 'pastor-tejedora',
    title: 'El pastor y la *tejedora*',
    author: 'Leyenda tradicional china', year: null, orig: '牛郎织女 (Niulang y Zhinü)', chapterLabel: 'Escena',
    trans: 'Versión propia en español, chino graduado e inglés (CC BY 4.0), a partir de la tradición oral china.',
    tagline: 'Dos estrellas, un río de plata y un puente de urracas.',
    intro: 'Un pastor pobre, una hada tejedora y una noche al año. La leyenda china que explica por qué, en verano, hay dos estrellas a cada lado de la Vía Láctea.',
    moral: 'El amor fiel y el trabajo honrado resisten la distancia. La leyenda nos recuerda que incluso lo que parece imposible —cruzar un río de estrellas— se logra cuando muchos ayudan: las urracas, con sus alas.',
    scenes: {
      cover: () => svg('Dos estrellas brillantes a cada lado de un río de estrellas, con un puente de urracas',
        `${sky('skyNight')}${stars(40, 8, 460)}
        ${ly(.1, 2, milky(250, -14, .6))}
        ${ly(.4, 5, brightStar(150, 130, 10, '#bfe0ff') + brightStar(650, 360, 10, '#ffd9a0'))}
        ${ly(.8, 9, `<g class="bob">${[0, 1, 2, 3, 4, 5, 6].map(i => magpie(230 + i * 52, 262 - Math.sin(i / 6 * Math.PI) * 60, .8, i % 2 ? 1 : -1)).join('')}</g>`)}
        ${ly(1.1, 12, paper(wave(450, 12, '#1a2450', 2) + wave(480, 10, '#10183a', 4)))}
        ${motes(10, '#ffe9a8', 80, 440)}`, 'cold'),

      aldea: () => svg('Niulang, un muchacho huérfano, junto a su buey y su casita vieja, junto a un río',
        `${sky('skyDay')}${sun(660, 80, 36)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(180, 90, 1, '#fff') + cloud(520, 60, .8, '#fff'), true)}</g>`)}
        ${ly(.3, 4, paper(wave(300, 14, '#a6d994', 1), true) + paper(house(560, 330, 120, 90, '#f3e2c2', '#8a3b4a') + house(420, 336, 80, 60, '#e8d4a8', '#6c4570'), true))}
        ${ly(.6, 8, paper(wave(380, 12, '#8fcf7a', 3) + `<path d="M0,430 Q200,410 400,432 T800,424 V500 H0Z" fill="#5fb0e0"/>` + tree(90, 400, 1.6, '#5fae5a')))}
        ${ly(.9, 12, paper(wave(455, 10, '#5fae5a', 5)) + flowers(10, 460, 495))}
        ${ly(1.2, 16, `<g class="bob">${paper(ox(300, 466, 1.5, 1))}</g>${paper(person(190, 470, 1.8, '#7a8a4a'))}${paper(cottage(600, 470, 1.5, '#e6d3ad', '#7a4a2c', true))}`)}`, 'warm'),

      buey: () => svg('El viejo buey habla a Niulang bajo las primeras estrellas',
        `${sky('skyDusk')}${stars(14, 8, 180)}
        ${ly(.1, 3, brightStar(560, 90, 10, '#ffe08a'))}
        ${ly(.3, 5, paper(wave(340, 12, '#8a6aa8', 2) + wave(390, 10, '#6a4a88', 4), true))}
        ${ly(.7, 10, paper(wave(440, 10, '#4a3a68', 3)) + paper(tree(700, 440, 2, '#4a7a52')))}
        ${ly(1, 14, `<g class="bob">${paper(ox(470, 466, 2.1, 1))}</g>${paper(person(250, 470, 2, '#7a8a4a'))}<text class="note" style="animation-delay:.4s" x="560" y="330" font-size="28" fill="#fff6c8">✦</text><text class="note" style="animation-delay:1.6s" x="590" y="360" font-size="22" fill="#ffd9a0">✦</text>`)}`, 'warm'),

      lago: () => svg('Siete hadas con vestidos de colores se bañan en un lago envuelto en niebla; Niulang observa escondido',
        `${sky('skyDawn')}
        ${ly(.1, 3, `<g class="drift">${paper(cloud(220, 90, 1.1, '#fff') + cloud(600, 130, .9, '#ffeef0'), true)}</g>`)}
        ${ly(.3, 5, paper(wave(300, 12, '#9ad0a0', 2) + tree(120, 360, 1.7, '#4f9a54') + tree(690, 366, 1.9, '#4f9a54'), true))}
        ${ly(.6, 8, paper(`<ellipse cx="400" cy="410" rx="330" ry="70" fill="#7fc4e8"/><ellipse cx="400" cy="404" rx="280" ry="52" fill="#a8dcf4"/>`) + `<g>${[['#e58b94', 200], ['#f7d878', 280], ['#b79af2', 360], ['#7fcf9a', 440], ['#ff9d6b', 520], ['#6fb3ff', 600]].map((c, i) => `<g class="bob" style="animation-delay:-${i * .35}s">${paper(fairy(c[1], 350 - (i % 2) * 18, .9, c[0], i % 2 ? 1 : -1))}</g>`).join('')}</g>`)}
        ${ly(.9, 12, fog(430, .45, 80))}
        ${ly(1.1, 15, paper(`<path d="M690,500 C686,430 684,380 692,330 M720,500 C718,440 720,390 728,350" stroke="#4f8f4a" stroke-width="6" fill="none" stroke-linecap="round"/>`) + `<g class="creep" style="--cx:-10px">${paper(person(650, 470, 1.5, '#7a8a4a'))}</g>${paper(`<rect x="560" y="260" width="40" height="52" rx="8" fill="#f4b8c8"/>`, true)}`)}`, 'warm'),

      puerta: () => svg('Una noche, Zhinü llama a la puerta de Niulang: ¿has visto mi vestido?',
        `${sky('skyNight')}${stars(34, 8, 240)}${moon(120, 90, 36)}
        ${ly(.2, 4, paper(wave(380, 12, '#26346f', 2), true))}
        ${ly(.6, 9, paper(`<rect x="300" y="190" width="240" height="220" fill="#d9b88a"/><polygon points="280,190 420,100 560,190" fill="#7a4a2c"/><rect x="380" y="260" width="80" height="150" rx="6" fill="#ffd36b"/>`) + `<g class="glow"><circle cx="420" cy="340" r="200" fill="url(#fireglow)" opacity=".5"/></g>`)}
        ${ly(1, 14, `${paper(fairy(250, 450, 1.6, '#f4f7ff', 1, '#e8eefc'))}${paper(person(500, 450, 1.9, '#7a8a4a'))}${candle(580, 460, 1.1)}`)}`, 'cold'),

      casa: () => svg('Zhinü teje telas como nubes en su telar mientras los niños juegan y Niulang trabaja el campo',
        `${sky('skyDay')}${sun(100, 80, 32)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(520, 80, 1, '#fff'), true)}</g>`)}
        ${ly(.3, 4, paper(wave(320, 12, '#b8d98f', 2), true))}
        ${ly(.6, 8, paper(`<rect x="60" y="200" width="320" height="230" fill="#efd3a2"/><polygon points="40,200 220,110 400,200" fill="#8a3b4a"/><rect x="100" y="330" width="130" height="14" fill="#8b5a2b"/><rect x="110" y="260" width="10" height="90" fill="#8b5a2b"/><rect x="210" y="260" width="10" height="90" fill="#8b5a2b"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${124 + i * 18}" y="270" width="12" height="62" fill="${['#ff9d9d', '#ffd36b', '#9ad0ff', '#c0a0ff', '#9be0b0'][i]}"/>`).join('')}`))}
        ${ly(.9, 12, paper(wave(450, 10, '#7fbf6e', 4)) + flowers(10, 455, 490))}
        ${ly(1.2, 16, `${paper(fairy(190, 340, 1.1, '#f4b8c8', 1))}${paper(person(520, 470, 1.8, '#7a8a4a', true) + person(620, 474, 1.1, '#c0283f', true) + person(680, 476, 1, '#2e5fbf', true))}`)}`, 'warm'),

      buey2: () => svg('El viejo buey descansa bajo un árbol; Niulang guarda su piel con cariño',
        `${sky('skyDusk')}
        ${ly(.3, 4, paper(wave(340, 14, '#a07aa8', 2) + wave(390, 12, '#7a5a88', 4), true))}
        ${ly(.6, 9, paper(tree(560, 440, 2.4, '#4f7a52', '#6a4a2a')))}
        ${ly(1, 14, `${paper(ox(380, 470, 1.8, 1))}${paper(person(230, 470, 2, '#7a8a4a'))}<text class="note" x="360" y="300" font-size="26" fill="#fff6c8">✦</text>`)}
        ${motes(10, '#ffe9a8', 160, 440)}`, 'warm'),

      tormenta: () => svg('Una tormenta: la Reina Madre del Oeste se lleva a Zhinü al cielo mientras los niños lloran',
        `${sky('skyDeep')}
        ${ly(.1, 3, `<g class="drift">${paper(cloud(160, 100, 1.6, '#3a3560') + cloud(560, 80, 1.8, '#2d2850') + cloud(380, 170, 1.4, '#4a4478'), true)}</g>`)}
        <polygon class="flickfx" points="430,0 400,120 440,120 380,260" fill="#fff6c8" opacity=".9"/>
        ${ly(.6, 8, paper(wave(400, 12, '#1d2450', 2)) + paper(cottage(300, 460, 1.7, '#d8c4a0', '#5a3a2a', true)))}
        ${ly(1, 14, `<g class="bob">${paper(`<ellipse cx="620" cy="160" rx="130" ry="40" fill="#ffd36b" opacity=".85"/>`)}${paper(fairy(640, 150, 1.3, '#f4b8c8', -1))}${paper(fairy(560, 168, 1.1, '#ffd36b', 1, '#ffe9a8'))}</g>${paper(person(120, 470, 1.4, '#c0283f', true) + person(180, 474, 1.2, '#2e5fbf', true))}`)}
        ${Array.from({ length: 30 }, () => `<line class="snow" style="animation-duration:${(.8 + R() * .6).toFixed(1)}s;animation-delay:-${(R() * 2).toFixed(1)}s" x1="${(R() * 800).toFixed(0)}" y1="0" x2="${(R() * 800 - 8).toFixed(0)}" y2="16" stroke="#9ecbff" stroke-width="1.6" opacity=".7"/>`).join('')}`, 'horror'),

      rio: () => svg('Niulang vuela con sus hijos en dos cestas tras Zhinü; la Reina Madre traza un río de estrellas',
        `${sky('skyNight')}${stars(30, 8, 200)}
        ${ly(.2, 4, `<g class="glow">${milky(260, 62, .7)}</g>`)}
        ${ly(.7, 9, `<g class="gx" style="--sx:-60px;--sy:60px;--t:3s;--w:.6s"><g class="gy" style="--sy:40px;--t:3s;--w:.6s">${paper(person(230, 360, 1.7, '#7a8a4a') + `<rect x="170" y="290" width="124" height="5" fill="#8b5a2b"/><rect x="160" y="296" width="32" height="26" rx="6" fill="#c58a52"/><rect x="274" y="296" width="32" height="26" rx="6" fill="#c58a52"/>`)}</g></g>${paper(fairy(600, 150, 1.4, '#f4b8c8', -1))}`)}
        ${ly(1, 13, `<g class="glow"><polygon points="660,60 640,150 690,150" fill="#ffd36b" opacity=".6"/></g>${paper(wave(470, 10, '#10183a', 2))}`)}`, 'cold'),

      puente: () => svg('Un puente de urracas cruza el río de estrellas; Niulang y Zhinü se encuentran en medio',
        `${sky('skyNight')}${stars(40, 8, 460)}
        ${ly(.1, 2, milky(280, -8, .65))}
        ${ly(.5, 8, `<g class="bob">${Array.from({ length: 16 }, (_, i) => magpie(130 + i * 36, 282 - Math.sin(i / 15 * Math.PI) * 50, .85, i % 2 ? 1 : -1)).join('')}</g>`)}
        ${ly(1, 13, `${paper(person(380, 246, 1.3, '#7a8a4a'))}${paper(fairy(430, 248, .95, '#f4b8c8', -1))}${brightStar(90, 90, 9, '#bfe0ff')}${brightStar(720, 440, 9, '#ffd9a0')}`)}
        ${ly(1.3, 14, paper(wave(485, 8, '#10183a', 2)))}${motes(12, '#ffe9a8', 80, 440)}`, 'cold'),

      fin: () => svg('Dos estrellas, Tejedora y Pastor, a cada lado del río de estrellas',
        `${sky('skyNight')}${stars(40, 8, 460)}
        ${ly(.2, 3, milky(250, -10, .6))}
        ${ly(.6, 8, brightStar(180, 160, 12, '#bfe0ff') + brightStar(620, 340, 12, '#ffd9a0'))}
        ${ly(1, 12, `<g class="bob">${[0, 1, 2, 3, 4].map(i => magpie(290 + i * 50, 258 - Math.sin(i / 4 * Math.PI) * 36, .9, i % 2 ? 1 : -1)).join('')}</g>`)}`, 'cold')
    },
    pages: [
      { scene: 'aldea', title: 'El pastor *huérfano*',
        text: ['Hace mucho tiempo, en un pueblo junto a un río, vivía un muchacho huérfano al que todos llamaban Niulang, «el pastor de bueyes».',
          'Vivía con su hermano mayor y la mujer de este, que lo trataban mal. Trabajaba de la mañana a la noche y apenas le daban de comer.',
          'Cuando el hermano repartió la herencia, le dejó a Niulang solo una casita vieja y un buey ya mayor. Niulang no se quejó: cuidó al buey como a un buen amigo.'],
        word: ['Huérfano', 'Niño o niña que ha perdido a su padre y a su madre.'] },
      { scene: 'buey', title: 'El viejo *buey*',
        text: ['Un día, el viejo buey abrió la boca y habló. —No te asustes, Niulang —dijo—. Soy una estrella del cielo que fue castigada y bajó a la tierra. Tú eres bueno conmigo y quiero ayudarte.',
          '—Mañana, al amanecer, las hadas del cielo vendrán a bañarse al lago del bosque. Una de ellas es Zhinü, la tejedora, que hace las nubes de colores. Toma su vestido rosa, que estará colgado de un árbol, y ella será tu esposa.',
          'Niulang no se atrevía a creerlo, pero al día siguiente fue al lago.'],
        word: ['Tejedora', 'Persona que hace telas entrelazando hilos en un telar.'] },
      { scene: 'lago', title: 'El lago y las hadas',
        text: ['Al amanecer, la niebla cubría el lago. De pronto, siete muchachas con vestidos de colores bajaron del cielo como pájaros y se metieron en el agua entre risas.',
          'Niulang se escondió entre los juncos. Vio los vestidos colgados de las ramas y buscó el rosa. Lo tomó con cuidado y volvió corriendo a su casa.',
          'Cuando el sol subió, las hadas salieron del agua y se vistieron para volver. Seis volaron al cielo; la séptima buscaba, asustada, su vestido.'] },
      { scene: 'puerta', title: 'El vestido *rosa*',
        text: ['Zhinü, la más joven, no podía volar sin su vestido. Esa noche llamaron a la puerta de Niulang. —¿Has visto mi vestido? —preguntó ella.',
          'Él se lo contó todo con sinceridad: lo del buey, el lago y el vestido. Ella lo miró y vio que era un hombre honrado y trabajador.',
          'Zhinü sonrió y se quedó. Poco después se casaron.'] },
      { scene: 'casa', title: 'Días *felices*',
        text: ['Fueron años felices. Niulang trabajaba en el campo y Zhinü tejía telas más hermosas que todas las del pueblo, con hilos que parecían nubes.',
          'Tuvieron dos hijos: un niño y una niña. La casita se llenó de risas.',
          'La gente decía que nunca había visto una familia tan unida.',
          'Pero allá arriba, en el cielo, alguien notó que la tejedora faltaba.'] },
      { scene: 'buey2', title: 'El regalo del buey',
        text: ['Un día el viejo buey enfermó. Antes de morir le dijo a Niulang: —Guarda mi piel. Cuando estés en un gran apuro, póntela y te llevará adonde necesites.',
          'Niulang lloró mucho. Enterró al buey bajo un árbol y guardó su piel con cariño.',
          'No sabía que muy pronto la necesitaría.'] },
      { scene: 'tormenta', title: 'La Reina *Madre*',
        text: ['Una tarde se levantó una tormenta enorme. El cielo se volvió negro, el viento sacudió la casa y un trueno hizo temblar la tierra.',
          'Cuando todo se calmó, Zhinü había desaparecido. Los niños lloraban: —¡Mamá, mamá!',
          'La Reina Madre del Oeste, abuela de Zhinü, estaba furiosa porque una hada del cielo se había casado con un mortal. Mandó soldados celestiales y se llevó a su nieta de vuelta.',
          'Niulang miró el cielo y recordó las palabras del buey.'],
        think: ['¿Por qué crees que la Reina Madre se enfadó con Zhinü?', 'Porque no aceptaba que una hada se casara con un mortal. La leyenda habla de cómo las reglas y los prejuicios separan a quienes se quieren.'] },
      { scene: 'rio', title: 'El río de *plata*',
        text: ['Puso a sus dos hijos en dos cestas, se echó encima la piel del buey, y de pronto sus pies se despegaron del suelo. Voló tras su esposa por entre las nubes.',
          'Ya casi la alcanzaba cuando la Reina Madre sacó una horquilla de oro de su pelo y la pasó por el cielo. Allí donde pasó, apareció un río ancho y turbulento, lleno de estrellas.',
          'Era la Vía Láctea: el Río de Plata. Niulang quedó a un lado y Zhinü al otro, y ya no pudieron cruzar.',
          'Se miraban desde las dos orillas, llorando, mientras los niños los llamaban.'] },
      { scene: 'puente', title: 'El puente de *urracas*',
        text: ['Las urracas lo vieron todo y se conmovieron. Cada año, la noche del séptimo día del séptimo mes, miles de urracas se juntan en el cielo y forman un puente con sus alas.',
          'Sobre ese puente, Niulang y Zhinü se encuentran una noche al año. La Reina Madre, al verlos tan fieles, lo permitió.',
          'Dicen que la lluvia de esa noche son sus lágrimas de alegría, y que a las urracas se les caen las plumas de la cabeza de tanto sostenerlos.',
          'En el cielo de verano puedes verlos: dos estrellas brillantes, Zhinü (Vega) y Niulang (Altair), una a cada lado del río de estrellas, esperando esa noche.'],
        think: ['¿Qué te dice esta leyenda sobre la ayuda entre muchos?', 'Que una cosa imposible para dos puede lograrse cuando muchos colaboran: cada urraca pone su ala.'] }
    ],
    quiz: [
      { q: '¿Qué le aconsejó el viejo buey a Niulang?', o: ['Que se fuera del pueblo', 'Que tomara el vestido rosa de la tejedora en el lago', 'Que vendiera la casa'], a: 1, ok: '¡Eso es! Así conoció a Zhinü.', no: 'El buey le dijo que tomara el vestido rosa de Zhinü, colgado de un árbol junto al lago.' },
      { q: '¿Quién se llevó a Zhinü de vuelta al cielo?', o: ['La Reina Madre del Oeste', 'El hermano de Niulang', 'El viejo buey'], a: 0, ok: '¡Muy bien! Era su abuela.', no: 'Fue la Reina Madre del Oeste, su abuela.' },
      { q: '¿Cómo se encuentran Niulang y Zhinü cada año?', o: ['Cruzando a nado el río', 'Sobre un puente que hacen las urracas con sus alas', 'En un barco de oro'], a: 1, ok: '¡Exacto! La noche del 7 del mes 7.', no: 'Las urracas forman un puente con sus alas la noche del séptimo día del séptimo mes.' }
    ]
  });
})();
