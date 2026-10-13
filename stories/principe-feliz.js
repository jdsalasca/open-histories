/* El Príncipe Feliz — Oscar Wilde (1888, «The Happy Prince and Other Tales»). Dominio público.
 * Traducción al español: propia (CC BY 4.0), a partir del original en inglés (Project Gutenberg #902). */
(function () {
  const { paper, ly, sky, stars, wave, cloud, moon, sun, heart, snowflakes, house, person, swallow, svg, R, motes, fog, candle, crow, star } = OH.kit;

  /* el Príncipe: o = {s, tear, blind, dull, noRuby, heart} */
  const prince = (x, y, o = {}) => {
    const g = o.dull ? '#a6acb8' : '#e9b942', g2 = o.dull ? '#c3c8d2' : '#f7d878', g3 = o.dull ? '#8a909c' : '#c89a2c';
    const eye = o.blind ? '#6b7080' : '#2e5fbf';
    return `<g transform="translate(${x},${y}) scale(${o.s || 1})">
    ${o.dull ? '' : `<circle class="glow" cx="0" cy="-90" r="135" fill="url(#halo)"/>`}
    ${paper(`<rect x="-54" y="0" width="108" height="15" rx="3" fill="#d4d8e6"/><rect x="-42" y="15" width="84" height="230" fill="#b4b9cc"/><rect x="-42" y="15" width="15" height="230" fill="#a1a7bf"/><rect x="-62" y="228" width="124" height="20" rx="3" fill="#cdd1e0"/>`)}
    ${paper(`
      <path d="M-31,0 L-24,-74 L24,-74 L31,0 Z" fill="${g}"/>
      <path d="M-8,0 L-4,-74 L4,-74 L8,0 Z" fill="${g3}"/>
      <rect x="-27" y="-120" width="54" height="52" rx="14" fill="${g2}"/>
      <rect x="-30" y="-98" width="60" height="9" fill="${g3}"/>
      <path d="M-26,-114 L-42,-70 L-33,-66 L-20,-100 Z" fill="${g}"/>
      <path d="M26,-114 L42,-82 L33,-78 L20,-100 Z" fill="${g}"/>
      <rect x="35" y="-100" width="6" height="80" fill="#dfe2ea"/>
      <rect x="26" y="-104" width="24" height="7" rx="2" fill="${g3}"/>
      <circle cx="0" cy="-140" r="19" fill="${g2}"/>
      <path d="M-17,-150 L-12,-165 L-5,-152 L0,-168 L5,-152 L12,-165 L17,-150 Z" fill="${g3}"/>
      ${o.heart ? `<path d="M0,-84 C-9,-92 -15,-100 -8,-105 C-4,-107 0,-103 0,-100 C0,-103 4,-107 8,-105 C15,-100 9,-92 0,-84Z" fill="#6f7482"/>` : ''}
    `)}
    <circle cx="-7" cy="-141" r="4.2" fill="${eye}"/><circle cx="7" cy="-141" r="4.2" fill="${eye}"/>
    ${o.blind ? '' : `<circle cx="-8.2" cy="-142.3" r="1.3" fill="#fff"/><circle cx="5.8" cy="-142.3" r="1.3" fill="#fff"/>`}
    <path d="M-6,-130 Q0,${o.tear || o.blind || o.dull ? -127 : -125} 6,-130" stroke="#7a4a1c" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${o.noRuby ? `<circle cx="38" cy="-110" r="5" fill="#777c8a"/>` : `<circle class="glow" cx="38" cy="-110" r="14" fill="#ff6b82" opacity=".5"/><circle cx="38" cy="-110" r="6.5" fill="#c0283f"/><circle cx="36" cy="-112" r="2" fill="#ffb3c0"/>`}
    ${o.tear ? `<circle class="tear" cx="-7" cy="-134" r="3.6" fill="#8ec5ff"/><ellipse class="ripple" cx="-7" cy="-1" rx="22" ry="5" fill="none" stroke="#cfe6ff" stroke-width="2"/>` : ''}
    </g>`;
  };
  const palm = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 Q-8,-60 4,-110" stroke="#7a5230" stroke-width="9" fill="none" stroke-linecap="round"/><g fill="#3f8f5a">${[-70, -35, 0, 35, 70].map(a => `<path d="M4,-110 q${a * .9},-30 ${a * 1.5},${10 + Math.abs(a) * .2}" stroke="#3f8f5a" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
  const pyramid = (x, y, w, h, c1 = '#d9a15a', c2 = '#c28a45') => `<polygon points="${x},${y} ${x + w / 2},${y - h} ${x + w},${y}" fill="${c1}"/><polygon points="${x + w / 2},${y - h} ${x + w},${y} ${x + w / 2},${y}" fill="${c2}"/>`;
  const sphinx = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60,0 L-60,-30 Q-30,-46 20,-44 L50,-44 L50,0Z" fill="#d9a15a"/><rect x="26" y="-90" width="26" height="50" fill="#d9a15a"/><circle cx="40" cy="-84" r="15" fill="#e6b574"/><path d="M22,-92 L40,-108 L60,-92 L60,-60 L52,-60 L52,-86 L28,-86 L28,-60 L22,-60Z" fill="#2e5fbf"/><circle cx="44" cy="-84" r="2" fill="#3a2a1a"/></g>`;
  const mast = (x, y, h, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-3" y="-${h}" width="6" height="${h}" fill="#7a5230"/><path d="M3,-${h - 10} L60,-${h * .45} L3,-${h * .3}Z" fill="#f4eee0"/><rect x="-50" y="-4" width="130" height="14" rx="5" fill="#5a3a20"/></g>`;
  const hat = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-13" y="-30" width="26" height="22" fill="#14101f"/><rect x="-19" y="-10" width="38" height="5" rx="2" fill="#14101f"/></g>`;

  OH.story({
    id: 'principe-feliz',
    title: 'El Príncipe *Feliz*',
    author: 'Oscar Wilde', year: 1888, orig: 'The Happy Prince', chapterLabel: 'Escena',
    trans: 'Traducción al español propia (CC BY 4.0), hecha a partir del original en inglés. Fiel al texto, con el lenguaje de su época.',
    tagline: 'Una estatua de oro, una golondrina y la ciudad entera.',
    intro: 'Acompaña a una pequeña golondrina que se quedó atrás y a una estatua que llora desde lo alto de la ciudad. El cuento más querido de Oscar Wilde, completo.',
    moral: '«No hay Misterio tan grande como la Miseria»: el Príncipe y la Golondrina lo dan todo —oro, ojos, viaje y vida— y eso, para Dios, es lo más precioso de la ciudad. Lo valioso no es lo que brilla, sino lo que damos.',
    scenes: {
      cover: () => svg('La estatua dorada del Príncipe Feliz bajo la luna con una golondrina volando',
        `${sky('skyNight')}${stars(46, 8, 260)}${moon(640, 105, 55)}
        ${ly(0.1, 3, `<g class="drift">${paper(cloud(170, 120, 1) + cloud(560, 215, .7), true)}</g>`)}
        ${ly(0.5, 5, paper(wave(330, 14, '#2b3b7c', 1) + wave(375, 12, '#223066', 3), true) + paper([20, 95, 175, 545, 625, 705].map((x, i) => house(x, 400, 62, 46 + i % 3 * 12, ['#e8b08a', '#d98f7e', '#f1cf9c'][i % 3], ['#8a3b4a', '#5d3a63', '#7a4a2c'][i % 3])).join(''), true))}
        ${ly(1.1, 9, prince(400, 205, { s: 1.2 }))}
        ${ly(1.6, 13, paper(wave(445, 10, '#18214a', 5)))}
        <g class="fly" style="opacity:0;animation:fly 15s steps(30,end) infinite,fadeIn 1s 3s forwards">${swallow(640, 170, .9, -1)}</g>
        ${motes(10, '#ffe9a8', 60, 360)}`, 'cold'),

      estatua: () => svg('La estatua dorada del Príncipe Feliz sobre su columna, al atardecer; la gente la admira',
        `${sky('skyDusk')}
        <g class="glow"><circle cx="150" cy="320" r="95" fill="#fff0b0" opacity=".35"/></g>${paper(`<circle cx="150" cy="320" r="58" fill="#ffe7a6"/>`, true)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(560, 85, 1, '#ffd9cf') + cloud(260, 65, .8, '#ffeadf'), true)}</g>`)}
        ${ly(.2, 4, paper(wave(325, 16, '#b383a8', 2) + wave(365, 14, '#8e68a0', 4), true))}
        ${ly(.4, 6, paper([10, 100, 190, 300, 400, 640, 720].map((x, i) => house(x, 410, 64, 50 + i % 3 * 14, ['#f3c9a4', '#e6a58c', '#f7dfae'][i % 3], ['#a24a58', '#6c4570', '#8c5a34'][i % 3], i % 2 === 0)).join(''), true))}
        ${ly(.7, 10, prince(560, 250, { s: 1.1 }))}
        ${ly(1, 13, paper(wave(440, 12, '#5d4a86', 6)))}
        ${ly(1.2, 16, paper([95, 150, 215, 275].map((x, i) => person(x, 478, 1.05, ['#c0283f', '#2e5fbf', '#3f8f5a', '#e08a2e'][i], true, '#f2c9a0', '#4a2f1d', i * .45)).join('')))}
        ${motes(10, '#fff3b0', 80, 360, 380, 760)}`, 'warm'),

      migracion: () => svg('Las golondrinas vuelan hacia Egipto; una se queda sola junto al río, cerca de un junco',
        `${sky('skyWarm')}${stars(26, 8, 220)}${moon(130, 90, 38)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(380, 110, .9, '#c6bfe6'), true)}</g>`)}
        ${ly(.2, 3, paper(pyramid(600, 320, 70, 70) + pyramid(650, 320, 100, 90, '#c28a45', '#a8733a'), true) + paper(wave(322, 6, '#e3b072', 2, 2), true))}
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `<g class="leave-fl" style="animation-delay:${[.4, 1.1, 1.7, 2.2, 2.6, 2.9, 3.1][i]}s"><g transform="translate(${340 + i * 38},${70 + (i % 3) * 34 + i * 6})">${swallow(0, 0, .34, 1, 'slow')}</g></g>`).join('')}
        ${ly(.5, 5, paper(wave(395, 10, '#3f6aa8', 1, 1.5) + wave(420, 8, '#4c7fc0', 3, 1.6), true))}
        ${ly(.8, 8, [110, 150, 190].map((x, i) => `<g class="sway" style="animation-delay:-${i * .9}s">${paper(`<path d="M${x},470 C${x - 6},400 ${x - 4},350 ${x + 4},300" stroke="#4f8f4a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${x + 2},350 C${x + 30},330 ${x + 44},310 ${x + 52},300 C${x + 30},322 ${x + 16},330 ${x + 2},346Z" fill="#6bb35f"/><ellipse cx="${x + 4}" cy="296" rx="6" ry="14" fill="#7a4a1c"/>`, true)}</g>`).join(''))}
        ${ly(1.1, 12, `<g class="bob">${swallow(285, 300, 1.1, -1, 'slow')}</g>`)}
        ${ly(1.2, 14, paper(wave(462, 10, '#2c5a3a', 4)))}`, 'warm'),

      gota: () => svg('Una lágrima cae de la estatua sobre la golondrina que descansa a sus pies',
        `${sky('skyNight')}${stars(42, 8, 300)}${moon(670, 90, 42)}
        ${ly(.2, 4, paper(wave(405, 12, '#26346f', 2) + [20, 110, 190, 560, 640, 720].map((x, i) => house(x, 500, 60, 60 + i % 3 * 14, ['#8a6e8e', '#7b6a9a', '#a07e8a'][i % 3], '#3b2d5a', i % 2 === 0)).join(''), true))}
        ${ly(.6, 9, prince(400, 330, { s: 1.1, tear: true }))}
        ${ly(1.1, 13, `<g class="lookup">${swallow(468, 326, .9, -1, 'slow', -10)}</g>`)}
        ${star(250, 60, 8, '#fff', .1)}${star(520, 40, 6, '#ffd36b', 1.1)}`, 'cold'),

      casa: () => svg('Una costurera cose a la luz de una vela; su niño tiene fiebre y la golondrina asoma por la ventana',
        `${sky('skyNight')}${stars(30, 8, 200)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(660, 60, .8, '#4a5c9e'), true)}</g>`)}
        ${ly(.3, 4, paper(`<polygon points="70,130 270,40 470,130" fill="#7a4a2c"/><rect x="90" y="130" width="360" height="330" fill="#8e6a48"/>`) + paper(`<rect x="106" y="146" width="328" height="298" fill="#efd3a2"/>`, true) + `<g opacity=".3">${Array.from({ length: 30 }, (_, i) => `<circle cx="${124 + (i % 10) * 32}" cy="${170 + Math.floor(i / 10) * 34}" r="3.5" fill="#c58a52"/>`).join('')}</g>`)}
        ${ly(.6, 7, paper(`<rect x="106" y="400" width="328" height="44" fill="#a2754a"/>
          <rect x="320" y="165" width="90" height="100" rx="6" fill="#1d2a5c"/><path d="M365,165 V265 M320,215 H410" stroke="#c7a36a" stroke-width="5"/>
          <rect x="130" y="330" width="90" height="70" rx="4" fill="#b97a3c"/><rect x="118" y="322" width="114" height="12" rx="3" fill="#a2672d"/>
          <rect x="300" y="352" width="124" height="52" rx="6" fill="#d9e4ff"/><rect x="300" y="340" width="124" height="28" rx="8" fill="#4d78d0"/>
          <rect x="292" y="330" width="18" height="76" rx="3" fill="#8b5a2b"/>`, true) + star(366, 200, 7, '#fff6c4', .4) + paper(`<circle cx="395" cy="346" r="15" fill="#f2c9a0"/><circle cx="388" cy="350" r="4" fill="#ff8f8f" opacity=".8"/><circle cx="402" cy="350" r="4" fill="#ff8f8f" opacity=".8"/><rect x="376" y="334" width="40" height="8" rx="4" fill="#f2f0ff"/>`, true))}
        ${ly(.9, 10, `<g class="shiver">${paper(person(180, 400, 1.7, '#a24a58'))}</g>${paper(`<path d="M232,350 l30,-6 l-4,22 l-30,6 Z" fill="#2e5fbf"/><rect x="250" y="388" width="14" height="14" fill="#f3e2b0"/>`, true)}<g class="flame"><ellipse cx="257" cy="378" rx="5" ry="9" fill="#ffb347"/></g><g class="glow"><circle cx="257" cy="378" r="26" fill="#ffd36b" opacity=".35"/></g>`)}
        <g class="bob">${swallow(560, 200, 1.1, -1)}</g>
        ${ly(1.2, 14, paper(wave(470, 8, '#1d2a5c', 2)))}`, 'warm'),

      egipto: () => svg('Egipto de noche: pirámides, palmeras, el Nilo con flores de loto y la Esfinge',
        `${sky('skyWarm')}${stars(34, 8, 200)}${moon(660, 90, 40)}
        ${ly(.1, 3, paper(pyramid(80, 330, 190, 170) + pyramid(260, 330, 130, 120, '#c28a45', '#a8733a') + sphinx(560, 340, 1.3), true))}
        ${ly(.4, 6, paper(wave(340, 8, '#e6b574', 2, 2) + palm(130, 400, 1.2) + palm(700, 405, 1.3), true))}
        ${ly(.7, 10, paper(`<path d="M0,400 Q200,380 400,404 T800,396 V500 H0Z" fill="#3f6aa8"/><path d="M0,430 Q200,412 400,432 T800,428 V500 H0Z" fill="#4c7fc0"/>`, true) + [[120, 440], [260, 458], [420, 446], [580, 462], [690, 440]].map(p => `<g class="sway"><ellipse cx="${p[0]}" cy="${p[1] + 6}" rx="22" ry="6" fill="#3f8f5a"/><circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#f2a6c0"/><circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#ffe08a"/></g>`).join(''))}
        ${ly(1, 13, `<g class="bob">${swallow(300, 250, .9, 1, 'slow')}${swallow(380, 210, .7, 1, 'slow')}</g>${motes(8, '#ffe9a8', 200, 440)}`)}`, 'warm'),

      vuelo: () => svg('La golondrina vuela con el rubí sobre la catedral, el palacio, el río y los barcos',
        `${sky('skyNight')}${stars(34, 8, 180)}${moon(110, 80, 36)}
        ${ly(.2, 3, paper(wave(330, 10, '#26346f', 2), true))}
        ${ly(.5, 6, paper(`<rect x="540" y="150" width="70" height="250" fill="#d4d8e6"/><polygon points="532,150 575,60 618,150" fill="#8e96b8"/><rect x="560" y="200" width="30" height="46" rx="15" fill="#2a3560"/>` + [[500, 180], [630, 200]].map(p => `<g fill="#fff"><circle cx="${p[0]}" cy="${p[1]}" r="9"/><path d="M${p[0] - 16},${p[1] + 4} q16,-22 32,0 q-16,8 -32,0Z"/></g>`).join('') + `<rect x="60" y="230" width="360" height="170" fill="#c9b3d9"/><polygon points="50,230 240,170 430,230" fill="#7a5a98"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${84 + i * 42}" y="${262}" width="20" height="30" rx="10" fill="#ffd36b"/>`).join('')}<rect x="200" y="320" width="76" height="14" fill="#8a6aa8"/>`))}
        ${ly(.8, 10, paper(person(214, 316, .7, '#c0283f') + person(246, 316, .7, '#2e5fbf'), true) + paper(`<path d="M0,420 Q200,404 400,424 T800,414 V500 H0Z" fill="#3a4d93"/>` + [[100, 440], [320, 452], [560, 444], [720, 440]].map(p => `<rect x="${p[0] - 2}" y="${p[1] - 50}" width="4" height="50" fill="#5a3a20"/><circle cx="${p[0]}" cy="${p[1] - 50}" r="5" fill="#ffd36b"/>`).join(''), true))}
        <g class="fly" style="animation-duration:11s">${swallow(560, 120, 1, -1)}<g class="glow"><circle cx="520" cy="127" r="18" fill="#ff6b82" opacity=".5"/></g>${paper(`<circle cx="520" cy="127" r="8" fill="#c0283f"/>`, true)}</g>
        ${ly(1.2, 14, paper(wave(478, 8, '#1d2a5c', 2)))}${motes(8, '#ffe9a8', 80, 420)}`, 'cold'),

      zafiros: () => svg('Un joven escritor con frío y una niña de las cerillas reciben los zafiros del Príncipe',
        `${sky('skyNight')}${stars(30, 5, 110)}
        <defs><clipPath id="cA"><rect x="50" y="135" width="330" height="320" rx="22"/></clipPath><clipPath id="cB"><rect x="420" y="135" width="330" height="320" rx="22"/></clipPath></defs>
        ${ly(.2, 4, paper(`<rect x="40" y="125" width="350" height="340" rx="30" fill="#8e6a48"/><rect x="410" y="125" width="350" height="340" rx="30" fill="#8e6a48"/>`))}
        ${ly(.6, 7, `<g clip-path="url(#cA)"><rect x="50" y="135" width="330" height="320" fill="#6e7fb5"/>
          ${paper(`<rect x="50" y="395" width="330" height="60" fill="#8b6540"/><rect x="95" y="330" width="200" height="16" rx="3" fill="#a57a4a"/><rect x="110" y="344" width="14" height="60" fill="#8b6540"/><rect x="266" y="344" width="14" height="60" fill="#8b6540"/><rect x="130" y="312" width="46" height="20" fill="#fff"/><rect x="190" y="318" width="40" height="14" fill="#f3ead2"/><rect x="215" y="286" width="12" height="44" fill="#f3e2b0"/>`, true)}
          <g class="shiver">${paper(person(310, 400, 2.1, '#2f7a5d'))}</g>
          <g class="flame"><ellipse cx="221" cy="278" rx="4" ry="8" fill="#ffb347"/></g>
          ${paper(`<rect x="70" y="160" width="86" height="110" rx="43" fill="#12183a"/>`, true)}${star(112, 205, 8, '#fff', .2)}
          <circle class="warm" style="animation-delay:4.2s" cx="215" cy="300" r="170" fill="url(#blueglow)"/></g>
        <g clip-path="url(#cB)"><rect x="420" y="135" width="330" height="320" fill="#7d8fc2"/>
          ${paper(wave(400, 8, '#e9eef7', 2) + `<rect x="440" y="170" width="70" height="170" fill="#8e6a8e"/><rect x="640" y="150" width="90" height="200" fill="#a2788a"/><rect x="520" y="200" width="60" height="140" fill="#6c6aa0"/>`, true)}
          ${paper(person(600, 430, 2.2, '#c0283f', false, '#f2c9a0', '#d9a441'))}
          ${paper(`<rect x="636" y="404" width="26" height="16" fill="#e8d08a"/>`, true)}
          ${snowflakes(12, 1.5, 3.5, 5, 9).replace(/cy="0"/g, 'cy="140"')}</g>`)}
        ${ly(1, 12, `<g class="bob">${swallow(400, 66, 1.1, 1)}</g>`)}
        <g class="gx" style="--sx:-190px;--t:2.8s;--w:1.8s"><g class="gy" style="--sy:-150px;--t:2.8s;--w:1.8s"><g class="glow">${paper(`<polygon points="190,230 210,206 230,230 210,262" fill="#2e5fbf"/>`, true)}</g><polygon points="210,206 230,230 210,230" fill="#7fb1ff"/></g></g>
        <g class="gx" style="--sx:150px;--t:2.8s;--w:2.1s"><g class="gy" style="--sy:-190px;--t:2.8s;--w:2.1s"><g class="glow">${paper(`<polygon points="590,280 610,256 630,280 610,312" fill="#2e5fbf"/>`, true)}</g><polygon points="610,256 630,280 610,280" fill="#7fb1ff"/></g></g>`, 'cold'),

      puerto: () => svg('Un barco en el puerto en invierno; la golondrina se despide desde el mástil',
        `${sky('skyDusk')}${sun(640, 280, 40, '#ffd9a0')}
        ${ly(.1, 3, `<g class="drift">${paper(cloud(200, 90, 1, '#ffd9cf') + cloud(560, 60, .8, '#ffeadf'), true)}</g>`)}
        ${ly(.3, 5, paper(wave(330, 8, '#6a7fb8', 1, 1.4), true))}
        ${ly(.6, 9, paper(mast(260, 400, 250, 1) + mast(560, 410, 190, .9)))}
        ${ly(.9, 12, paper(wave(420, 8, '#4c6aa8', 3, 1.8) + `<rect x="60" y="420" width="140" height="64" rx="4" fill="#a2754a"/><rect x="80" y="396" width="90" height="30" rx="4" fill="#8b5a2b"/><path d="M60,444 H200 M130,420 V484" stroke="#5a3a20" stroke-width="4"/>`))}
        ${ly(1.1, 14, `<g class="bob">${swallow(262, 154, 1, -1, 'slow')}</g>${paper(person(640, 450, 1.1, '#2a3a6a') + person(700, 456, 1.1, '#6a4a2a'))}`)}
        ${snowflakes(14, 1.4, 2.8, 8, 13)}`, 'warm'),

      cerillera: () => svg('Una niña de las cerillas, descalza en la nieve, recibe un zafiro en la palma de la mano',
        `${sky('skyNight')}${stars(20, 8, 140)}
        ${ly(.2, 3, paper(wave(330, 10, '#26346f', 2) + [30, 130, 560, 660].map((x, i) => house(x, 420, 70, 90 + i % 2 * 30, ['#5a5a8a', '#6a5a7a', '#4a5a8a', '#6a5a8a'][i], '#2b2147', i % 2 === 0)).join(''), true))}
        ${ly(.6, 8, paper(`<rect x="396" y="170" width="8" height="260" fill="#3a3a4a"/><rect x="384" y="150" width="32" height="26" rx="4" fill="#ffd36b"/>`) + `<g class="glow"><circle cx="400" cy="164" r="90" fill="url(#fireglow)" opacity=".55"/></g>`)}
        ${ly(.9, 12, paper(wave(440, 8, '#f4f7fb', 2)) + `<g>${Array.from({ length: 9 }, (_, i) => `<rect x="${230 + i * 36}" y="${452 + (i % 3) * 8}" width="16" height="3" fill="#e9d8b4" transform="rotate(${-20 + i * 12} ${238 + i * 36} ${454 + (i % 3) * 8})"/>`).join('')}</g>`)}
        ${ly(1.2, 15, `${paper(person(400, 470, 2.2, '#8a3b4a', false, '#f2c9a0', '#d9a441'))}<g class="glow">${paper(`<polygon points="440,424 450,410 460,424 450,440" fill="#2e5fbf"/>`, true)}</g><g class="bob">${swallow(520, 360, .9, -1, 'slow')}</g>`)}
        ${snowflakes(30, 1.6, 3.4, 6, 11)}`, 'cold'),

      oro: () => svg('El Príncipe ciego escucha las historias de Egipto que le cuenta la golondrina sobre su hombro',
        `${sky('skyWarm')}${stars(34, 5, 200)}
        ${ly(.1, 3, `<g class="drift">${paper(`<g transform="translate(560,130)"><ellipse rx="190" ry="85" fill="#fcf3dc"/><circle cx="-170" cy="30" r="22" fill="#fcf3dc"/><circle cx="-190" cy="52" r="10" fill="#fcf3dc"/></g>`, true)}</g>`)}
        ${ly(.4, 4, paper(pyramid(450, 170, 90, 76) + pyramid(540, 170, 100, 56, '#c28a45', '#a8733a') + sphinx(640, 172, .6), true) + `<circle class="glow" cx="690" cy="76" r="22" fill="#ffd36b"/>` + paper(`<path d="M440,176 Q540,166 700,176 L700,190 L440,190Z" fill="#4c93c8"/>`, true) + [[500, 120], [560, 100], [620, 126]].map(p => paper(`<ellipse cx="${p[0]}" cy="${p[1]}" rx="7" ry="10" fill="#e0403f"/><path d="M${p[0]},${p[1] - 8} q10,-10 16,-4" stroke="#e0403f" stroke-width="3" fill="none"/>`, true)).join(''))}
        ${ly(.8, 9, prince(150, 255, { s: 1, blind: true, noRuby: true }))}
        ${ly(1.1, 12, `<g class="bob">${swallow(180, 120, .85, 1, 'slow')}</g>`)}
        ${ly(1.3, 14, paper(wave(450, 8, '#3b3366', 2)))}${motes(10, '#ffe9a8', 100, 440)}`, 'warm'),

      puente: () => svg('Bajo el arco de un puente, dos niños se abrazan para darse calor mientras el guarda los echa',
        `${sky('skyDeep')}
        ${ly(.2, 3, paper(wave(300, 10, '#1e2850', 2), true))}
        ${ly(.5, 6, paper(`<path d="M0,260 H800 V300 H0Z" fill="#6a6a80"/><path d="M80,300 Q250,170 420,300 Z" fill="#14122a"/><path d="M420,300 Q590,170 760,300 Z" fill="#14122a"/><rect x="0" y="300" width="800" height="200" fill="#232845"/>`))}
        ${ly(.8, 10, paper(wave(440, 8, '#2b3358', 3)) + `<g>${paper(person(240, 450, 1.5, '#7a4a4a') + person(280, 452, 1.4, '#4a5a7a'))}</g>`)}
        ${ly(1.1, 14, `<g class="creep" style="--cx:-34px">${paper(person(620, 450, 2, '#1a1a2a', false, '#e8cfae', '#2a1d10') + hat(620, 340, 1.1))}${candle(676, 450, .8)}</g>`)}
        ${Array.from({ length: 36 }, () => `<line class="snow" style="animation-duration:${(.9 + R() * .8).toFixed(1)}s;animation-delay:-${(R() * 2).toFixed(1)}s" x1="${(R() * 800).toFixed(0)}" y1="0" x2="${(R() * 800 - 6).toFixed(0)}" y2="14" stroke="#9ecbff" stroke-width="1.6" opacity=".7"/>`).join('')}`, 'cold'),

      invierno: () => svg('Invierno: la nieve cubre la estatua gris y la golondrina yace a sus pies',
        `${sky('skySnow')}
        ${snowflakes(22, 1.5, 3, 9, 14)}
        ${ly(0, 2, `<g class="drift">${paper(cloud(150, 80, 1.1, '#eef2f9') + cloud(620, 60, .9, '#e6ecf6'), true)}</g>`)}
        ${ly(.3, 4, paper(wave(350, 14, '#b9c6dc', 1) + wave(390, 12, '#cfd9ea', 3), true))}
        ${ly(.7, 8, prince(400, 230, { s: 1, blind: true, dull: true, noRuby: true, heart: true }))}
        <path class="crack" pathLength="1" d="M401,126 L397,133 L402,136 L398,143" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
        ${paper(`<ellipse cx="400" cy="75" rx="24" ry="9" fill="#fff"/><ellipse cx="370" cy="125" rx="13" ry="5" fill="#fff"/><ellipse cx="438" cy="148" rx="10" ry="4" fill="#fff"/>`, true)}
        ${ly(1.1, 12, `<g class="bank">${paper(wave(448, 9, '#f4f7fb', 2))}</g>`)}
        ${ly(1.4, 14, `<g>${swallow(285, 452, .9, 1, 'slow', 78)}</g>`)}
        ${snowflakes(12, 3, 6, 4.5, 7)}`, 'cold'),

      fundicion: () => svg('El Alcalde y los Concejales discuten ante el horno donde se funde la estatua',
        `${sky('skyDungeon')}
        ${ly(.2, 3, paper(`<rect width="800" height="330" fill="#2a2030"/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${i * 100 + 10}" y="40" width="70" height="250" fill="#3a2f40"/>`).join(''), true))}
        ${ly(.5, 7, `<g class="glow"><circle cx="560" cy="330" r="260" fill="url(#fireglow)"/></g>${paper(`<rect x="430" y="200" width="270" height="260" rx="30" fill="#4a3a3a"/><rect x="470" y="260" width="190" height="130" rx="16" fill="#ff7a3c"/>`)}<g class="flick"><path d="M480,390 Q500,300 520,390 Q540,320 560,390 Q580,310 600,390 Q620,330 650,390Z" fill="#ffd36b"/></g>`)}
        ${ly(.9, 11, `${paper(person(120, 470, 2.4, '#5a1226', false, '#e8cfae', '#6a6a7a'))}${paper(`<rect x="86" y="388" width="68" height="8" fill="#f7d878"/>`, true)}${hat(120, 330, 1.5)}${paper([230, 300, 370].map((x, i) => person(x, 470, 2 - i * .1, ['#2a3a6a', '#3a2a5a', '#1a3a3a'][i], false, '#e8cfae', '#222') + hat(x, 470 - 58 * (2 - i * .1), 1.1 - i * .03)).join(''))}`)}
        ${ly(1.2, 14, `${fog(450, .25, 80)}${motes(10, '#ffb347', 200, 460, 400, 760)}`)}`, 'horror'),

      cielo: () => svg('Un ángel lleva al cielo el corazón de plomo y la golondrina; en el jardín del paraíso cantan',
        `${sky('skyHeaven')}
        <g class="rays" opacity=".35">${Array.from({ length: 12 }, (_, i) => `<polygon points="400,90 ${400 + Math.cos(i * Math.PI / 6) * 900},${90 + Math.sin(i * Math.PI / 6) * 900} ${400 + Math.cos((i + .5) * Math.PI / 6) * 900},${90 + Math.sin((i + .5) * Math.PI / 6) * 900}" fill="#fff6c8"/>`).join('')}</g>
        ${stars(24, 8, 260)}
        ${ly(.1, 3, `<g class="drift">${paper(cloud(120, 110, 1.1, '#fff') + cloud(690, 150, 1, '#ffeef0'), true)}</g>`)}
        <g class="descend"><g class="bob" style="animation-duration:3s">
          <g transform="translate(400,235) scale(1.5)">
            ${paper(`<g class="awing l"><path d="M-12,-14 C-70,-70 -105,-10 -70,30 C-55,10 -35,0 -12,6 Z" fill="#fff"/></g><g class="awing r"><path d="M12,-14 C70,-70 105,-10 70,30 C55,10 35,0 12,6 Z" fill="#fff"/></g>
            <path d="M-30,52 L-15,-14 L15,-14 L30,52 Z" fill="#fffdf4"/><circle cx="0" cy="-30" r="16" fill="#f6d5b5"/><path d="M-17,-32 A17,17 0 0 1 17,-32 Q0,-44 -17,-32Z" fill="#f2c24a"/>
            <ellipse cx="0" cy="-58" rx="18" ry="5" fill="none" stroke="#f2c24a" stroke-width="4"/>`)}
            <circle cx="-6" cy="-30" r="1.8" fill="#4a2f1d"/><circle cx="6" cy="-30" r="1.8" fill="#4a2f1d"/>
            ${heart(-6, 26, 1.0, '#8a909c')}
            <g class="glow"><circle cx="-6" cy="14" r="22" fill="#ffe9a8" opacity=".5"/></g>
            ${swallow(18, 22, .34, 1, 'slow')}
          </g>
        </g></g>
        ${ly(1.2, 10, paper(wave(405, 12, '#fff4f6', 2) + wave(440, 10, '#ffd9de', 4), true))}
        ${ly(1.5, 14, paper(wave(468, 8, '#8fcf7a', 1, 1.4)))}
        ${ly(1.8, 16, [40, 120, 200, 300, 420, 520, 610, 700, 760].map((x, i) => `<g class="sway" style="animation-delay:-${(i * .7).toFixed(1)}s">${paper(`<path d="M${x},490 L${x},${448 - i % 3 * 8}" stroke="#4f8f4a" stroke-width="4"/><circle cx="${x}" cy="${442 - i % 3 * 8}" r="10" fill="${['#e58b94', '#f7d878', '#fff', '#b79af2'][i % 4]}"/><circle cx="${x}" cy="${442 - i % 3 * 8}" r="4" fill="#f2a22e"/>`, true)}</g>`).join(''))}
        ${[0, 1, 2].map(i => `<text class="note" style="animation-delay:${i * 1.6}s" x="${135 + i * 22}" y="430" font-size="26" fill="#c0283f">♪</text>`).join('')}
        <g class="bob">${swallow(150, 440, .55, 1, 'slow')}</g>${motes(12, '#fff', 60, 380)}`, 'warm'),

      fin: () => svg('Un corazón y una golondrina rodeados de estrellas de oro',
        `${sky('skyHeaven')}
        <g class="rays" opacity=".4" style="transform-origin:400px 250px">${Array.from({ length: 12 }, (_, i) => `<polygon points="400,250 ${400 + Math.cos(i * Math.PI / 6) * 900},${250 + Math.sin(i * Math.PI / 6) * 900} ${400 + Math.cos((i + .5) * Math.PI / 6) * 900},${250 + Math.sin((i + .5) * Math.PI / 6) * 900}" fill="#fff6c8"/>`).join('')}</g>
        ${ly(.2, 4, paper(`<circle cx="400" cy="250" r="150" fill="#fff4cf"/><circle cx="400" cy="250" r="118" fill="#ffe29a"/>`))}
        ${ly(.6, 9, paper(heart(400, 262, 4.6, '#c0283f')))}
        ${ly(1, 13, `<g class="bob">${swallow(400, 230, 1.6, 1, 'slow')}</g>`)}
        ${Array.from({ length: 14 }, (_, i) => star(400 + Math.cos(i * .45) * (210 + i % 3 * 30), 250 + Math.sin(i * .45) * (150 + i % 2 * 30), 8 + i % 3 * 3, i % 2 ? '#fff' : '#f2a22e', i * .3)).join('')}`, 'warm')
    },
    pages: [
      { scene: 'estatua', title: 'La estatua más *hermosa*',
        text: ['En lo alto de la ciudad, sobre una columna elevada, se alzaba la estatua del Príncipe Feliz. Estaba toda dorada con finas hojas de oro puro; por ojos tenía dos brillantes zafiros, y en la {{empuñadura|La parte de la espada que se sujeta con la mano.}} de su espada resplandecía un gran rubí rojo.',
          'Era muy admirado. «Es tan hermoso como una veleta —comentó uno de los Concejales, que quería ganar fama de tener gustos artísticos—; solo que no tan útil», añadió, temeroso de que la gente lo creyera poco práctico, cosa que en realidad no era.',
          '—¿Por qué no puedes ser como el Príncipe Feliz? —preguntaba una madre sensata a su niñito, que lloraba pidiendo la luna—. El Príncipe Feliz jamás sueña con llorar por nada.',
          '—Me alegra que haya alguien en el mundo que sea completamente feliz —murmuró un hombre desilusionado mientras contemplaba la maravillosa estatua.',
          '—Parece un ángel —decían los Niños de la Beneficencia al salir de la catedral con sus brillantes capas escarlata y sus limpios delantales blancos.',
          '—¿Cómo lo saben? —dijo el Profesor de Matemáticas—. Nunca han visto uno.',
          '—¡Ah! Pero sí, en sueños —respondieron los niños; y el Profesor de Matemáticas frunció el ceño y adoptó un aire muy severo, pues no aprobaba que los niños soñaran.'],
        word: ['Admirar', 'Mirar algo con mucho agrado y respeto porque nos parece muy bueno o muy bello.'] },
      { scene: 'migracion', title: 'La golondrina que se *quedó* atrás',
        text: ['Una noche voló sobre la ciudad una pequeña Golondrina. Sus amigas se habían marchado a Egipto seis semanas antes, pero ella se había quedado atrás, porque estaba enamorada del más hermoso Junco. Lo había conocido a principios de la primavera, mientras volaba río abajo persiguiendo una gran polilla amarilla, y su esbelto talle la había atraído tanto que se detuvo a conversar con él.',
          '—¿Te amaré? —dijo la Golondrina, a quien le gustaba ir directa al grano, y el Junco le hizo una profunda reverencia. Entonces ella voló en círculos a su alrededor, rozando el agua con las alas y haciendo ondas de plata. Aquel fue su cortejo, y duró todo el verano.',
          '—Es un apego ridículo —gorjeaban las otras Golondrinas—; no tiene dinero, y demasiada parentela —y en efecto el río estaba lleno de Juncos. Luego, cuando llegó el otoño, todas se marcharon volando.',
          'Cuando se fueron se sintió sola, y empezó a cansarse de su amado. «No tiene conversación —dijo—, y me temo que es un coqueto, porque siempre está flirteando con el viento.» Y ciertamente, cada vez que soplaba el viento, el Junco hacía las más graciosas reverencias. «Admito que es hogareño —prosiguió—, pero a mí me encanta viajar, y mi marido, por lo tanto, debería amar también los viajes.»',
          '—¿Vendrás conmigo? —le dijo por fin; pero el Junco negó con la cabeza, tan apegado estaba a su hogar.',
          '—Has jugado conmigo —gritó ella—. Me voy a las Pirámides. ¡Adiós! —y se alejó volando.'],
        word: ['Migrar', 'Viajar cada año a otro lugar, buscando mejor clima y alimento. Muchas aves lo hacen.'] },
      { scene: 'gota', title: 'Una *gota* en una noche sin nubes',
        text: ['Voló todo el día, y al llegar la noche arribó a la ciudad. «¿Dónde me alojaré? —dijo—. Espero que la ciudad haya hecho preparativos.» Entonces vio la estatua en la alta columna.',
          '—Me alojaré allí —exclamó—; es una buena posición, con mucho aire fresco. —Y se posó justo entre los pies del Príncipe Feliz.',
          '—Tengo una habitación dorada —se dijo en voz baja mirando a su alrededor, y se dispuso a dormir; pero justo cuando ponía la cabeza bajo el ala le cayó encima una gran gota de agua. «¡Qué cosa tan curiosa! —exclamó—. No hay ni una sola nube en el cielo, las estrellas están claras y brillantes, y sin embargo llueve. El clima del norte de Europa es realmente espantoso. Al Junco le gustaba la lluvia, pero eso era puro egoísmo.»',
          'Entonces cayó otra gota.',
          '—¿Para qué sirve una estatua si no puede detener la lluvia? —dijo—. Tendré que buscar una buena chimenea —y resolvió irse volando.',
          'Pero antes de abrir las alas, cayó una tercera gota, y levantó la vista, y vio… ¡Ah! ¿Qué vio?',
          'Los ojos del Príncipe Feliz estaban llenos de lágrimas, y las lágrimas corrían por sus mejillas doradas. Su rostro era tan hermoso a la luz de la luna que la pequeña Golondrina se llenó de compasión.'],
        think: ['¿Por qué lloraba el Príncipe si todos lo llamaban «Feliz»?', 'Porque en vida solo conoció el placer; ahora, desde lo alto, ve el dolor de su ciudad y le importa.'] },
      { scene: 'gota', title: 'El Palacio de Sans-Souci',
        text: ['—¿Quién eres? —dijo.',
          '—Soy el Príncipe Feliz.',
          '—¿Por qué lloras, entonces? —preguntó la Golondrina—; me has empapado por completo.',
          '—Cuando estaba vivo y tenía un corazón humano —respondió la estatua—, no sabía lo que eran las lágrimas, porque vivía en el Palacio de Sans-Souci, donde no se permite la entrada a la pena. De día jugaba con mis compañeros en el jardín, y por la noche guiaba el baile en el Gran Salón. Alrededor del jardín corría un muro muy alto, pero nunca me interesó preguntar qué había más allá; todo cuanto me rodeaba era tan hermoso. Mis cortesanos me llamaban el Príncipe Feliz, y feliz era yo, en verdad, si el placer es felicidad. Así viví, y así morí. Y ahora que estoy muerto me han puesto aquí tan alto que puedo ver toda la fealdad y toda la miseria de mi ciudad, y aunque mi corazón es de {{plomo|Metal gris, pesado y blando.}}, no puedo sino llorar.',
          '«¿Cómo? ¿No es de oro macizo?», se dijo la Golondrina. Era demasiado educada para hacer en voz alta comentarios personales.'],
        word: ['Miseria', 'Pobreza muy grande, cuando a alguien le falta lo necesario para vivir.'] },
      { scene: 'casa', title: 'El *rubí* de la espada',
        text: ['—Lejos de aquí —continuó la estatua con voz baja y musical—, lejos, en una callecita, hay una casa pobre. Una de las ventanas está abierta, y por ella veo a una mujer sentada a una mesa. Tiene el rostro delgado y gastado, y unas manos ásperas y rojas, todas pinchadas por la aguja, pues es {{costurera|Persona que cose ropa para ganarse la vida.}}. Está bordando pasionarias en un vestido de raso para que lo luzca la más hermosa de las damas de honor de la Reina en el próximo baile de la Corte. En una cama, en un rincón de la habitación, yace enfermo su niñito. Tiene fiebre y pide naranjas. Su madre no tiene para darle más que agua del río, y por eso llora. Golondrina, Golondrina, pequeña Golondrina, ¿no le llevarás el rubí de la empuñadura de mi espada? Mis pies están sujetos a este pedestal y no puedo moverme.'] },
      { scene: 'egipto', title: 'Me esperan en *Egipto*',
        text: ['—Me esperan en Egipto —dijo la Golondrina—. Mis amigas vuelan de arriba abajo por el Nilo, y hablan con las grandes flores de loto. Pronto se irán a dormir a la tumba del gran Rey. Allí está el propio Rey en su ataúd pintado. Está envuelto en lino amarillo y embalsamado con especias. Alrededor del cuello lleva una cadena de jade verde pálido, y sus manos son como hojas secas.',
          '—Golondrina, Golondrina, pequeña Golondrina —dijo el Príncipe—, ¿no te quedarás conmigo una noche y serás mi mensajera? El niño tiene tanta sed, y la madre está tan triste.',
          '—No creo que me gusten los niños —respondió la Golondrina—. El verano pasado, cuando estaba en el río, había dos niños groseros, los hijos del molinero, que siempre me tiraban piedras. Nunca me dieron, por supuesto; las golondrinas volamos demasiado bien para eso, y además vengo de una familia famosa por su agilidad; pero aun así era una muestra de falta de respeto.',
          'Pero el Príncipe Feliz parecía tan triste que la pequeña Golondrina lo lamentó.',
          '—Hace mucho frío aquí —dijo—; pero me quedaré contigo una noche y seré tu mensajera.',
          '—Gracias, pequeña Golondrina —dijo el Príncipe.'],
        think: ['La Golondrina decía que no le gustaban los niños y, aun así, se quedó. ¿Qué la hizo cambiar de idea?', 'Ver tan triste al Príncipe: la compasión fue más fuerte que su comodidad y su viaje.'] },
      { scene: 'vuelo', title: 'Sobre los tejados de la ciudad',
        text: ['Así que la Golondrina arrancó el gran rubí de la espada del Príncipe y se alejó volando con él en el pico sobre los tejados de la ciudad.',
          'Pasó junto a la torre de la catedral, donde estaban esculpidos los ángeles de mármol blanco. Pasó junto al palacio y oyó el sonido de un baile. Una muchacha hermosa salió al balcón con su enamorado. «Qué maravillosas son las estrellas —le dijo él—, y qué maravilloso es el poder del amor.»',
          '—Espero que mi vestido esté listo a tiempo para el baile de gala —respondió ella—; he encargado que le bordaran pasionarias; pero las costureras son tan perezosas.',
          'Pasó sobre el río y vio los faroles colgados de los mástiles de los barcos. Pasó sobre el gueto y vio a los viejos judíos regateando entre sí y pesando monedas en balanzas de cobre. Por fin llegó a la casa pobre y miró dentro. El niño se agitaba febril en su cama, y la madre se había quedado dormida, de tan cansada que estaba. Entró de un salto y dejó el gran rubí en la mesa, junto al dedal de la mujer.'] },
      { scene: 'casa', title: 'Una buena acción',
        text: ['Luego voló suavemente alrededor de la cama, abanicando la frente del niño con las alas. «Qué fresquito me siento —dijo el niño—; debo de estar mejorando»; y se hundió en un delicioso sueño.',
          'Entonces la Golondrina volvió junto al Príncipe Feliz y le contó lo que había hecho. «Es curioso —observó—, pero ahora siento mucho calor, aunque hace tanto frío.»',
          '—Es porque has hecho una buena acción —dijo el Príncipe.',
          'Y la pequeña Golondrina se puso a pensar, y luego se quedó dormida. Pensar siempre le daba sueño.'],
        word: ['Bondad', 'La cualidad de quien ayuda a los demás sin esperar nada a cambio.'] },
      { scene: 'egipto', title: 'El profesor de ornitología',
        text: ['Cuando amaneció voló hasta el río y se dio un baño. «Qué fenómeno tan notable —dijo el Profesor de Ornitología al pasar por el puente—. ¡Una golondrina en invierno!» Y escribió una larga carta sobre ello al periódico local. Todo el mundo la citó; estaba llena de tantas palabras que no podían entender.',
          '—Esta noche me voy a Egipto —dijo la Golondrina, y estaba muy animada ante la perspectiva. Visitó todos los monumentos públicos, y se estuvo largo rato posada en lo alto del campanario de la iglesia. Dondequiera que iba los Gorriones piaban y se decían: «¡Qué distinguida forastera!», de modo que se divirtió muchísimo.',
          'Cuando salió la luna volvió junto al Príncipe Feliz. «¿Tiene algún encargo para Egipto? —gritó—. Estoy a punto de partir.»',
          '—Golondrina, Golondrina, pequeña Golondrina —dijo el Príncipe—, ¿no te quedarás conmigo una noche más?'] },
      { scene: 'zafiros', title: 'Los *zafiros* del Príncipe',
        text: ['—Me esperan en Egipto —respondió la Golondrina—. Mañana mis amigas volarán hasta la Segunda Catarata. Allí se acuesta el hipopótamo entre los juncos, y sobre un gran trono de granito se sienta el dios Memnón. Toda la noche vigila las estrellas, y cuando brilla el lucero del alba lanza un grito de alegría, y luego calla. Al mediodía los leones amarillos bajan a la orilla a beber. Tienen ojos como berilos verdes, y su rugido es más fuerte que el rugido de la catarata.',
          '—Golondrina, Golondrina, pequeña Golondrina —dijo el Príncipe—, lejos, al otro lado de la ciudad, veo a un joven en una buhardilla. Está inclinado sobre un escritorio cubierto de papeles, y en un vaso a su lado hay un ramito de violetas marchitas. Tiene el pelo castaño y rizado, los labios rojos como una granada, y los ojos grandes y soñadores. Está tratando de terminar una obra para el Director del Teatro, pero tiene demasiado frío para escribir más. No hay fuego en la chimenea, y el hambre lo ha dejado débil.',
          '—Esperaré contigo una noche más —dijo la Golondrina, que en verdad tenía buen corazón—. ¿Le llevo otro rubí?',
          '—¡Ay! Ya no tengo rubí —dijo el Príncipe—; mis ojos son todo lo que me queda. Son de {{zafiros|Piedra preciosa de color azul intenso.}} raros, que fueron traídos de la India hace mil años. Arráncame uno y llévaselo. Él lo venderá al joyero, y comprará comida y leña, y terminará su obra.',
          '—Querido Príncipe —dijo la Golondrina—, no puedo hacer eso —y se echó a llorar.',
          '—Golondrina, Golondrina, pequeña Golondrina —dijo el Príncipe—, haz lo que te mando.'] },
      { scene: 'zafiros', title: 'Empiezo a ser *apreciado*',
        text: ['Así que la Golondrina le arrancó un ojo al Príncipe, y voló a la buhardilla del estudiante. Fue fácil entrar, pues había un agujero en el tejado. Por él se coló y entró en la habitación. El joven tenía la cabeza hundida entre las manos, así que no oyó el aleteo del pájaro, y cuando levantó la vista encontró el hermoso zafiro sobre las violetas marchitas.',
          '—Empiezo a ser apreciado —exclamó—; esto es de algún gran admirador. Ahora puedo terminar mi obra —y parecía muy feliz.'],
        think: ['El joven cree que el zafiro viene de «un gran admirador». ¿Qué sabemos nosotros que él no sabe?', 'Que viene de un gesto anónimo de generosidad: el Príncipe y la Golondrina dan sin que nadie lo sepa.'] },
      { scene: 'puerto', title: 'Es invierno',
        text: ['Al día siguiente la Golondrina bajó volando al puerto. Se posó en el mástil de un gran barco y vio a los marineros sacando grandes cofres de la bodega con cuerdas. «¡Oh, hisa!», gritaban cuando subía cada cofre. «¡Me voy a Egipto!», gritó la Golondrina, pero nadie hizo caso, y cuando salió la luna volvió junto al Príncipe Feliz.',
          '—He venido a despedirme —gritó.',
          '—Golondrina, Golondrina, pequeña Golondrina —dijo el Príncipe—, ¿no te quedarás conmigo una noche más?',
          '—Es invierno —respondió la Golondrina—, y pronto llegará la nieve helada. En Egipto el sol calienta las verdes palmeras, y los cocodrilos yacen en el barro y miran perezosamente a su alrededor. Mis compañeras están construyendo un nido en el Templo de Baalbek, y las palomas rosadas y blancas las observan, y se arrullan unas a otras. Querido Príncipe, debo dejarte, pero nunca te olvidaré, y la próxima primavera te traeré dos hermosas joyas en lugar de las que has regalado. El rubí será más rojo que una rosa roja, y el zafiro será tan azul como el gran mar.'] },
      { scene: 'cerillera', title: 'La niña de las cerillas',
        text: ['—En la plaza de abajo —dijo el Príncipe Feliz— hay una pequeña vendedora de cerillas. Ha dejado caer sus cerillas en el arroyo, y se han estropeado todas. Su padre le pegará si no lleva a casa algo de dinero, y está llorando. No tiene zapatos ni medias, y lleva la cabecita descubierta. Arráncame el otro ojo, y dáselo, y su padre no le pegará.',
          '—Me quedaré contigo una noche más —dijo la Golondrina—, pero no puedo arrancarte el ojo. Te quedarías completamente ciego.',
          '—Golondrina, Golondrina, pequeña Golondrina —dijo el Príncipe—, haz lo que te mando.',
          'Así que le arrancó el otro ojo al Príncipe, y bajó en picado con él. Pasó rozando a la niña de las cerillas y le deslizó la joya en la palma de la mano. «¡Qué pedacito de cristal tan bonito!», gritó la niña; y echó a correr a casa, riendo.',
          'Entonces la Golondrina volvió junto al Príncipe. «Ahora estás ciego —dijo—, así que me quedaré contigo para siempre.»',
          '—No, pequeña Golondrina —dijo el pobre Príncipe—, debes irte a Egipto.',
          '—Me quedaré contigo para siempre —dijo la Golondrina, y durmió a los pies del Príncipe.'],
        word: ['Sacrificio', 'Dar algo muy querido o valioso para que otra persona esté mejor.'] },
      { scene: 'oro', title: 'Los *ojos* de la golondrina',
        text: ['Todo el día siguiente estuvo posada en el hombro del Príncipe, y le contó historias de lo que había visto en tierras extrañas. Le habló de los ibis rojos, que se alinean en largas filas a orillas del Nilo y atrapan peces dorados con el pico; de la {{Esfinge|Estatua enorme con cuerpo de león y cabeza humana.}}, que es tan vieja como el mundo mismo y vive en el desierto y lo sabe todo; de los mercaderes, que caminan despacio junto a sus camellos y llevan en las manos cuentas de ámbar; del Rey de las Montañas de la Luna, negro como el ébano, que adora un gran cristal; de la gran serpiente verde que duerme en una palmera y tiene veinte sacerdotes que la alimentan con tortas de miel; y de los pigmeos que navegan sobre un gran lago en grandes hojas planas y están siempre en guerra con las mariposas.',
          '—Querida pequeña Golondrina —dijo el Príncipe—, me hablas de cosas maravillosas, pero más maravilloso que todo es el sufrimiento de los hombres y de las mujeres. No hay Misterio tan grande como la Miseria. Vuela sobre mi ciudad, pequeña Golondrina, y dime qué ves allí.'] },
      { scene: 'puente', title: 'Bajo el *puente*',
        text: ['Así que la Golondrina voló sobre la gran ciudad, y vio a los ricos divirtiéndose en sus hermosas casas, mientras los mendigos estaban sentados a las puertas. Voló por callejones oscuros, y vio los rostros pálidos de niños hambrientos que miraban sin ganas las calles negras. Bajo el arco de un puente, dos niñitos yacían abrazados para tratar de darse calor. «¡Qué hambre tenemos!», decían. «No pueden estar aquí», gritó el Guarda, y salieron a vagar bajo la lluvia.',
          'Entonces volvió y le contó al Príncipe lo que había visto.'],
        think: ['¿Qué contraste hay entre «los ricos en sus casas» y «los niños bajo el puente»?', 'Que la misma ciudad guarda mucha fiesta y mucha hambre; el cuento nos pide mirar a quien casi nadie quiere ver.'] },
      { scene: 'oro', title: 'Hoja tras hoja de oro',
        text: ['—Estoy cubierto de oro fino —dijo el Príncipe—; tienes que quitármelo, hoja por hoja, y dárselo a mis pobres; los vivos siempre piensan que el oro puede hacerlos felices.',
          'Hoja tras hoja de oro fino fue arrancando la Golondrina, hasta que el Príncipe Feliz quedó apagado y gris. Hoja tras hoja de oro fino las llevó a los pobres, y los rostros de los niños se pusieron más rosados, y reían y jugaban en la calle. «¡Ya tenemos pan!», gritaban.',
          'Entonces llegó la nieve, y tras la nieve llegó la helada. Las calles parecían hechas de plata, de tan brillantes y relucientes; largos carámbanos como dagas de cristal colgaban de los aleros de las casas, todo el mundo andaba con pieles, y los niños llevaban gorros escarlata y patinaban sobre el hielo.',
          'La pobre pequeña Golondrina tenía cada vez más frío, pero no quería dejar al Príncipe; lo quería demasiado. Recogía migas a la puerta de la panadería cuando el panadero no miraba, y trataba de calentarse batiendo las alas.'] },
      { scene: 'invierno', title: 'La casa de la Muerte',
        text: ['Pero al fin supo que iba a morir. Solo le quedaban fuerzas para volar una vez más hasta el hombro del Príncipe. «¡Adiós, querido Príncipe! —murmuró—. ¿Me dejas besarte la mano?»',
          '—Me alegra que por fin te vayas a Egipto, pequeña Golondrina —dijo el Príncipe—; te has quedado demasiado tiempo aquí; pero debes besarme en los labios, porque te quiero.',
          '—No es a Egipto adonde voy —dijo la Golondrina—. Voy a la Casa de la Muerte. La Muerte es hermana del Sueño, ¿no es así?',
          'Y besó al Príncipe Feliz en los labios, y cayó muerta a sus pies.',
          'En ese momento sonó dentro de la estatua un curioso crujido, como si algo se hubiera roto. El hecho es que el corazón de plomo se había partido en dos. Sin duda fue una helada terriblemente dura.'],
        word: ['Amistad', 'El cariño sincero entre personas (o animales) que se cuidan y se acompañan.'] },
      { scene: 'fundicion', title: 'Un *mendigo* de estatua',
        text: ['A la mañana siguiente muy temprano, el Alcalde paseaba por la plaza de abajo en compañía de los Concejales. Al pasar junto a la columna miró la estatua: «¡Dios mío! ¡Qué desaliñado se ve el Príncipe Feliz!», dijo.',
          '—¡Qué desaliñado, en efecto! —gritaron los Concejales, que siempre estaban de acuerdo con el Alcalde; y subieron a mirarla.',
          '—Se le ha caído el rubí de la espada, ha perdido los ojos y ya no es de oro —dijo el Alcalde—; ¡apenas es mejor que un mendigo!',
          '—Apenas mejor que un mendigo —dijeron los Concejales.',
          '—¡Y aquí hay, de hecho, un pájaro muerto a sus pies! —prosiguió el Alcalde—. Tenemos que publicar un bando prohibiendo que los pájaros mueran aquí. —Y el Secretario del Ayuntamiento tomó nota de la sugerencia.',
          'Así que derribaron la estatua del Príncipe Feliz. «Como ya no es hermoso, ya no es útil», dijo el Profesor de Arte de la Universidad.',
          'Luego fundieron la estatua en un horno, y el Alcalde reunió al Ayuntamiento para decidir qué hacer con el metal. «Tenemos que tener otra estatua, por supuesto —dijo—, y será una estatua mía.»',
          '—Mía —dijo cada uno de los Concejales, y se pelearon. La última vez que supe de ellos todavía seguían peleándose.'],
        think: ['El Profesor dice: «Como ya no es hermoso, ya no es útil». ¿Estás de acuerdo con él? ¿Por qué?', 'Respuesta libre. El cuento sugiere que lo más útil que hizo el Príncipe fue justamente perder su belleza para ayudar.'] },
      { scene: 'cielo', title: 'Lo más *precioso* de la ciudad',
        text: ['—¡Qué cosa más extraña! —dijo el capataz de los obreros de la fundición—. Este corazón de plomo roto no se funde en el horno. Habrá que tirarlo. —Y lo arrojaron a un montón de basura donde yacía también la Golondrina muerta.',
          '—Tráeme las dos cosas más preciosas de la ciudad —dijo Dios a uno de sus {{Ángeles|Seres de luz que, según muchas historias, acompañan y cuidan a las personas.}}; y el Ángel le llevó el corazón de plomo y el pájaro muerto.',
          '—Has elegido bien —dijo Dios—, pues en mi jardín del Paraíso este pajarito cantará por siempre jamás, y en mi ciudad de oro el Príncipe Feliz me alabará.'],
        word: ['Moraleja', 'La enseñanza o lección que nos deja un cuento.'] }
    ],
    quiz: [
      { q: '¿Qué le pidió el Príncipe a la Golondrina que repartiera entre los pobres?', o: ['Solo su rubí', 'Su rubí, sus zafiros y todas sus hojas de oro', 'Su espada y su corona'], a: 1, ok: '¡Eso es! Se desprendió de todo lo que brillaba en él.', no: 'Dio su rubí, sus dos zafiros (sus ojos) y todo su oro, hoja a hoja.' },
      { q: '¿Por qué se quedó la Golondrina con el Príncipe, aunque llegó el invierno?', o: ['Porque se perdió', 'Porque lo quería y él estaba ciego', 'Porque quería quedarse con su oro'], a: 1, ok: '¡Muy bien! Eligió el cariño antes que su propio viaje.', no: 'Se quedó porque lo quería y, además, él se había quedado ciego.' },
      { q: '¿Cuáles fueron «las dos cosas más preciosas de la ciudad» que eligió el Ángel?', o: ['El oro y los zafiros', 'El corazón de plomo y la golondrina muerta', 'La espada y el pedestal'], a: 1, ok: '¡Correcto! Lo más valioso fue el amor que dieron.', no: 'El Ángel llevó el corazón de plomo y el pájaro muerto: lo más precioso es el amor que se da.' }
    ]
  });
})();
