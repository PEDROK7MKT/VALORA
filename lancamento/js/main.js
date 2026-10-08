/* =====================================================================
   VALORA SUISSE · Loading page de lançamento
   JS puro, sem dependências. Cada bloco roda isolado: se um falhar,
   os outros continuam funcionando (ver `safely` no fim do arquivo).
   ===================================================================== */
import { CONFIG } from './config.js';

// o JS principal assumiu: desliga a rede de segurança do index.html
window.__mainOk = true;
document.documentElement.classList.replace('no-js', 'js');

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const root = document.documentElement;
const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
// Dia da abertura, sem horário: [ano, mês 1–12, dia]
const LAUNCH_DAY = (/^(\d{4})-(\d{2})-(\d{2})$/.exec(CONFIG.launchDate || '') || []).slice(1).map(Number);
const UA = navigator.userAgent || '';
const IN_APP = /Instagram|FBAN|FBAV|FB_IAB/i.test(UA);
// dentro de uma moldura (iframe, prévias): downloads e Web Share costumam ser bloqueados
const IN_FRAME = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

// ?slow=5 deixa as animações 5× mais lentas (só para conferir a coreografia)
const SLOW = Math.max(1, Number(new URLSearchParams(location.search).get('slow')) || 1);
const T = (ms) => ms * SLOW;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// localStorage pode não existir ou lançar exceção (aba anônima, WebView restrita)
const store = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* segue sem salvar */ } },
  del(k) { try { window.localStorage.removeItem(k); } catch (e) { /* idem */ } },
};

// "tique" tátil curtinho onde existe (Android); no iOS não faz nada
const haptic = () => { try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) { /* sem suporte */ } };

// curva cúbica (mesma sintaxe do CSS) para as animações feitas quadro a quadro
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
const EASE_OUT = bezier(0.22, 1, 0.36, 1);

/* ---------------------------------------------------------------------
   Medição (opcional) · window.dataLayer + sendBeacon para CONFIG.analyticsEndpoint
   Eventos: intro_view, intro_open{mode,ms}, stone_select{pedra,via},
            cta_click{origem}, lead_submit{canal,pedra}, lead_error, share
   --------------------------------------------------------------------- */
function track(event, data = {}) {
  const payload = { event, ...data, ts: new Date().toISOString() };
  try { (window.dataLayer = window.dataLayer || []).push(payload); } catch (e) { /* ok */ }
  if (CONFIG.analyticsEndpoint && navigator.sendBeacon) {
    try { navigator.sendBeacon(CONFIG.analyticsEndpoint, new Blob([JSON.stringify(payload)], { type: 'text/plain' })); } catch (e) { /* ok */ }
  }
}

/* ---------------------------------------------------------------------
   Datas · só o dia (o horário da abertura ainda não foi confirmado)
   --------------------------------------------------------------------- */
function launchText() {
  if (LAUNCH_DAY.length !== 3) return null;
  try {
    const [y, m, d] = LAUNCH_DAY;
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
  } catch (e) {
    return null;
  }
}

// Dias de calendário até a abertura, pelo relógio do aparelho: cada pessoa
// vê "É hoje" no seu próprio 18 de outubro.
function daysToLaunch() {
  if (LAUNCH_DAY.length !== 3) return NaN;
  const [y, m, d] = LAUNCH_DAY;
  const now = new Date();
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
}

function applyConfig() {
  const t = launchText();
  if (t) $$('.launch-date').forEach((el) => { el.textContent = t; el.dateTime = CONFIG.launchDate; });
  const ig = $('#ig-link');
  if (ig && CONFIG.instagram) {
    ig.href = `https://www.instagram.com/${CONFIG.instagram}/`;
    $('#ig-handle').textContent = `@${CONFIG.instagram}`;
  }
  const shop = $('#cd-shop');
  if (shop) shop.href = CONFIG.shopURL;
}

/* ---------------------------------------------------------------------
   1 · ABERTURA — o lacre
   A aba do envelope desce em "V" até o lacre com 33° de inclinação,
   em qualquer tela. O lacre racha exatamente na borda da aba: a metade
   de cima sobe com a aba, a de baixo sai com o corpo do envelope.
   --------------------------------------------------------------------- */
const AUTO_OPEN_MS = 4500;

// O desenho do envelope (aba a 33°, lacre, dobras) é calculado por um script
// inline no index.html, logo depois do HTML da abertura, para já sair certo no
// primeiro quadro. Aqui ele só é chamado de novo quando a tela muda de tamanho.
const layoutEnvelope = (intro) => { if (typeof window.__valoraLayout === 'function') window.__valoraLayout(intro); };

async function runIntro() {
  const intro = $('#intro');
  if (!intro) return;
  const mode = root.dataset.intro;
  if (!root.classList.contains('intro-on') || !mode) {
    intro.remove();
    return;
  }
  intro.classList.add('is-live'); // desliga a rede de segurança do CSS
  const locks = [$('#main'), $('.footer')].filter(Boolean);
  locks.forEach((el) => { el.inert = true; });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const relayout = () => layoutEnvelope(intro);
  relayout();
  window.addEventListener('resize', relayout);

  let unlocked = false;
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    clearTimeout(hardStop);
    window.removeEventListener('resize', relayout);
    store.set('valora:intro', String(Date.now()));
    const hadFocus = intro.contains(document.activeElement);
    root.classList.remove('intro-on', 'intro-free');
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    locks.forEach((el) => { el.inert = false; });
    intro.remove();
    if (hadFocus) { const h1 = $('#hero-title'); if (h1) h1.focus({ preventScroll: true }); }
    document.dispatchEvent(new CustomEvent('valora:opened'));
  };
  // trava de segurança: aconteça o que acontecer, a página é liberada
  const hardStop = setTimeout(unlock, T(12000));

  // o texto do convite espera a Cormorant itálica (no máximo 0,7 s)
  try { await Promise.race([document.fonts ? document.fonts.load('italic 400 25px "Cormorant Garamond"') : null, wait(700)]); } catch (e) { /* segue */ }
  intro.classList.add('is-ready');
  relayout(); // a altura do texto do convite pode mudar com a fonte certa
  track('intro_view', { mode });

  const t0 = performance.now();
  let opening = false;
  let autoTimer = 0;
  let startY = null;
  const onDown = (e) => { startY = e.clientY; };
  const onMove = (e) => { if (startY !== null && startY - e.clientY > 24) open('swipe'); };
  const onClick = (e) => open(e.pointerType === 'mouse' ? 'click' : 'tap');
  const onWheel = () => open('scroll');
  const onKey = (e) => {
    if (['Enter', ' ', 'Escape', 'ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); open('key'); }
  };
  const detach = () => {
    clearTimeout(autoTimer);
    intro.removeEventListener('pointerdown', onDown);
    intro.removeEventListener('pointermove', onMove);
    intro.removeEventListener('click', onClick);
    intro.removeEventListener('wheel', onWheel);
    document.removeEventListener('keydown', onKey);
  };

  function open(how) {
    if (opening) return;
    opening = true;
    detach();
    track('intro_open', { mode: how, ms: Math.round(performance.now() - t0) });
    if (!['auto', 'short'].includes(how)) haptic();
    openEnvelope(intro, {
      short: how === 'short',
      release: () => { root.classList.add('intro-free'); intro.classList.add('is-releasing'); locks.forEach((el) => { el.inert = false; }); },
    })
      .catch((err) => console.error('[Valora] abertura:', err))
      .finally(unlock);
  }

  if (mode === 'short') {
    await wait(T(160));
    open('short');
    return;
  }
  intro.addEventListener('pointerdown', onDown);
  intro.addEventListener('pointermove', onMove);
  intro.addEventListener('click', onClick);
  intro.addEventListener('wheel', onWheel, { passive: true });
  document.addEventListener('keydown', onKey);
  autoTimer = setTimeout(() => open('auto'), T(AUTO_OPEN_MS));
  // quem navega pelo teclado ou leitor de tela decide quando abrir
  $('#seal', intro).addEventListener('focus', () => clearTimeout(autoTimer), { once: true });
}

async function openEnvelope(intro, { short, release }) {
  const k = short ? 0.7 : 1;
  const d = (ms) => T(ms * k);
  intro.classList.add('is-opening');
  const heroImg = $('.hero-media img');
  const heroReady = heroImg && heroImg.decode ? heroImg.decode().catch(() => {}) : Promise.resolve();

  // movimento reduzido (ou sem Web Animations): o envelope só esmaece
  if (RM.matches || !intro.animate) {
    await Promise.race([heroReady, wait(600)]);
    release();
    if (intro.animate) await intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.catch(() => {});
    return;
  }

  const seal = $('#seal', intro);
  const crack = $('.seal-crack path', intro);
  const top = $('.seal-top', intro);
  const base = $('.seal-base', intro);
  const flap = $('#env-flap', intro);
  const dark = $('#flap-dark', intro);
  const shadow = $('#env-flap-shadow', intro);
  const body = $('#env-body', intro);

  if (!short) {
    // a) pressão do dedo e a fratura: um traço de cera escura na borda da aba
    seal.animate([{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: d(260), easing: 'ease-out' });
    const len = crack.getTotalLength ? crack.getTotalLength() : 200;
    crack.style.strokeDasharray = `${len} ${len}`;
    crack.style.opacity = '1';
    await crack.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: d(180), delay: d(40), easing: 'cubic-bezier(.5, 0, .2, 1)', fill: 'forwards',
    }).finished.catch(() => {});
  }

  // b) as duas partes se soltam 2–3 px (as metades precisam estar carregadas)
  await Promise.race([
    Promise.all([top, base].map((im) => { im.loading = 'eager'; return im.decode ? im.decode().catch(() => {}) : null; })),
    wait(800),
  ]);
  intro.classList.add('is-breaking');
  top.animate([{ transform: 'translate(0, 0) rotate(0deg)' }, { transform: 'translate(-.5px, -2.5px) rotate(-.6deg)' }], { duration: d(170), easing: 'ease-out', fill: 'forwards' });
  base.animate([{ transform: 'translate(0, 0) rotate(0deg)' }, { transform: 'translate(.5px, 2px) rotate(.3deg)' }], { duration: d(170), easing: 'ease-out', fill: 'forwards' });
  await wait(d(40));

  // c) a aba levanta na nossa direção, levando a metade de cima do lacre
  //    (perspectiva dentro do próprio transform: sem preserve-3d, estável no WebKit)
  const FLAP = d(820);
  flap.style.willChange = 'transform, opacity';
  // com perspectiva, uma aba que vem na nossa direção quase não "sobe" nos primeiros
  // graus (ela cresce enquanto encurta); por isso o ângulo avança rápido no começo.
  const flapAnim = flap.animate([
    { transform: 'perspective(1400px) rotateX(0deg)', opacity: 1 },
    { transform: 'perspective(1400px) rotateX(52deg)', opacity: 1, offset: 0.32 },
    { transform: 'perspective(1400px) rotateX(82deg)', opacity: 1, offset: 0.68 },
    { transform: 'perspective(1400px) rotateX(100deg)', opacity: 0 },
  ], { duration: FLAP, easing: 'cubic-bezier(.35, .1, .25, 1)', fill: 'forwards' });
  dark.animate([{ opacity: 0 }, { opacity: 0.4 }], { duration: FLAP * 0.7, easing: 'ease-in', fill: 'forwards' });
  shadow.animate([{ opacity: 1 }, { opacity: 0 }], { duration: d(320), fill: 'forwards' });

  // d) na metade da aba, o corpo do envelope desce e sai; a foto assenta
  await wait(FLAP * 0.5);
  await Promise.race([heroReady, wait(d(900))]);
  release();
  if (heroImg) heroImg.animate([{ transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: d(1800), easing: 'cubic-bezier(.22, 1, .36, 1)' });
  const drop = body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(104%)' }], {
    duration: d(700), easing: 'cubic-bezier(.4, 0, .62, .3)', fill: 'forwards',
  });
  await Promise.all([drop.finished.catch(() => {}), flapAnim.finished.catch(() => {})]);
}

/* ---------------------------------------------------------------------
   2 · CONTAGEM REGRESSIVA
   Só dias, sem horas: o horário da abertura ainda não foi confirmado.
   Recalcula pelo relógio (nunca "decrementa"): à meia-noite, de hora em
   hora e sempre que a aba volta a aparecer.
   --------------------------------------------------------------------- */
const days = (n) => (n === 1 ? 'dia' : 'dias');

function countdown() {
  const grid = $('#cd');
  if (!grid || Number.isNaN(daysToLaunch())) return;
  const num = $('.cd-num', grid);
  const label = $('.cd-label', grid);
  const sr = $('#cd-sr');
  let last;
  let timer = 0;

  const render = () => {
    clearTimeout(timer);
    const n = daysToLaunch();
    if (n < 0) { launched(); return; }
    if (n === 0) launchDay();
    else if (n !== last) {
      num.textContent = String(n);
      label.textContent = days(n);
      if (last !== undefined && !RM.matches) {
        num.classList.remove('tick');
        void num.offsetWidth;
        num.classList.add('tick');
      }
      sr.textContent = `${n === 1 ? 'Falta' : 'Faltam'} ${n} ${days(n)} para a abertura.`;
    }
    last = n;
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    timer = setTimeout(render, Math.min(midnight - now, 36e5));
  };

  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); else clearTimeout(timer); });
  window.addEventListener('pageshow', render);
  render();
}

// No dia: some o número, a página diz "É hoje" e a lista continua aberta.
function launchDay() {
  if (root.classList.contains('is-launch-day')) return;
  root.classList.add('is-launch-day');
  const grid = $('#cd');
  if (grid) grid.hidden = true;
  const title = $('#cd-title');
  if (title) title.textContent = 'É hoje.';
  const sr = $('#cd-sr');
  if (sr) sr.textContent = '';
  const date = $('#hero-date');
  if (date) date.textContent = 'A nova coleção Valora Suisse abre hoje.';
}

function launched() {
  if (root.classList.contains('is-launched')) return;
  root.classList.add('is-launched');
  const grid = $('#cd');
  if (grid) grid.hidden = true;
  const title = $('#cd-title');
  if (title) title.textContent = 'A coleção está aberta.';
  const sr = $('#cd-sr');
  if (sr) sr.textContent = '';
  const open = $('#cd-open');
  if (open) open.hidden = false;
  const date = $('#hero-date');
  if (date) date.textContent = 'A nova coleção Valora Suisse, em moissanite e zircônia, já está aberta.';
  const cta = $('#hero-cta');
  if (cta) { cta.textContent = 'Conhecer as peças'; cta.href = CONFIG.shopURL; }
  const stonesCta = $('.stones-cta');
  if (stonesCta) { stonesCta.textContent = 'Conhecer as peças'; stonesCta.href = CONFIG.shopURL; }
  const list = $('#lista');
  if (list) list.hidden = true;
}

/* ---------------------------------------------------------------------
   3 · ESCOLHA SUA PEDRA
   Uma única transição, presa ao gesto: a nova foto entra como uma
   cortina que acompanha o dedo (com leve parallax e um fio dourado na
   borda). Tocar no nome da pedra faz o mesmo movimento sozinho.
   Tudo em transform: roda no compositor, sem repintar a cada quadro.
   --------------------------------------------------------------------- */
let currentStone = 'moissanite';
let stoneChosen = false; // só vira interesse de verdade se a pessoa mexer no seletor

function stones() {
  const section = $('#pedras');
  const stage = $('#stone-stage');
  if (!section || !stage) return;
  const edge = $('#stone-edge');
  const caption = $('#stone-caption');
  const radios = $$('input[name="pedra"]', section);
  const keys = radios.map((r) => r.value);
  const layers = {};
  $$('.stone-layer', stage).forEach((l) => { layers[l.dataset.stone] = l; });
  const pic = (key) => $('picture', layers[key]);
  const width = () => stage.clientWidth;

  let current = (radios.find((r) => r.checked) || radios[0]).value;
  currentStone = current;
  layers[current].classList.add('is-current');
  let trans = null; // { from, to, dir, p, target }
  let raf = 0;

  const setCaption = (key) => {
    const s = CONFIG.stones[key];
    caption.textContent = s && s.pieceConfirmed ? `Na foto: ${s.piece} em ${s.name.toLowerCase()}.` : 'Imagem ilustrativa.';
  };
  const commitText = (key) => {
    section.dataset.active = key;
    currentStone = key;
    setCaption(key);
    radios.forEach((r) => { r.checked = r.value === key; });
  };

  const apply = (p) => {
    const { from, to, dir } = trans;
    const w = width();
    trans.p = p;
    const off = (1 - p) * w * dir; // posição da janela da foto que entra
    layers[to].style.transform = `translate3d(${off}px, 0, 0)`;
    pic(to).style.transform = `translate3d(${-off * 0.7}px, 0, 0)`; // a foto anda a 30%: parallax
    pic(from).style.transform = `translate3d(${-p * w * dir * 0.18}px, 0, 0)`;
    const x = dir > 0 ? off : w + off;
    edge.style.transform = `translate3d(${x}px, 0, 0)`;
    edge.style.opacity = p > 0 && p < 1 ? String(Math.min(1, Math.sin(Math.PI * p) * 1.8)) : '0';
  };
  const begin = (to, dir) => {
    $('img', layers[to]).loading = 'eager';
    layers[to].classList.add('is-incoming');
    trans = { from: current, to, dir, p: 0, target: 1 };
    apply(0);
  };
  const finish = () => {
    if (!trans) return;
    const { from, to, target } = trans;
    [layers[from], layers[to], pic(from), pic(to)].forEach((el) => { el.style.transform = ''; });
    edge.style.opacity = '0';
    layers[to].classList.remove('is-incoming');
    if (target === 1) {
      layers[from].classList.remove('is-current');
      layers[to].classList.add('is-current');
      current = to;
    }
    trans = null;
  };
  const animateTo = (target, duration) => {
    cancelAnimationFrame(raf);
    const mine = trans;
    mine.target = target;
    const start = mine.p;
    const t0 = performance.now();
    const step = (now) => {
      if (trans !== mine) return;
      const t = Math.min(1, (now - t0) / duration);
      apply(start + (target - start) * EASE_OUT(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else finish();
    };
    raf = requestAnimationFrame(step);
  };
  const settle = () => { // termina na hora qualquer transição em curso
    cancelAnimationFrame(raf);
    if (trans) { apply(trans.target); finish(); }
  };

  const select = (key, via) => {
    if (!layers[key]) return;
    settle();
    if (key === current) { commitText(key); return; }
    const dir = keys.indexOf(key) > keys.indexOf(current) ? 1 : -1;
    commitText(key);
    stoneChosen = true;
    haptic();
    track('stone_select', { pedra: key, via });
    if (RM.matches) {
      layers[current].classList.remove('is-current');
      layers[key].classList.add('is-current');
      current = key;
      return;
    }
    begin(key, dir);
    const mine = trans;
    const img = $('img', layers[key]);
    Promise.race([img.decode ? img.decode().catch(() => {}) : null, wait(400)]).then(() => {
      if (trans === mine) animateTo(1, T(760));
    });
  };

  radios.forEach((r) => r.addEventListener('change', () => { if (r.checked) select(r.value, 'toque'); }));
  // tocar (ou Espaço) na pedra que já vem marcada não dispara 'change', mas é uma escolha
  radios.forEach((r) => r.addEventListener('click', () => {
    if (!stoneChosen) track('stone_select', { pedra: r.value, via: 'toque' });
    stoneChosen = true;
  }));

  // ----- gesto -----
  let drag = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // a borda da tela é do sistema (voltar do iOS/Android): não disputa
    if (e.clientX < 24 || e.clientX > window.innerWidth - 24) return;
    settle();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, mode: 'pending', to: null, hist: [] };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0;
    const dy = e.clientY - drag.y0;
    if (drag.mode === 'pending') {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dx) <= 1.5 * Math.abs(dy)) { drag = null; return; } // é rolagem vertical
      drag.mode = 'drag';
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      stage.classList.add('is-dragging');
      const n = keys.indexOf(current) + (dx < 0 ? 1 : -1);
      if (n >= 0 && n < keys.length && !RM.matches) {
        drag.to = keys[n];
        begin(drag.to, dx < 0 ? 1 : -1);
      }
    }
    drag.hist.push([e.timeStamp, e.clientX]);
    if (drag.hist.length > 6) drag.hist.shift();
    if (drag.to && trans) apply(Math.max(0, Math.min(1, (-dx * trans.dir) / width())));
    else pic(current).style.transform = `translate3d(${dx * 0.16}px, 0, 0)`; // fim da lista: elástico
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const g = drag;
    drag = null;
    stage.classList.remove('is-dragging');
    if (g.mode !== 'drag') return;
    if (!g.to || !trans) {
      const p = pic(current);
      const from = p.style.transform;
      p.style.transform = '';
      if (from && p.animate) p.animate([{ transform: from }, { transform: 'translate3d(0, 0, 0)' }], { duration: T(320), easing: 'cubic-bezier(.22, 1, .36, 1)' });
      if (RM.matches && g.to === null) {
        const n = keys.indexOf(current) + ((e.clientX - g.x0) < 0 ? 1 : -1);
        if (n >= 0 && n < keys.length) select(keys[n], 'swipe');
      }
      return;
    }
    const h = g.hist;
    const v = h.length > 1 ? (h[h.length - 1][1] - h[0][1]) / Math.max(1, h[h.length - 1][0] - h[0][0]) : 0;
    const flick = -v * trans.dir > 0.35;
    const commit = e.type !== 'pointercancel' && (trans.p > 0.3 || flick);
    if (commit) {
      commitText(g.to);
      stoneChosen = true;
      haptic();
      track('stone_select', { pedra: g.to, via: 'swipe' });
      animateTo(1, T(Math.max(260, 700 * (1 - trans.p))));
    } else {
      animateTo(0, T(Math.max(200, 420 * trans.p)));
    }
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  // no toque, o navegador já "captura" o dedo no <picture>; ao passarmos a captura
  // para o palco, o <picture> perde a dele — esse evento não é o fim do gesto
  stage.addEventListener('lostpointercapture', (e) => { if (e.target === stage && drag && drag.id === e.pointerId) end(e); });

  commitText(current);

  // pré-carrega a outra foto quando a seção se aproxima — mas só depois da
  // abertura, para não disputar banda com o lacre e a foto do hero
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      keys.forEach((key) => { $('img', layers[key]).loading = 'eager'; });
      io.disconnect();
    }, { rootMargin: '700px 0px' });
    const watch = () => io.observe(stage);
    if (root.classList.contains('intro-on')) document.addEventListener('valora:opened', watch, { once: true });
    else watch();
  }
}

/* ---------------------------------------------------------------------
   4 · LISTA DE CONVIDADOS
   --------------------------------------------------------------------- */
const JOIN_KEY = 'valora:lista';
const OUTBOX_KEY = 'valora:pendente';
let joined = false;

const DDD = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75,
  77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99]);

// texto padrão caso o config.js em uso seja de uma versão sem `consent`
const CONSENT = CONFIG.consent || {
  whatsapp: 'Ao entrar na lista, você autoriza a Valora Suisse a enviar pelo WhatsApp mensagens sobre o lançamento desta coleção. Não vendemos nem compartilhamos seu número para publicidade. Para sair, é só responder SAIR. ',
  email: 'Ao entrar na lista, você autoriza a Valora Suisse a enviar por e-mail mensagens sobre o lançamento desta coleção. Não vendemos nem compartilhamos seu e-mail para publicidade. Para sair, use o link no fim de cada e-mail. ',
};

// WhatsApp: país do seletor + número. Quem digita "+41…" ou "0041…" escolhe o
// país sozinho. `len` = dígitos do número nacional, sem o 0 de discagem.
const COUNTRIES = {
  CH: { cc: '41', len: [9, 9], ph: '79 123 45 67' },
  BR: { cc: '55', len: [11, 11], ph: 'DDD + número' },
  PT: { cc: '351', len: [9, 9], ph: '912 345 678' },
  FR: { cc: '33', len: [9, 9], ph: '6 12 34 56 78' },
  DE: { cc: '49', len: [6, 11], ph: '151 23456789' },
  IT: { cc: '39', len: [6, 11], ph: '312 345 6789', keepZero: true },
  AT: { cc: '43', len: [6, 13], ph: '664 1234567' },
  ES: { cc: '34', len: [9, 9], ph: '612 34 56 78' },
  GB: { cc: '44', len: [9, 10], ph: '7400 123456' },
  US: { cc: '1', len: [10, 10], ph: '(201) 555-0123' },
  XX: { cc: '', len: [8, 15], ph: '+ código do país e número' },
};
const BY_CODE = Object.keys(COUNTRIES).filter((k) => COUNTRIES[k].cc).sort((a, b) => COUNTRIES[b].cc.length - COUNTRIES[a].cc.length);

// País sugerido pelo fuso do aparelho (dá para trocar no seletor)
function defaultCountry() {
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* ok */ }
  const hit = [
    [/^Europe\/Zurich$/, 'CH'],
    [/^America\/(Sao_Paulo|Bahia|Fortaleza|Recife|Belem|Manaus|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Araguaina|Maceio|Santarem|Noronha|Eirunepe)$/, 'BR'],
    [/^(Europe\/Lisbon|Atlantic\/(Madeira|Azores))$/, 'PT'],
    [/^Europe\/Paris$/, 'FR'],
    [/^Europe\/Berlin$/, 'DE'],
    [/^Europe\/Rome$/, 'IT'],
    [/^Europe\/Vienna$/, 'AT'],
    [/^(Europe\/Madrid|Atlantic\/Canary)$/, 'ES'],
    [/^Europe\/London$/, 'GB'],
    [/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit)|Pacific\/Honolulu)$/, 'US'],
  ].find(([re]) => re.test(tz));
  if (hit) return hit[1];
  return /^pt-BR/i.test(navigator.language || '') ? 'BR' : 'CH';
}

function parsePhone(raw, selected) {
  const v = String(raw).trim();
  let digits = v.replace(/\D/g, '');
  const intl = v.startsWith('+') || digits.startsWith('00');
  let country = COUNTRIES[selected] ? selected : 'CH';
  if (intl) {
    if (!v.startsWith('+')) digits = digits.slice(2);
    const k = BY_CODE.find((c) => digits.startsWith(COUNTRIES[c].cc));
    if (!k) return { country: 'XX', cc: '', d: digits, intl };
    country = k;
    digits = digits.slice(COUNTRIES[k].cc.length);
  }
  const c = COUNTRIES[country];
  if (country === 'XX') return { country, cc: '', d: digits, intl }; // número já com o código do país
  if (country === 'BR') { // tira 55 sem "+", 0 e código de operadora
    let d = digits;
    if (!intl && d.length >= 12 && d.startsWith('55')) d = d.slice(2);
    if (d.startsWith('0')) d = d.length >= 13 ? d.slice(-11) : d.replace(/^0+/, '');
    return { country, cc: c.cc, d: d.slice(0, 11), intl };
  }
  let d = digits;
  if (!intl && d.length > c.len[1] && d.startsWith(c.cc)) d = d.slice(c.cc.length); // código sem "+"
  if (!c.keepZero) d = d.replace(/^0/, ''); // 0 de discagem nacional
  return { country, cc: c.cc, d, intl };
}
function formatBR(d) {
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}
function formatNational(country, d) {
  if (country === 'BR') return formatBR(d);
  if (country === 'CH') return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9), d.slice(9)].filter(Boolean).join(' ');
  return d;
}
function phoneContact(p) {
  return p.country === 'XX' ? `+${p.d}` : `+${p.cc}${p.d}`;
}
function phoneDisplay(p) {
  if (p.country === 'BR') return formatBR(p.d);
  if (p.country === 'XX') return `+${p.d}`;
  return `+${p.cc} ${formatNational(p.country, p.d)}`;
}
function validatePhone(raw, selected) {
  const { country, d } = parsePhone(raw, selected);
  const c = COUNTRIES[country];
  if (!d) return country === 'BR' ? 'Informe seu WhatsApp com DDD.' : 'Informe seu WhatsApp.';
  if (country === 'BR') {
    if (d.length < 11) return 'Confira o número: são 11 dígitos com o DDD.';
    if (!DDD.has(Number(d.slice(0, 2)))) return 'Confira o DDD.';
    if (d[2] !== '9') return 'Confira o número: celulares têm 9 depois do DDD.';
    return '';
  }
  if (country === 'CH') return d.length === 9 ? '' : 'Confira o número (ex.: 079 123 45 67).';
  if (country === 'XX') return d.length >= 8 && d.length <= 15 ? '' : 'Escreva o número com o código do país (ex.: +44 7400 123456).';
  return d.length >= c.len[0] && d.length <= c.len[1] ? '' : 'Confira o número.';
}
function validateEmail(raw) {
  const v = String(raw).trim();
  if (!v) return 'Informe seu e-mail.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Confira o e-mail: parece faltar algo.';
}
function validateName(raw) {
  const v = String(raw).trim();
  if (!v) return 'Informe seu nome.';
  return v.length >= 2 ? '' : 'Confira o nome.';
}

function utm() {
  const out = {};
  try {
    const p = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => { if (p.get(k)) out[k] = p.get(k); });
  } catch (e) { /* sem query */ }
  return out;
}

/**
 * BACKEND · ponto único de integração da lista.
 * ------------------------------------------------------------------
 * `CONFIG.waitlistEndpoint` vazio → envio SIMULADO (0,9 s).
 * Com URL → POST application/x-www-form-urlencoded, timeout de 8 s.
 * A confirmação só aparece com resposta 2xx. O webhook precisa liberar
 * CORS para o domínio da página (no n8n: Allowed Origins = *).
 * Campos: channel, contact (+5511987654321 | nome@email.com), name, stone,
 *         consent, consent_text, consent_version, page, referrer,
 *         created_at, utm_source, utm_medium, utm_campaign, utm_content
 */
async function submitLead(payload) {
  if (!CONFIG.waitlistEndpoint) {
    await wait(900);
    console.info('[Valora] envio simulado da lista:', payload);
    return;
  }
  const body = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => body.append(k, String(v)));
  const ctrl = 'AbortController' in window ? new AbortController() : null;
  const timer = setTimeout(() => ctrl && ctrl.abort(), 8000);
  try {
    const res = await fetch(CONFIG.waitlistEndpoint, { method: 'POST', body, keepalive: true, signal: ctrl ? ctrl.signal : undefined });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}

// cadastro que falhou fica guardado e é reenviado na próxima visita
async function flushOutbox(onSent) {
  const raw = store.get(OUTBOX_KEY);
  if (!raw || !CONFIG.waitlistEndpoint) return;
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { store.del(OUTBOX_KEY); return; }
  try {
    await submitLead(payload);
    store.del(OUTBOX_KEY);
    if (onSent) onSent(payload);
  } catch (e) { /* tenta de novo na próxima visita */ }
}

function waLink(text) {
  return `https://wa.me/${CONFIG.whatsappBrand}?text=${encodeURIComponent(text)}`;
}

function calendarLink() {
  const useGoogle = IN_APP || IN_FRAME || /Android/i.test(UA);
  if (!useGoogle || LAUNCH_DAY.length !== 3) return { href: 'assets/lancamento.ics', download: true };
  const [y, m, d] = LAUNCH_DAY;
  const ymd = (dt) => dt.toISOString().slice(0, 10).replace(/-/g, '');
  const url = location.href.split('#')[0].split('?')[0];
  const t = launchText();
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Abertura da nova coleção Valora Suisse',
    dates: `${ymd(new Date(Date.UTC(y, m - 1, d)))}/${ymd(new Date(Date.UTC(y, m - 1, d + 1)))}`, // dia inteiro
    details: `${t ? `${t}. ` : ''}${url}`,
  });
  return { href: `https://calendar.google.com/calendar/render?${q.toString()}`, download: false };
}

function waitlist() {
  const form = $('#wl-form');
  if (!form) return;
  form.hidden = false;
  const name = $('#wl-name');
  const phone = $('#wl-phone');
  const cc = $('#wl-cc');
  const email = $('#wl-email');
  const fPhone = $('#field-whatsapp');
  const fEmail = $('#field-email');
  const text = $('#wl-text');
  const err = $('#wl-error');
  const sw = $('#wl-switch');
  const consent = $('#wl-consent');
  const btn = $('#wl-submit');
  const btnLabel = $('.btn-label', btn);
  const formWrap = $('#invite-form');
  const done = $('#invite-done');
  const invite = $('#invite');
  const status = $('#wl-status');
  let channel = 'whatsapp';
  let touched = false;

  const input = () => (channel === 'email' ? email : phone);
  const validate = () => validateName(name.value) || (channel === 'email' ? validateEmail(email.value) : validatePhone(phone.value, cc.value));
  const badField = () => (validateName(name.value) ? name : input());

  const setError = (msg, withWhatsApp) => {
    err.replaceChildren(msg || '');
    if (msg && withWhatsApp && CONFIG.whatsappBrand) {
      const a = document.createElement('a');
      a.href = waLink('Olá, Valora Suisse! Quero entrar na lista da nova coleção.');
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Entrar pelo WhatsApp';
      err.append(' ', a, '.');
    }
    err.hidden = !msg;
    if (!msg) status.textContent = ''; // não deixa um erro antigo na região lida pelo leitor de tela
    [name, phone, email].forEach((el) => {
      if (msg && el === badField()) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
  };

  const renderConsent = () => {
    const a = document.createElement('a');
    a.href = 'privacidade.html';
    a.textContent = 'Política de privacidade';
    consent.replaceChildren(CONSENT[channel], a, '.');
  };

  const setChannel = (next, focus) => {
    channel = next;
    const isEmail = channel === 'email';
    fPhone.hidden = isEmail;
    fEmail.hidden = !isEmail;
    text.textContent = isEmail
      ? 'Deixe seu e-mail e avisamos você no dia da abertura.'
      : 'Deixe seu WhatsApp e avisamos você no dia da abertura.';
    sw.textContent = isEmail ? 'Prefiro receber pelo WhatsApp' : 'Prefiro receber por e-mail';
    touched = false;
    setError('');
    renderConsent();
    if (focus) input().focus();
  };
  sw.addEventListener('click', () => setChannel(channel === 'email' ? 'whatsapp' : 'email', true));

  // País: sugerido pelo fuso do aparelho; o placeholder mostra o formato local
  const setCountry = (k) => {
    cc.value = k;
    phone.placeholder = COUNTRIES[k].ph;
  };
  setCountry(defaultCountry());
  cc.addEventListener('change', () => {
    setCountry(cc.value);
    const p = parsePhone(phone.value, cc.value);
    if (!p.intl && p.d && (p.country === 'BR' || p.country === 'CH')) phone.value = formatNational(p.country, p.d);
    if (touched) setError(validate());
  });

  // máscara (Brasil e Suíça) que preserva a posição do cursor (conta os dígitos antes dele)
  phone.addEventListener('input', (ev) => {
    const raw = phone.value;
    const p = parsePhone(raw, cc.value);
    if (p.intl && p.country !== cc.value) setCountry(p.country); // digitou +41, +55…
    const deleting = ev.inputType && ev.inputType.startsWith('delete');
    if (!p.intl && !deleting && !/^\s*[+0]/.test(raw) && (p.country === 'BR' || p.country === 'CH')) {
      const caret = phone.selectionStart == null ? raw.length : phone.selectionStart;
      const rawDigits = raw.replace(/\D/g, '');
      const stripped = Math.max(0, rawDigits.length - p.d.length); // código do país, zero inicial ou excesso
      const before = Math.max(0, raw.slice(0, caret).replace(/\D/g, '').length - stripped);
      const out = formatNational(p.country, p.d);
      if (out !== raw) {
        phone.value = out;
        let pos = 0;
        let seen = 0;
        while (pos < out.length && seen < before) { if (/\d/.test(out[pos])) seen += 1; pos += 1; }
        if (document.activeElement === phone) { try { phone.setSelectionRange(pos, pos); } catch (e) { /* ok */ } }
      }
    }
    if (touched) setError(validate());
  });
  phone.addEventListener('blur', () => {
    const p = parsePhone(phone.value, cc.value);
    if (!p.d || p.country === 'XX') return;
    if (p.intl || p.country === 'BR' || p.country === 'CH') phone.value = formatNational(p.country, p.d);
  });
  email.addEventListener('input', () => { if (touched) setError(validate()); });
  name.addEventListener('input', () => { if (touched) setError(validate()); });

  const showDone = ({ channel: ch, display, isNew }) => {
    joined = true;
    const t = launchText();
    $('#done-title').textContent = isNew ? 'Você está na lista.' : 'Você continua na lista.';
    const strong = document.createElement('strong');
    strong.textContent = display;
    strong.classList.toggle('is-phone', ch !== 'email'); // telefone numa linha só; e-mail quebra se precisar
    $('#done-text').replaceChildren(
      `${t ? `No dia ${t}` : 'No dia da abertura'}, avisamos você ${ch === 'email' ? 'no e-mail' : 'no WhatsApp'} `,
      strong,
      '.',
    );
    $('#done-fix').textContent = ch === 'email' ? 'Corrigir e-mail' : 'Corrigir número';

    const wa = $('#done-wa');
    if (CONFIG.whatsappBrand && ch !== 'email') {
      const s = stoneChosen ? CONFIG.stones[currentStone] : null;
      wa.href = waLink(`Olá, Valora Suisse! Entrei na lista da nova coleção e quero receber o aviso da abertura.${s ? ` Pedra de interesse: ${s.name}.` : ''}`);
      wa.hidden = false;
    } else {
      wa.hidden = true;
    }
    const cal = calendarLink();
    const calA = $('#done-cal');
    calA.href = cal.href;
    if (cal.download) { calA.setAttribute('download', 'valora-suisse-abertura.ics'); calA.removeAttribute('target'); } else { calA.removeAttribute('download'); calA.target = '_blank'; }

    formWrap.hidden = true;
    done.hidden = false;
    done.classList.toggle('is-new', !!isNew && !RM.matches);
    if (isNew) {
      invite.classList.remove('is-stamped');
      void invite.offsetWidth;
      if (!RM.matches) invite.classList.add('is-stamped');
      setTimeout(haptic, 380);
      status.textContent = `Você está na lista. Avisamos você ${ch === 'email' ? 'no e-mail' : 'no WhatsApp'} ${display}.`;
      $('#done-title').focus({ preventScroll: true });
    }
    document.dispatchEvent(new CustomEvent('valora:joined'));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    touched = true;
    const msg = validate();
    setError(msg);
    if (msg) {
      status.textContent = '';
      requestAnimationFrame(() => { status.textContent = msg; });
      badField().focus();
      return;
    }

    const ch = channel;
    let contact;
    let display;
    if (ch === 'email') {
      contact = email.value.trim().toLowerCase();
      display = contact;
    } else {
      const p = parsePhone(phone.value, cc.value);
      contact = phoneContact(p);
      display = phoneDisplay(p);
    }
    // armadilha anti-robô preenchida: finge sucesso e não envia nada
    if (form.elements.website.value) { showDone({ channel: ch, display, isNew: true }); return; }

    const payload = {
      channel: ch,
      contact,
      name: name.value.trim(),
      stone: stoneChosen ? currentStone : '',
      consent: 'sim',
      consent_text: consent.textContent.trim(),
      consent_version: CONFIG.consentVersion,
      page: location.href.split('#')[0],
      referrer: document.referrer || '',
      created_at: new Date().toISOString(),
      ...utm(),
    };
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    btnLabel.textContent = 'Enviando';
    try {
      await submitLead(payload);
      store.del(OUTBOX_KEY); // o que foi confirmado não pode ser reenviado depois
      store.set(JOIN_KEY, JSON.stringify({ channel: ch, display, stone: payload.stone, ts: Date.now() }));
      track('lead_submit', { canal: ch, pedra: payload.stone });
      showDone({ channel: ch, display, isNew: true });
    } catch (error) {
      store.set(OUTBOX_KEY, JSON.stringify(payload));
      track('lead_error', { canal: ch });
      const fail = 'Não conseguimos registrar agora. Tente de novo em instantes.';
      setError(fail, true);
      status.textContent = fail;
      input().focus(); // o botão desabilitado derrubou o foco; volta para o campo
    } finally {
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
      btn.disabled = false;
      btnLabel.textContent = 'Entrar na lista';
    }
  });

  $('#done-fix').addEventListener('click', () => {
    let saved = null;
    try { saved = JSON.parse(store.get(JOIN_KEY) || 'null'); } catch (e) { saved = null; }
    joined = false;
    done.hidden = true;
    done.classList.remove('is-new');
    formWrap.hidden = false;
    setChannel(saved && saved.channel === 'email' ? 'email' : 'whatsapp', false);
    if (saved && saved.display) input().value = saved.display;
    input().focus();
    document.dispatchEvent(new CustomEvent('valora:left'));
  });

  // Compartilhar: é um link de verdade para o WhatsApp (funciona em qualquer navegador);
  // onde o Web Share existir de fato, abre a folha de compartilhar do aparelho.
  const share = $('#done-share');
  const SHARE_TEXT = 'Um convite da Valora Suisse: a nova coleção, em moissanite e zircônia.';
  const shareUrl = () => {
    const url = new URL(location.href.split('#')[0]);
    url.search = '';
    url.searchParams.set('utm_source', 'share');
    return url.toString();
  };
  share.href = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${shareUrl()}`)}`;
  share.addEventListener('click', async (e) => {
    track('share', {});
    if (!navigator.share || IN_FRAME) return; // segue o link
    e.preventDefault();
    try {
      await navigator.share({ title: 'Valora Suisse', text: SHARE_TEXT, url: shareUrl() });
    } catch (err) {
      if (err && err.name !== 'AbortError') window.location.href = share.href;
    }
  });

  // CTAs levam direto ao campo (o teclado só abre no iOS se o foco vier do toque)
  $$('[data-cta]').forEach((a) => a.addEventListener('click', (e) => {
    track('cta_click', { origem: a.dataset.cta });
    if (root.classList.contains('is-launched')) return;
    e.preventDefault();
    if (joined) {
      $('#done-title').focus({ preventScroll: true });
      invite.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    const target = input();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'center' });
  }));

  setChannel('whatsapp', false);

  // já está na lista (mesmo aparelho): mostra o convite selado direto
  try {
    const saved = JSON.parse(store.get(JOIN_KEY) || 'null');
    if (saved && saved.display) showDone({ channel: saved.channel, display: saved.display, isNew: false });
  } catch (e) { store.del(JOIN_KEY); }

  // cadastro que ficou na fila e foi reenviado agora: a pessoa passa a "estar na lista"
  flushOutbox((p) => {
    if (joined) return;
    const disp = p.channel === 'email' ? p.contact : phoneDisplay(parsePhone(p.contact, 'XX'));
    store.set(JOIN_KEY, JSON.stringify({ channel: p.channel, display: disp, stone: p.stone, ts: Date.now() }));
    showDone({ channel: p.channel, display: disp, isNew: false });
  });
}

/* ---------------------------------------------------------------------
   5 · Fotos aparecem suavemente quando terminam de carregar
   --------------------------------------------------------------------- */
function softImages() {
  $$('.piece img, .stone-layer img').forEach((img) => {
    if (img.complete && img.naturalWidth) return;
    img.classList.add('is-pending');
    const show = () => img.classList.remove('is-pending');
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
  });
}

/* ---------------------------------------------------------------------
   Início
   --------------------------------------------------------------------- */
const safely = (name, fn) => { try { return fn(); } catch (err) { console.error(`[Valora] ${name}:`, err); return undefined; } };

safely('intro', () => runIntro().catch((err) => {
  console.error('[Valora] intro:', err);
  root.classList.remove('intro-on');
  const intro = $('#intro');
  if (intro) intro.remove();
  [$('#main'), $('.footer')].forEach((el) => { if (el) el.inert = false; });
}));
safely('config', applyConfig);
safely('countdown', countdown);
safely('stones', stones);
safely('waitlist', waitlist);
safely('images', softImages);
