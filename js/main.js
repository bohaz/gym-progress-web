/* Gym Progress · interacciones
   Mejora progresiva: sin JavaScript, los carruseles siguen funcionando
   con scroll horizontal y el menú queda como lista de enlaces. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduceMotion ? 'auto' : 'smooth';

  /* ---------- Menú móvil ---------- */
  const nav = document.querySelector('.nav');
  const burger = nav?.querySelector('.nav__burger');

  const setMenu = (open) => {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  burger?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!nav.classList.contains('is-open'));
  });
  nav?.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (e) => {
    if (nav?.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => m.matches && setMenu(false));

  /* ---------- Enlace activo según la sección visible ---------- */
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => visible.set(en.target.id, en.isIntersecting));
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) return setActive(sections[sections.length - 1].id);
        const current = sections.find((s) => visible.get(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(sections[sections.length - 1].id);
      }
    }, { passive: true });
  }

  /* ---------- Carruseles ---------- */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('[data-track]');
    if (!track) return;
    const slides = [...track.children];
    const goers = [...root.querySelectorAll('[data-go]')];
    let index = 0;
    let ticking = false;

    const padLeft = () => parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const offsetOf = (i) => slides[i].offsetLeft - track.offsetLeft - padLeft();

    const paint = (i) => {
      index = i;
      goers.forEach((g) => {
        const on = Number(g.dataset.go) === i;
        g.classList.toggle('is-active', on);
        g.setAttribute('aria-selected', String(on));
        // En móvil la barra de pestañas se desliza: deja visible la activa sin mover la página
        const bar = g.parentElement;
        if (on && bar && bar.scrollWidth > bar.clientWidth) {
          bar.scrollTo({ left: g.offsetLeft - 16, behavior });
        }
      });
    };

    const go = (i) => {
      const n = slides.length;
      const next = ((i % n) + n) % n;
      track.scrollTo({ left: offsetOf(next), behavior });
      paint(next);
    };

    // Sincroniza pestañas y puntos cuando el usuario desliza con el dedo o el trackpad
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const x = track.scrollLeft;
        let best = 0;
        slides.forEach((_, k) => {
          if (Math.abs(offsetOf(k) - x) < Math.abs(offsetOf(best) - x)) best = k;
        });
        if (best !== index) paint(best);
        ticking = false;
      });
    }, { passive: true });

    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-prev], [data-next], [data-go]');
      if (!btn || !root.contains(btn)) return;
      e.preventDefault();
      if (btn.hasAttribute('data-prev')) go(index - 1);
      else if (btn.hasAttribute('data-next')) go(index + 1);
      else go(Number(btn.dataset.go));
    });

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    });

    // Mantiene la diapositiva actual alineada si cambia el ancho de la ventana
    window.addEventListener('resize', () => track.scrollTo({ left: offsetOf(index) }), { passive: true });

    paint(0);
  });
})();
