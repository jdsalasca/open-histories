/* El corazón delator — Edgar Allan Poe (1843, «The Tell-Tale Heart»). Dominio público.
 * Traducción al español: propia (CC BY 4.0), a partir del original en inglés (Project Gutenberg #2148). */
(function () {
  const { paper, ly, sky, stars, wave, cloud, moon, person, heart, svg, R, motes, fog, beams, candle, lantern, bat, crow, tomb, web, vultureEye, clock, house } = OH.kit;
  const H = 'horror';

  /* habitación oscura: pared, suelo de tablas y zócalo */
  const room = (wall = '#2a2038', floor = '#3a2a2a') => `<rect width="800" height="500" fill="${wall}"/><path d="M0,330 H800 V500 H0Z" fill="${floor}"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 70 + 10},330 L${i * 100 - 120},500" stroke="rgba(0,0,0,.35)" stroke-width="3"/>`).join('')}<rect y="320" width="800" height="14" fill="#1a1322"/>`;
  const oldMan = (x, y, s, fear = false) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-70" y="-20" width="150" height="70" rx="10" fill="#5a3a52"/><path d="M-30,-18 Q-26,-66 4,-66 Q34,-66 38,-18Z" fill="#e9e4f5"/><circle cx="4" cy="-84" r="20" fill="#e8cfae"/><path d="M-16,-92 Q4,-120 24,-92 Q4,-98 -16,-92Z" fill="#f4f4f8"/><path d="M-18,-96 Q4,-132 26,-96Z" fill="#e9e4f5"/><g class="blink" style="--b:6s"><circle cx="-4" cy="-84" r="${fear ? 4 : 2.2}" fill="#fff"/><circle cx="12" cy="-84" r="${fear ? 4 : 2.2}" fill="#fff"/><circle cx="-4" cy="-84" r="1.5" fill="#1a1626"/><circle cx="12" cy="-84" r="1.5" fill="#1a1626"/></g><path d="M-2,-72 Q4,${fear ? -70 : -68} 10,-72" stroke="#7a4a3a" stroke-width="2.2" fill="none"/>${fear ? '<path d="M24,-96 q4,8 0,12" stroke="#8ec5ff" stroke-width="2.5" fill="none"/>' : ''}</g>`;
  const bed = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-110" y="-30" width="230" height="22" rx="6" fill="#6a4a3a"/><rect x="-118" y="-84" width="18" height="86" rx="5" fill="#4a3228"/><rect x="108" y="-60" width="18" height="62" rx="5" fill="#4a3228"/><rect x="-100" y="-44" width="210" height="22" rx="8" fill="#8a6fb0"/><rect x="-100" y="-48" width="50" height="18" rx="8" fill="#e9e4f5"/></g>`;
  const dark = (x, y, s, flip = 1) => person(x, y, s, '#14101f', false, '#d8c8b8', '#0c0814');
  const rings = (x, y, n = 4, col = '#ff4560', fast = false) => Array.from({ length: n }, (_, i) => `<circle class="ripple2" style="animation-duration:${fast ? 1.1 : 2.4}s;animation-delay:-${(i * (fast ? .27 : .6)).toFixed(2)}s" cx="${x}" cy="${y}" r="30" fill="none" stroke="${col}" stroke-width="3"/>`).join('');
  const hat = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-17" y="-40" width="34" height="14" rx="3" fill="#1f2a4a"/><rect x="-24" y="-28" width="48" height="6" rx="3" fill="#1f2a4a"/></g>`;
  const officer = (x, y, s, flip = 1) => `<g>${person(x, y, s, '#2a3a6a', false, '#e8cfae', '#3a2a1a')}${hat(x, y - 38 * s, s)}<circle cx="${x}" cy="${y - 26 * s}" r="${2.2 * s}" fill="#f7d878"/></g>`;
  const chair = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-22" y="-34" width="44" height="8" rx="3" fill="#7a5230"/><rect x="-22" y="-80" width="8" height="48" fill="#7a5230"/><rect x="-18" y="-26" width="6" height="28" fill="#5a3a20"/><rect x="12" y="-26" width="6" height="28" fill="#5a3a20"/></g>`;

  OH.story({
    id: 'corazon-delator',
    theme: 'terror',
    title: 'El corazón *delator*',
    author: 'Edgar Allan Poe', year: 1843, orig: 'The Tell-Tale Heart', chapterLabel: 'Noche',
    warning: 'Terror psicológico · para lectores valientes (+12)',
    trans: 'Traducción al español propia (CC BY 4.0), hecha a partir del original en inglés.',
    tagline: '«¿Por qué dirán que estoy loco?»',
    intro: 'Un narrador jura que está cuerdo. Solo quiere librarse de un ojo… y de un sonido que nadie más oye. Un clásico de Poe, contado a oscuras.',
    moral: 'La culpa no necesita testigos: a veces es la propia conciencia la que nos delata. Poe usa un narrador que jura estar tranquilo… y que se traiciona con cada palabra.',
    scenes: {
      cover: () => svg('Un enorme ojo pálido flota sobre una casa a oscuras con una sola ventana encendida',
        `${sky('skyMidnight')}${stars(26, 8, 240)}
        ${ly(.1, 2, `<g class="glow"><circle cx="560" cy="130" r="150" fill="#9ecbff" opacity=".18"/></g><g class="beat">${paper(vultureEye(560, 130, 2.6), true)}</g>`)}
        ${ly(.4, 4, `<g class="drift">${paper(cloud(220, 100, 1.1, '#2a2650') + cloud(640, 250, .9, '#2a2650'), true)}</g>`)}
        ${ly(.7, 8, paper(`<path d="M0,420 Q200,380 400,420 T800,410 V500 H0Z" fill="#0b0716"/>${house(250, 440, 120, 190, '#1a1426', '#0c0814', false)}<rect x="296" y="300" width="28" height="36" fill="#ffd36b"/><rect x="296" y="300" width="28" height="36" fill="url(#fireglow)" opacity=".4"/>`))}
        ${ly(1, 11, `${paper(crow(120, 330, 1.2) + crow(160, 340, .9, -1) + `<g transform="translate(640,430)"><path d="M0,0 L0,-120 M0,-70 L-34,-110 M0,-90 L30,-124" stroke="#0b0716" stroke-width="8" stroke-linecap="round"/></g>`)}${fog(450, .35, 80)}`)}
        ${bat(440, 220, .9)}`, H),

      ojo: () => svg('Un ojo de buitre, azul pálido y cubierto por un velo, en la oscuridad',
        `${sky('skyDungeon')}
        ${ly(.1, 2, `<g class="glow"><circle cx="400" cy="250" r="230" fill="#9ecbff" opacity=".16"/></g>`)}
        ${ly(.4, 7, `<g class="beat">${paper(vultureEye(400, 250, 5.2))}</g>`)}
        ${ly(.8, 12, `${web(0, 0, 1.6)}${web(800, 0, 1.6, -1)}${fog(430, .4, 90)}${motes(14, '#bcd8ff', 60, 440)}`)}`, H),

      puerta: () => svg('Una puerta entreabierta a medianoche y un hilo de luz sobre el suelo',
        `${room('#24192f', '#33242a')}
        ${ly(.2, 3, paper(clock(110, 120, 1.1, 0), true))}
        ${ly(.5, 7, paper(`<rect x="440" y="110" width="180" height="230" rx="10" fill="#6b4a2a"/><rect x="460" y="130" width="140" height="90" rx="6" fill="#5a3a20"/><rect x="460" y="236" width="140" height="90" rx="6" fill="#5a3a20"/><rect x="606" y="110" width="14" height="230" fill="#0a0612"/><circle cx="590" cy="230" r="6" fill="#f7d878"/>`))}
        ${ly(.8, 11, `<polygon class="beam" points="612,230 700,500 560,500" fill="url(#beamg)" opacity=".6"/>${paper(lantern(210, 420, 1.2))}<polygon class="beam" points="224,400 440,330 440,342 226,412" fill="#ffe9a8" opacity=".3"/>${fog(440, .3, 70)}`)}`, H),

      cama: () => svg('El viejo, sentado en la cama a oscuras, escucha; en la puerta, una silueta',
        `${room('#1b1426', '#2a1d22')}
        ${ly(.2, 3, paper(`<rect x="520" y="80" width="150" height="160" rx="8" fill="#3a2a1a"/><path d="M520,120 H670 M520,160 H670 M520,200 H670" stroke="#0e0a14" stroke-width="10"/>`, true))}
        ${ly(.5, 7, `${paper(bed(330, 400, 1.5))}${paper(oldMan(350, 372, 1.5, true))}`)}
        ${ly(.9, 11, `<g class="creep" style="--cx:14px">${paper(dark(90, 430, 2.4))}</g><g class="glow">${paper(`<circle cx="104" cy="326" r="5" fill="#cfe0f3"/><circle cx="82" cy="326" r="5" fill="#cfe0f3"/>`, true)}</g>${fog(450, .3, 70)}`)}`, H),

      gemido: () => svg('Una sombra enorme, la Muerte, avanza detrás de la cabeza del narrador',
        `${room('#150f20', '#241a22')}
        ${ly(.2, 4, `<g class="creep" style="--cx:40px"><path d="M-40,500 Q80,80 260,160 Q360,40 460,240 Q560,120 620,500Z" fill="#05030a" opacity=".92"/><path d="M300,170 q-20,-50 -10,-90 M340,176 q10,-50 40,-80" stroke="#05030a" stroke-width="14" stroke-linecap="round" fill="none"/></g>`)}
        ${ly(.5, 8, `${paper(bed(520, 430, 1.6))}${paper(oldMan(550, 400, 1.7, true))}`)}
        ${ly(.9, 12, `<g class="shake">${paper(dark(150, 460, 2.2))}</g>${motes(8, '#cfd8ff', 100, 420)}`)}`, H),

      rayo: () => svg('Un rayo fino de luz cae sobre el ojo de buitre, abierto de par en par',
        `${sky('skyDungeon')}
        ${ly(.2, 3, `<polygon points="60,0 90,0 430,248 400,262" fill="#ffe9a8" opacity=".5"/><polygon points="60,0 90,0 432,250 416,258" fill="#fff" opacity=".7"/>`)}
        ${ly(.5, 8, `<g class="glow"><circle cx="420" cy="254" r="210" fill="#9ecbff" opacity=".2"/></g><g class="beat fast">${paper(vultureEye(420, 254, 4.6))}</g>`)}
        ${ly(.8, 12, `${rings(420, 254, 3, '#9ecbff')}${fog(450, .3, 80)}${motes(12, '#fff4c8', 80, 440)}`)}`, H),

      latido: () => svg('El latido crece: anillos rojos se expanden en la oscuridad; la linterna se abre de golpe',
        `${room('#1a0f1c', '#2a1822')}
        ${ly(.2, 4, `<polygon points="30,300 800,60 800,500 30,330" fill="#ffe9a8" opacity=".14"/>`)}
        ${ly(.4, 8, `${rings(400, 270, 5, '#ff4560', true)}<g class="beat frantic">${paper(heart(400, 280, 5.6, '#7d1224'))}</g>`)}
        ${ly(.8, 12, `${paper(`<path d="M150,500 L200,400 H380 L330,500Z" fill="#14101f"/><rect x="520" y="390" width="200" height="40" rx="10" fill="#14101f"/>`)}${paper(lantern(90, 420, 1.2))}<g class="shake">${paper(person(640, 470, 1.8, '#14101f', false, '#d8c8b8', '#0c0814'))}</g>`)}`, H),

      tablas: () => svg('Tres tablas del suelo de la habitación vuelven a su sitio; en el reloj son las cuatro',
        `${room('#1d1627', '#3a2c2a')}
        ${ly(.2, 3, paper(clock(660, 110, 1.2, 120), true))}
        ${ly(.5, 8, paper(`${Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 80}" y="${300 + (i % 2) * 8}" width="76" height="200" fill="${[3, 4, 5].includes(i) ? '#6a5040' : '#4a3a38'}" stroke="#1a1214" stroke-width="3"/>`).join('')}${Array.from({ length: 9 }, (_, i) => `<circle cx="${78 + i * 80}" cy="320" r="3" fill="#1a1214"/>`).join('')}<rect x="640" y="380" width="110" height="80" rx="8" fill="#5a3a20"/><rect x="650" y="372" width="90" height="14" rx="6" fill="#3a2410"/>`))}
        ${ly(.9, 12, `${paper(lantern(120, 440, 1.2))}${candle(300, 470, 1)}${fog(470, .35, 70)}`)}`, H),

      policia: () => svg('Tres agentes entran en la casa a las cuatro de la madrugada; el narrador sonríe',
        `${room('#201a2e', '#352a2c')}
        ${ly(.2, 3, paper(`<rect x="70" y="90" width="120" height="170" rx="8" fill="#1a2650"/><path d="M130,90 V260 M70,175 H190" stroke="#c7a36a" stroke-width="6"/>`, true))}
        ${ly(.5, 8, `${paper(officer(330, 420, 2.1) + officer(450, 424, 2.1) + officer(570, 420, 2.1))}${candle(700, 440, 1.2)}`)}
        ${ly(.9, 13, `${paper(person(180, 480, 2.7, '#14101f', false, '#e8d5c0', '#2a1d10'))}<path d="M164,402 Q180,416 196,402" stroke="#7a1f2c" stroke-width="3" fill="none"/>`)}`, H),

      sonido: () => svg('El narrador, pálido, sentado sobre las tablas, mientras un sonido sordo y rápido crece',
        `${room('#190f1c', '#2c1a22')}
        ${ly(.2, 4, `${rings(400, 460, 5, '#ff4560')}`)}
        ${ly(.5, 8, `${paper(chair(200, 450, 1.6) + officer(190, 400, 1.9))}${paper(chair(610, 450, 1.6) + officer(610, 400, 1.9))}`)}
        ${ly(.9, 12, `<g class="shake">${paper(chair(400, 480, 1.9))}${paper(person(400, 446, 2.5, '#14101f', false, '#e8e8f0', '#2a1d10'))}</g><g class="blink" style="--b:1.2s"><circle cx="388" cy="334" r="4" fill="#fff"/><circle cx="412" cy="334" r="4" fill="#fff"/></g><path d="M388,356 Q400,346 412,356" stroke="#7a1f2c" stroke-width="3" fill="none"/><path d="M376,300 q-10,-14 -4,-26 M424,300 q10,-14 4,-26" stroke="#8ec5ff" stroke-width="3" fill="none"/>`)}`, H),

      final: () => svg('Las tablas del suelo se abren y un corazón enorme late con luz roja',
        `<rect width="800" height="500" fill="#10040a"/>
        ${ly(.1, 3, `<g class="flickfx"><rect width="800" height="500" fill="#9b1c31" opacity=".25"/></g>${rings(400, 290, 6, '#ff4560', true)}`)}
        ${ly(.4, 9, `<g class="beat frantic">${paper(heart(400, 310, 9.5, '#c0283f'))}</g><g class="glow"><circle cx="400" cy="270" r="220" fill="url(#fireglow)" opacity=".6"/></g>`)}
        ${ly(.8, 13, `${paper(`<polygon points="0,420 180,360 240,500 0,500" fill="#3a2a2a"/><polygon points="800,420 620,360 560,500 800,500" fill="#3a2a2a"/><polygon points="250,500 300,400 360,420 340,500" fill="#4a3a38"/><polygon points="460,500 480,410 540,380 580,500" fill="#4a3a38"/>`)}`)}`, H),

      fin: () => svg('Un corazón rojo entre la niebla, a oscuras, y una vela que tiembla',
        `${sky('skyDungeon')}
        ${ly(.2, 5, `${rings(400, 270, 3, '#ff4560')}<g class="beat">${paper(heart(400, 280, 5, '#8a1a2e'))}</g>`)}
        ${ly(.6, 11, `${candle(120, 470, 1.4)}${candle(680, 470, 1.1)}${fog(440, .35, 90)}${motes(10, '#ffb3bf', 100, 440)}`)}`, H)
    },
    pages: [
      { scene: 'ojo', title: 'Nervioso, ¡pero no loco!',
        text: ['¡Es cierto! Nervioso, muy, muy terriblemente nervioso he estado y estoy; pero ¿por qué dirán que estoy loco? La enfermedad ha aguzado mis sentidos, no los ha destruido ni embotado. Por encima de todo estaba el sentido del oído, agudo. Oía todas las cosas del cielo y de la tierra. Oía muchas cosas del infierno. ¿Cómo, entonces, voy a estar loco? ¡Escuchad! Y observad con cuánta salud, con cuánta calma puedo contaros toda la historia.',
          'Es imposible decir cómo la idea entró por primera vez en mi cerebro; pero una vez concebida, me obsesionó día y noche. Motivo no había ninguno. Pasión no había ninguna. Yo quería al viejo. Nunca me había hecho daño. Nunca me había insultado. Su oro no lo codiciaba. ¡Creo que fue su ojo! ¡Sí, fue eso! Tenía el ojo de un buitre: un ojo azul pálido, cubierto por un velo. Siempre que caía sobre mí, se me helaba la sangre; y así, poco a poco —muy gradualmente— me decidí a quitarle la vida al viejo, y librarme así del ojo para siempre.'],
        word: ['Obsesión', 'Una idea fija que nos persigue todo el tiempo y no nos deja pensar en otra cosa.'] },
      { scene: 'puerta', title: 'Siete noches a medianoche',
        text: ['Ahora, este es el punto. Vosotros me creéis loco. Los locos no saben nada. Pero tendríais que haberme visto. ¡Tendríais que haber visto con qué sabiduría procedí, con qué cautela, con qué previsión, con qué {{disimulo|Fingir que no pasa nada para ocultar lo que uno piensa o hace.}} me puse a la obra! Nunca fui más amable con el viejo que durante toda la semana antes de matarlo.',
          'Y cada noche, hacia la medianoche, giraba el picaporte de su puerta y la abría —¡oh, tan suavemente! Y entonces, cuando había hecho una abertura suficiente para mi cabeza, introducía una {{linterna sorda|Linterna con una pantalla que se puede cerrar: solo deja salir un rayo fino cuando se abre un poco.}}, toda cerrada, cerrada, de modo que no saliera luz alguna, y luego metía la cabeza. ¡Oh, os habríais reído de ver con cuánta astucia la metía! La movía lentamente —muy, muy lentamente— para no perturbar el sueño del viejo. Me llevaba una hora colocar toda mi cabeza dentro de la abertura, hasta poder verlo tendido en su cama. ¡Ja! ¿Habría sido tan sabio un loco?',
          'Y entonces, cuando tenía la cabeza bien dentro de la habitación, destapaba la linterna con cautela —oh, tan cautelosamente— cautelosamente (porque las bisagras crujían)— la destapaba justo lo suficiente para que un solo rayo delgado cayera sobre el ojo de buitre. Y esto lo hice durante siete largas noches —cada noche justo a medianoche— pero siempre encontré el ojo cerrado; y así era imposible hacer el trabajo; porque no era el viejo quien me atormentaba, sino su Mal de Ojo.',
          'Y cada mañana, al despuntar el día, entraba osadamente en la habitación y le hablaba con valor, llamándolo por su nombre en tono cordial e interesándome por cómo había pasado la noche. Así que ya veis: tendría que haber sido un viejo muy profundo, en verdad, para sospechar que cada noche, justo a las doce, yo lo miraba mientras dormía.'] },
      { scene: 'cama', title: 'La octava noche',
        text: ['En la octava noche fui más cauteloso que de costumbre al abrir la puerta. El minutero de un reloj se mueve más deprisa que lo hacía mi mano. Nunca antes de aquella noche había sentido la medida de mis propias fuerzas, de mi {{sagacidad|Astucia e inteligencia para darse cuenta de las cosas y salirse con la suya.}}. Apenas podía contener mis sentimientos de triunfo. Pensar que allí estaba yo, abriendo la puerta poco a poco, y él sin soñar siquiera con mis actos o pensamientos secretos. Casi me reí entre dientes de la idea; y quizá me oyó; porque se movió en la cama de repente, como asustado.',
          'Ahora podéis pensar que retrocedí —pero no. Su habitación estaba negra como la pez, con la espesa oscuridad (pues los {{postigos|Hojas de madera que se cierran por dentro de una ventana.}} estaban bien cerrados, por miedo a los ladrones), y así supe que no podía ver la abertura de la puerta, y seguí empujándola con firmeza, con firmeza.',
          'Tenía la cabeza dentro y estaba a punto de abrir la linterna, cuando mi pulgar resbaló sobre el cierre de hojalata, y el viejo se incorporó de un salto en la cama, gritando:',
          '—¿Quién anda ahí?',
          'Me quedé muy quieto y no dije nada. Durante una hora entera no moví un músculo, y entretanto no le oí acostarse. Seguía sentado en la cama, escuchando; tal como yo había hecho, noche tras noche, escuchando los relojes de la muerte en la pared.'] },
      { scene: 'gemido', title: 'La sombra de la Muerte',
        text: ['Enseguida oí un leve gemido, y supe que era el gemido del terror mortal. No era un gemido de dolor ni de pena —¡oh, no!— era el sonido bajo y ahogado que sube del fondo del alma cuando está sobrecargada de espanto. Conocía bien ese sonido. Muchas noches, justo a medianoche, cuando todo el mundo dormía, ha brotado de mi propio pecho, ahondando, con su eco espantoso, los terrores que me distraían. Digo que lo conocía bien. Sabía lo que sentía el viejo, y me compadecía de él, aunque me reía en mi interior. Sabía que había estado despierto desde el primer ruidito, cuando se volvió en la cama.',
          'Sus miedos habían ido creciendo desde entonces. Había tratado de imaginar que no tenían causa, pero no pudo. Se había estado diciendo: «No es más que el viento en la chimenea; es solo un ratón cruzando el suelo», o «Es simplemente un grillo que ha dado un solo chirrido». Sí, había estado tratando de consolarse con estas suposiciones; pero había comprobado que todo era en vano. En vano; porque la Muerte, al acercarse a él, había avanzado con su negra sombra por delante, y había envuelto a la víctima. Y era la influencia lúgubre de la sombra no percibida la que le hacía sentir —aunque ni veía ni oía— sentir la presencia de mi cabeza dentro de la habitación.'],
        think: ['¿Por qué crees que el narrador dice que conocía bien ese gemido, «porque brotaba de su propio pecho»?', 'Porque él también sentía ese mismo miedo en las noches. Poe sugiere que el narrador no es tan distinto de su víctima: también está aterrado.'] },
      { scene: 'rayo', title: 'El ojo se abre',
        text: ['Cuando hube esperado mucho tiempo, con gran paciencia, sin oírlo acostarse, resolví abrir un poco —una muy, muy pequeña rendija— en la linterna. Así que la abrí —no podéis imaginar con qué sigilo, sigilo— hasta que, por fin, un solo rayo tenue, como el hilo de la araña, salió disparado de la rendija y cayó de lleno sobre el ojo de buitre.',
          'Estaba abierto —abierto de par en par— y me enfurecí al mirarlo. Lo veía con perfecta nitidez —todo de un azul opaco, con un velo horrible encima que me helaba hasta la médula de los huesos; pero no podía ver nada más del rostro ni de la persona del viejo: porque había dirigido el rayo, como por instinto, precisamente sobre el maldito punto.',
          '¿Y no os he dicho que lo que confundís con locura no es sino exceso de agudeza de los sentidos? Ahora, digo, llegó a mis oídos un sonido bajo, sordo, rápido, como el que hace un reloj envuelto en algodón. También conocía bien aquel sonido. Era el latido del corazón del viejo. Aumentó mi furia, como el redoble de un tambor estimula al soldado a la valentía.'] },
      { scene: 'latido', title: 'Más fuerte, más fuerte',
        text: ['Pero aun así me contuve y permanecí quieto. Apenas respiraba. Mantuve la linterna inmóvil. Intenté ver con qué firmeza podía mantener el rayo sobre el ojo. Entretanto el infernal tamborileo del corazón aumentaba. Se hacía más rápido y más rápido, y más fuerte y más fuerte a cada instante. ¡El terror del viejo debía de ser extremo! ¡Se hacía más fuerte, digo, más fuerte a cada momento! ¿Me entendéis bien? Os he dicho que soy nervioso: lo soy.',
          'Y ahora, en plena hora muerta de la noche, en medio del espantoso silencio de aquella vieja casa, un ruido tan extraño como ese me excitaba hasta un terror incontrolable. Con todo, durante unos minutos más me contuve y permanecí quieto. ¡Pero el latido se hacía más fuerte, más fuerte! Pensé que el corazón iba a estallar. Y entonces una nueva ansiedad se apoderó de mí: ¡el sonido sería oído por algún vecino! ¡La hora del viejo había llegado!',
          'Con un grito fuerte, abrí del todo la linterna y salté a la habitación. Chilló una vez —una sola vez. En un instante lo arrastré al suelo y le eché encima la pesada cama. Entonces sonreí alegremente, al ver el hecho tan avanzado. Pero, durante muchos minutos, el corazón siguió latiendo con un sonido apagado. Esto, sin embargo, no me molestó; no se oiría a través de la pared. Por fin cesó. El viejo estaba muerto. Aparté la cama y examiné el cadáver. Sí, estaba muerto como una piedra, como una piedra. Puse la mano sobre el corazón y la mantuve allí muchos minutos. No había pulsación. Estaba muerto como una piedra. Su ojo no volvería a molestarme.'] },
      { scene: 'tablas', title: 'Tres tablas',
        text: ['Si aún me creéis loco, dejaréis de creerlo cuando os describa las sabias precauciones que tomé para ocultar el cuerpo. La noche declinaba, y trabajé deprisa, pero en silencio. Ante todo descuarticé el cadáver. Le corté la cabeza y los brazos y las piernas.',
          'Luego levanté tres tablas del suelo de la habitación y deposité todo entre las {{vigas|Maderos gruesos que sostienen un suelo o un techo.}}. Luego volví a colocar los tablones tan hábilmente, tan astutamente, que ningún ojo humano —ni siquiera el suyo— habría podido detectar nada raro. No había nada que lavar —ninguna mancha de ninguna clase— ni gota de sangre alguna. Había sido demasiado cauteloso para eso. Una tina lo había recogido todo. ¡Ja, ja!'] },
      { scene: 'policia', title: 'Llaman a la puerta',
        text: ['Cuando hube terminado estas labores, eran las cuatro —todavía oscuro como la medianoche. Cuando la campana dio la hora, llamaron a la puerta de la calle. Bajé a abrir con el corazón ligero —pues ¿qué tenía ya que temer? Entraron tres hombres, que se presentaron, con perfecta suavidad, como agentes de policía. Un vecino había oído un grito durante la noche; había surgido la sospecha de algún crimen; se había presentado una denuncia en la oficina de policía, y ellos (los agentes) habían sido comisionados para registrar el local.',
          'Sonreí —pues ¿qué tenía que temer? Di la bienvenida a los caballeros. El grito, dije, había sido mío, en un sueño. El viejo, mencioné, estaba ausente, en el campo. Llevé a mis visitantes por toda la casa. Les dije que registraran —que registraran bien. Los conduje, por último, a su habitación. Les mostré sus tesoros, seguros, intactos. En el entusiasmo de mi confianza, traje sillas a la habitación y les pedí que descansaran allí de sus fatigas, mientras yo mismo, en la salvaje audacia de mi perfecto triunfo, colocaba mi propio asiento justo sobre el lugar bajo el cual reposaba el cadáver de la víctima.'] },
      { scene: 'sonido', title: 'El zumbido',
        text: ['Los agentes estaban satisfechos. Mi actitud los había convencido. Yo estaba singularmente tranquilo. Se sentaron, y mientras yo respondía alegremente, charlaron de cosas familiares. Pero, al poco rato, me sentí palidecer y deseé que se marcharan. Me dolía la cabeza y me imaginé un zumbido en los oídos: pero ellos seguían sentados y seguían charlando. El zumbido se hizo más distinto: continuó y se hizo más distinto; hablé con más soltura para librarme de la sensación; pero continuó y fue cobrando nitidez, hasta que, por fin, descubrí que el ruido no estaba dentro de mis oídos.',
          'Sin duda me puse entonces muy pálido; pero hablé con más fluidez, y con voz exaltada. Sin embargo el sonido aumentaba, ¿y qué podía hacer? Era un sonido bajo, sordo, rápido, muy parecido al que hace un reloj envuelto en algodón. Jadeé buscando aire, y sin embargo los agentes no lo oían. Hablé más deprisa, más vehementemente; pero el ruido aumentaba sin cesar. Me levanté y discutí sobre nimiedades, en tono agudo y con violentas gesticulaciones; pero el ruido aumentaba sin cesar. ¿Por qué no se marchaban? Recorrí el suelo de un lado a otro con pasos pesados, como excitado hasta la furia por las observaciones de los hombres; pero el ruido aumentaba sin cesar. ¡Oh Dios! ¿Qué podía hacer? ¡Eché espuma, desvarié, juré! Hice girar la silla en que había estado sentado y la arrastré sobre las tablas, pero el ruido se alzaba sobre todo y aumentaba continuamente. ¡Se hacía más fuerte, más fuerte, más fuerte!'] },
      { scene: 'final', title: '¡Aquí, aquí!',
        text: ['Y los hombres seguían charlando agradablemente, y sonreían. ¿Era posible que no lo oyeran? ¡Dios Todopoderoso! ¡No, no! ¡Lo oían! ¡Sospechaban! ¡Lo sabían! ¡Se estaban burlando de mi horror! Esto pensé, y esto pienso. ¡Pero cualquier cosa era mejor que aquella agonía! ¡Cualquier cosa era más tolerable que aquella burla! ¡No podía soportar más aquellas sonrisas hipócritas! ¡Sentí que debía gritar o morir! Y ahora… ¡otra vez! ¡Escuchad! ¡Más fuerte! ¡Más fuerte! ¡Más fuerte! ¡<i>Más fuerte</i>!',
          '—¡Villanos! —chillé—. ¡No disimulen más! ¡Admito el hecho! ¡Levanten las tablas! ¡Aquí, aquí! ¡Es el latido de su espantoso corazón!'],
        think: ['¿De quién crees que era realmente el latido que se oía?', 'Poe lo deja abierto: puede ser el del viejo, o el del propio narrador, que no soporta su culpa. Por eso el cuento se llama «el corazón delator»: el que delata.'] }
    ],
    quiz: [
      { q: '¿Qué era lo que el narrador quería quitarse de encima?', o: ['El oro del viejo', 'El ojo de buitre del viejo', 'La casa del viejo'], a: 1, ok: '¡Exacto! «No era el viejo quien me atormentaba, sino su Mal de Ojo.»', no: 'Decía que no codiciaba su oro: lo que no soportaba era su ojo, azul pálido y con un velo.' },
      { q: '¿Qué hizo caer al narrador delante de los agentes?', o: ['Que encontraron el cuerpo', 'Un sonido que solo él oía, el latido', 'Que el viejo apareció vivo'], a: 1, ok: '¡Correcto! El latido creció hasta hacerle confesar.', no: 'Fue un sonido, como el de un reloj envuelto en algodón, que solo él oía.' },
      { q: '¿Qué enseña, en el fondo, este cuento?', o: ['Que los vecinos siempre oyen todo', 'Que la conciencia culpable puede delatarnos', 'Que los viejos duermen poco'], a: 1, ok: '¡Muy bien! La culpa no necesita testigos.', no: 'Piensa en el título: el corazón «delator» es el que nos acusa por dentro.' }
    ]
  });
})();
