/* El cuento de Perico, el conejo — Beatrix Potter (1902). Dominio público.
 * Traducción al español: propia (CC BY 4.0), a partir del original en inglés (Project Gutenberg #14838). */
(function () {
  const { paper, ly, sky, stars, wave, cloud, sun, moon, tree, pine, bush, flower, flowers, fence, person, rabbit, bird, cottage, svg } = OH.kit;
  const T = 'Perico, el conejo travieso';

  const scarecrow = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-120" width="8" height="120" fill="#7a5230"/><rect x="-46" y="-96" width="92" height="7" fill="#7a5230"/><circle cx="0" cy="-128" r="14" fill="#f2d49b"/><polygon points="-22,-134 0,-160 22,-134" fill="#d9a441"/><rect x="-30" y="-134" width="60" height="6" fill="#d9a441"/><path d="M-26,-100 L-26,-56 L26,-56 L26,-100 Q0,-110 -26,-100Z" fill="#2e5fbf"/><circle cx="-8" cy="-84" r="3" fill="#f7d878"/><circle cx="-8" cy="-70" r="3" fill="#f7d878"/><path d="M-46,-96 L-46,-70 M46,-96 L46,-70" stroke="#2e5fbf" stroke-width="10"/></g>`;
  const cabbages = (n, y, col = '#8fcf7a') => Array.from({ length: n }, (_, i) => `<g><circle cx="${40 + i * (720 / n)}" cy="${y}" r="20" fill="${col}"/><circle cx="${40 + i * (720 / n)}" cy="${y}" r="11" fill="#b9e4a2"/></g>`).join('');
  const mcgregor = (x, y, s, flip = 1) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})"><path d="M-22,0 L-18,-64 L18,-64 L22,0Z" fill="#6b4a2a"/><path d="M-14,0 V-30 M14,0 V-30" stroke="#3a2a1a" stroke-width="10"/><circle cx="0" cy="-80" r="16" fill="#f0c8a0"/><path d="M-20,-86 Q0,-116 20,-86 Q0,-92 -20,-86Z" fill="#8b5a2b"/><path d="M-8,-70 Q0,-60 8,-70 Q0,-64 -8,-70" fill="#c9a36a"/><rect x="26" y="-120" width="5" height="120" fill="#7a5230"/><path d="M20,-120 H40 M22,-114 V-100 M28,-114 V-100 M34,-114 V-100 M40,-114 V-100" stroke="#555" stroke-width="3"/></g>`;
  const doorLock = (x, y) => `<rect x="${x}" y="${y}" width="70" height="110" rx="34" fill="#8b5a2b"/><circle cx="${x + 54}" cy="${y + 66}" r="5" fill="#f7d878"/>`;

  OH.story({
    id: 'perico-conejo',
    title: 'Perico, el conejo *travieso*',
    author: 'Beatrix Potter', year: 1902, orig: 'The Tale of Peter Rabbit', chapterLabel: 'Escena',
    trans: 'Traducción al español propia (CC BY 4.0), hecha a partir del original en inglés.',
    tagline: 'Una huerta prohibida, un abrigo azul y una tacita de manzanilla.',
    intro: 'Cuatro conejitos viven bajo un enorme abeto. Tres son muy obedientes. El cuarto… se llama Perico.',
    moral: 'Perico se llevó un buen susto por no hacer caso. Los avisos de mamá no son para aburrirnos: nos cuidan. Y cuando nos equivocamos, volver a casa siempre es posible.',
    scenes: {
      cover: () => svg('Perico el conejo con su abrigo azul frente a un gran abeto',
        `${sky('skyDay')}${sun(660, 90, 40)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(180, 90, 1, '#fff') + cloud(500, 60, .8, '#fff'), true)}</g>`)}
        ${ly(.3, 4, paper(wave(320, 14, '#9fd08a', 1) + wave(365, 12, '#7fbf6e', 3), true))}
        ${ly(.6, 8, paper(pine(110, 420, 2.4) + pine(700, 430, 1.8, '#3d7d5a') + pine(610, 400, 1.2, '#4a8c66')))}
        ${ly(.9, 12, paper(wave(430, 10, '#5fae5a', 5)) + flowers(10, 440, 480))}
        ${ly(1.2, 16, `<g class="bob">${paper(rabbit(410, 448, 2.3, '#b9926a', { coat: true }))}</g>`)}`),

      madriguera: () => svg('Mamá coneja con cesta y paraguas despide a sus cuatro conejitos bajo el abeto',
        `${sky('skyDay')}${sun(100, 80, 34)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(520, 70, .9, '#fff'), true)}</g>`)}
        ${ly(.3, 4, paper(wave(300, 12, '#a6d994', 2) + pine(560, 330, 1.2, '#3d7d5a') + pine(640, 340, 1.5), true))}
        ${ly(.6, 8, paper(`${pine(170, 440, 3)}<ellipse cx="170" cy="438" rx="46" ry="20" fill="#3a2a1a"/>`))}
        ${ly(.9, 12, paper(wave(440, 10, '#c9a36a', 4)))}
        ${ly(1.2, 15, `${paper(rabbit(330, 462, 1.5, '#9a7a56', { flip: 1 }))}<g transform="translate(330,462)"><rect x="34" y="-34" width="26" height="18" rx="4" fill="#c58a52"/><path d="M38,-34 Q47,-52 56,-34" fill="none" stroke="#8b5a2b" stroke-width="3"/></g>
          ${paper(rabbit(470, 470, .9, '#b9926a') + rabbit(530, 474, .8, '#d6b88e') + rabbit(590, 472, .85, '#c49e72') + rabbit(660, 476, .95, '#b9926a', { coat: true }))}`)}`),

      huerta: () => svg('Perico se atiborra de lechugas y rabanitos en la huerta del señor McGregor',
        `${sky('skyDay')}${sun(690, 80, 36)}
        ${ly(.1, 3, paper(wave(250, 10, '#a6d994', 1) + cottage(640, 262, 1.3, '#f3e2c2', '#8a3b4a'), true))}
        ${ly(.4, 6, paper(`<rect x="0" y="250" width="800" height="250" fill="#8b6a43"/>` + fence(0, 270, 800, '#e9d8b4')))}
        ${ly(.7, 10, paper(`${cabbages(6, 330)}${cabbages(6, 400, '#a6d994')}<g fill="#c0283f">${[90, 190, 300, 520, 640].map(x => `<circle cx="${x}" cy="450" r="9"/>`).join('')}</g><g stroke="#4f8f4a" stroke-width="4">${[90, 190, 300, 520, 640].map(x => `<path d="M${x},441 V425 M${x - 6},430 L${x},425 L${x + 6},430"/>`).join('')}</g>`, true))}
        ${ly(1, 14, `<g class="bob">${paper(rabbit(380, 470, 2.1, '#b9926a', { coat: true }))}</g>`)}`),

      persecucion: () => svg('El señor McGregor persigue a Perico con un rastrillo; unos gorriones lo animan',
        `${sky('skyDay')}
        ${ly(.1, 3, paper(wave(240, 10, '#a6d994', 2), true))}
        ${ly(.4, 7, paper(`<rect x="0" y="260" width="800" height="240" fill="#8b6a43"/>` + cabbages(7, 300, '#8fcf7a') + cabbages(7, 380, '#a6d994'), true))}
        ${ly(.7, 11, `<g class="shiver">${paper(mcgregor(170, 470, 1.7))}</g>`)}
        ${ly(1, 14, `<g class="bob">${paper(rabbit(520, 466, 1.7, '#b9926a', { flip: 1 }))}</g>${paper(`<path d="M580,300 Q640,250 700,300 L700,400 Q640,430 580,400Z" fill="none" stroke="#7a5230" stroke-width="3"/><path d="M590,320 L690,320 M590,345 L690,345 M590,370 L690,370 M610,290 V410 M640,285 V418 M670,290 V410" stroke="#7a5230" stroke-width="1.5"/>`)}`)}
        ${ly(1.3, 18, paper(bird(300, 180, 1.6, '#b07a4a') + bird(380, 130, 1.3, '#9a6a3c') + bird(450, 200, 1.5, '#b07a4a')))}`),

      regadera: () => svg('Perico escondido dentro de una regadera en el cobertizo mientras McGregor busca entre las macetas',
        `${sky('skyIndoor')}
        ${ly(.2, 3, paper(`<rect x="0" y="0" width="800" height="500" fill="#a2754a"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${i * 80}" y="0" width="4" height="500" fill="#8b5a2b"/>`).join(''), true))}
        ${ly(.5, 7, paper(`<rect x="0" y="380" width="800" height="120" fill="#6e4a2a"/><rect x="560" y="120" width="180" height="150" rx="6" fill="#9ecbff"/><path d="M650,120 V270 M560,195 H740" stroke="#7a4a2c" stroke-width="6"/>`))}
        ${ly(.8, 11, paper(`${[60, 130, 200, 270].map((x, i) => `<path d="M${x},440 L${x + 12},400 H${x + 56} L${x + 68},440Z" fill="#c0653a"/><rect x="${x - 4}" y="396" width="76" height="12" fill="#d17a4c"/>`).join('')}`))}
        ${ly(1.1, 15, `<g class="bob">${paper(`<path d="M400,300 H520 L535,440 H385Z" fill="#7d8da6"/><path d="M520,330 L600,300 L600,318 L530,356Z" fill="#7d8da6"/><ellipse cx="460" cy="300" rx="60" ry="12" fill="#4f5d73"/>`)}<g transform="translate(450,300)">${paper(`<ellipse cx="-12" cy="-30" rx="6" ry="26" fill="#b9926a" transform="rotate(-8)"/><ellipse cx="12" cy="-30" rx="6" ry="26" fill="#b9926a" transform="rotate(10)"/>`, true)}</g></g>
          <g class="shiver">${paper(`<path d="M690,500 L700,420 H740 L750,500Z" fill="#6b4a2a"/>`)}</g>
          <text class="note" style="animation-delay:.5s;animation-duration:3s" x="470" y="280" font-size="22" fill="#fff" font-family="Nunito,sans-serif" font-weight="800">¡achís!</text>`)}`),

      puerta: () => svg('Perico llora ante una puerta cerrada mientras una gata blanca vigila a los peces dorados',
        `${sky('skyDay')}
        ${ly(.2, 3, paper(wave(220, 10, '#a6d994', 2), true))}
        ${ly(.5, 7, paper(`<rect x="0" y="180" width="360" height="320" fill="#a9a9b8"/>${Array.from({ length: 6 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<rect x="${c * 72 + (r % 2) * 36}" y="${186 + r * 52}" width="66" height="46" rx="4" fill="${r % 2 ? '#9b9bae' : '#b6b6c6'}"/>`).join('')).join('')}${doorLock(150, 280)}<rect x="0" y="470" width="360" height="30" fill="#8d8da0"/>`))}
        ${ly(.8, 11, paper(`<rect x="360" y="400" width="440" height="100" fill="#6aa97c"/><ellipse cx="590" cy="440" rx="150" ry="36" fill="#7fb7e0"/><ellipse cx="590" cy="436" rx="120" ry="24" fill="#9ccbed"/>${[540, 600, 650].map(x => `<ellipse cx="${x}" cy="440" rx="14" ry="6" fill="#f2a22e"/>`).join('')}`, true))}
        ${ly(1, 14, `${paper(rabbit(250, 470, 1.6, '#b9926a', { coat: false }))}${paper(`<ellipse cx="700" cy="370" rx="34" ry="24" fill="#fff"/><circle cx="728" cy="344" r="16" fill="#fff"/><polygon points="716,336 720,318 730,332" fill="#fff"/><polygon points="732,330 744,318 744,336" fill="#fff"/><circle cx="733" cy="344" r="2.4" fill="#2e5fbf"/><path d="M666,376 q-26,-10 -14,-34" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>`)}
          <g class="tear"><circle cx="262" cy="410" r="3" fill="#8ec5ff"/></g>`)}`),

      escape: () => svg('Perico trepa a una carretilla y descubre la puerta de salida, con McGregor de espaldas',
        `${sky('skyDay')}${sun(80, 70, 30)}
        ${ly(.2, 3, paper(wave(250, 10, '#a6d994', 1) + fence(520, 300, 280, '#e9d8b4'), true))}
        ${ly(.5, 7, paper(`<rect x="0" y="300" width="800" height="200" fill="#8b6a43"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${40 + i * 90},400 q-16,-30 0,-46 q16,16 0,46" fill="#e8d9a8"/>`).join('')}<g fill="#2f6b4f">${[130, 250, 360].map(x => `<ellipse cx="${x}" cy="420" rx="36" ry="24"/>`).join('')}</g>`, true))}
        ${ly(.8, 11, `<g class="shiver">${paper(mcgregor(560, 470, 1.4))}</g>`)}
        ${ly(1.1, 15, `${paper(`<path d="M190,430 H300 L320,380 H170Z" fill="#9a5b32"/><circle cx="240" cy="446" r="16" fill="#3a2a1a"/><rect x="300" y="396" width="64" height="7" fill="#7a5230"/>`)}<g class="bob">${paper(rabbit(250, 392, 1.1, '#b9926a'))}</g>`)}`),

      casa: () => svg('Perico en la cama con una taza de manzanilla; sus hermanas cenan pan, leche y moras',
        `${sky('skyIndoor')}
        ${ly(.2, 3, paper(`<rect width="800" height="500" fill="#a2754a"/><path d="M0,380 Q400,300 800,380 V500 H0Z" fill="#c9a36a"/>`, true))}
        ${ly(.5, 7, paper(`<rect x="60" y="260" width="300" height="120" rx="14" fill="#d9e4ff"/><rect x="60" y="230" width="300" height="60" rx="18" fill="#4d78d0"/><rect x="40" y="220" width="22" height="170" rx="4" fill="#8b5a2b"/><circle cx="300" cy="248" r="26" fill="#b9926a"/><ellipse cx="294" cy="214" rx="6" ry="22" fill="#b9926a" transform="rotate(-10 294 214)"/><ellipse cx="312" cy="216" rx="6" ry="22" fill="#b9926a" transform="rotate(12 312 216)"/><rect x="420" y="330" width="320" height="18" rx="4" fill="#8b5a2b"/><rect x="440" y="346" width="16" height="100" fill="#7a4a2c"/><rect x="700" y="346" width="16" height="100" fill="#7a4a2c"/><ellipse cx="560" cy="324" rx="40" ry="10" fill="#fff"/><g fill="#4a2a5c">${[530, 555, 580, 600].map((x, i) => `<circle cx="${x}" cy="${316 - i % 2 * 3}" r="6"/>`).join('')}</g>`))}
        ${ly(.9, 12, `${paper(rabbit(480, 330, 1.1, '#d6b88e') + rabbit(660, 330, 1.1, '#9a7a56'))}${paper(rabbit(180, 470, 1.9, '#9a7a56', { flip: 1 }))}<g transform="translate(250,400)">${paper(`<rect x="0" y="0" width="26" height="22" rx="4" fill="#fff"/><path d="M26,6 q12,0 12,8 q0,8 -12,8" fill="none" stroke="#fff" stroke-width="4"/>`)}<path class="note" d="M10,-4 q-4,-8 0,-14" stroke="#fff" stroke-width="2" fill="none"/></g>`)}
        <g class="glow"><circle cx="400" cy="120" r="60" fill="#ffd36b" opacity=".35"/></g>${paper(`<circle cx="400" cy="120" r="22" fill="#ffd36b"/><rect x="396" y="60" width="8" height="40" fill="#7a4a2c"/>`, true)}`),

      fin: () => svg('Un espantapájaros lleva el abrigo azul y los zapatos de Perico, con pájaros alrededor',
        `${sky('skyDawn')}${sun(130, 120, 42, '#ffe9a8')}
        ${ly(.2, 3, paper(wave(320, 14, '#a6d994', 1) + wave(366, 12, '#7fbf6e', 3), true))}
        ${ly(.6, 9, `${paper(scarecrow(420, 430, 2.2))}${paper(`<ellipse cx="380" cy="436" rx="12" ry="7" fill="#7a4a2c"/><ellipse cx="460" cy="436" rx="12" ry="7" fill="#7a4a2c"/>`, true)}`)}
        ${ly(1, 14, `<g class="bob">${paper(bird(250, 250, 1.8, '#2a2a3a') + bird(600, 230, 1.6, '#2a2a3a') + bird(540, 330, 1.4, '#3a3a4a'))}</g>${paper(wave(450, 9, '#5fae5a', 4))}${flowers(8, 460, 490)}`)}`)
    },
    pages: [
      { scene: 'madriguera', title: 'Cuatro conejitos y un aviso',
        text: ['Había una vez cuatro conejitos que se llamaban Flopsy, Mopsy, Colita de Algodón y Perico.',
          'Vivían con su mamá en un montículo de arena, bajo la raíz de un abeto enorme.',
          '—Queridos míos —dijo una mañana la vieja señora Coneja—, pueden ir a los campos o bajar por el sendero, pero no entren en la huerta del señor McGregor: allí tuvo un accidente su padre; la señora McGregor lo metió en un pastel.',
          '—Ahora corran, y no se metan en líos. Yo voy a salir.',
          'Entonces la vieja señora Coneja tomó una cesta y su paraguas, y atravesó el bosque hasta la panadería. Compró una hogaza de pan moreno y cinco bollos con pasas.'],
        word: ['Travesura', 'Algo que hace un niño sin pensar en las consecuencias; casi siempre es una broma, pero a veces trae problemas.'] },
      { scene: 'huerta', title: 'La huerta prohibida',
        text: ['Flopsy, Mopsy y Colita de Algodón, que eran conejitos muy buenos, bajaron por el sendero a recoger moras.',
          'Pero Perico, que era muy travieso, corrió derecho a la huerta del señor McGregor, ¡y se coló por debajo de la puerta!',
          'Primero se comió unas lechugas y unas judías verdes; y luego se comió unos rabanitos.',
          'Y después, sintiéndose algo mareado, fue a buscar un poco de perejil.',
          'Pero al doblar la esquina de un invernadero de pepinos, ¿a quién crees que se encontró? ¡Al señor McGregor!'] },
      { scene: 'persecucion', title: '¡Al ladrón!',
        text: ['El señor McGregor estaba de rodillas plantando coles jóvenes, pero se levantó de un salto y corrió tras Perico, agitando un rastrillo y gritando: «¡Al ladrón!».',
          'Perico estaba espantosamente asustado; corrió por toda la huerta, porque había olvidado el camino de vuelta a la puerta.',
          'Perdió un zapato entre las coles y el otro entre las patatas.',
          'Después de perderlos, echó a correr a cuatro patas y fue más rápido, de modo que creo que habría escapado del todo si, por desgracia, no hubiera ido a dar contra una red de grosellas, y no se hubiera enganchado por los grandes botones de su chaqueta. Era una chaqueta azul con botones de latón, completamente nueva.',
          'Perico se dio por perdido y lloró lágrimas gordas; pero sus sollozos los oyeron unos gorriones amigos, que acudieron a él muy alborotados y le rogaron que hiciera un esfuerzo.',
          'El señor McGregor llegó con un cedazo, que pensaba dejar caer sobre Perico; pero Perico se escurrió justo a tiempo, dejándose la chaqueta atrás.'] },
      { scene: 'regadera', title: 'Dentro de la regadera',
        text: ['Y se precipitó en el cobertizo de las herramientas, y se metió de un salto en una regadera. Habría sido un escondite precioso si no hubiera tenido tanta agua dentro.',
          'El señor McGregor estaba seguro de que Perico estaba en algún lugar del cobertizo, quizá escondido debajo de una maceta. Empezó a darles la vuelta con cuidado, mirando bajo cada una.',
          'Al poco Perico estornudó: «¡Aaa-chís!». El señor McGregor fue tras él en un santiamén.',
          'E intentó pisar a Perico, que saltó por una ventana, tirando tres plantas. La ventana era demasiado pequeña para el señor McGregor, que estaba cansado de correr detrás de Perico. Volvió a su trabajo.',
          'Perico se sentó a descansar; estaba sin aliento y temblando de miedo, y no tenía la menor idea de qué camino tomar. Además estaba muy mojado de haber estado sentado en aquella regadera.'],
        think: ['¿Por qué crees que Perico se escondió en la regadera, y qué le salió mal?', 'Buscaba un escondite, pero tenía tanta agua que lo mojó y, además, estornudó. A veces las soluciones rápidas traen más problemas.'] },
      { scene: 'puerta', title: 'La puerta cerrada y la gata blanca',
        text: ['Pasado un rato empezó a vagar, caminando lippity-lippity, no muy rápido, y mirando a todos lados.',
          'Encontró una puerta en un muro; pero estaba cerrada con llave, y no había espacio para que un conejito gordito se colara por debajo.',
          'Una vieja ratona entraba y salía corriendo por el umbral de piedra, llevando guisantes y habas a su familia en el bosque. Perico le preguntó por el camino a la puerta del jardín, pero ella llevaba un guisante tan grande en la boca que no pudo contestar. Solo le movió la cabeza. Perico se echó a llorar.',
          'Entonces trató de cruzar la huerta en línea recta, pero se fue desorientando más y más. Al rato llegó a un estanque donde el señor McGregor llenaba sus regaderas. Una gata blanca miraba fijamente a unos peces dorados; estaba muy, muy quieta, pero de vez en cuando la punta de su cola se agitaba como si tuviera vida. A Perico le pareció mejor irse sin hablarle; había oído hablar de los gatos a su primito, el pequeño Benjamín Conejo.'] },
      { scene: 'escape', title: 'La puerta, por fin',
        text: ['Volvió hacia el cobertizo, pero de pronto, muy cerca de él, oyó el ruido de una azada: scr-r-ritch, scratch, scratch, scritch. Perico salió disparado bajo unos arbustos. Pero al poco, como no pasaba nada, salió y trepó a una carretilla y se asomó por encima.',
          'Lo primero que vio fue al señor McGregor escardando cebollas. Estaba de espaldas a Perico, ¡y más allá estaba la puerta!',
          'Perico bajó de la carretilla muy despacito, y echó a correr tan rápido como pudo por un camino recto, detrás de unos grosellos negros.',
          'El señor McGregor lo vio de refilón en la esquina, pero a Perico no le importó. Se deslizó por debajo de la puerta, y por fin estuvo a salvo en el bosque, fuera de la huerta.',
          'El señor McGregor colgó la chaquetita y los zapatos en un espantapájaros, para asustar a los mirlos.'],
        word: ['Espantapájaros', 'Muñeco con ropa vieja que se pone en los campos para asustar a los pájaros y que no se coman las semillas.'] },
      { scene: 'casa', title: 'Una tacita de manzanilla',
        text: ['Perico no paró de correr ni miró hacia atrás hasta llegar a casa, al gran abeto.',
          'Estaba tan cansado que se dejó caer sobre la blanda arena del suelo de la madriguera y cerró los ojos. Su madre estaba ocupada cocinando; se preguntó qué habría hecho con su ropa. ¡Era la segunda chaquetita y el segundo par de zapatos que Perico perdía en quince días!',
          'Lamento decir que Perico no se sintió muy bien durante la tarde.',
          'Su madre lo metió en la cama y preparó un poco de té de manzanilla; ¡y le dio una dosis a Perico!',
          '«Una cucharada grande, antes de dormir.»',
          'Flopsy, Mopsy y Colita de Algodón, en cambio, cenaron pan con leche y moras.', '<i>Fin</i>'],
        think: ['Perico perdió su chaqueta y se enfermó, pero volvió sano y salvo. ¿Qué crees que aprendió?', 'Que los avisos de mamá eran para cuidarlo; y que, aunque nos equivoquemos, en casa nos reciben con cariño.'] }
    ],
    quiz: [
      { q: '¿Qué les pidió mamá coneja antes de irse a la panadería?', o: ['Que no entraran en la huerta del señor McGregor', 'Que le trajeran moras del bosque', 'Que se quedaran dormidos hasta tarde'], a: 0, ok: '¡Así es! Les avisó del peligro de la huerta.', no: 'Recuerda: les dijo que no entraran en la huerta del señor McGregor.' },
      { q: '¿Dónde se escondió Perico cuando lo perseguía el señor McGregor?', o: ['En una regadera', 'En una carretilla', 'Dentro de un pastel'], a: 0, ok: '¡Correcto! Y por poco lo descubre un estornudo.', no: 'Se metió en una regadera… y estornudó.' },
      { q: '¿Qué tomó Perico al final, en la cama?', o: ['Pan con leche y moras', 'Té de manzanilla', 'Un pastel de zanahoria'], a: 1, ok: '¡Muy bien! Sus hermanas cenaron pan, leche y moras.', no: 'Perico tomó té de manzanilla; fueron sus hermanas quienes cenaron pan, leche y moras.' }
    ]
  });
})();
