/* =========================================================
   NOVARA — products.js
   Single source of truth for catalog data (fetched from
   data/phones.json + data/accessories.json), plus product
   and accessory card rendering, and the product.html detail
   page logic (driven by ?id= query param).

   Adding a new phone: add one entry to data/phones.json,
   generate its SVG image files, done — no other file changes.
   ========================================================= */

const Catalog = { phones: [], accessories: [], ready: null };

Catalog.ready = (async () => {
  try {
    const [phonesRes, accRes] = await Promise.all([
      fetch('data/phones.json'),
      fetch('data/accessories.json'),
    ]);
    if (!phonesRes.ok || !accRes.ok) throw new Error('Catalog fetch failed');
    Catalog.phones = (await phonesRes.json()).phones;
    Catalog.accessories = (await accRes.json()).accessories;
  } catch (err) {
    console.error('NOVARA: failed to load catalog data', err);
    Catalog.phones = [];
    Catalog.accessories = [];
  }
  return Catalog;
})();

function findPhone(id) { return Catalog.phones.find(p => p.id === id || p.slug === id); }
function findAccessory(id) { return Catalog.accessories.find(a => a.id === id); }

function formatTZS(n) { return n == null ? '' : 'TZS ' + n.toLocaleString('en-US'); }
function discountPct(price, oldPrice) { return oldPrice ? Math.round((1 - price / oldPrice) * 100) : null; }
const STATUS_LABELS = {
  best: '🔥 Best Seller', new: '🆕 New Arrival', limited: '⚡ Limited Stock',
  popular: '⭐ Most Popular', deal: '🎁 Special Offer'
};
function statusTag(status) { return (status || []).map(s => `<span class="tag ${s}">${STATUS_LABELS[s]}</span>`).join(''); }

/* ============ PRODUCT CARD (used on index.html + compare picker) ============ */
function productCard(p) {
  const disc = discountPct(p.price, p.oldPrice);
  const isWish = Store.wishlist.includes(p.id);
  const isCompare = Store.compareList.includes(p.id);
  const href = `product.html?id=${p.id}`;
  return `
  <article class="product-card" data-reveal data-blur-reveal>
    <div class="badges">${statusTag(p.status)}</div>
    <button class="fav-btn ${isWish ? 'active' : ''}" onclick="toggleWishlist('${p.id}')" aria-label="${isWish ? 'Remove from' : 'Add to'} wishlist">${ICONS.heart}</button>
    <a href="${href}" class="card-media" aria-label="View ${p.name} details">
      <img src="${p.images[0]}" alt="${p.brand} ${p.name}" loading="lazy" width="220" height="440">
      <span class="qv-btn" onclick="event.preventDefault();event.stopPropagation();openQuickView('${p.id}')" role="button" tabindex="0">Quick View</span>
    </a>
    <span class="card-brand">${p.brand}</span>
    <a href="${href}"><h3 class="card-title">${p.name}</h3></a>
    <div class="card-specs">
      <span>${p.storage}</span><span>${p.ram} RAM</span><span>${p.camera.split(' ')[0]} Cam</span>
    </div>
    <div class="card-rating"><span class="stars" aria-hidden="true">★★★★★</span> ${p.rating} <span style="color:var(--sage-dim)">(${p.reviews})</span></div>
    <div class="card-price-row">
      <div><span class="price-now">${formatTZS(p.price)}</span>${p.oldPrice ? `<span class="price-old">${formatTZS(p.oldPrice)}</span>` : ''}</div>
      ${disc ? `<span class="discount-chip">-${disc}%</span>` : ''}
    </div>
    <div class="stock-line"><span>${p.stockLeft} left in stock</span><span>${p.stockPercent}%</span></div>
    <div class="stock-bar"><i style="width:${p.stockPercent}%"></i></div>
    <div class="card-actions">
      <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
      <button class="icon-square ${isCompare ? 'active' : ''}" onclick="toggleCompare('${p.id}')" title="Compare" aria-label="${isCompare ? 'Remove from' : 'Add to'} compare">${ICONS.compare}</button>
    </div>
  </article>`;
}

/* ============ ACCESSORY CARD ============ */
function accessoryCard(a) {
  const disc = discountPct(a.price, a.oldPrice);
  return `
  <article class="product-card" data-reveal data-blur-reveal>
    <div class="badges">${statusTag(a.status)}</div>
    <div class="card-media"><img src="${a.image}" alt="${a.name}" loading="lazy" width="200" height="160"></div>
    <span class="card-brand">${a.categoryLabel}</span>
    <h3 class="card-title">${a.name}</h3>
    <p style="font-size:13px;color:var(--sage);margin-top:6px;">${a.tagline}</p>
    <div class="card-rating"><span class="stars" aria-hidden="true">★★★★★</span> ${a.rating} <span style="color:var(--sage-dim)">(${a.reviews})</span></div>
    <div class="card-price-row">
      <div><span class="price-now">${formatTZS(a.price)}</span>${a.oldPrice ? `<span class="price-old">${formatTZS(a.oldPrice)}</span>` : ''}</div>
      ${disc ? `<span class="discount-chip">-${disc}%</span>` : ''}
    </div>
    <div class="card-actions">
      <a class="btn btn-wa btn-block" href="${accessoryWaLink(a)}" target="_blank" rel="noopener">${ICONS.wa} Order via WhatsApp</a>
    </div>
  </article>`;
}
function accessoryWaLink(a) {
  const msg = `Hello NOVARA! I'd like to order the *${a.name}* listed at ${formatTZS(a.price)}. Is it available?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* ============ PRODUCT DETAIL PAGE (product.html?id=p01) ============ */
function initProductPage() {
  const root = document.getElementById('pdpRoot');
  if (!root) return; // not on product.html

  Catalog.ready.then(() => {
    const params = new URLSearchParams(location.search);
    const product = findPhone(params.get('id')) || Catalog.phones[0];
    if (!product) { root.innerHTML = '<p style="padding:80px 0;text-align:center;color:var(--sage)">Product not found.</p>'; return; }

    document.title = `${product.brand} ${product.name} — Buy Genuine in Tanzania | NOVARA`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', `Buy the ${product.brand} ${product.name} (${product.storage}) at NOVARA. ${product.tagline} Official warranty, nationwide delivery, WhatsApp ordering.`);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://gaistovia.github.io/novara/product.html?id=${product.id}`);
    const waFloat = document.getElementById('waFloat');
    if (waFloat) waFloat.href = waLink(product);

    const disc = discountPct(product.price, product.oldPrice);
    const reviewSeed = [
      { name: 'Baraka S.', rating: 5, text: `Bought the ${product.name} last month — performance is exactly as advertised and the display is stunning in daylight.` },
      { name: 'Neema T.', rating: 5, text: 'Delivery was fast and the box was sealed with warranty documents included. Very happy with the purchase.' },
      { name: 'Idris H.', rating: 4, text: 'Great device overall. Battery life is strong, only wish the charger came in the box.' },
    ];
    const ratingBreakdown = [{ stars: 5, pct: 74 }, { stars: 4, pct: 16 }, { stars: 3, pct: 6 }, { stars: 2, pct: 3 }, { stars: 1, pct: 1 }];

    root.innerHTML = `
      <div class="pdp-gallery">
        <div class="pdp-media" id="pdpMedia"><img src="${product.images[0]}" alt="${product.brand} ${product.name}" width="220" height="440" id="pdpMediaImg"></div>
        <div class="pdp-thumbs">
          ${product.images.map((src, i) => `<div class="thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="switchColor(${i})"><img src="${src}" alt="Color option ${i + 1}" width="70" height="70" loading="lazy"></div>`).join('')}
        </div>
      </div>
      <div class="pdp-info">
        <div class="breadcrumb"><a href="index.html">Home</a> / <a href="index.html#catalog">Shop</a> / <span>${product.name}</span></div>
        <div class="badges" style="position:static;display:flex;gap:8px;">${statusTag(product.status)}</div>
        <div class="pdp-title"><span class="card-brand">${product.brand}</span><h1>${product.name}</h1></div>
        <p class="pdp-tagline">${product.tagline}</p>
        <div class="card-rating" style="margin-top:16px;"><span class="stars" aria-hidden="true">★★★★★</span> ${product.rating} <span style="color:var(--sage-dim)">(${product.reviews} verified reviews)</span></div>

        <div class="card-price-row" style="border:none;padding-top:24px;">
          <div><span class="price-now" style="font-size:28px;">${formatTZS(product.price)}</span>${product.oldPrice ? `<span class="price-old">${formatTZS(product.oldPrice)}</span>` : ''}</div>
          ${disc ? `<span class="discount-chip">-${disc}%</span>` : ''}
        </div>

        <div class="color-row">${product.colors.map((c, i) => `<span class="color-dot ${i === 0 ? 'active' : ''}" style="background:${c}" onclick="switchColor(${i})" role="button" aria-label="Select color ${i + 1}"></span>`).join('')}</div>

        <div class="stock-line" style="margin-top:20px;"><span>${product.stockLeft} units left</span><span>${product.stockPercent}% in stock</span></div>
        <div class="stock-bar"><i style="width:${product.stockPercent}%"></i></div>

        <div class="card-actions" style="margin-top:26px;">
          <button class="btn btn-primary" style="flex:2;" onclick="addToCart('${product.id}')">Add to Cart</button>
          <a class="btn btn-wa" style="flex:2;" href="${waLink(product)}" target="_blank" rel="noopener">${ICONS.wa} Order via WhatsApp</a>
          <button class="icon-square" onclick="toggleWishlist('${product.id}')" title="Wishlist" aria-label="Add to wishlist">${ICONS.heart}</button>
        </div>

        <div class="trust-badges" style="justify-content:flex-start;margin-top:28px;">
          <div class="trust-badge">${iconSized(ICONS.shield, 18)} ${product.warranty}</div>
          <div class="trust-badge">${iconSized(ICONS.truck, 18)} ${product.delivery}</div>
        </div>

        <div class="pdp-tabs" role="tablist">
          <button class="active" data-tab="specs" role="tab">Specifications</button>
          <button data-tab="ai" role="tab">AI Features</button>
          <button data-tab="camera" role="tab">Camera Samples</button>
          <button data-tab="reviews" role="tab">Reviews (${product.reviews})</button>
          <button data-tab="shipping" role="tab">Warranty &amp; Delivery</button>
          <button data-tab="faq" role="tab">FAQ</button>
        </div>

        <div class="pdp-panel active" data-panel="specs">
          <div class="spec-list" style="grid-template-columns:1fr;">
            <div>Display <b>${product.display}</b></div>
            <div>Processor <b>${product.processor}</b></div>
            <div>RAM <b>${product.ram}</b></div>
            <div>Storage <b>${product.storage}</b></div>
            <div>Camera System <b>${product.camera}</b></div>
            <div>Battery <b>${product.battery}</b></div>
            <div>Charging <b>${product.charging}</b></div>
            <div>Connectivity <b>${product.fiveG ? '5G' : '4G LTE'} ${product.dualSim ? '· Dual SIM' : ''}</b></div>
          </div>
        </div>
        <div class="pdp-panel" data-panel="ai">
          <div class="ai-feature-grid">${product.aiFeatures.map(f => `<div class="ai-feature-card"><span class="dot"></span><p>${f}</p></div>`).join('')}</div>
        </div>
        <div class="pdp-panel" data-panel="camera">
          <div class="camera-sample-grid">${product.cameraSamples.map(s => `<div class="camera-sample"><span>${s}</span></div>`).join('')}</div>
          <p class="camera-sample-note">Illustrative sample descriptions — this is a concept demo, not a real product catalog.</p>
        </div>
        <div class="pdp-panel" data-panel="reviews">
          <div class="review-summary">
            <div class="big-rating">${product.rating}</div>
            <div class="review-bars">${ratingBreakdown.map(r => `<div class="review-bar-row"><span>${r.stars}★</span><div class="bar"><i style="width:${r.pct}%"></i></div><span>${r.pct}%</span></div>`).join('')}</div>
          </div>
          ${reviewSeed.map(r => `<div class="review-card"><div class="testi-user" style="margin-top:0;"><div class="testi-avatar">${r.name[0]}</div><div><b>${r.name}</b><span class="stars" style="display:block;font-size:12px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></div></div><p style="margin-top:10px;color:var(--sage);font-size:14.5px;">${r.text}</p></div>`).join('')}
        </div>
        <div class="pdp-panel" data-panel="shipping">
          <div class="spec-list" style="grid-template-columns:1fr;">
            <div>Warranty <b>${product.warranty}</b></div>
            <div>Delivery <b>${product.delivery}</b></div>
            <div>Returns <b>7-Day Easy Returns</b></div>
            <div>Payment <b>M-Pesa, Tigo Pesa, Airtel Money, Cards, Installments</b></div>
          </div>
        </div>
        <div class="pdp-panel" data-panel="faq">
          <div class="faq-list">
            <div class="faq-item"><div class="faq-q"><span>Is this device brand new and sealed?</span><span class="plus"></span></div><div class="faq-a"><p>Yes — every ${product.name} ships factory-sealed with full accessories and official warranty documentation.</p></div></div>
            <div class="faq-item"><div class="faq-q"><span>Can I pay in installments?</span><span class="plus"></span></div><div class="faq-a"><p>Yes, qualifying customers can split payment over 3–6 months. Message us on WhatsApp to check eligibility.</p></div></div>
            <div class="faq-item"><div class="faq-q"><span>What if I receive a faulty unit?</span><span class="plus"></span></div><div class="faq-a"><p>You have 7 days for a free replacement — just message us with your order number and issue description.</p></div></div>
          </div>
        </div>
      </div>
    `;

    window.switchColor = function (i) {
      document.querySelectorAll('.pdp-thumbs .thumb').forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx, 10) === i));
      document.querySelectorAll('.color-dot').forEach((d, di) => d.classList.toggle('active', di === i));
      document.getElementById('pdpMediaImg').src = product.images[i];
    };

    document.querySelectorAll('.pdp-tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pdp-tabs button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pdp-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.pdp-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
      });
    });
    bindFaqAccordion(root);

    const accEl = document.getElementById('accessoryRow');
    if (accEl) {
      const accs = (product.accessories || []).map(id => findAccessory(id)).filter(Boolean);
      accEl.innerHTML = accs.map(a => `
        <a href="index.html#accessories" class="accessory-card">
          <div class="accessory-media"><img src="${a.image}" alt="${a.name}" loading="lazy" width="200" height="160"></div>
          <span class="cat-label">${a.categoryLabel}</span>
          <h5>${a.name}</h5>
          <div class="card-price-row" style="border:none;padding-top:8px;"><span class="price-now">${formatTZS(a.price)}</span></div>
        </a>`).join('');
    }

    const related = Catalog.phones.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
    const relList = related.length ? related : Catalog.phones.filter(p => p.id !== product.id).slice(0, 4);
    const relatedEl = document.getElementById('relatedGrid');
    if (relatedEl) {
      relatedEl.innerHTML = relList.map(p => `
        <a href="product.html?id=${p.id}" class="product-card" style="cursor:pointer;">
          <div class="card-media"><img src="${p.images[0]}" alt="${p.brand} ${p.name}" loading="lazy" width="220" height="440"></div>
          <span class="card-brand">${p.brand}</span>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-price-row"><span class="price-now">${formatTZS(p.price)}</span></div>
        </a>`).join('');
    }

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product',
      name: `${product.brand} ${product.name}`, description: product.tagline,
      image: `https://gaistovia.github.io/novara/${product.images[0]}`,
      brand: { '@type': 'Brand', name: product.brand },
      offers: { '@type': 'Offer', priceCurrency: 'TZS', price: product.price, availability: product.availability === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews },
    });
    document.head.appendChild(ld);

    renderCart(); renderWishlist(); renderCompareDrawer(); updateBadges();
    window.observeReveal?.(); window.reinitBlurReveal?.();
  });
}
function iconSized(svg, size) { return svg.replace('<svg ', `<svg style="width:${size}px;height:${size}px;color:var(--emerald-300);" `); }

document.addEventListener('DOMContentLoaded', initProductPage);
