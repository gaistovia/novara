/* =========================================================
   NOVARA — search.js
   Instant search overlay, available on every page via the
   nav search icon or the "/" and "⌘K" shortcuts.
   ========================================================= */

const POPULAR_SEARCHES = ['iPhone', 'Galaxy S25', 'Pixel 9', 'Under TZS 2.5M', '5G phones', 'Best camera'];

function buildSearchOverlay() {
  if (document.getElementById('searchOverlay')) return;
  const el = document.createElement('div');
  el.className = 'search-overlay';
  el.id = 'searchOverlay';
  el.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search NOVARA">
      <div class="search-input-row">
        ${ICONS.search}
        <input type="text" id="smartSearchInput" placeholder="Search devices, brands, features…" autocomplete="off" aria-label="Search">
        <span class="search-esc">ESC</span>
      </div>
      <div class="search-body" id="smartSearchBody"></div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', (e) => { if (e.target === el) closeSearch(); });
}

function renderSearchDefault() {
  const body = document.getElementById('smartSearchBody');
  if (!body) return;
  const trending = Catalog.phones.filter(p => p.status.includes('best') || p.status.includes('popular')).slice(0, 5);
  body.innerHTML = `
    <div class="search-section">
      <div class="search-section-label">Popular Searches</div>
      <div class="search-chip-row">${POPULAR_SEARCHES.map(s => `<button class="search-chip" onclick="runSearch('${s.replace(/'/g, "\\'")}')">${s}</button>`).join('')}</div>
    </div>
    <div class="search-section">
      <div class="search-section-label">Trending Devices</div>
      ${trending.map((p, i) => `
        <div class="search-trending-row" onclick="goToProduct('${p.id}')">
          <span class="rank">0${i + 1}</span>
          <span>${p.brand} ${p.name}</span>
          <span class="search-result-price" style="margin-left:auto;">${formatTZS(p.price)}</span>
        </div>`).join('')}
    </div>`;
}

function highlightMatch(text, term) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) + `<span class="search-highlight">${text.slice(idx, idx + term.length)}</span>` + text.slice(idx + term.length);
}

let searchResults = [];
let kbIndex = -1;

function runSearch(term) {
  const input = document.getElementById('smartSearchInput');
  if (input) input.value = term;
  performSearch(term);
}

function performSearch(term) {
  const body = document.getElementById('smartSearchBody');
  if (!body) return;
  if (!term) { renderSearchDefault(); searchResults = []; kbIndex = -1; return; }
  const t = term.toLowerCase();
  searchResults = Catalog.phones.filter(p => (p.brand + ' ' + p.name + ' ' + p.category).toLowerCase().includes(t));
  kbIndex = -1;
  if (!searchResults.length) {
    body.innerHTML = `<div class="search-empty">No devices match "${term}". Try a different brand or model.</div>`;
    return;
  }
  body.innerHTML = `
    <div class="search-section">
      <div class="search-section-label">${searchResults.length} Result${searchResults.length > 1 ? 's' : ''}</div>
      ${searchResults.map((p) => `
        <div class="search-result-row" onclick="goToProduct('${p.id}')">
          <img src="${p.images[0]}" alt="${p.name}" style="height:50px;width:auto;">
          <div class="search-result-info">
            <b>${highlightMatch(p.brand + ' ' + p.name, term)}</b>
            <span>${p.storage} · ${p.ram} RAM · ${p.category}</span>
          </div>
          <span class="search-result-price">${formatTZS(p.price)}</span>
        </div>`).join('')}
    </div>`;
}

function goToProduct(id) { window.location.href = `product.html?id=${id}`; }

function openSearch() {
  buildSearchOverlay();
  Catalog.ready.then(() => {
    renderSearchDefault();
    document.getElementById('searchOverlay').classList.add('open');
    setTimeout(() => document.getElementById('smartSearchInput')?.focus(), 150);
    document.getElementById('smartSearchInput').oninput = (e) => performSearch(e.target.value);
    document.getElementById('smartSearchInput').onkeydown = handleSearchKeys;
  });
}
function closeSearch() { document.getElementById('searchOverlay')?.classList.remove('open'); }

function handleSearchKeys(e) {
  const rows = document.querySelectorAll('.search-result-row');
  if (e.key === 'ArrowDown') { e.preventDefault(); kbIndex = Math.min(kbIndex + 1, rows.length - 1); updateKbActive(rows); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); kbIndex = Math.max(kbIndex - 1, 0); updateKbActive(rows); }
  else if (e.key === 'Enter') { if (kbIndex > -1 && searchResults[kbIndex]) goToProduct(searchResults[kbIndex].id); }
  else if (e.key === 'Escape') closeSearch();
}
function updateKbActive(rows) {
  rows.forEach(r => r.classList.remove('kb-active'));
  if (rows[kbIndex]) { rows[kbIndex].classList.add('kb-active'); rows[kbIndex].scrollIntoView({ block: 'nearest' }); }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-open-search]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openSearch(); }));
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';
    if (e.key === '/' && !isTyping) { e.preventDefault(); openSearch(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });
});
