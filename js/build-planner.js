/* ============================================
   BŌRYKU / RYKU — BUILD PLANNER
   ============================================ */

(function () {
  'use strict';

  /* ---- STATE ---- */
  const state = {
    vehicle: null,
    year: null,
    trim: null,
    mission: null,
    budget: 15000,
    selectedProducts: {},   // categoryId → product object
    activeCategory: 'roof-racks',
    buildName: 'MY BUILD'
  };

  /* ---- SVG LAYER MAP ---- */
  const SVG_LAYERS = {
    'roof-rack':    'layer-roof-rack',
    'rtt':          'layer-rtt',
    'suspension':   'layer-suspension',
    'front-bumper': 'layer-front-bumper',
    'rear-bumper':  'layer-rear-bumper',
    'sliders':      'layer-sliders',
    'wheels':       'layer-wheels-upgraded',
    'tires':        'layer-wheels-upgraded',
    'lightbar':     'layer-lightbar',
    'aux-lights':   'layer-aux-lights'
  };

  /* ---- INIT ---- */
  function init() {
    renderCategories();
    setupVehicleConfig();
    loadCategoryProducts(state.activeCategory);
    updateSummary();
    setupBuildActions();
    updateLayerTags();

    document.getElementById('build-name-input')?.addEventListener('input', e => {
      state.buildName = e.target.value || 'MY BUILD';
      const nameEl = document.getElementById('build-name-display');
      if (nameEl) nameEl.textContent = state.buildName;
    });
  }

  /* ---- CATEGORIES ---- */
  function renderCategories() {
    const container = document.getElementById('category-list');
    if (!container) return;

    container.innerHTML = BORIKU_DATA.categories.map(cat => `
      <button class="planner-category-btn ${cat.id === state.activeCategory ? 'active' : ''}"
              data-cat="${cat.id}" onclick="selectCategory('${cat.id}')">
        <span class="planner-category-icon">${cat.icon}</span>
        <span>${cat.label}</span>
        <span class="count">${getSelectedForCategory(cat.id) ? '✓' : cat.count}</span>
      </button>
    `).join('');
  }

  window.selectCategory = function (catId) {
    state.activeCategory = catId;
    document.querySelectorAll('.planner-category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === catId);
    });
    loadCategoryProducts(catId);
    document.getElementById('products-area')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  function getSelectedForCategory(catId) {
    return state.selectedProducts[catId] || null;
  }

  /* ---- VEHICLE CONFIGURATOR ---- */
  function setupVehicleConfig() {
    const openBtn = document.getElementById('open-vehicle-config');
    const modal = document.getElementById('vehicle-config-modal');
    const closeBtn = document.getElementById('close-vehicle-config');
    const confirmBtn = document.getElementById('confirm-vehicle');
    const vehicleSelect = document.getElementById('vehicle-select');
    const yearSelect = document.getElementById('year-select');
    const trimSelect = document.getElementById('trim-select');
    const missionBtns = document.querySelectorAll('.mission-btn');

    if (!modal) return;

    openBtn?.addEventListener('click', () => modal.classList.add('open'));
    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

    vehicleSelect?.addEventListener('change', () => {
      const vehicle = BORIKU_DATA.vehicles.find(v => v.id === vehicleSelect.value);
      if (!vehicle) return;
      yearSelect.innerHTML = '<option value="">Select Year</option>';
      trimSelect.innerHTML = '<option value="">Select Trim</option>';
      vehicle.generations.forEach(gen => {
        gen.years.forEach(yr => {
          yearSelect.innerHTML += `<option value="${yr}">${yr}</option>`;
        });
      });
      vehicle.trims.forEach(trim => {
        trimSelect.innerHTML += `<option value="${trim}">${trim}</option>`;
      });
    });

    missionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        missionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mission = btn.dataset.mission;
      });
    });

    const budgetSlider = document.getElementById('budget-slider');
    const budgetDisplay = document.getElementById('budget-display');
    budgetSlider?.addEventListener('input', () => {
      state.budget = parseInt(budgetSlider.value);
      if (budgetDisplay) budgetDisplay.textContent = '$' + state.budget.toLocaleString();
      updateSummary();
    });

    confirmBtn?.addEventListener('click', () => {
      const vehicleId = vehicleSelect?.value;
      const year = yearSelect?.value;
      const trim = trimSelect?.value;

      if (!vehicleId || !year || !trim) {
        showToast('Please select vehicle, year, and trim.', 'warning');
        return;
      }

      const vehicle = BORIKU_DATA.vehicles.find(v => v.id === vehicleId);
      state.vehicle = vehicle;
      state.year = year;
      state.trim = trim;

      updateVehicleDisplay();
      modal.classList.remove('open');
      loadCategoryProducts(state.activeCategory);
      updateSummary();
      showToast(`${year} ${vehicle.name} ${trim} configured!`);
    });
  }

  function updateVehicleDisplay() {
    const nameEl = document.getElementById('vehicle-name-display');
    const yearEl = document.getElementById('vehicle-year-display');
    const iconEl = document.getElementById('vehicle-icon-display');
    if (state.vehicle) {
      if (nameEl) nameEl.textContent = `${state.vehicle.name} ${state.trim}`;
      if (yearEl) yearEl.textContent = state.year;
      if (iconEl) iconEl.textContent = state.vehicle.icon;
    }
  }

  /* ---- PRODUCTS ---- */
  function loadCategoryProducts(catId) {
    const area = document.getElementById('products-area');
    const headerEl = document.getElementById('products-category-name');
    const countEl = document.getElementById('products-count');
    if (!area) return;

    const cat = BORIKU_DATA.categories.find(c => c.id === catId);
    if (headerEl && cat) headerEl.textContent = cat.label;

    let products = BORIKU_DATA.products.filter(p => p.category === catId);

    if (state.vehicle) {
      products = products.filter(p => p.compatibility.includes(state.vehicle.id));
    }

    if (countEl) countEl.textContent = `${products.length} Compatible Products`;

    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const selected = state.selectedProducts[catId];

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:48px; color:var(--text-3);">
          <div style="font-size:2rem; margin-bottom:12px;">🔧</div>
          <div style="font-weight:700; margin-bottom:6px;">No compatible products found</div>
          <div style="font-size:0.8125rem;">${state.vehicle ? 'Try selecting a different vehicle or category.' : 'Configure your vehicle above to see compatible products.'}</div>
        </div>`;
      return;
    }

    grid.innerHTML = products.map(p => renderProductCard(p, selected?.id === p.id)).join('');

    grid.querySelectorAll('.product-card-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = btn.closest('[data-product-id]').dataset.productId;
        toggleProduct(catId, productId);
      });
    });
  }

  function renderProductCard(p, isSelected) {
    const diffClass = p.installDifficulty === 'Pro Install' ? 'tag-warning' : 'tag-success';
    const popClass = p.popularity ? 'tag-accent' : 'tag-default';

    return `
      <div class="product-card ${isSelected ? 'selected' : ''}" data-product-id="${p.id}">
        <div class="product-card-image">
          ${getProductIcon(p.category)}
          ${p.popularity ? `<span class="product-card-badge">${p.popularity}</span>` : ''}
        </div>
        <div class="product-card-body">
          <div class="product-card-brand">${p.brand}</div>
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-compat" style="font-size:0.75rem;color:var(--text-3);">${p.model}</div>
          <div class="product-card-meta">
            <span class="tag ${diffClass}">${p.installDifficulty}</span>
            ${p.weight ? `<span class="tag tag-default">${p.weight}</span>` : ''}
          </div>
          <div style="font-size:0.75rem;color:var(--text-3);margin-top:6px;line-height:1.5;">${p.desc}</div>
        </div>
        <div class="product-card-footer">
          <div>
            <div class="product-card-price">$${p.price.toLocaleString()}</div>
            ${p.installCost > 0 ? `<div style="font-size:0.6875rem;color:var(--text-3);">+$${p.installCost} install est.</div>` : ''}
          </div>
          <button class="product-card-action">
            ${isSelected ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>`;
  }

  function getProductIcon(category) {
    const icons = {
      'roof-racks': `<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="24" width="48" height="8" rx="2" stroke="currentColor" stroke-width="2"/><rect x="12" y="20" width="4" height="12" rx="1" fill="currentColor" opacity="0.4"/><rect x="48" y="20" width="4" height="12" rx="1" fill="currentColor" opacity="0.4"/></svg>`,
      'rtt': `<svg viewBox="0 0 64 64" fill="none"><path d="M8 32l24-16 24 16v16H8z" stroke="currentColor" stroke-width="2"/><path d="M20 48V36h8v12" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'suspension': `<svg viewBox="0 0 64 64" fill="none"><circle cx="20" cy="44" r="12" stroke="currentColor" stroke-width="2"/><circle cx="44" cy="44" r="12" stroke="currentColor" stroke-width="2"/><path d="M20 20v12M44 20v12M16 20h32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      'front-bumpers': `<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="24" width="48" height="16" rx="3" stroke="currentColor" stroke-width="2"/><path d="M8 28H4v8h4M56 28h4v8h-4" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'rear-bumpers': `<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="24" width="48" height="16" rx="3" stroke="currentColor" stroke-width="2"/><circle cx="48" cy="32" r="6" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'sliders': `<svg viewBox="0 0 64 64" fill="none"><rect x="4" y="28" width="56" height="8" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 28v8M24 28v8M36 28v8M48 28v8" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'wheels': `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="32" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M32 8v16M32 40v16M8 32h16M40 32h16" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'tires': `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="14" stroke="currentColor" stroke-width="2"/></svg>`,
      'lighting': `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="28" r="12" stroke="currentColor" stroke-width="2"/><path d="M32 8v4M32 44v4M8 28h4M52 28h4M14 14l3 3M47 47l3 3M14 42l3-3M47 17l3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="24" y="40" width="16" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'recovery': `<svg viewBox="0 0 64 64" fill="none"><path d="M12 32c0-11 9-20 20-20s20 9 20 20" stroke="currentColor" stroke-width="2"/><path d="M20 44l-8-12h8l4-16 4 16h8l-8 12" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'storage': `<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="16" width="48" height="32" rx="3" stroke="currentColor" stroke-width="2"/><path d="M8 32h48M24 16v16M40 16v16" stroke="currentColor" stroke-width="1.5"/></svg>`,
      'communication': `<svg viewBox="0 0 64 64" fill="none"><path d="M32 8v32M8 20c7-8 16-12 24-12s17 4 24 12M14 28c5-6 11-9 18-9s13 3 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="44" r="6" stroke="currentColor" stroke-width="2"/></svg>`
    };
    return icons[category] || `<svg viewBox="0 0 64 64" fill="none"><rect x="16" y="16" width="32" height="32" rx="4" stroke="currentColor" stroke-width="2"/></svg>`;
  }

  function toggleProduct(catId, productId) {
    const product = BORIKU_DATA.products.find(p => p.id === productId);
    if (!product) return;

    if (state.selectedProducts[catId]?.id === productId) {
      delete state.selectedProducts[catId];
      removeVehicleLayer(product.svgLayer);
      showToast(`${product.brand} ${product.name} removed`, 'info');
    } else {
      const old = state.selectedProducts[catId];
      if (old) removeVehicleLayer(old.svgLayer);
      state.selectedProducts[catId] = product;
      addVehicleLayer(product.svgLayer);
      showToast(`${product.brand} ${product.name} added to build!`);
    }

    loadCategoryProducts(catId);
    renderCategories();
    updateSummary();
    updateLayerTags();
  }

  /* ---- SVG VEHICLE VISUALIZATION ---- */
  function addVehicleLayer(layerKey) {
    if (!layerKey) return;
    const layerId = SVG_LAYERS[layerKey];
    if (!layerId) return;
    const el = document.getElementById(layerId);
    if (el) {
      el.style.display = '';
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.transform = 'translateY(-4px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    }
  }

  function removeVehicleLayer(layerKey) {
    if (!layerKey) return;
    const layerId = SVG_LAYERS[layerKey];
    if (!layerId) return;
    const el = document.getElementById(layerId);
    if (el) {
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity = '0';
      setTimeout(() => { el.style.display = 'none'; }, 400);
    }
  }

  function updateLayerTags() {
    const container = document.getElementById('layer-tags');
    if (!container) return;

    const layerLabels = {
      'roof-rack': 'Roof Rack',
      'rtt': 'RTT',
      'suspension': 'Lift Kit',
      'front-bumper': 'Front Bumper',
      'rear-bumper': 'Rear Bumper',
      'sliders': 'Sliders',
      'wheels': 'Wheels',
      'lightbar': 'Light Bar',
      'aux-lights': 'Aux Lights'
    };

    const activeLayers = Object.values(state.selectedProducts)
      .filter(p => p.svgLayer)
      .map(p => p.svgLayer);

    container.innerHTML = Object.entries(layerLabels).map(([key, label]) => `
      <span class="preview-layer-tag ${activeLayers.includes(key) ? 'active' : ''}">
        <span class="preview-layer-tag-dot"></span>
        ${label}
      </span>
    `).join('');
  }

  /* ---- SUMMARY / INVOICE ---- */
  function updateSummary() {
    const parts = Object.values(state.selectedProducts);
    const subtotal = parts.reduce((sum, p) => sum + p.price, 0);
    const installTotal = parts.reduce((sum, p) => sum + (p.installCost || 0), 0);
    const total = subtotal + installTotal;
    const remaining = state.budget - total;
    const pct = Math.min((total / state.budget) * 100, 100);

    const subtotalEl = document.getElementById('summary-subtotal');
    const installEl = document.getElementById('summary-install');
    const totalEl = document.getElementById('summary-total');
    const remainEl = document.getElementById('summary-remaining');
    const barFill = document.getElementById('budget-bar-fill');
    const partsListEl = document.getElementById('summary-parts-list');
    const emptyEl = document.getElementById('summary-empty');

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toLocaleString();
    if (installEl) installEl.textContent = '$' + installTotal.toLocaleString();
    if (totalEl) {
      totalEl.textContent = '$' + total.toLocaleString();
      totalEl.classList.toggle('over', total > state.budget);
    }
    if (remainEl) {
      remainEl.textContent = (remaining >= 0 ? '+$' : '-$') + Math.abs(remaining).toLocaleString();
      remainEl.style.color = remaining >= 0 ? 'var(--success)' : 'var(--danger)';
    }
    if (barFill) {
      barFill.style.width = pct + '%';
      barFill.classList.toggle('over', total > state.budget);
      barFill.classList.toggle('near', !barFill.classList.contains('over') && pct > 80);
    }

    if (partsListEl) {
      if (parts.length === 0) {
        if (emptyEl) emptyEl.style.display = '';
        partsListEl.innerHTML = '';
      } else {
        if (emptyEl) emptyEl.style.display = 'none';
        partsListEl.innerHTML = parts.map(p => `
          <div class="summary-line">
            <div style="flex:1;min-width:0;">
              <div class="summary-line-name">${p.name}</div>
              <span class="summary-line-brand">${p.brand}</span>
            </div>
            <div class="summary-line-price">$${p.price.toLocaleString()}</div>
            <button class="summary-line-remove" onclick="removePart('${p.category}')" title="Remove">✕</button>
          </div>
        `).join('');
      }
    }

    const partCountEl = document.getElementById('part-count');
    if (partCountEl) partCountEl.textContent = parts.length;
  }

  window.removePart = function (catId) {
    const product = state.selectedProducts[catId];
    if (product) {
      removeVehicleLayer(product.svgLayer);
      delete state.selectedProducts[catId];
      renderCategories();
      loadCategoryProducts(catId);
      updateSummary();
      updateLayerTags();
      showToast('Part removed from build', 'info');
    }
  };

  /* ---- BUILD ACTIONS ---- */
  function setupBuildActions() {
    document.getElementById('btn-save-build')?.addEventListener('click', saveBuild);
    document.getElementById('btn-export-quote')?.addEventListener('click', exportQuote);
    document.getElementById('btn-clear-build')?.addEventListener('click', clearBuild);
    document.getElementById('btn-share-build')?.addEventListener('click', shareBuild);
  }

  function saveBuild() {
    const parts = Object.values(state.selectedProducts);
    if (parts.length === 0) { showToast('Add at least one product to save', 'warning'); return; }
    const buildData = { ...state, savedAt: new Date().toISOString() };
    localStorage.setItem('boriku_build_draft', JSON.stringify(buildData));
    showToast(`"${state.buildName}" saved successfully!`);
  }

  function exportQuote() {
    const parts = Object.values(state.selectedProducts);
    if (parts.length === 0) { showToast('Add products before exporting', 'warning'); return; }

    let lines = [`BŌRYKU BUILD QUOTE\n${'='.repeat(40)}`];
    lines.push(`BUILD: ${state.buildName}`);
    if (state.vehicle) lines.push(`VEHICLE: ${state.year} ${state.vehicle.name} ${state.trim}`);
    if (state.mission) lines.push(`MISSION: ${state.mission}`);
    lines.push(`DATE: ${new Date().toLocaleDateString()}\n${'─'.repeat(40)}`);
    lines.push('PARTS & PRODUCTS:');

    let subtotal = 0, installTotal = 0;
    parts.forEach(p => {
      lines.push(`  ${p.brand} ${p.name}`);
      lines.push(`    Product: $${p.price.toLocaleString()}`);
      if (p.installCost > 0) lines.push(`    Install Est.: $${p.installCost.toLocaleString()}`);
      subtotal += p.price;
      installTotal += p.installCost || 0;
    });

    lines.push(`\n${'─'.repeat(40)}`);
    lines.push(`PARTS SUBTOTAL:   $${subtotal.toLocaleString()}`);
    lines.push(`INSTALL EST.:     $${installTotal.toLocaleString()}`);
    lines.push(`TOTAL ESTIMATE:   $${(subtotal + installTotal).toLocaleString()}`);
    lines.push(`\nBudget:           $${state.budget.toLocaleString()}`);
    lines.push(`Remaining:        $${(state.budget - subtotal - installTotal).toLocaleString()}`);
    lines.push(`\n${'='.repeat(40)}`);
    lines.push('Generated by BŌRYKU / RYKU Platform');
    lines.push('CONTROL THE CHAOS');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BORIKU_BUILD_QUOTE_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Quote exported successfully!');
  }

  function clearBuild() {
    if (Object.keys(state.selectedProducts).length === 0) return;
    if (!confirm('Clear all selected products?')) return;
    Object.values(state.selectedProducts).forEach(p => removeVehicleLayer(p.svgLayer));
    state.selectedProducts = {};
    renderCategories();
    loadCategoryProducts(state.activeCategory);
    updateSummary();
    updateLayerTags();
    showToast('Build cleared', 'info');
  }

  function shareBuild() {
    const parts = Object.values(state.selectedProducts);
    if (parts.length === 0) { showToast('Add products before sharing', 'warning'); return; }
    const text = `Check out my BŌRYKU build: ${state.buildName} — ${parts.length} parts configured`;
    if (navigator.share) {
      navigator.share({ title: `BŌRYKU Build: ${state.buildName}`, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast('Build details copied to clipboard!');
    }
  }

  /* ---- BOOT ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
