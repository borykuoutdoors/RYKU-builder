/* ============================================
   BŌRYKU / RYKU — CORE JS
   ============================================ */

(function () {
  'use strict';

  /* ---- NAV ---- */
  const nav = document.querySelector('.nav');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      mobileToggle.innerHTML = open
        ? `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect y="3" width="18" height="2" rx="1" fill="currentColor"/><rect y="8" width="18" height="2" rx="1" fill="currentColor"/><rect y="13" width="18" height="2" rx="1" fill="currentColor"/></svg>`;
    });
    mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ---- ACTIVE NAV LINK ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      (currentPath === '' && href === 'index.html') ||
      href === currentPath ||
      (currentPath === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- REVEAL ANIMATIONS (handled by js/animations.js via Framer Motion) ---- */

  /* ---- TOAST NOTIFICATIONS ---- */
  window.showToast = function (message, type = 'success', duration = 3500) {
    const icons = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon ${type !== 'success' ? type : ''}">${icons[type] || '✓'}</span><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ---- COUNTER ANIMATIONS (stats) ---- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ---- FILTER BUTTONS ---- */
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const target = btn.closest('[data-filter-parent]') || document.querySelector('[data-filter-target]');
      if (target) {
        target.querySelectorAll('[data-category]').forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
        });
      }
    });
  });

  /* ---- HERO PARALLAX (handled by js/animations.js via Framer Motion scroll()) ---- */

})();
