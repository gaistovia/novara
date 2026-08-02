/* =========================================================
   NOVARA — compare.js
   Comparison Studio (compare.html): pick up to 3 phones,
   see a scored visual breakdown, get a recommendation.
   ========================================================= */

let compareSlots = [null, null, null];

const CHIP_TIER = {
  'A18 Pro Bionic': 97, 'Snapdragon 8 Elite for Galaxy': 95, 'Snapdragon 8 Elite': 94,
  'Google Tensor G4': 86, 'Snapdragon 8s Gen 4': 82,
};
function chipScore(processor) {
  const key = Object.keys(CHIP_TIER).find(k => processor.includes(k));
  return key ? CHIP_TIER[key] : 80;
}
function displayScore(p) { const size = parseFloat(p.display); const hz = /120Hz|4K/.test(p.display) ? 12 : 0; return Math.min(100, Math.round(size * 10 + hz)); }
function cameraScore(p) { const mp = parseInt(p.camera, 10) || 48; return Math.min(100, Math.round(Math.sqrt(mp) * 7)); }
function batteryScore(p) { const mah = parseInt(p.battery, 10) || 4500; return Math.min(100, Math.round(mah / 60)); }
function chargingScore(p) { const w = parseInt(p.charging, 10) || 25; return Math.min(100, w); }
function storageScore(p) { const gb = parseInt(p.storage, 10) || 128; return Math.min(100, Math.round((gb / 512) * 100)); }
function aiScore(p) { return Math.min(100, p.aiFeatures.length * 25); }
function priceScore(p, group) {
  const prices = group.map(x => x.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  if (max === min) return 100;
  return Math.round((1 - (p.price - min) / (max - min)) * 100);
}

const DIMENSIONS = [
  { key: 'display', label: 'Display', fn: displayScore, raw: p => p.display },
  { key: 'performance', label: 'Performance', fn: p => chipScore(p.processor), raw: p => p.processor },
  { key: 'camera', label: 'Camera', fn: cameraScore, raw: p => p.camera },
  { key: 'battery', label: 'Battery', fn: batteryScore, raw: p => p.battery },
  { key: 'charging', label: 'Charging', fn: chargingScore, raw: p => p.charging },
  { key: 'storage', label: 'Storage', fn: storageScore, raw: p => p.storage },
  { key: 'ai', label: 'AI Features', fn: aiScore, raw: p => `${p.aiFeatures.length} features` },
  { key: 'price', label: 'Value for Price', fn: null, raw: p => formatTZS(p.price) },
];

function renderSlots() {
  const wrap = document.getElementById('compareSlots');
  if (!wrap) return;
  wrap.innerHTML = compareSlots.map((id, i) => {
    const p = id ? findPhone(id) : null;
    if (!p) {
      return `<div class="compare-slot" onclick="openPicker(${i})">
        <div class="add-ic">+</div>
        <h4>Add a device</h4>
        <p style="font-size:12.5px;color:var(--sage-dim);margin-top:6px;">Slot ${i + 1} of 3</p>
      </div>`;
    }
    return `<div class="compare-slot filled">
      <div class="compare-slot-media"><img src="${p.images[0]}" alt="${p.name}" style="height:140px;"></div>
      <h4>${p.brand} ${p.name}</h4>
      <span class="price-now">${formatTZS(p.price)}</span>
      <span class="remove-slot" onclick="removeSlot(${i})" role="button">Remove</span>
    </div>`;
  }).join('');
  renderResults();
}

function openPicker(slotIndex) {
  const overlay = document.getElementById('quickViewModal');
  const chosen = compareSlots.filter(Boolean);
  const available = Catalog.phones.filter(p => !chosen.includes(p.id));
  overlay.innerHTML = `
    <div class="modal-box compare-picker-modal" style="grid-template-columns:1fr;max-width:520px;">
      <button class="modal-close" onclick="closeQuickView()" aria-label="Close">${ICONS.close}</button>
      <div style="padding:36px;">
        <h3 style="font-size:20px;margin-bottom:18px;">Choose a device</h3>
        <div class="picker-list">
          ${available.map(p => `
            <div class="picker-row" onclick="pickDevice(${slotIndex}, '${p.id}')">
              <img src="${p.images[0]}" alt="${p.name}" style="height:44px;">
              <div class="pr-info"><b>${p.brand} ${p.name}</b><span>${formatTZS(p.price)}</span></div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
  overlay.classList.add('open');
}
function pickDevice(slotIndex, id) { compareSlots[slotIndex] = id; closeQuickView(); renderSlots(); syncUrl(); }
function removeSlot(i) { compareSlots[i] = null; renderSlots(); syncUrl(); }
function syncUrl() {
  const ids = compareSlots.filter(Boolean).join(',');
  const url = new URL(window.location);
  if (ids) url.searchParams.set('ids', ids); else url.searchParams.delete('ids');
  window.history.replaceState({}, '', url);
}

function renderResults() {
  const resultsEl = document.getElementById('compareResults');
  if (!resultsEl) return;
  const group = compareSlots.map(id => id ? findPhone(id) : null).filter(Boolean);
  if (group.length < 2) {
    resultsEl.innerHTML = `<div class="compare-empty">Add at least two devices to see a full side-by-side breakdown.</div>`;
    return;
  }
  const scored = group.map(p => {
    const scores = {};
    DIMENSIONS.forEach(d => { scores[d.key] = d.key === 'price' ? priceScore(p, group) : d.fn(p); });
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    return { p, scores, avg };
  });
  const winner = scored.reduce((a, b) => b.avg > a.avg ? b : a, scored[0]);

  resultsEl.innerHTML = DIMENSIONS.map(d => {
    const maxScore = Math.max(...scored.map(s => s.scores[d.key]));
    return `
    <div class="compare-dimension">
      <div class="compare-dimension-label">${d.label}</div>
      <div class="compare-bars">
        ${scored.map(s => `
          <div class="compare-bar-card ${s.scores[d.key] === maxScore ? 'winner' : ''}">
            <div class="val"><span>${s.p.brand} ${s.p.name}</span></div>
            <div style="font-size:12px;color:var(--sage-dim);margin-bottom:8px;">${d.raw(s.p)}</div>
            <div class="compare-bar-track"><div class="compare-bar-fill" style="width:${s.scores[d.key]}%"></div></div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('') + `
    <div class="compare-recommendation">
      <span class="eyebrow" style="justify-content:center;">Our Take</span>
      <h3 style="margin-top:14px;">${winner.p.brand} ${winner.p.name} is the strongest overall pick</h3>
      <p>${buildRecommendationText(winner, scored)}</p>
      <div class="card-actions" style="justify-content:center;margin-top:26px;max-width:360px;margin-inline:auto;">
        <a href="product.html?id=${winner.p.id}" class="btn btn-primary">View ${winner.p.name}</a>
        <a href="${waLink(winner.p)}" target="_blank" rel="noopener" class="btn btn-wa">${ICONS.wa} Ask on WhatsApp</a>
      </div>
    </div>`;
}

function buildRecommendationText(winner, scored) {
  const top = Object.entries(winner.scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => DIMENSIONS.find(d => d.key === k).label.toLowerCase());
  const others = scored.filter(s => s.p.id !== winner.p.id).map(s => s.p.name).join(' and ');
  return `Scoring highest across the dimensions that matter most here — especially ${top.join(' and ')} — the ${winner.p.name} edges out ${others || 'the alternatives'} for most buyers. If your priority is different, use the bars above to weigh what matters most to you.`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('compareSlots')) return; // not on compare.html
  Catalog.ready.then(() => {
    const params = new URLSearchParams(location.search);
    const ids = (params.get('ids') || '').split(',').filter(Boolean).slice(0, 3);
    ids.forEach((id, i) => { if (findPhone(id)) compareSlots[i] = id; });
    renderSlots();
    renderCart(); renderWishlist(); renderCompareDrawer(); updateBadges();
    window.reinitBlurReveal?.();
  });
});
