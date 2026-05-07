// 1. SCROLL REVEAL ANIMATION

(function initReveal() {
  
  const elements = document.querySelectorAll('.reveal');
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Dejar de observar una vez visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );
  
  elements.forEach((el) => observer.observe(el));
  
})();

/* ── 2. EFECTO CRISTAL EN NAVEGACIÓN AL HACER SCROLL ────────────────────────── */
(function initNavScroll() {
  const nav = document.querySelector('.nav-glass');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(6, 9, 18, 0.85)';
      nav.style.boxShadow  = '0 1px 0 rgba(255,255,255,0.06)';
    } else {
      nav.style.background = 'rgba(6, 9, 18, 0.60)';
      nav.style.boxShadow  = 'none';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 3. SCROLL SUAVE PARA TODOS LOS ENLACES ANCLA ─────────────────── */
(function initSmoothScroll() {
  const nav = document.querySelector('.nav-glass');
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navOffset = nav ? nav.getBoundingClientRect().height : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset - 12;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
})();

/* ── 4. EFECTO ONDA EN BOTONES (RIPPLE EFFECT) ───────────────────────────────── */
(function initRipple() {
  const RIPPLE_SELECTORS = '.btn-primary, .btn-primary-end, .btn-ghost-end, .btn-support, .btn-contact, .nav-cta';

  document.querySelectorAll(RIPPLE_SELECTORS).forEach((btn) => {
    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', (e) => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width:  ${size}px;
        height: ${size}px;
        left:   ${x}px;
        top:    ${y}px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnim 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      `;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  if (!document.getElementById('ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── 5. SEGUIMIENTO DE SECCIÓN ACTIVA ───────────────────── */
(function initSectionTracking() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.dispatchEvent(
            new CustomEvent('sectionChange', { detail: { id: entry.target.id } })
          );
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
})();

/* ── 6. ORBES DE PARALLAX ─────────────────────────────────────── */
(function initParallaxOrbs() {
  if (!matchMedia('(pointer: fine)').matches) return;

  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2; 
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2; 

    if (rafId) return; 
    rafId = requestAnimationFrame(() => {
      orbs.forEach((orb, i) => {
        const depth  = (i + 1) * 10; 
        const tx = mouseX * depth;
        const ty = mouseY * depth;
        orb.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      rafId = null;
    });
  });
})();

/* ── 7. INCLINACIÓN DE TARJETAS ───────────────────────────────────── */
(function initCardTilt() {
  if (!matchMedia('(pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MAX_TILT = 1.4;
  const HOVER_LIFT = -2;

  document.querySelectorAll('.glass-card, .motive-card, .support-hero-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;

      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const rotateX = -dy * MAX_TILT;
      const rotateY =  dx * MAX_TILT;

      card.style.transform    = `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${HOVER_LIFT}px)`;
      card.style.transition   = 'transform 0.05s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
})();

/* ── 7B. MICROINTERACCIÓN EN ACCIONES QR ───────────────────────────── */
(function initQrActionMotion() {
  if (!matchMedia('(pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const actionButtons = document.querySelectorAll('.qr-actions .btn-primary-end, .qr-actions .btn-ghost-end');
  if (!actionButtons.length) return;

  actionButtons.forEach((button) => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -ny * 4;
      const rotateY = nx * 4;

      button.style.transform = `translateY(-2px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      button.style.transition = 'transform 0.08s linear';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
})();

/* ── 8. COPIAR AL PORTAPAPELES (TELÉFONOS) ─────────────────── */
(function initPhoneCopy() {
  const phoneLinks = document.querySelectorAll('.contact-phone[href^="tel"]');
  if (!phoneLinks.length) return;

  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(14, 165, 233, 0.95);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.6rem 1.5rem;
    border-radius: 100px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    z-index: 9999;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  let toastTimer = null;

  const showToast = (message) => {
    toast.textContent = message;
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
  };

  phoneLinks.forEach((link) => {
    link.addEventListener('click', async () => {
      const number = link.href.replace('tel:', '');
      try {
        await navigator.clipboard.writeText(number);
        showToast('Número copiado al portapapeles');
      } catch {
        // Fallo silencioso si la API no está disponible
      }
    });
  });
})();

/* ── 9. ACCESIBILIDAD: SALTAR AL CONTENIDO ─────────────────────── */
(function injectSkipLink() {
  const skip = document.createElement('a');
  skip.href        = '#tips';
  skip.textContent = 'Saltar al contenido principal';
  skip.style.cssText = `
    position: fixed;
    top: -60px;
    left: 1rem;
    z-index: 10000;
    background: var(--ocean-500, #0ea5e9);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    text-decoration: none;
    transition: top 0.2s;
  `;
  skip.addEventListener('focus', () => { skip.style.top = '1rem'; });
  skip.addEventListener('blur',  () => { skip.style.top = '-60px'; });
  document.body.prepend(skip);
})();

/* ── 10. ANIMACIÓN DE CONTADORES ─────────────────── */
(function initCounters() {
  const animateCount = (el, target, duration, suffix) => {
    const start     = performance.now();
    const isDecimal = target !== Math.floor(target);

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = isDecimal
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);

      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statItems = document.querySelectorAll('.stat-number');
  const VALUES = [92, 3, 1];
  const SUFFIXES = ['%', 'x', ''];

  if (!statItems.length) return;

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        statItems.forEach((el, i) => {
          setTimeout(() => {
            animateCount(el, VALUES[i], 1400, SUFFIXES[i]);
          }, i * 150);
        });

        statObserver.disconnect();
      });
    },
    { threshold: 0.5 }
  );

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statObserver.observe(statsBar);
})();

/* ── 11. EASTER EGG EN LA CONSOLA ───────────────────────────────── */

console.log(
  '%cimpulso%c.',
  'color: #e5e7eb; font-weight: 600; font-size: 16px; font-family: Inter, sans-serif;',
  'color: #0ea5e9; font-weight: 700; font-size: 16px;'
);

/* ── 12. INTERACTIVIDAD SUTIL EN QR ───────────────────────────────── */
(function initQrHover() {
  if (!matchMedia('(pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const qr = document.querySelector('.qr-placeholder');
  if (!qr) return;

  qr.addEventListener('mousemove', (e) => {
    const rect = qr.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    qr.style.setProperty('--qr-tilt-x', `${(-ny * 1.25).toFixed(2)}deg`);
    qr.style.setProperty('--qr-tilt-y', `${(nx * 1.25).toFixed(2)}deg`);
  });

  qr.addEventListener('mouseleave', () => {
    qr.style.setProperty('--qr-tilt-x', '0deg');
    qr.style.setProperty('--qr-tilt-y', '0deg');
  });
})();

/* ── 13. COPIAR ENLACE DESDE QR ───────────────────────────────── */
(function initQrCopy() {
  const qr = document.querySelector('.qr-placeholder');
  const feedback = document.querySelector('.qr-copy-feedback');
  if (!qr || !feedback) return;

  const urlToCopy = qr.dataset.copyUrl || window.location.href;
  let clearStateTimeout;
  let clearMessageTimeout;

  const setFeedback = (message) => {
    feedback.textContent = message;
    feedback.classList.add('is-visible');
    clearTimeout(clearMessageTimeout);
    clearMessageTimeout = window.setTimeout(() => {
      feedback.classList.remove('is-visible');
    }, 2200);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      qr.classList.add('is-copied');
      setFeedback('¡Enlace copiado al portapapeles!');
      clearTimeout(clearStateTimeout);
      clearStateTimeout = window.setTimeout(() => qr.classList.remove('is-copied'), 1000);
    } catch (_) {
      setFeedback('No se pudo copiar automáticamente. Mantén presionado para copiar.');
    }
  };

  qr.addEventListener('click', copyLink);
  qr.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    copyLink();
  });
})();
