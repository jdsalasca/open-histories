/* El Gigante Egoísta — Oscar Wilde (1888, «The Happy Prince and Other Tales»). Dominio público.
 * Traducción al español: propia (CC BY 4.0), a partir del original en inglés (Project Gutenberg #902). */
(function () {
  const { paper, ly, sky, stars, wave, cloud, sun, moon, tree, pine, bush, flower, flowers, fence, person, bird, snowflakes, svg, R } = OH.kit;

  const giant = (x, y, s, o = {}) => `<g transform="translate(${x},${y}) scale(${s * (o.flip || 1)},${s})">
    <path d="M-36,0 L-26,-92 L26,-92 L36,0Z" fill="${o.robe || '#7a4fa0'}"/>
    <rect x="-34" y="-16" width="68" height="9" fill="#3a2a1a"/><circle cx="0" cy="-12" r="5" fill="#f7d878"/>
    <circle cx="0" cy="-114" r="25" fill="#f0c8a0"/>
    <path d="M-26,-112 Q-26,-76 0,-72 Q26,-76 26,-112 Q16,-92 0,-90 Q-16,-92 -26,-112Z" fill="${o.beard || '#8b6a43'}"/>
    <path d="M-26,-124 Q0,-156 26,-124 Q0,-136 -26,-124Z" fill="${o.beard || '#8b6a43'}"/>
    <path d="${o.angry ? 'M-16,-126 L-4,-120 M16,-126 L4,-120' : 'M-16,-122 L-4,-124 M16,-122 L4,-124'}" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-9" cy="-114" r="2.6" fill="#3a2a1a"/><circle cx="9" cy="-114" r="2.6" fill="#3a2a1a"/>
    <path d="${o.angry ? 'M-8,-98 Q0,-104 8,-98' : 'M-8,-100 Q0,-94 8,-100'}" stroke="#3a2a1a" stroke-width="2.4" fill="none"/>
  </g>`;
  const kid = (x, y, s, c, arms = false) => person(x, y, s, c, arms, '#f2c9a0', ['#4a2f1d', '#d9a441', '#2b2118'][Math.abs(Math.round(x)) % 3]);
  const sign = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-5" y="-60" width="10" height="60" fill="#7a5230"/><rect x="-60" y="-110" width="120" height="58" rx="4" fill="#e9d8b4"/><text x="0" y="-86" text-anchor="middle" font-size="13" font-weight="800" fill="#7a1f2c" font-family="Nunito,sans-serif">PROHIBIDO</text><text x="0" y="-68" text-anchor="middle" font-size="13" font-weight="800" fill="#7a1f2c" font-family="Nunito,sans-serif">ENTRAR</text></g>`;
  const wall = (x, w, y0 = 250) => `<rect x="${x}" y="${y0}" width="${w}" height="${500 - y0}" fill="#9a8f84"/>` + Array.from({ length: 5 }, (_, r) => Array.from({ length: Math.ceil(w / 60) }, (_, c) => `<rect x="${x + c * 60 + (r % 2) * 30}" y="${y0 + 6 + r * 46}" width="54" height="40" rx="3" fill="${r % 2 ? '#8a8076' : '#aea294'}"/>`).join('')).join('');
  const castle = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-130" width="140" height="130" fill="#b8a7c9"/><rect x="-86" y="-170" width="40" height="170" fill="#a695b9"/><rect x="46" y="-170" width="40" height="170" fill="#a695b9"/><polygon points="-92,-170 -66,-212 -40,-170" fill="#7a4fa0"/><polygon points="40,-170 66,-212 92,-170" fill="#7a4fa0"/><rect x="-14" y="-60" width="28" height="60" rx="14" fill="#5a3d7a"/><rect x="-60" y="-110" width="26" height="34" rx="13" fill="#ffd36b"/><rect x="34" y="-110" width="26" height="34" rx="13" fill="#ffd36b"/></g>`;
  const bareTree = (x, y, s, snow = true) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 L0,-80 M0,-50 L-34,-96 M0,-62 L30,-104 M-34,-96 L-48,-120 M30,-104 L44,-128 M0,-80 L-6,-120" stroke="#6b5a4a" stroke-width="7" stroke-linecap="round" fill="none"/>${snow ? '<path d="M-50,-122 q8,-6 14,0 M42,-130 q8,-6 14,0 M-14,-122 q8,-6 14,0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>' : ''}</g>`;
  const pinkTree = (x, y, s) => tree(x, y, s, '#e8a9b8', '#7a5230', '#fff4f6');
  const whiteTree = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-7" y="-70" width="14" height="70" fill="#d9a441"/><circle cx="0" cy="-100" r="44" fill="#fff"/><circle cx="-32" cy="-78" r="28" fill="#fff"/><circle cx="32" cy="-80" r="28" fill="#fff"/>${[[-20, -60], [20, -66], [0, -40], [-36, -52]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#d8dce8"/>`).join('')}</g>`;

  OH.story({
    id: 'gigante-egoista',
    title: 'El Gigante *Egoísta*',
    author: 'Oscar Wilde', year: 1888, orig: 'The Selfish Giant', chapterLabel: 'Escena',
    trans: 'Traducción al español propia (CC BY 4.0), hecha a partir del original en inglés.',
    tagline: 'Un jardín que olvidó la primavera.',
    intro: 'Un gigante construye un muro para quedarse solo con su jardín. Pero la primavera… no sabe pasar los muros.',
    moral: 'El egoísmo deja helados los jardines y los corazones; compartir hace que vuelva la primavera. Los niños —dice el Gigante— «son las flores más hermosas de todas».',
    scenes: {
      cover: () => svg('Un gigante junto a un melocotonero en flor con un niño en brazos',
        `${sky('skyDay')}${sun(680, 80, 36)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(160, 90, 1, '#fff') + cloud(480, 60, .8, '#fff'), true)}</g>`)}
        ${ly(.2, 4, paper(wave(300, 14, '#b8d98f', 1) + castle(660, 330, .9), true))}
        ${ly(.5, 8, paper(wave(380, 12, '#8fcf7a', 3) + pinkTree(520, 440, 2) + pinkTree(120, 450, 1.6)))}
        ${ly(.9, 13, paper(wave(450, 10, '#5fae5a', 5)) + flowers(10, 455, 490))}
        ${ly(1.2, 17, `<g class="bob">${paper(giant(330, 470, 2.2))}${paper(kid(420, 392, 1.1, '#2e5fbf', true))}</g>`)}`),

      jardin: () => svg('Niños jugando en el jardín del Gigante, entre doce melocotoneros en flor',
        `${sky('skyDay')}${sun(100, 80, 34)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(520, 70, .9, '#fff'), true)}</g>`)}
        ${ly(.3, 4, paper(wave(300, 12, '#b8d98f', 2) + castle(700, 330, .8), true))}
        ${ly(.6, 8, paper(wave(380, 10, '#8fcf7a', 3) + [90, 230, 380, 520, 650].map((x, i) => pinkTree(x, 430 + i % 2 * 10, 1.5)).join('')))}
        ${ly(.9, 12, paper(wave(450, 9, '#5fae5a', 5)) + flowers(14, 455, 495, ['#fff', '#f7d878', '#b79af2', '#e58b94']))}
        ${ly(1.2, 16, `${paper([[170, 'f'], [250, 'f'], [470, 'f'], [560, 'f'], [330, 'f']].map(([x], i) => kid(x, 480 - (i % 2) * 6, 1.1, ['#c0283f', '#2e5fbf', '#3f8f5a', '#e08a2e', '#8a4fa8'][i], i % 2 === 0)).join(''))}
          <g class="bob">${paper(bird(150, 220, 1.5) + bird(560, 190, 1.3, '#c0283f') + bird(640, 250, 1.4, '#f2a22e'))}</g>`)}`),

      muro: () => svg('El Gigante levanta un muro y un cartel: prohibido entrar; los niños se quedan fuera',
        `${sky('skyDay')}
        ${ly(.1, 3, paper(cloud(560, 80, .9, '#e8edf5'), true))}
        ${ly(.3, 5, paper(castle(620, 250, 1) + `${pinkTree(260, 270, 1.3)}${pinkTree(420, 270, 1.1)}`, true))}
        ${ly(.6, 9, paper(wall(0, 800, 250)))}
        ${ly(.9, 12, paper(`<rect x="0" y="440" width="800" height="60" fill="#c9b690"/>` + [[80, 460], [150, 470], [330, 462]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${10 + R() * 10}" ry="5" fill="#a8946b"/>`).join('')))}
        ${ly(1.2, 16, `${paper(sign(420, 450, 1.4))}${paper(kid(130, 470, 1.2, '#c0283f') + kid(200, 476, 1.1, '#2e5fbf') + kid(560, 472, 1.2, '#3f8f5a') + kid(640, 478, 1.1, '#e08a2e'))}`)}
        ${ly(1.4, 4, paper(giant(330, 250, .0001)))}`),

      invierno: () => svg('El jardín en invierno eterno: la nieve, la escarcha, el viento del norte y el granizo',
        `${sky('skySnow')}
        ${snowflakes(26, 1.5, 3.5, 7, 12)}
        ${ly(.2, 3, paper(wave(300, 12, '#cfd9ea', 2), true))}
        ${ly(.5, 7, paper(castle(110, 340, 1.1) + bareTree(360, 410, 1.6) + bareTree(520, 400, 1.3) + bareTree(680, 420, 1.7) + sign(250, 440, 1)))}
        ${ly(.8, 11, paper(wave(430, 10, '#f4f7fb', 3) + `<g stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"><path d="M420,120 q60,-30 120,0 t110,10"/><path d="M450,160 q50,-24 110,0 t90,6"/><path d="M400,200 q70,-30 130,0"/></g>`))}
        ${ly(1.1, 14, `${paper(giant(110, 336, .48, { angry: false, flip: 1 }))}${Array.from({ length: 16 }, (_, i) => `<circle class="snow" style="animation-duration:${(1.4 + R() * 1.2).toFixed(1)}s;animation-delay:-${(R() * 2).toFixed(1)}s" cx="${380 + R() * 380}" cy="0" r="3.4" fill="#e8eefb"/>`).join('')}`)}`),

      brecha: () => svg('Los niños se cuelan por un agujero del muro y el jardín florece; en un rincón sigue el invierno',
        `${sky('skyDay')}${sun(120, 70, 30)}
        ${ly(.1, 3, paper(wave(280, 12, '#b8d98f', 2) + castle(150, 330, .9), true))}
        ${ly(.4, 7, paper(`<rect x="560" y="300" width="240" height="200" fill="#e9eef7"/>` + bareTree(690, 440, 1.7) + wave(380, 10, '#8fcf7a', 3).replace('M-80,520', 'M-80,520')))}
        ${ly(.7, 10, paper(pinkTree(130, 420, 1.7) + pinkTree(300, 430, 1.5) + pinkTree(450, 420, 1.7)))}
        ${ly(1, 14, `${paper(wall(0, 90, 360))}<g>${paper(kid(210, 360, .8, '#c0283f', true) + kid(330, 366, .8, '#2e5fbf', true) + kid(480, 362, .8, '#3f8f5a', true))}</g>
          ${paper(wave(455, 9, '#5fae5a', 5))}${paper(kid(60, 470, 1, '#e08a2e') + kid(110, 474, 1, '#8a4fa8'))}
          ${paper(kid(650, 470, .7, '#2e5fbf'))}<g class="tear"><circle cx="652" cy="400" r="3" fill="#8ec5ff"/></g>
          <g class="bob">${paper(bird(300, 200, 1.4) + bird(520, 170, 1.2, '#f2a22e'))}</g>`)}`),

      deshielo: () => svg('El Gigante, arrepentido, sube al niño pequeño al árbol, que florece; los niños vuelven con la primavera',
        `${sky('skyDay')}${sun(680, 90, 36)}
        ${ly(.1, 3, `<g class="drift">${paper(cloud(220, 80, 1, '#fff'), true)}</g>`)}
        ${ly(.3, 5, paper(wave(320, 12, '#b8d98f', 2), true))}
        ${ly(.6, 9, paper(pinkTree(130, 430, 1.6) + pinkTree(300, 440, 1.5) + pinkTree(600, 435, 2.2)))}
        ${ly(.9, 13, paper(wave(455, 9, '#5fae5a', 5)) + flowers(10, 460, 495))}
        ${ly(1.2, 17, `<g class="bob">${paper(giant(470, 480, 2.1, { flip: -1, robe: '#7a4fa0' }))}</g>${paper(kid(588, 298, .9, '#2e5fbf', true))}
          ${paper(kid(120, 480, 1.1, '#c0283f', true) + kid(200, 484, 1.1, '#3f8f5a', true) + kid(260, 480, 1.1, '#e08a2e', true))}
          <g class="leaf"><rect x="640" y="200" width="10" height="10" fill="#fff4f6"/></g>`)}`),

      vejez: () => svg('El Gigante, ya viejo, mira jugar a los niños desde su sillón',
        `${sky('skyWarm')}${sun(120, 280, 46, '#ffd09a')}
        ${ly(.2, 4, paper(wave(320, 12, '#c9a36a', 2) + castle(660, 340, .9), true))}
        ${ly(.5, 8, paper(wave(400, 10, '#8fcf7a', 3) + pinkTree(200, 450, 1.5) + pinkTree(430, 440, 1.3)))}
        ${ly(.8, 12, paper(wave(458, 9, '#5fae5a', 5)) + flowers(10, 462, 496))}
        ${ly(1.1, 15, `${paper(`<rect x="570" y="360" width="150" height="120" rx="16" fill="#8a3b4a"/><rect x="556" y="330" width="24" height="150" rx="10" fill="#6c2a38"/><rect x="710" y="330" width="24" height="150" rx="10" fill="#6c2a38"/>`)}${paper(giant(640, 440, 1.4, { beard: '#f4f4f8', robe: '#6d4a90' }))}
          ${paper(kid(170, 484, 1, '#c0283f', true) + kid(250, 486, 1, '#2e5fbf', true) + kid(330, 482, 1, '#e08a2e'))}`)}`),

      paraiso: () => svg('Un árbol blanco de flores con frutos de plata; el niño espera al Gigante en el rincón del jardín',
        `${sky('skyDawn')}
        ${snowflakes(14, 1.5, 2.6, 9, 14)}
        ${ly(.2, 3, paper(wave(310, 12, '#dfe7f2', 2) + castle(130, 330, .9), true))}
        ${ly(.6, 8, paper(wave(400, 10, '#f4f7fb', 3) + bareTree(260, 450, 1.3) + bareTree(110, 460, 1.1)))}
        ${ly(.9, 11, `<g class="glow"><circle cx="560" cy="300" r="190" fill="url(#halo)"/></g>${paper(whiteTree(560, 450, 2.4))}<g fill="#cfd5e4">${[[500, 330], [610, 310], [560, 370], [650, 350]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="7"/>`).join('')}</g>`)}
        ${ly(1.2, 15, `${paper(wave(462, 8, '#f4f7fb', 3))}${paper(kid(560, 480, .95, '#fff'))}<g class="glow"><circle cx="560" cy="418" r="34" fill="#fff6c4" opacity=".7"/></g>${paper(giant(380, 480, 1.7, { beard: '#f4f4f8', robe: '#6d4a90' }))}`)}`),

      fin: () => svg('Pétalos blancos caen sobre el árbol del jardín',
        `${sky('skyHeaven')}
        <g class="rays" opacity=".35">${Array.from({ length: 12 }, (_, i) => `<polygon points="400,90 ${400 + Math.cos(i * Math.PI / 6) * 900},${90 + Math.sin(i * Math.PI / 6) * 900} ${400 + Math.cos((i + .5) * Math.PI / 6) * 900},${90 + Math.sin((i + .5) * Math.PI / 6) * 900}" fill="#fff6c8"/>`).join('')}</g>
        ${ly(.3, 6, paper(wave(420, 12, '#fff4f6', 2) + wave(455, 10, '#ffd9de', 4), true))}
        ${ly(.7, 11, paper(whiteTree(400, 470, 2.8)))}
        ${Array.from({ length: 18 }, (_, i) => `<ellipse class="snow" style="animation-duration:${(7 + R() * 6).toFixed(1)}s;animation-delay:-${(R() * 9).toFixed(1)}s" cx="${(R() * 800).toFixed(0)}" cy="0" rx="5" ry="3" fill="#fff" opacity=".95"/>`).join('')}`)
    },
    pages: [
      { scene: 'jardin', title: 'El jardín de los niños',
        text: ['Todas las tardes, al volver de la escuela, los niños iban a jugar al jardín del Gigante.',
          'Era un jardín grande y hermoso, de suave césped verde. Aquí y allá, entre la hierba, asomaban flores bellas como estrellas, y había doce melocotoneros que en primavera se cubrían de delicadas flores rosadas y nacaradas, y en otoño daban sabrosos frutos. Los pájaros se posaban en los árboles y cantaban tan dulcemente que los niños interrumpían sus juegos para escucharlos. «¡Qué felices somos aquí!», se decían unos a otros.',
          'Un día el Gigante volvió. Había ido a visitar a su amigo, el ogro de Cornualles, y se había quedado con él siete años. Pasados los siete años, ya había dicho todo lo que tenía que decir, pues su conversación era limitada, y decidió regresar a su castillo. Al llegar vio a los niños jugando en el jardín.',
          '—¿Qué hacen aquí? —gritó con una voz muy áspera, y los niños salieron corriendo.'],
        word: ['Egoísta', 'La persona que solo piensa en lo suyo y no quiere compartir con los demás.'] },
      { scene: 'muro', title: 'El muro',
        text: ['—Mi jardín es mi jardín —dijo el Gigante—; cualquiera lo entiende, y no permitiré que nadie juegue en él sino yo.',
          'Así que levantó un muro muy alto alrededor y puso un cartel:',
          '<b>PROHIBIDO ENTRAR. LOS INFRACTORES SERÁN CASTIGADOS.</b>',
          'Era un Gigante muy egoísta.',
          'Los pobres niños no tenían ahora dónde jugar. Intentaron jugar en el camino, pero el camino estaba muy polvoriento y lleno de piedras duras, y no les gustaba. Cuando terminaban las lecciones, daban vueltas alrededor del muro alto y hablaban del hermoso jardín de adentro. «¡Qué felices éramos allí!», se decían.'] },
      { scene: 'invierno', title: 'Siempre invierno',
        text: ['Luego llegó la primavera, y por todo el país hubo florecillas y pajarillos. Solo en el jardín del Gigante Egoísta seguía siendo invierno. A los pájaros no les interesaba cantar en él, porque no había niños, y los árboles se olvidaron de florecer. Una vez una hermosa flor sacó la cabeza entre la hierba, pero al ver el cartel sintió tanta pena por los niños que volvió a meterse en la tierra y se durmió. Los únicos contentos eran la Nieve y la Escarcha.',
          '—La primavera se ha olvidado de este jardín —gritaron—, así que viviremos aquí todo el año.',
          'La Nieve cubrió la hierba con su gran capa blanca, y la Escarcha pintó de plata todos los árboles. Después invitaron al Viento del Norte a quedarse con ellas, y él vino. Iba envuelto en pieles y rugía todo el día por el jardín y tiraba al suelo las chimeneas.',
          '—Este es un lugar delicioso —dijo—; tenemos que invitar también al Granizo.',
          'Y vino el Granizo. Cada día, durante tres horas, repiqueteaba sobre el tejado del castillo hasta que rompió casi todas las tejas, y luego corría y corría alrededor del jardín tan rápido como podía. Iba vestido de gris y su aliento era hielo.'],
        think: ['¿Por qué crees que la primavera no llegaba al jardín del Gigante?', 'Porque en el jardín no había niños ni alegría. El cuento sugiere que donde se cierra el corazón a los demás, tampoco florece nada.'] },
      { scene: 'invierno', title: 'La espera',
        text: ['—No comprendo por qué la primavera tarda tanto en llegar —decía el Gigante Egoísta, sentado a la ventana, mirando su jardín frío y blanco—. Espero que cambie el tiempo.',
          'Pero la primavera nunca vino, ni el verano. El otoño dio frutos dorados a todos los jardines, pero al del Gigante no le dio ninguno. «Es demasiado egoísta», dijo. Así que allí era siempre invierno, y el Viento del Norte, y el Granizo, y la Escarcha y la Nieve bailaban entre los árboles.'] },
      { scene: 'brecha', title: 'Una música en la ventana',
        text: ['Una mañana el Gigante estaba despierto en la cama cuando oyó una música deliciosa. Le sonó tan dulce que pensó que pasaban los músicos del rey. En realidad era solo un pardillo que cantaba junto a su ventana, pero hacía tanto tiempo que no oía cantar a un pájaro en su jardín que le pareció la música más hermosa del mundo. Entonces el Granizo dejó de bailar sobre su cabeza, el Viento del Norte dejó de rugir, y un perfume delicioso le llegó por el postigo abierto.',
          '—Creo que por fin ha llegado la primavera —dijo el Gigante; y saltó de la cama y miró afuera.',
          '¿Qué vio?',
          'Vio un espectáculo maravilloso. Por un pequeño agujero del muro se habían colado los niños, y estaban sentados en las ramas de los árboles. En cada árbol que alcanzaba a ver había un niño. Y los árboles estaban tan contentos de tener de vuelta a los niños que se habían cubierto de flores y agitaban suavemente los brazos sobre sus cabezas. Los pájaros revoloteaban y trinaban de alegría, y las flores asomaban entre la hierba verde y se reían. Era una escena encantadora; solo en un rincón seguía siendo invierno.',
          'Era el rincón más lejano del jardín, y en él había un niñito. Era tan pequeño que no alcanzaba las ramas del árbol, y daba vueltas a su alrededor llorando amargamente. El pobre árbol seguía cubierto de escarcha y nieve, y el Viento del Norte soplaba y rugía sobre él.',
          '—¡Sube, niñito! —decía el Árbol, e inclinaba sus ramas lo más bajo que podía; pero el niño era demasiado pequeño.'] },
      { scene: 'deshielo', title: 'El corazón que se derrite',
        text: ['Y el corazón del Gigante se derritió al mirar.',
          '—¡Qué egoísta he sido! —dijo—. Ahora sé por qué la primavera no quería venir aquí. Pondré a ese pobre niñito en la copa del árbol, y luego derribaré el muro, y mi jardín será el campo de juegos de los niños para siempre jamás.',
          'Estaba de veras muy arrepentido de lo que había hecho.',
          'Bajó las escaleras de puntillas, abrió la puerta de entrada muy suavemente y salió al jardín. Pero cuando los niños lo vieron se asustaron tanto que echaron a correr, y el jardín volvió a ser invierno. Solo el niñito no huyó, porque tenía los ojos tan llenos de lágrimas que no vio venir al Gigante. Y el Gigante se le acercó por detrás, lo tomó con delicadeza en la mano y lo puso en el árbol. Y el árbol floreció al instante, y los pájaros vinieron a cantar en él, y el niñito extendió los dos brazos, los echó al cuello del Gigante y lo besó.',
          'Y los otros niños, cuando vieron que el Gigante ya no era malo, volvieron corriendo, y con ellos llegó la primavera.',
          '—Ahora es vuestro jardín, niños —dijo el Gigante, y tomó un hacha enorme y derribó el muro. Y cuando a las doce la gente iba al mercado, encontró al Gigante jugando con los niños en el jardín más hermoso que habían visto jamás.'],
        word: ['Arrepentirse', 'Sentir pena por lo que hicimos mal y querer cambiarlo.'] },
      { scene: 'vejez', title: 'El niño que no volvió',
        text: ['Jugaron todo el día, y al atardecer se acercaron al Gigante para despedirse.',
          '—Pero ¿dónde está vuestro compañerito? —preguntó—. El niño que puse en el árbol.',
          'El Gigante lo quería más que a ninguno, porque lo había besado.',
          '—No lo sabemos —respondieron los niños—; se ha ido.',
          '—Decidle que no deje de venir mañana —dijo el Gigante.',
          'Pero los niños dijeron que no sabían dónde vivía y que nunca lo habían visto antes; y el Gigante se puso muy triste.',
          'Todas las tardes, al salir de la escuela, los niños venían y jugaban con el Gigante. Pero el niñito al que el Gigante quería no volvió a verse. El Gigante era muy bueno con todos los niños, pero añoraba a su primer amiguito y hablaba a menudo de él. «¡Cómo me gustaría verlo!», solía decir.',
          'Pasaron los años y el Gigante se hizo muy viejo y débil. Ya no podía jugar, así que se sentaba en un enorme sillón y miraba los juegos de los niños y admiraba su jardín. «Tengo muchas flores hermosas —decía—; pero los niños son las flores más hermosas de todas.»'] },
      { scene: 'paraiso', title: 'Las heridas del Amor',
        text: ['Una mañana de invierno miró por la ventana mientras se vestía. Ya no odiaba el invierno, porque sabía que era solo la primavera dormida, y que las flores estaban descansando.',
          'De pronto se frotó los ojos asombrado, y miró y miró. Era sin duda una visión maravillosa. En el rincón más lejano del jardín había un árbol completamente cubierto de preciosas flores blancas. Sus ramas eran todas doradas, y de ellas colgaban frutos de plata, y debajo estaba el niñito al que había querido.',
          'Bajó corriendo el Gigante lleno de alegría y salió al jardín. Cruzó la hierba a toda prisa y se acercó al niño. Y cuando estuvo muy cerca, su rostro enrojeció de ira, y dijo: «¿Quién se ha atrevido a herirte?». Porque en las palmas de las manos del niño estaban las marcas de dos clavos, y las marcas de dos clavos había en sus piececitos.',
          '—¿Quién se ha atrevido a herirte? —gritó el Gigante—. Dímelo, para que tome mi gran espada y lo mate.',
          '—¡No! —respondió el niño—. Estas son las heridas del Amor.',
          '—¿Quién eres? —dijo el Gigante, y un extraño temor reverente cayó sobre él, y se arrodilló ante el niñito.',
          'Y el niño sonrió al Gigante, y le dijo:',
          '—Una vez me dejaste jugar en tu jardín; hoy vendrás conmigo a mi jardín, que es el Paraíso.',
          'Y cuando los niños entraron corriendo aquella tarde, encontraron al Gigante tendido, muerto, bajo el árbol, todo cubierto de flores blancas.'],
        think: ['¿Qué crees que quiere decir el cuento con «las heridas del Amor»?', 'Que querer de verdad a los demás a veces duele y pide sacrificio, y que el amor que damos vuelve a nosotros. Es una imagen cristiana: el niño es Jesús.'] }
    ],
    quiz: [
      { q: '¿Qué hizo el Gigante al volver a su castillo?', o: ['Abrió el jardín a los niños', 'Levantó un muro y puso un cartel', 'Plantó doce melocotoneros'], a: 1, ok: '¡Eso es! «Mi jardín es mi jardín», dijo.', no: 'Levantó un muro alto y puso un cartel de «Prohibido entrar».' },
      { q: '¿Quiénes se alegraron de que en el jardín fuera siempre invierno?', o: ['Los pájaros y las flores', 'La Nieve, la Escarcha, el Viento del Norte y el Granizo', 'Los niños'], a: 1, ok: '¡Muy bien! Se quedaron a vivir allí.', no: 'Fueron la Nieve, la Escarcha, el Viento del Norte y el Granizo.' },
      { q: '¿Qué hizo cambiar al Gigante?', o: ['Ver al niñito que no alcanzaba las ramas, llorando', 'Que se le rompió el tejado', 'Que se le acabaron los frutos'], a: 0, ok: '¡Correcto! Su corazón se derritió.', no: 'Lo cambió ver al niñito llorando bajo el árbol helado.' }
    ]
  });
})();
