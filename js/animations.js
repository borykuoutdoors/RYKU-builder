/**
 * BŌRYKU Platform — Cinematic Animation System
 * Powered by Framer Motion (vanilla DOM API)
 *
 * Aesthetic: Tactical · Premium · Cinematic · Smooth
 * Rule: transform + opacity only. No bouncing. No glow overload.
 */

import { animate, stagger, inView, scroll } from 'https://esm.sh/framer-motion@11';

/* ─── EASING PRESETS ────────────────────────────────────────────────────── */
const E = {
  out:   [0.16, 1, 0.3, 1],   // swift deceleration — core premium feel
  in:    [0.7,  0, 0.84, 0],  // swift acceleration
  inOut: [0.45, 0, 0.15, 1],
  linear: 'linear',
};

const D = { xs: 0.16, sm: 0.26, md: 0.42, lg: 0.60 };

const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ─── 1. PAGE ENTRANCE ──────────────────────────────────────────────────── */
function pageEntrance() {
  // Instant set + fast fade — barely perceptible, removes FOUC feel
  animate(document.body, { opacity: [0, 1] }, { duration: D.md, ease: E.out });
}

/* ─── 2. NAV ────────────────────────────────────────────────────────────── */
function navEntrance() {
  const nav = qs('nav');
  if (!nav) return;
  animate(nav, { opacity: [0, 1], y: [-14, 0] }, {
    duration: D.lg, ease: E.out, delay: 0.05,
  });
}

/* ─── 3. HERO ───────────────────────────────────────────────────────────── */
function heroEntrance() {
  const lines = qsa('.hero-title .line-1, .hero-title .line-2, .hero-title .line-3');
  if (lines.length) {
    animate(lines, { opacity: [0, 1], y: [30, 0], filter: ['blur(6px)', 'blur(0px)'] }, {
      duration: D.lg,
      delay: stagger(0.11, { startDelay: 0.12 }),
      ease: E.out,
    });
  }

  const eyebrow = qs('.hero-eyebrow');
  if (eyebrow) {
    animate(eyebrow, { opacity: [0, 1], y: [10, 0] }, { duration: D.md, delay: 0.08, ease: E.out });
  }

  const sub = qs('.hero-sub');
  if (sub) {
    animate(sub, { opacity: [0, 1], y: [16, 0] }, { duration: D.md, delay: 0.52, ease: E.out });
  }

  const ctas = qsa('.hero-ctas .btn');
  if (ctas.length) {
    animate(ctas, { opacity: [0, 1], y: [12, 0] }, {
      duration: D.sm + 0.1,
      delay: stagger(0.07, { startDelay: 0.72 }),
      ease: E.out,
    });
  }

  const stats = qsa('.hero-stats .stat, .hero-stat');
  if (stats.length) {
    animate(stats, { opacity: [0, 1], y: [12, 0] }, {
      duration: D.sm + 0.1,
      delay: stagger(0.06, { startDelay: 0.95 }),
      ease: E.out,
    });
  }
}

/* ─── 4. HERO PARALLAX (scroll-linked) ─────────────────────────────────── */
function heroParallax() {
  const hero   = qs('.hero');
  const heroBg = qs('.hero-bg') || qs('.hero-bg-gradient');
  if (!hero || !heroBg) return;

  // Background drifts at ~22% of scroll speed — subtle depth effect
  scroll(
    animate(heroBg, { y: ['0px', '55px'] }, { ease: E.linear }),
    { target: hero, offset: ['start start', 'end start'] }
  );
}

/* ─── 5. SCROLL REVEALS ─────────────────────────────────────────────────── */
function scrollReveals() {
  // Section headings — stagger the tag + title + sub trio
  const headingGroups = qsa('section');
  headingGroups.forEach(section => {
    const els = qsa('.section-tag, .section-title, .section-sub', section);
    if (!els.length) return;
    els.forEach(el => { el.style.opacity = '0'; });
    inView(section, () => {
      animate(els, { opacity: [0, 1], y: [18, 0] }, {
        duration: D.md,
        delay: stagger(0.07),
        ease: E.out,
      });
    }, { amount: 0.15 });
  });

  // Generic .reveal elements not inside grids (main.js no longer handles these)
  qsa('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'none'; // framer-motion owns transform now
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [22, 0] }, { duration: D.md, ease: E.out });
    }, { amount: 0.12 });
  });
}

/* ─── 6. STAGGERED CARD GRIDS ───────────────────────────────────────────── */
const GRID_SELECTORS = [
  '.builds-grid',
  '.gear-grid',
  '.product-grid',
  '.installer-grid',
  '.brands-grid',
  '.contest-grid',
  '.contest-entries',
  '.features-grid',
  '.winners-grid',
  '.past-winners-grid',
  '.account-sections',
];

function cardGrids() {
  GRID_SELECTORS.forEach(sel => {
    const grid = qs(sel);
    if (!grid) return;

    const cards = [...grid.children];
    if (!cards.length) return;

    cards.forEach(c => { c.style.opacity = '0'; });

    inView(grid, () => {
      animate(cards, { opacity: [0, 1], y: [28, 0] }, {
        duration: D.md,
        delay: stagger(0.05),
        ease: E.out,
      });
    }, { amount: 0.06 });
  });
}

/* ─── 7. BUTTON PRESS FEEDBACK ─────────────────────────────────────────── */
function buttonPress() {
  // Only press state — CSS handles hover scale/color (avoid conflicts)
  document.addEventListener('mousedown', e => {
    const btn = e.target.closest('.btn');
    if (!btn || btn.classList.contains('nav-mobile-toggle')) return;
    animate(btn, { scale: 0.96 }, { duration: D.xs, ease: E.in });
  });

  document.addEventListener('mouseup', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    animate(btn, { scale: 1 }, { duration: D.sm, ease: E.out });
  });

  // Vote buttons — tactile feedback
  qsa('.vote-btn, .product-card-action').forEach(btn => {
    btn.addEventListener('mousedown', () =>
      animate(btn, { scale: 0.94 }, { duration: D.xs, ease: E.in })
    );
    btn.addEventListener('mouseup', () =>
      animate(btn, { scale: 1 }, { duration: D.sm, ease: E.out })
    );
  });
}

/* ─── 8. MOBILE MENU ────────────────────────────────────────────────────── */
function mobileMenuAnimation() {
  const menu = qs('.nav-mobile-menu');
  if (!menu) return;

  const observer = new MutationObserver(() => {
    if (menu.classList.contains('open')) {
      animate(menu, { opacity: [0, 1], y: [-10, 0] }, { duration: D.sm, ease: E.out });
      const items = qsa('.nav-mobile-link, .mobile-auth-section > *', menu);
      if (items.length) {
        animate(items, { opacity: [0, 1], x: [-10, 0] }, {
          duration: D.sm,
          delay: stagger(0.04, { startDelay: 0.04 }),
          ease: E.out,
        });
      }
    }
  });
  observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
}

/* ─── 9. AUTH BOX ENTRANCE ─────────────────────────────────────────────── */
function authEntrance() {
  const box = qs('.auth-box');
  if (!box) return;
  box.style.opacity = '0';
  animate(box, { opacity: [0, 1], y: [24, 0], scale: [0.97, 1] }, {
    duration: D.md + 0.05,
    ease: E.out,
    delay: 0.1,
  });

  // Tab switch animation — panel cross-fade
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const activePanel = qs('.auth-panel.active');
      if (activePanel) {
        animate(activePanel, { opacity: [0, 1], y: [8, 0] }, {
          duration: D.sm,
          ease: E.out,
        });
      }
    });
  });
}

/* ─── 10. BUILD PLANNER PANELS ─────────────────────────────────────────── */
function plannerEntrance() {
  const panels = qsa('.planner-sidebar, .planner-preview, .planner-invoice');
  if (!panels.length) return;
  panels.forEach(p => { p.style.opacity = '0'; });
  animate(panels, { opacity: [0, 1], y: [14, 0] }, {
    duration: D.md,
    delay: stagger(0.07, { startDelay: 0.18 }),
    ease: E.out,
  });
}

/* ─── 11. VEHICLE CONFIG MODAL ─────────────────────────────────────────── */
function modalAnimation() {
  const modal = qs('#vehicle-config-modal, .modal');
  if (!modal) return;

  const observer = new MutationObserver(() => {
    if (modal.classList.contains('open')) {
      const inner = qs('.modal-inner, .vehicle-modal', modal) || modal.firstElementChild;
      if (inner) {
        animate(inner, { opacity: [0, 1], y: [16, 0], scale: [0.97, 1] }, {
          duration: D.md,
          ease: E.out,
        });
      }
    }
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

/* ─── 12. SUBMIT FORM STEP TRANSITIONS ─────────────────────────────────── */
function formStepAnimation() {
  // Observe step changes
  const steps = qsa('.step-panel, .form-step');
  if (!steps.length) return;

  steps.forEach(step => {
    const stepObserver = new MutationObserver(() => {
      if (step.classList.contains('active')) {
        animate(step, { opacity: [0, 1], x: [20, 0] }, {
          duration: D.sm + 0.05,
          ease: E.out,
        });
      }
    });
    stepObserver.observe(step, { attributes: true, attributeFilter: ['class'] });
  });
}

/* ─── 13. ACCOUNT DASHBOARD SECTIONS ───────────────────────────────────── */
function accountSectionAnimation() {
  // Animate in the active section when tabs switch
  const contentArea = qs('.account-content, .dashboard-main');
  if (!contentArea) return;

  const sectionObserver = new MutationObserver(() => {
    const active = qs('.account-section.active, .dash-section.active', contentArea);
    if (active) {
      animate(active, { opacity: [0, 1], y: [12, 0] }, {
        duration: D.md,
        ease: E.out,
      });
      // Stagger children
      const children = [...active.children];
      if (children.length > 1) {
        animate(children, { opacity: [0, 1], y: [10, 0] }, {
          duration: D.sm,
          delay: stagger(0.05, { startDelay: 0.08 }),
          ease: E.out,
        });
      }
    }
  });
  sectionObserver.observe(contentArea, { subtree: true, attributes: true, attributeFilter: ['class'] });
}

/* ─── 14. PAGE EXIT TRANSITION ─────────────────────────────────────────── */
function pageTransitions() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      link.hasAttribute('download') ||
      link.getAttribute('target') === '_blank'
    ) return;

    e.preventDefault();
    animate(document.body, { opacity: [1, 0] }, { duration: D.xs + 0.04, ease: E.in })
      .then(() => { window.location.href = href; });
  });
}

/* ─── GLOBAL API — for dynamic content in build planner & elsewhere ─────── */
window.BORIKU_ANIM = {

  /**
   * Stagger-reveal dynamically rendered cards.
   * Pass a container element, NodeList, or Array.
   */
  revealCards(source) {
    const items = (source instanceof Element)
      ? [...source.children]
      : [...source];
    if (!items.length) return;
    items.forEach(c => { c.style.opacity = '0'; });
    animate(items, { opacity: [0, 1], y: [20, 0] }, {
      duration: D.md,
      delay: stagger(0.05),
      ease: E.out,
    });
  },

  /**
   * Animate an SVG accessory layer popping onto the vehicle.
   */
  pulseLayer(layerEl) {
    if (!layerEl) return;
    animate(layerEl, { opacity: [0, 1], scale: [0.88, 1], y: ['-6px', '0px'] }, {
      duration: D.md,
      ease: E.out,
    });
  },

  /**
   * Animate an SVG layer fading off (returns promise to hide after).
   */
  fadeLayer(layerEl) {
    if (!layerEl) return animate(layerEl, { opacity: 0 }, { duration: D.sm, ease: E.in });
    return animate(layerEl, { opacity: [1, 0], scale: [1, 0.92] }, {
      duration: D.sm,
      ease: E.in,
    });
  },

  /**
   * Slide in a newly added invoice line item.
   */
  flashRow(rowEl) {
    if (!rowEl) return;
    animate(rowEl, { opacity: [0, 1], x: ['-14px', '0px'] }, {
      duration: D.sm,
      ease: E.out,
    });
  },

  /**
   * Shake an element — used when budget is exceeded.
   */
  shake(el) {
    if (!el) return;
    animate(el, { x: [0, -7, 7, -5, 5, -2, 0] }, {
      duration: 0.42,
      ease: E.inOut,
    });
  },

  /**
   * Loading shimmer: pulse opacity while fetching/filtering.
   */
  shimmer(containerEl) {
    if (!containerEl) return;
    return animate(containerEl, { opacity: [1, 0.35, 1] }, {
      duration: 0.7,
      repeat: Infinity,
      ease: E.inOut,
    });
  },

  stopShimmer(animation) {
    if (animation && animation.stop) animation.stop();
  },
};

/* ─── INIT ──────────────────────────────────────────────────────────────── */
function init() {
  pageEntrance();
  navEntrance();
  heroEntrance();
  heroParallax();
  scrollReveals();
  cardGrids();
  buttonPress();
  mobileMenuAnimation();
  authEntrance();
  plannerEntrance();
  modalAnimation();
  formStepAnimation();
  accountSectionAnimation();
  pageTransitions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
