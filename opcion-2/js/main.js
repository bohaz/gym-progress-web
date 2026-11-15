/* Gym Progress · Opción 2 · interacciones
   Mejora progresiva: sin JavaScript todo el contenido queda visible,
   los carruseles se deslizan con scroll nativo y el FAQ usa <details>.
   Aquí solo se agregan clases; el movimiento vive en CSS. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Entrada del hero (espera las fuentes, máx. 700 ms) ---------- */
  const start = () => requestAnimationFrame(() => root.classList.add('is-loaded'));
  if (document.fonts?.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(start);
  } else {
    start();
  }

  /* ---------- Encabezado: fondo al bajar, se oculta al bajar y vuelve al subir ---------- */
  const nav = $('[data-nav]');
  const heroImg = $('.hero__img');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const goingDown = y > lastY && y > 420;
    if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', goingDown);
    lastY = y;
    if (heroImg && !reduceMotion && y < window.innerHeight * 1.2) {
      heroImg.style.setProperty('--py', `${(y * 0.25).toFixed(1)}px`);
    }
    updateTimeline();
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------- Enlace activo según la sección visible ---------- */
  const navLinks = $$('.nav__links a');
  const sectionMap = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.classList.remove('is-active'));
        sectionMap.get(e.target.id)?.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Menú a pantalla completa ---------- */
  const menu = $('[data-menu]');
  const openBtn = $('[data-menu-open]');
  const closeBtn = $('[data-menu-close]');

  const setMenu = (open) => {
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      closeBtn.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      menu.hidden = true;
      openBtn.focus({ preventScroll: true });
    }
    document.body.classList.toggle('menu-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
  };
  openBtn.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Aparición al hacer scroll (con escalonado por grupo) ---------- */
  const reveals = $$('[data-reveal]');
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`);
  });

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion || !target) return;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        $$('[data-count]', e.target).forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Carruseles horizontales: barra de progreso y arrastre con mouse ---------- */
  $$('[data-rail]').forEach((rail) => {
    const track = $('[data-rail-track]', rail);
    const bar = $('[data-rail-bar]', rail);

    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = track.clientWidth / track.scrollWidth;
      const w = Math.max(ratio * 100, 14);
      const p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.setProperty('--w', `${w}%`);
      bar.style.setProperty('--x', `${p * (100 / w * 100 - 100)}%`);
    };
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();

    // Arrastre con mouse (en táctil el scroll nativo ya funciona)
    let down = false; let startX = 0; let startLeft = 0; let moved = false;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-dragging'); }
      if (moved) track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (moved) {
        track.classList.remove('is-dragging');
        // Ajusta a la tarjeta más cercana
        const items = [...track.children];
        const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
        const nearest = items.reduce((best, it) => (
          Math.abs(it.offsetLeft - pad - track.scrollLeft) < Math.abs(best.offsetLeft - pad - track.scrollLeft) ? it : best
        ), items[0]);
        track.scrollTo({ left: nearest.offsetLeft - pad, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
    track.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);

    // Flechas del teclado
    track.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const step = (track.children[0]?.getBoundingClientRect().width || 300) + 20;
      track.scrollBy({ left: e.key === 'ArrowRight' ? step : -step, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Slider de boxeo con avance automático ---------- */
  $$('[data-slider]').forEach((stage) => {
    const tabs = $$('[role="tab"]', stage);
    const cards = $$('.coach-card', stage);
    const DURATION = 6000;
    let index = 0;
    let timer = null;
    let remaining = DURATION;
    let startedAt = 0;

    stage.style.setProperty('--dur', `${DURATION}ms`);
    if (reduceMotion) stage.classList.add('no-autoplay');

    const go = (i) => {
      index = (i + cards.length) % cards.length;
      cards.forEach((c, k) => {
        const on = k === index;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-hidden', String(!on));
        $$('a, button', c).forEach((el) => (on ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1')));
      });
      tabs.forEach((t, k) => {
        t.setAttribute('aria-selected', String(k === index));
        // Reinicia la animación de la barra
        t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
      });
      schedule(DURATION);
    };

    const schedule = (ms) => {
      clearTimeout(timer);
      if (reduceMotion) return;
      remaining = ms; startedAt = performance.now();
      timer = setTimeout(() => go(index + 1), ms);
    };
    const pause = () => {
      if (stage.classList.contains('is-paused')) return;
      clearTimeout(timer);
      remaining -= performance.now() - startedAt;
      stage.classList.add('is-paused');
    };
    const resume = () => {
      if (!stage.classList.contains('is-paused')) return;
      stage.classList.remove('is-paused');
      schedule(Math.max(remaining, 400));
    };

    tabs.forEach((t, k) => t.addEventListener('click', () => { stage.classList.remove('is-paused'); go(k); }));
    stage.addEventListener('mouseenter', pause);
    stage.addEventListener('mouseleave', resume);
    stage.addEventListener('focusin', pause);
    stage.addEventListener('focusout', resume);

    // Deslizar con el dedo
    let sx = null;
    stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      sx = null;
    });

    // Solo corre cuando está a la vista
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) resume(); else pause();
      }, { threshold: 0.3 }).observe(stage);
      stage.classList.add('is-paused');
      remaining = DURATION;
    } else {
      schedule(DURATION);
    }
  });

  /* ---------- Línea de tiempo de «Cómo empezar» ---------- */
  const timeline = $('[data-timeline]');
  const fill = $('[data-timeline-fill]');
  const steps = $$('[data-step]');
  function updateTimeline() {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.6 - r.top) / r.height, 0), 1);
    fill.style.setProperty('--p', p.toFixed(3));
    // Solo un paso en rojo a la vez: el último que cruzó el 60 % de la pantalla
    let current = 0;
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.6) current = i; });
    steps.forEach((s, i) => s.classList.toggle('is-on', i === current));
  }
  updateTimeline();

  /* ---------- Formulario: arma el mensaje y abre el DM de Instagram ---------- */
  const form = $('[data-form]');
  const status = $('[data-form-status]');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = String(data.get('nombre') || '').trim();
    const interes = String(data.get('interes') || '');
    const nameField = form.elements.nombre.closest('.field');
    const selField = form.elements.interes.closest('.field');
    nameField.classList.toggle('is-invalid', !nombre);
    selField.classList.toggle('is-invalid', !interes);
    if (!nombre || !interes) {
      status.textContent = 'Completa tu nombre y lo que te interesa.';
      (!nombre ? form.elements.nombre : form.elements.interes).focus();
      return;
    }
    const tel = String(data.get('telefono') || '').trim();
    const correo = String(data.get('correo') || '').trim();
    const msg = String(data.get('mensaje') || '').trim();
    const text = [
      `Hola, soy ${nombre}. Me interesa: ${interes}.`,
      msg,
      tel && `Mi teléfono: +56 ${tel}`,
      correo && `Mi correo: ${correo}`,
    ].filter(Boolean).join('\n');

    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch { /* sin permiso */ }
    status.textContent = copied
      ? 'Listo: copiamos tu mensaje. Pégalo en el chat de Instagram que se abrió.'
      : 'Se abrió Instagram: cuéntanos tu nombre y qué plan te interesa.';
    window.open('https://ig.me/m/gym_progressssss', '_blank', 'noopener');
  });
})();
