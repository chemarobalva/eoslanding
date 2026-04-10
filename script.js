// =============================================
// GLOW — sigue la posición del mouse
// =============================================
const glow = document.getElementById('glow');

document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// =============================================
// REVEAL ON SCROLL — elementos con .reveal
// =============================================
const reveals = document.querySelectorAll('.reveal');

if (reveals.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));
}

// =============================================
// MAKER SECTION — GSAP Animations (Cómo funciona)
// =============================================
(function initMaker() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Label
  gsap.from('.label-line', {
    scaleX: 0, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.label-row', start: 'top 88%' }
  });
  gsap.from('.label-text', {
    opacity: 0, x: -10, duration: 0.5, delay: 0.25, ease: 'power2.out',
    scrollTrigger: { trigger: '.label-row', start: 'top 88%' }
  });

  // Headline + subheadline
  gsap.from('[data-headline]', {
    y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '[data-headline]', start: 'top 85%' }
  });
  gsap.from('[data-subheadline]', {
    y: 20, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '[data-subheadline]', start: 'top 88%' }
  });

  // Sessions timeline
  const mcSessions = document.querySelectorAll('[data-session]');
  const mcProgressBar = document.querySelector('[data-progress]');
  const mcSessionsContainer = document.querySelector('[data-sessions]');

  mcSessions.forEach((session) => {
    gsap.from(session, {
      opacity: 0, x: -24, duration: 0.65, ease: 'power2.out',
      scrollTrigger: {
        trigger: session,
        start: 'top 82%',
        onEnter: () => {
          session.classList.add('is-active');
          const dotTop = session.querySelector('.mc-session-dot').getBoundingClientRect().top
                       - mcSessionsContainer.getBoundingClientRect().top;
          gsap.to(mcProgressBar, { height: dotTop + 7, duration: 0.6, ease: 'power2.out' });
        }
      }
    });
  });

  // Engranes grid
  gsap.from('[data-eng-label]', {
    opacity: 0, y: 16, duration: 0.5, ease: 'power2.out',
    scrollTrigger: { trigger: '[data-eng-label]', start: 'top 88%' }
  });
  gsap.from('[data-engrane]', {
    y: 30, opacity: 0, scale: 0.92,
    duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.mc-engranes-grid', start: 'top 85%' }
  });

  // CTA block
  gsap.from('[data-cta]', {
    y: 50, opacity: 0, scale: 0.97,
    duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '[data-cta]', start: 'top 90%' }
  });

  // Counter on CTA
  gsap.fromTo('[data-cta-count]',
    { innerText: 0 },
    {
      innerText: 6,
      duration: 1.4,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: '[data-cta]', start: 'top 88%' }
    }
  );
})();

// =============================================
// TRUTH SECTION — horizontal scroll hijack
// =============================================
(function initTruthScroll() {
  const section = document.querySelector('.truth');
  const track   = document.getElementById('truthTrack');
  const pbar    = document.getElementById('truthProgress');
  const dots    = [0,1,2,3].map(i => document.getElementById('td' + i));
  if (!section || !track) return;

  const SLIDES = 4;
  let rafId = null;
  let activeDot = 0;

  // Activa primer dot
  dots[0].classList.add('active');

  function update() {
    const rect     = section.getBoundingClientRect();
    const scrolled = Math.max(-rect.top, 0);
    const maxScroll = section.offsetHeight - window.innerHeight;
    const ratio    = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    // translateX directo — sin transition
    const offsetPct = ratio * (SLIDES - 1) / SLIDES * 100;
    track.style.transform = `translateX(-${offsetPct}%)`;

    // Barra de progreso
    pbar.style.width = (25 + ratio * 75) + '%';

    // Dots
    const idx = Math.min(Math.round(ratio * (SLIDES - 1)), SLIDES - 1);
    if (idx !== activeDot) {
      dots[activeDot].classList.remove('active');
      dots[idx].classList.add('active');
      activeDot = idx;
    }

    rafId = null;
  }

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

// =============================================
// ACCIONISTA — highlights wipe-in al 50% del viewport
// =============================================
(function initAccionistaHighlights() {
  const section = document.querySelector('.accionista-section');
  if (!section) return;

  section.querySelectorAll('.hl').forEach((hl, i) => {
    hl.style.transitionDelay = (i * 0.12) + 's';
  });

  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('hl-visible');
      }
    },
    { threshold: 0.5 }
  ).observe(section);
})();

// =============================================
// FORD SECTION — slide-up reveal + parallax
// =============================================
(function initFordSection() {
  const section = document.querySelector('.ford-section');
  const wrap    = document.getElementById('fordParallax');
  if (!section || !wrap) return;

  // 1) Reveal slide-up cuando la sección entra al viewport
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('ford-visible');
      }
    },
    { threshold: 0.15 }
  ).observe(section);

  // 2) Parallax suave: el bloque sube un poco más lento que el scroll
  let rafId = null;
  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const rect     = section.getBoundingClientRect();
      const viewH    = window.innerHeight;
      // progreso de -1 (antes de entrar) a +1 (después de salir)
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const clamp    = Math.min(Math.max(progress, 0), 1);
      // desplazamiento máximo de ±40px (breve, no invasivo)
      const shift    = (clamp - 0.5) * -80;
      wrap.style.transform = `translateY(${shift}px)`;
      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// =============================================
// CARTA SECTION — scroll-driven color reveal letra a letra
// =============================================
(function initCartaSection() {
  const section = document.querySelector('.carta-section');
  const card    = document.querySelector('.carta-card');
  if (!section || !card) return;

  // Separar cada bloque en spans por caracter
  const blocks   = section.querySelectorAll('.carta-block');
  const allChars = [];

  blocks.forEach(block => {
    const text = block.textContent;
    block.textContent = '';

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = 'carta-char';
      span.textContent = text[i];
      block.appendChild(span);
      // Solo animar caracteres visibles (no espacios)
      if (text[i].trim() !== '') {
        allChars.push(span);
      }
    }
  });

  const total = allChars.length;
  let rafId   = null;

  function update() {
    const rect      = section.getBoundingClientRect();
    const scrolled  = Math.max(-rect.top, 0);
    const maxScroll = section.offsetHeight - window.innerHeight;
    const ratio     = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    // Revelar chars de negro a naranja linealmente
    const litCount = Math.floor(ratio * total);
    for (let i = 0; i < total; i++) {
      allChars[i].style.color = i < litCount ? '#FF5C00' : '#111';
    }

    // Tarjeta fija — sin parallax
    card.style.transform = 'none';

    rafId = null;
  }

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

// =============================================
// ENGRANES — carrusel vertical scroll-hijack + snap
// =============================================
(function initEngranesScroll() {
  const section = document.getElementById('engranes');
  const track   = document.getElementById('engranesTrack');
  const pbar    = document.getElementById('engranesProgress');
  const dots    = [0,1,2,3,4,5].map(i => document.getElementById('ed' + i));
  if (!section || !track) return;

  const SLIDES = 6;
  let rafId     = null;
  let activeDot = 0;

  dots[0].classList.add('active');

  function getInfo() {
    const rect      = section.getBoundingClientRect();
    const scrolled  = Math.max(-rect.top, 0);
    const maxScroll = section.offsetHeight - window.innerHeight;
    const ratio     = Math.min(Math.max(scrolled / maxScroll, 0), 1);
    return { scrolled, maxScroll, ratio, rect };
  }

  function update() {
    const { ratio, rect } = getInfo();

    // Solo actuar cuando la sección está en pantalla
    if (rect.bottom < 0 || rect.top > window.innerHeight) { rafId = null; return; }

    // Mover track hacia arriba
    const offsetPct = ratio * (SLIDES - 1) / SLIDES * 100;
    track.style.transform = `translateY(-${offsetPct}%)`;

    // Barra de progreso
    if (pbar) pbar.style.width = (100 / SLIDES + ratio * (100 - 100 / SLIDES)) + '%';

    // Dots
    const idx = Math.min(Math.round(ratio * (SLIDES - 1)), SLIDES - 1);
    if (idx !== activeDot) {
      dots[activeDot].classList.remove('active');
      dots[idx].classList.add('active');
      activeDot = idx;
    }

    rafId = null;
  }

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

// =============================================
// STACK SECTION — parallax del título en mobile
// =============================================
(function initStackParallax() {
  const section = document.querySelector('.stack-section');
  const inner   = document.querySelector('.stack-title-inner');
  const arrow   = document.querySelector('.stack-scroll-arrow');
  if (!section || !inner) return;

  function onScroll() {
    if (window.innerWidth > 768) {
      inner.style.transform = '';
      if (arrow) arrow.style.opacity = '';
      return;
    }

    const rect      = section.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Progreso de 0 (sección entra al viewport) a 1 (scrolleado un viewport completo)
    const scrolled  = Math.max(-rect.top, 0);
    const progress  = Math.min(scrolled / viewportH, 1);

    // El título baja desde el top hacia el centro (~30vh de desplazamiento)
    const maxShift  = viewportH * 0.30;
    inner.style.transform = `translateY(${progress * maxShift}px)`;

    // La flecha se desvanece rápido al empezar a scrollear
    if (arrow) arrow.style.opacity = Math.max(1 - progress * 5, 0);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

// =============================================
// NOSOTROS — convergencia editorial de fotos en scroll
// =============================================
(function initNosotros() {
  var track    = document.getElementById('nosScrollTrack');
  var benji    = document.getElementById('nosBenji');
  var chema    = document.getElementById('nosChema');
  var headline = document.getElementById('nosHeadline');
  if (!track || !benji || !chema) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si el usuario prefiere sin movimiento, mostrar estado final directamente
  if (reduced) {
    benji.style.transform    = 'translateX(0)';
    chema.style.transform    = 'translateX(0)';
    if (headline) { headline.style.opacity = '1'; headline.style.transform = 'translateY(0)'; }
    return;
  }

  var raf = null;

  // Ease out cúbico: arranque rápido, final suave
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Ease out cuártico para Chema (ligeramente más dramático)
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function tick() {
    var rect   = track.getBoundingClientRect();
    var trackH = track.offsetHeight;
    var vh     = window.innerHeight;

    // p: 0 = track justo entrando por abajo, 1 = track completamente scrolleado
    var scrolled = -rect.top;
    var maxScroll = trackH - vh;
    var p = maxScroll > 0 ? Math.max(0, Math.min(1, scrolled / maxScroll)) : 0;

    // — Convergencia: fotos entran durante el primer 72% del scroll —
    var photoP = Math.min(1, p / 0.72);

    // Benji entra desde la izquierda (más lenta, ease out cubic)
    var benjiEased = easeOutCubic(photoP);
    var benjiX = (1 - benjiEased) * -108; // vw units

    // Chema entra desde la derecha (ligeramente más rápida, ease out quart)
    var chemaEased = easeOutQuart(photoP);
    var chemaX = (1 - chemaEased) * 112;  // vw units

    benji.style.transform = 'translateX(' + benjiX + 'vw)';
    chema.style.transform = 'translateX(' + chemaX + 'vw)';

    // — Headline: aparece entre el 65% y el 85% del scroll —
    if (headline) {
      var textP  = Math.max(0, Math.min(1, (p - 0.65) / 0.20));
      var textY  = (1 - textP) * 22; // px
      headline.style.opacity   = textP;
      headline.style.transform = 'translateY(' + textY + 'px)';
    }

    raf = null;
  }

  window.addEventListener('scroll', function() {
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  window.addEventListener('resize', function() {
    requestAnimationFrame(tick);
  }, { passive: true });

  requestAnimationFrame(tick);
})();
