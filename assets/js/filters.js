/* =========================================================
   NOVARA — filters.js
   index.html catalog: search, quick pills, advanced filters,
   sort — plus the inline Accessories section category filter.
   ========================================================= */

let filters = {
  quick: 'all', search: '', sort: 'featured',
  brands: [], storage: [], ram: [], fiveG: false, dualSim: false, availability: [],
  priceMax: 5000000,
};

function matchesFilters(p) {
  if (filters.quick !== 'all' && !(p.category === filters.quick || p.status.includes(filters.quick))) return false;
  if (filters.search && !(p.brand + ' ' + p.name).toLowerCase().includes(filters.search.toLowerCase())) return false;
  if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
  if (filters.storage.length && !filters.storage.includes(p.storage)) return false;
  if (filters.ram.length && !filters.ram.includes(p.ram)) return false;
  if (filters.fiveG && !p.fiveG) return false;
  if (filters.dualSim && !p.dualSim) return false;
  if (filters.availability.length && !filters.availability.includes(p.availability)) return false;
  if (p.price > filters.priceMax) return false;
  return true;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  let list = Catalog.phones.filter(matchesFilters);
  if (filters.sort === 'price-low') list.sort((a, b) => a.price - b.price);
  else if (filters.sort === 'price-high') list.sort((a, b) => b.price - a.price);
  else if (filters.sort === 'rating') list.sort((a, b) => b.rating - a.rating);

  grid.innerHTML = list.length ? list.map(productCard).join('') : `<div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--sage)">No devices match your filters. Try clearing some.</div>`;
  grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in-view'));
  grid.querySelectorAll('[data-blur-reveal]').forEach(el => el.classList.add('gsap-in'));
  updateActiveFilterCount();
}

function updateActiveFilterCount() {
  const n = filters.brands.length + filters.storage.length + filters.ram.length + filters.availability.length + (filters.fiveG ? 1 : 0) + (filters.dualSim ? 1 : 0) + (filters.priceMax < 5000000 ? 1 : 0);
  const badge = document.getElementById('filterCountBadge');
  if (badge) { badge.textContent = n; badge.style.display = n ? 'inline-flex' : 'none'; }
}

function buildAdvancedFilterPanel() {
  const panel = document.getElementById('advancedFilterPanel');
  if (!panel) return;
  const brands = [...new Set(Catalog.phones.map(p => p.brand))];
  const storages = [...new Set(Catalog.phones.map(p => p.storage))];
  const rams = [...new Set(Catalog.phones.map(p => p.ram))];
  panel.innerHTML = `
    <div class="filter-group">
      <h5>Brand</h5>
      <div class="filter-group-chips">${brands.map(b => `<label class="chk"><input type="checkbox" value="${b}" data-filter-group="brands"> ${b}</label>`).join('')}</div>
    </div>
    <div class="filter-group">
      <h5>Storage</h5>
      <div class="filter-group-chips">${storages.map(s => `<label class="chk"><input type="checkbox" value="${s}" data-filter-group="storage"> ${s}</label>`).join('')}</div>
    </div>
    <div class="filter-group">
      <h5>RAM</h5>
      <div class="filter-group-chips">${rams.map(r => `<label class="chk"><input type="checkbox" value="${r}" data-filter-group="ram"> ${r}</label>`).join('')}</div>
    </div>
    <div class="filter-group">
      <h5>Connectivity & Availability</h5>
      <label class="chk"><input type="checkbox" id="filter5g"> 5G Only</label>
      <label class="chk"><input type="checkbox" id="filterDualSim"> Dual SIM</label>
      <label class="chk"><input type="checkbox" value="in-stock" data-filter-group="availability"> In Stock</label>
      <label class="chk"><input type="checkbox" value="limited" data-filter-group="availability"> Limited Stock</label>
    </div>
    <div class="filter-group" style="grid-column: 1 / -1;">
      <h5>Max Price</h5>
      <div class="price-range-row"><input type="range" id="priceRange" min="1500000" max="5000000" step="50000" value="5000000"></div>
      <div class="price-range-values"><span>TZS 1.5M</span><span id="priceRangeVal">Up to TZS 5.0M</span></div>
    </div>
  `;
  panel.querySelectorAll('input[data-filter-group]').forEach(cb => {
    cb.addEventListener('change', () => {
      const group = cb.dataset.filterGroup;
      filters[group] = [...panel.querySelectorAll(`input[data-filter-group="${group}"]:checked`)].map(x => x.value);
      renderProducts();
    });
  });
  document.getElementById('filter5g').addEventListener('change', (e) => { filters.fiveG = e.target.checked; renderProducts(); });
  document.getElementById('filterDualSim').addEventListener('change', (e) => { filters.dualSim = e.target.checked; renderProducts(); });
  document.getElementById('priceRange').addEventListener('input', (e) => {
    filters.priceMax = parseInt(e.target.value, 10);
    document.getElementById('priceRangeVal').textContent = filters.priceMax >= 5000000 ? 'Up to TZS 5.0M' : `Up to ${formatTZS(filters.priceMax)}`;
    renderProducts();
  });
}

function clearAllFilters() {
  filters = { quick: 'all', search: '', sort: 'featured', brands: [], storage: [], ram: [], fiveG: false, dualSim: false, availability: [], priceMax: 5000000 };
  document.querySelectorAll('.pill[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
  const searchInput = document.getElementById('productSearch');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'featured';
  buildAdvancedFilterPanel();
  renderProducts();
}

/* ============ INLINE ACCESSORIES SECTION (index.html) ============ */
let activeAccessoryCategory = 'all';
function renderAccessories() {
  const grid = document.getElementById('accessoryGrid');
  if (!grid) return;
  const list = activeAccessoryCategory === 'all' ? Catalog.accessories : Catalog.accessories.filter(a => a.category === activeAccessoryCategory);
  grid.innerHTML = list.map(accessoryCard).join('');
  grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in-view'));
  grid.querySelectorAll('[data-blur-reveal]').forEach(el => el.classList.add('gsap-in'));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pill[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filters.quick = btn.dataset.filter;
      renderProducts();
    });
  });
  document.getElementById('productSearch')?.addEventListener('input', (e) => { filters.search = e.target.value; renderProducts(); });
  document.getElementById('sortSelect')?.addEventListener('change', (e) => { filters.sort = e.target.value; renderProducts(); });
  document.getElementById('advancedFilterToggle')?.addEventListener('click', () => document.getElementById('advancedFilterPanel')?.classList.toggle('open'));
  document.getElementById('clearFiltersBtn')?.addEventListener('click', clearAllFilters);

  document.querySelectorAll('.pill[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAccessoryCategory = btn.dataset.cat;
      renderAccessories();
    });
  });
});

Catalog.ready.then(() => {
  if (document.getElementById('productGrid')) {
    buildAdvancedFilterPanel();
    renderProducts();
  }
  if (document.getElementById('accessoryGrid')) {
    const hash = location.hash.replace('#', '');
    const catBtn = hash ? document.querySelector(`.pill[data-cat="${hash}"]`) : null;
    if (catBtn) { document.querySelectorAll('.pill[data-cat]').forEach(b => b.classList.remove('active')); catBtn.classList.add('active'); activeAccessoryCategory = hash; }
    renderAccessories();
  }
  renderCart(); renderWishlist(); renderCompareDrawer(); updateBadges();
  window.reinitBlurReveal?.();
});
