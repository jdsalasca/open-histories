/* open-histories · kit.js
 * Piezas de cartón recortado (SVG) para armar dioramas. Todo es determinista:
 * el lector llama a K.reseed(n) antes de dibujar cada escena.
 * Convención: lienzo 800×500; las capas se arman de atrás hacia delante con K.ly().
 */
(function (global) {
  'use strict';
  let seed = 7;
  const R = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const reseed = n => { seed = (n | 0) || 7; };
  const hash = s => { let h = 7; for (const c of s) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0; return h; };

  /* una sola mano de papel: sombra cercana o lejana; los bordes "hierven" a pasos (lo mueve el lector) */
  const paper = (s, far = false) => `<g filter="url(#${far ? 'paperFar' : 'paper'})">${s}</g>`;
  /* capa del diorama: d = retraso de armado (s), k = parallax con el cursor */
  const ly = (d, k, s) => { const b = k <= 3 ? .9 : k <= 5 ? .5 : 0; return `<g class="ly" style="--d:${d}s"><g class="par" style="--k:${k}${b ? `;filter:blur(${b}px)` : ''}">${s}</g></g>`; };

  const starPts = (x, y, ro, ri) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? ri : ro; p.push((x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1)); } return p.join(' '); };
  const star = (x, y, r, c = '#fff3b0', d = 0) => `<polygon class="tw" style="animation-duration:${(3 + R() * 4).toFixed(1)}s;animation-delay:-${d.toFixed(2)}s" fill="${c}" points="${starPts(x, y, r, r * .45)}"/>`;
  const stars = (n, y0, y1, x0 = 0, x1 = 800) => Array.from({ length: n }, () => star(x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), 2.5 + R() * 4.5, R() > .75 ? '#ffd36b' : '#fff3b0', R() * 5)).join('');

  const wave = (y, amp, col, sd = 0, ph = 1, step = 80) => {
    const P = []; for (let x = -step; x <= 800 + step; x += step) P.push([x, y + amp * Math.sin(x / 110 * ph + sd) + (R() - .5) * amp * .5]);
    let d = `M${P[0][0]},520 L${P[0][0]},${P[0][1].toFixed(1)}`;
    for (let i = 1; i < P.length - 1; i++) { const m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2]; d += ` Q${P[i][0]},${P[i][1].toFixed(1)} ${m[0]},${m[1].toFixed(1)}`; }
    return `<path d="${d} L${P[P.length - 1][0]},520 Z" fill="${col}"/>`;
  };
  const cloud = (x, y, s = 1, c = '#d3dcf4') => `<g transform="translate(${x},${y}) scale(${s})" fill="${c}"><ellipse cx="0" cy="0" rx="62" ry="20"/><ellipse cx="-28" cy="-12" rx="30" ry="20"/><ellipse cx="16" cy="-19" rx="35" ry="25"/></g>`;
  const moon = (x, y, r) => `<g class="glow"><circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="#fff3c4" opacity=".12"/><circle cx="${x}" cy="${y}" r="${r * 1.35}" fill="#fff3c4" opacity=".2"/></g>${paper(`<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf0c9"/><circle cx="${x - r * .25}" cy="${y - r * .2}" r="${r * .16}" fill="#efe0a8"/><circle cx="${x + r * .28}" cy="${y + r * .25}" r="${r * .11}" fill="#efe0a8"/>`, true)}`;
  const sun = (x, y, r, c = '#ffe08a') => `<g class="glow"><circle cx="${x}" cy="${y}" r="${r * 1.8}" fill="${c}" opacity=".25"/></g>${paper(`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`, true)}`;
  const heart = (x, y, s, fill) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,10 C-16,-4 -26,-18 -13,-27 C-6,-31 0,-25 0,-20 C0,-25 6,-31 13,-27 C26,-18 16,-4 0,10 Z" fill="${fill}"/></g>`;
  const snowflakes = (n, rmin, rmax, t0, t1) => Array.from({ length: n }, () => `<circle class="snow" style="animation-duration:${(t0 + R() * (t1 - t0)).toFixed(1)}s;animation-delay:-${(R() * 10).toFixed(1)}s" cx="${(R() * 800).toFixed(0)}" cy="0" r="${(rmin + R() * (rmax - rmin)).toFixed(1)}" fill="#fff" opacity=".9"/>`).join('');

  /* ── edificios y decorado ── */
  const house = (x, y, w, h, wall, roof, lit = true) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wall}"/><polygon points="${x - 6},${y - h} ${x + w / 2},${y - h - w * .5} ${x + w + 6},${y - h}" fill="${roof}"/><rect x="${x + w * .16}" y="${y - h * .72}" width="${w * .24}" height="${h * .3}" fill="${lit ? '#ffd36b' : '#59607e'}"/><rect x="${x + w * .6}" y="${y - h * .72}" width="${w * .24}" height="${h * .3}" fill="${lit ? '#ffd36b' : '#59607e'}"/>`;
  const cottage = (x, y, s, wall = '#f3e2c2', roof = '#a8503c', lit = true) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-60" y="-70" width="120" height="70" fill="${wall}"/><polygon points="-72,-70 0,-128 72,-70" fill="${roof}"/><rect x="30" y="-118" width="14" height="30" fill="#7a4a2c"/><rect x="-14" y="-46" width="28" height="46" rx="3" fill="#8b5a2b"/><rect x="-50" y="-56" width="24" height="24" fill="${lit ? '#ffd36b' : '#59607e'}"/><rect x="26" y="-56" width="24" height="24" fill="${lit ? '#ffd36b' : '#59607e'}"/><path d="M-38,-56 V-32 M-50,-44 H-26 M38,-56 V-32 M26,-44 H50" stroke="#7a4a2c" stroke-width="2"/></g>`;
  const fence = (x, y, w, col = '#e9d8b4') => { let s = `<rect x="${x}" y="${y - 22}" width="${w}" height="5" fill="${col}"/><rect x="${x}" y="${y - 10}" width="${w}" height="5" fill="${col}"/>`; for (let i = 0; i <= w; i += 16) s += `<polygon points="${x + i},${y} ${x + i},${y - 34} ${x + i + 5},${y - 40} ${x + i + 10},${y - 34} ${x + i + 10},${y}" fill="${col}"/>`; return s; };
  const tree = (x, y, s, leaf = '#5fae5a', trunk = '#7a5230', blossom = '') => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-7" y="-70" width="14" height="70" fill="${trunk}"/><circle cx="0" cy="-100" r="42" fill="${leaf}"/><circle cx="-30" cy="-78" r="28" fill="${leaf}"/><circle cx="30" cy="-80" r="28" fill="${leaf}"/>${blossom ? [[-20, -110], [10, -125], [30, -92], [-34, -80], [0, -86], [18, -108]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${blossom}"/>`).join('') : ''}</g>`;
  const pine = (x, y, s, col = '#2f6b4f') => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-6" y="-24" width="12" height="24" fill="#6b4626"/><polygon points="-40,-20 0,-78 40,-20" fill="${col}"/><polygon points="-32,-58 0,-108 32,-58" fill="${col}"/><polygon points="-24,-92 0,-136 24,-92" fill="${col}"/></g>`;
  const bush = (x, y, s, col = '#4f9a54') => `<g transform="translate(${x},${y}) scale(${s})" fill="${col}"><ellipse cx="0" cy="-18" rx="34" ry="22"/><ellipse cx="-26" cy="-10" rx="22" ry="14"/><ellipse cx="26" cy="-10" rx="22" ry="14"/></g>`;
  const flower = (x, y, col = '#e58b94', s = 1) => `<g class="sway" style="animation-delay:-${(R() * 3).toFixed(1)}s"><path d="M${x},${y} L${x},${y - 30 * s}" stroke="#4f8f4a" stroke-width="3"/><circle cx="${x}" cy="${y - 34 * s}" r="${9 * s}" fill="${col}"/><circle cx="${x}" cy="${y - 34 * s}" r="${3.6 * s}" fill="#f2a22e"/></g>`;
  const flowers = (n, y0, y1, cols = ['#e58b94', '#f7d878', '#fff', '#b79af2']) => Array.from({ length: n }, (_, i) => flower(20 + R() * 760, y0 + R() * (y1 - y0), cols[i % cols.length], .8 + R() * .5)).join('');
  const win = (x, y, w, h, lit = true) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${lit ? '#ffd36b' : '#1d2a5c'}"/><path d="M${x + w / 2},${y} V${y + h} M${x},${y + h / 2} H${x + w}" stroke="#7a4a2c" stroke-width="3"/>`;

  /* ── personas y animales ── */
  const person = (x, y, s, body, arms = false, skin = '#f2c9a0', hair = '#4a2f1d', d = 0) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-15,0 L-10,-36 L10,-36 L15,0 Z" fill="${body}"/>${arms ? `<path class="armsup" style="animation-delay:-${d}s" d="M-10,-33 L-24,-62 L-18,-64 L-5,-38Z M10,-33 L24,-62 L18,-64 L5,-38Z" fill="${skin}"/>` : ''}<circle cx="0" cy="-48" r="12" fill="${skin}"/><path d="M-12,-50 A12,12 0 0 1 12,-50 Q0,-59 -12,-50Z" fill="${hair}"/><g class="blink" style="--b:${(4 + R() * 3).toFixed(1)}s;animation-delay:-${(R() * 4).toFixed(1)}s"><circle cx="-4" cy="-47" r="1.7" fill="#2a1d10"/><circle cx="4" cy="-47" r="1.7" fill="#2a1d10"/></g></g>`;
  /* niña con caperuza roja; basket = true lleva cesta */
  const hood = (x, y, s, basket = true, flip = 1) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})"><path d="M-16,0 L-11,-40 L11,-40 L16,0 Z" fill="#f4eee0"/><path d="M-14,-18 L0,-40 L14,-18 Z" fill="#c0283f"/><circle cx="0" cy="-52" r="12" fill="#f2c9a0"/><path d="M-17,-48 Q-18,-72 0,-72 Q18,-72 17,-48 Q8,-60 0,-60 Q-8,-60 -17,-48Z" fill="#c0283f"/><circle class="blink" style="--b:${(4 + R() * 3).toFixed(1)}s" cx="3" cy="-52" r="1.7" fill="#3a2a1a"/>${basket ? `<path d="M14,-14 Q22,-30 30,-14 Z" fill="none" stroke="#8b5a2b" stroke-width="2.5"/><rect x="12" y="-14" width="22" height="14" rx="3" fill="#c58a52"/><rect x="14" y="-17" width="18" height="6" fill="#fff"/>` : ''}</g>`;
  const rabbit = (x, y, s, fur = '#b9926a', o = {}) => `<g transform="translate(${x},${y}) scale(${(o.flip || 1) * s},${s})">
    <ellipse cx="0" cy="-22" rx="26" ry="20" fill="${fur}"/>
    ${o.coat ? `<path d="M-24,-22 Q-20,-44 6,-42 L10,-6 Q-18,-4 -24,-22Z" fill="#2e5fbf"/><circle cx="-6" cy="-24" r="2.4" fill="#f7d878"/><circle cx="-6" cy="-14" r="2.4" fill="#f7d878"/>` : ''}
    <circle cx="-30" cy="-16" r="8" fill="#fff"/>
    <circle cx="22" cy="-40" r="14" fill="${fur}"/>
    <g class="twitch" style="animation-delay:-${(R() * 6).toFixed(1)}s"><ellipse cx="14" cy="-72" rx="5" ry="20" fill="${fur}" transform="rotate(-10 14 -72)"/><ellipse cx="14" cy="-72" rx="2.2" ry="14" fill="#f2b6b0" transform="rotate(-10 14 -72)"/></g><ellipse cx="26" cy="-72" rx="5" ry="20" fill="${fur}" transform="rotate(12 26 -72)"/>
    <circle class="blink" style="--b:${(4 + R() * 3).toFixed(1)}s" cx="27" cy="-43" r="2.4" fill="#3a2a1a"/><circle cx="35" cy="-37" r="2.4" fill="#e58b94"/>
    <ellipse cx="10" cy="-2" rx="12" ry="5" fill="${fur}"/>
  </g>`;
  const wolf = (x, y, s, flip = 1, col = '#6b7080') => `<g transform="translate(${x},${y}) scale(${s * flip},${s})">
    <ellipse cx="0" cy="-34" rx="44" ry="26" fill="${col}"/>
    <rect x="-34" y="-20" width="12" height="20" fill="${col}"/><rect x="18" y="-20" width="12" height="20" fill="${col}"/>
    <path d="M-44,-44 Q-72,-70 -66,-30 Q-56,-40 -44,-34Z" fill="${col}"/>
    <ellipse cx="42" cy="-56" rx="22" ry="17" fill="${col}"/>
    <polygon points="56,-58 86,-46 58,-42" fill="${col}"/><polygon points="86,-46 80,-38 66,-42" fill="#f4eee0"/>
    <polygon points="30,-70 36,-92 46,-68" fill="${col}"/><polygon points="40,-70 52,-88 54,-66" fill="#4f5463"/>
    <circle cx="48" cy="-58" r="3" fill="#ffd36b"/><circle cx="48.5" cy="-58" r="1.3" fill="#111"/>
    <path d="M60,-44 L64,-38 L68,-44 L72,-38 L76,-44" fill="#fff" stroke="#fff"/>
  </g>`;
  const bird = (x, y, s = 1, col = '#4d78d0') => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="12" ry="8" fill="${col}"/><circle cx="10" cy="-5" r="6" fill="${col}"/><polygon points="15,-5 22,-3 15,-1" fill="#f0a23a"/><polygon points="-10,0 -24,-6 -20,4" fill="${col}"/><circle cx="12" cy="-6" r="1.4" fill="#fff"/><g class="wing"><path d="M-2,-4 Q-6,-18 -16,-16 Q-8,-8 -2,-2Z" fill="#2a4388"/></g></g>`;
  const swallow = (x, y, s = 1, flip = 1, cls = '', rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s * flip},${s})"><g class="${cls}" filter="url(#paperFar)">
 <path d="M-30,-3 L-56,-12 L-44,0 L-58,10 L-28,6 Z" fill="#1f2f66"/>
 <ellipse cx="0" cy="0" rx="28" ry="12" fill="#2a4388"/>
 <ellipse cx="7" cy="5" rx="17" ry="6.5" fill="#f6e7c8"/>
 <circle cx="23" cy="-6" r="10" fill="#2a4388"/>
 <path d="M18,-2 Q24,5 30,-1 Q26,1 18,-2Z" fill="#c0283f"/>
 <path d="M31,-7 L43,-3 L31,-1 Z" fill="#f0a23a"/>
 <circle cx="25" cy="-9" r="2.4" fill="#fff"/><circle cx="25.6" cy="-9" r="1.2" fill="#111"/>
 <g class="wing"><path d="M-4,-7 C-8,-34 -30,-46 -52,-38 C-36,-30 -20,-16 -4,-4 Z" fill="#1a2a5c"/></g>
</g></g>`;


  /* ── ambiente: motas, niebla, haces de luz, velas ── */
  const motes = (n, col = '#ffe9a8', y0 = 40, y1 = 460, x0 = 0, x1 = 800) => Array.from({ length: n }, () => { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0); return `<circle class="mote" style="--t:${(7 + R() * 8).toFixed(1)}s;--dx:${((R() - .5) * 80).toFixed(0)}px;--dy:${(-20 - R() * 60).toFixed(0)}px;animation-delay:-${(R() * 12).toFixed(1)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.4 + R() * 2.4).toFixed(1)}" fill="${col}"/>`; }).join('');
  const fog = (y, op = .25, h = 70) => `<g class="fog" style="opacity:${op}"><ellipse cx="160" cy="${y}" rx="260" ry="${h / 2}" fill="url(#fogg)"/><ellipse cx="560" cy="${y + 8}" rx="300" ry="${h / 2}" fill="url(#fogg)"/><ellipse cx="820" cy="${y - 6}" rx="240" ry="${h / 2}" fill="url(#fogg)"/></g>`;
  const beams = (x, y, n = 3, w = 90, len = 420) => Array.from({ length: n }, (_, i) => `<polygon class="beam" style="animation-delay:-${(i * 1.7).toFixed(1)}s" points="${x + i * 40},${y} ${x + i * 40 + w},${y} ${x + i * 40 + w * 2.2},${y + len} ${x + i * 40 - w * .6},${y + len}" fill="url(#beamg)"/>`).join('');
  const candle = (x, y, s = 1, lit = true) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-7" y="-46" width="14" height="46" rx="3" fill="#f4eee0"/><rect x="-7" y="-46" width="5" height="46" rx="2" fill="#fff"/><path d="M-7,-46 q3,10 7,2 q4,8 7,-2" fill="#f4eee0"/><rect x="-1" y="-54" width="2" height="9" fill="#3a2a1a"/>${lit ? `<g class="flick"><circle cx="0" cy="-66" r="30" fill="url(#fireglow)"/><path d="M0,-52 Q-8,-62 0,-80 Q8,-62 0,-52Z" fill="#ffb347"/><path d="M0,-54 Q-4,-62 0,-72 Q4,-62 0,-54Z" fill="#fff0a8"/></g>` : ''}</g>`;
  const lantern = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-14" y="-36" width="28" height="36" rx="4" fill="#4a4a58"/><rect x="-9" y="-30" width="18" height="24" fill="#ffd36b"/><path d="M-10,-36 q10,-14 20,0" fill="none" stroke="#4a4a58" stroke-width="4"/><circle class="flick" cx="0" cy="-18" r="34" fill="url(#fireglow)"/></g>`;

  /* ── terror ── */
  const pumpkin = (x, y, s = 1, lit = true) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-30" rx="46" ry="34" fill="#e8742a"/><ellipse cx="-26" cy="-30" rx="22" ry="32" fill="#f08a3c"/><ellipse cx="26" cy="-30" rx="22" ry="32" fill="#f08a3c"/><ellipse cx="0" cy="-30" rx="16" ry="34" fill="#d9621f"/><path d="M-4,-62 q-2,-14 8,-18 l4,4 q-6,4 -4,14Z" fill="#4f6b2a"/>${lit ? `<g class="flick"><polygon points="-26,-40 -12,-40 -19,-24" fill="#ffd36b"/><polygon points="12,-40 26,-40 19,-24" fill="#ffd36b"/><path d="M-28,-14 L-18,-22 L-10,-12 L0,-22 L10,-12 L18,-22 L28,-14 L22,-2 L10,-8 L0,-2 L-10,-8 L-22,-2Z" fill="#ffd36b"/><circle cx="0" cy="-28" r="50" fill="url(#fireglow)" opacity=".55"/></g>` : ''}</g>`;
  const bat = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><g class="batfly"><ellipse cx="0" cy="0" rx="7" ry="9" fill="#17122a"/><polygon points="-5,-7 -3,-15 0,-8" fill="#17122a"/><polygon points="5,-7 3,-15 0,-8" fill="#17122a"/><circle cx="-2.4" cy="-2" r="1.2" fill="#ffd36b"/><circle cx="2.4" cy="-2" r="1.2" fill="#ffd36b"/><g class="bwing l"><path d="M-6,-2 Q-24,-22 -42,-4 Q-34,-6 -30,2 Q-24,-4 -20,6 Q-14,0 -6,6Z" fill="#17122a"/></g><g class="bwing r"><path d="M6,-2 Q24,-22 42,-4 Q34,-6 30,2 Q24,-4 20,6 Q14,0 6,6Z" fill="#17122a"/></g></g></g>`;
  const crow = (x, y, s = 1, flip = 1) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})"><ellipse cx="0" cy="-16" rx="22" ry="14" fill="#14111f"/><circle cx="18" cy="-28" r="9" fill="#14111f"/><polygon points="25,-30 40,-26 25,-24" fill="#2a2638"/><polygon points="-18,-14 -42,-8 -20,-4" fill="#14111f"/><circle cx="21" cy="-30" r="1.8" fill="#ffd36b"/><rect x="-4" y="-4" width="3" height="12" fill="#14111f"/><rect x="6" y="-4" width="3" height="12" fill="#14111f"/></g>`;
  const tomb = (x, y, s = 1, kind = 'rip') => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-26,0 V-52 Q0,-84 26,-52 V0Z" fill="#8a8aa0"/><path d="M-26,0 V-52 Q-14,-64 -8,-68 V0Z" fill="#a0a0b6"/>${kind === 'cross' ? `<rect x="-3" y="-60" width="6" height="34" fill="#6a6a80"/><rect x="-12" y="-50" width="24" height="6" fill="#6a6a80"/>` : `<text x="0" y="-36" text-anchor="middle" font-size="13" font-weight="800" fill="#5a5a70" font-family="Playfair Display,serif">R.I.P</text>`}</g>`;
  const web = (x, y, s = 1, flip = 1) => `<g transform="translate(${x},${y}) scale(${s * flip},${s})" stroke="#e8e8f4" stroke-opacity=".6" stroke-width="1.3" fill="none"><path d="M0,0 L120,0 M0,0 L0,120 M0,0 L90,90"/><path d="M30,0 Q14,14 0,30 M60,0 Q34,34 0,60 M90,0 Q54,54 0,90 M120,0 Q70,70 0,120"/></g>`;
  const ghost = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><g class="ghostfloat"><path d="M-34,0 V-46 Q-34,-84 0,-84 Q34,-84 34,-46 V0 Q26,-12 18,0 Q9,-12 0,0 Q-9,-12 -18,0 Q-26,-12 -34,0Z" fill="#f4f4ff" opacity=".92"/><ellipse cx="-11" cy="-50" rx="5" ry="8" fill="#1d1a33"/><ellipse cx="11" cy="-50" rx="5" ry="8" fill="#1d1a33"/><ellipse cx="0" cy="-30" rx="6" ry="8" fill="#1d1a33"/></g></g>`;
  /* el ojo de buitre: azul pálido con un velo */
  const vultureEye = (x, y, s = 1, open = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-46,0 Q0,${-40 * open} 46,0 Q0,${40 * open} -46,0Z" fill="#e9eef7"/><circle cx="0" cy="0" r="${22 * open}" fill="#8fb4de"/><circle cx="0" cy="0" r="${22 * open}" fill="#cfe0f3" opacity=".55"/><circle cx="0" cy="0" r="${9 * open}" fill="#10131f"/><circle cx="-5" cy="-5" r="${3 * open}" fill="#fff"/></g>`;
  const clock = (x, y, s = 1, ang = 0) => `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="#f1e6c8"/><circle r="40" fill="none" stroke="#3a2a1a" stroke-width="5"/>${Array.from({ length: 12 }, (_, i) => `<rect x="-1.5" y="-36" width="3" height="${i % 3 ? 5 : 9}" fill="#3a2a1a" transform="rotate(${i * 30})"/>`).join('')}<rect x="-2" y="-30" width="4" height="30" fill="#3a2a1a" transform="rotate(${ang})"/><rect x="-1.5" y="-22" width="3" height="22" fill="#3a2a1a" transform="rotate(${ang * 12})"/><circle r="4" fill="#c0283f"/></g>`;

  /* ── luz y envoltorio ── */
  const lightFx = `<rect width="800" height="500" fill="url(#lightA)" style="mix-blend-mode:soft-light" pointer-events="none"/><rect width="800" height="500" fill="url(#vig)" pointer-events="none"/><rect width="800" height="500" filter="url(#fiber)" opacity=".1" style="mix-blend-mode:multiply" pointer-events="none"/><rect width="800" height="500" filter="url(#grain)" opacity=".2" style="mix-blend-mode:multiply" pointer-events="none"/>`;
  const moodFx = { warm: `<rect width="800" height="500" fill="#ff9a4a" opacity=".08" style="mix-blend-mode:soft-light" pointer-events="none"/>`,
    cold: `<rect width="800" height="500" fill="#5b7bd8" opacity=".12" style="mix-blend-mode:soft-light" pointer-events="none"/>`,
    horror: `<rect width="800" height="500" fill="url(#vigDark)" pointer-events="none"/><rect class="flickfx" width="800" height="500" fill="#7a0f1f" opacity=".1" style="mix-blend-mode:multiply" pointer-events="none"/>` };
  const svg = (label, inner, mood = '') => `<svg viewBox="0 0 800 500" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${inner}${lightFx}${moodFx[mood] || ''}</svg>`;
  const sky = id => `<rect width="800" height="500" fill="url(#${id})"/>`;

  /* filtros y degradados compartidos (se inyectan una vez) */
  const grad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((s, i) => `<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')}</linearGradient>`;
  const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="paper" x="-10%" y="-10%" width="122%" height="132%"><feTurbulence class="boil" type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" result="d"/><feColorMatrix in="d" values="0 0 0 0 .04 0 0 0 0 .05 0 0 0 0 .16 0 0 0 .6 0" result="sh"/><feOffset in="sh" dx="1" dy="2" result="o1"/><feGaussianBlur in="o1" stdDeviation=".9" result="b1"/><feOffset in="sh" dx="4" dy="10" result="o2"/><feGaussianBlur in="o2" stdDeviation="6" result="b2"/><feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="d"/></feMerge></filter>
    <filter id="paperFar" x="-8%" y="-8%" width="118%" height="125%"><feTurbulence class="boil" type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d"/><feDropShadow in="d" dx="1" dy="2" stdDeviation="1.6" flood-color="#0c1030" flood-opacity=".38"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/><feColorMatrix type="saturate" values="0"/></filter>
    <filter id="fiber" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .22" numOctaves="3" seed="2"/><feColorMatrix type="saturate" values="0"/></filter>
    <linearGradient id="lightA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4d6" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000a30" stop-opacity=".55"/></linearGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#0a0520" stop-opacity="0"/><stop offset="1" stop-color="#0a0520" stop-opacity=".42"/></radialGradient>
    <radialGradient id="fogg"><stop offset="0" stop-color="#f4f0ff" stop-opacity=".9"/><stop offset="1" stop-color="#f4f0ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="beamg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4c8" stop-opacity=".85"/><stop offset="1" stop-color="#fff4c8" stop-opacity="0"/></linearGradient>
    <radialGradient id="vigDark" cx=".5" cy=".5" r=".72"><stop offset=".35" stop-color="#05000f" stop-opacity="0"/><stop offset="1" stop-color="#05000f" stop-opacity=".78"/></radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".75"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
    <radialGradient id="blueglow"><stop offset="0" stop-color="#9ecbff" stop-opacity=".9"/><stop offset="1" stop-color="#9ecbff" stop-opacity="0"/></radialGradient>
    <radialGradient id="fireglow"><stop offset="0" stop-color="#ffb347" stop-opacity=".95"/><stop offset="1" stop-color="#ff7a3c" stop-opacity="0"/></radialGradient>
    ${grad('skyNight', [[0, '#121b40'], [1, '#3a4d93']])}
    ${grad('skyDusk', [[0, '#6c5a9c'], [.55, '#e58b94'], [1, '#ffd09a']])}
    ${grad('skyWarm', [[0, '#1c2552'], [.7, '#5a4a8c'], [1, '#e59a7a']])}
    ${grad('skySnow', [[0, '#6b7fa6'], [1, '#d9e2f0']])}
    ${grad('skyHeaven', [[0, '#fff3bf'], [.6, '#ffd9a3'], [1, '#f8b9c6']])}
    ${grad('skyDay', [[0, '#8fd3f4'], [1, '#fdf6d8']])}
    ${grad('skyDawn', [[0, '#9db8e8'], [.6, '#f6c9c0'], [1, '#ffe9b8']])}
    ${grad('skyForest', [[0, '#1f3a34'], [1, '#6aa97c']])}
    ${grad('skyDeep', [[0, '#0b1230'], [1, '#26335f']])}
    ${grad('skyIndoor', [[0, '#f6e2b8'], [1, '#e8c58f']])}
    ${grad('skyBlood', [[0, '#14061a'], [.6, '#3a0f2a'], [1, '#7a1f2c']])}
    ${grad('skyMidnight', [[0, '#05030f'], [1, '#1b1840']])}
    ${grad('skyDungeon', [[0, '#120b16'], [1, '#2b1d2a']])}
  </defs></svg>`;

  global.OH = global.OH || {};
  global.OH.registry = global.OH.registry || {};
  global.OH.story = def => { global.OH.registry[def.id] = def; if (global.OH.onStory) global.OH.onStory(def); };
  global.OH.kit = { R, reseed, hash, paper, ly, star, stars, wave, cloud, moon, sun, heart, snowflakes, house, cottage, fence, tree, pine, bush, flower, flowers, win, person, hood, rabbit, wolf, bird, swallow, svg, sky, lightFx, defs, motes, fog, beams, candle, lantern, pumpkin, bat, crow, tomb, web, ghost, vultureEye, clock };
})(window);
