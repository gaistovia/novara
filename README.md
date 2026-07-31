# NOVARA — Premium Mobile Technology
### A GA Istovia Concept Demo — Phase 2: Architecture, Motion & Premium Experience

## Overview
NOVARA is a premium flagship smartphone e-commerce concept demonstrating enterprise-grade frontend
architecture for GA Istovia — vanilla HTML/CSS/JS, zero build step, fully GitHub Pages compatible.

**Live demo:** `gaistovia.github.io/novara/`

## What's new in Phase 2
- **Scalable architecture** — CSS and JS split into logical, single-responsibility modules; all product
  and accessory data now lives in JSON. Adding a new phone requires editing only `data/phones.json`
  (plus one small static HTML file for its dedicated product page — no template logic changes).
- **Dedicated product pages** for all 8 flagship phones, each with gallery + color switching, full specs,
  AI Features, camera sample gallery, rating breakdown + reviews, accessories cross-sell, related devices,
  warranty/delivery info, FAQ, and Product/AggregateRating JSON-LD.
- **Accessories catalog** — 7 categories (smart watches, earbuds, chargers, cables, cases, power banks,
  screen protectors), reusable card component, deep-linkable by category.
- **Comparison Studio** (`compare.html`) — pick up to 3 phones, see a scored visual breakdown across
  8 dimensions (display, performance, camera, battery, charging, storage, AI features, price) with a
  generated "best overall" recommendation. Deep-linkable via `?ids=p01,p02,p03`.
- **Smart Search** — instant search overlay with autocomplete highlighting, popular searches, trending
  devices, and full keyboard navigation (↑/↓/Enter/Esc, plus `/` and `⌘K` shortcuts).
- **Enhanced filters** — brand, storage, RAM, price range slider, 5G, Dual SIM, and availability, with an
  active-filter counter and one-click clear.
- **Motion upgrade** — GSAP + ScrollTrigger blur-reveal, Lenis smooth scroll, mouse-parallax card tilt,
  ambient cursor glow, luxury page-transition wipe on internal navigation. Every motion layer degrades
  gracefully to a CSS/IntersectionObserver fallback if a CDN fails, so nothing is ever left invisible.
- **Accessibility** — skip-to-content link, ARIA labels on icon controls and dialogs, keyboard-operable
  FAQ accordions and search, visible focus states, semantic landmarks throughout.
- **Future-ready hooks** — `assets/js/future/` contains documented (unimplemented) interfaces for auth,
  wishlist sync, order tracking, accounts, and a backend adapter, so a real backend can be wired in later
  without touching page-level code.

## File Structure
```
novara/
├── index.html
├── compare.html
├── accessories/
│   └── index.html
├── products/
│   ├── iphone-16-pro-max.html
│   ├── galaxy-s25-ultra.html
│   ├── pixel-9-pro.html
│   ├── nothing-phone-3.html
│   ├── oneplus-13.html
│   ├── xiaomi-15-ultra.html
│   ├── honor-magic-7-pro.html
│   └── xperia-1-vii.html
├── data/
│   ├── phones.json          ← single source of truth for all phones
│   └── accessories.json     ← single source of truth for all accessories
├── assets/
│   ├── css/
│   │   ├── base.css         (tokens, reset, typography, buttons)
│   │   ├── components.css   (nav, cards, drawers, modal, footer — reused everywhere)
│   │   ├── home.css          (hero, orbit, story, deal banner — homepage-only)
│   │   ├── product.css       (product page, accessories page, compare studio)
│   │   ├── search.css        (smart search overlay)
│   │   ├── responsive.css    (shared breakpoints)
│   │   └── motion.css        (reveal system, blur-reveal, page transitions)
│   ├── js/
│   │   ├── core/              (icons, svg-render, data loader, state store, shared UI)
│   │   ├── pages/              (nav shell, search, home, product-page, accessories, compare)
│   │   └── future/             (unimplemented backend-integration placeholders)
│   ├── images/
│   └── icons/
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── README.md
```

## Adding a new phone
1. Add an entry to `data/phones.json` (id, slug, specs, colors, aiFeatures, cameraSamples, accessories, etc.)
2. Copy any existing file in `/products/` to `products/<new-slug>.html` and update the two inline values:
   `window.PRODUCT_ID = '<new-id>'` and the `<title>`/`<meta description>`.
3. Add the new URL to `sitemap.xml`.
No JavaScript or CSS changes are required — every page reads from the JSON at runtime.

## Tech Stack
- HTML5, CSS3 (custom properties, no framework), vanilla JavaScript (no bundler)
- GSAP 3 + ScrollTrigger and Lenis (via CDN) for premium motion — additive only, with automatic fallback
- `fetch()` against local JSON for the data layer; `localStorage` for cart/wishlist/compare state
- No build step — deploy the folder as-is to GitHub Pages

## Notes for deployment
- Ensure `.nojekyll` and the full `assets/` + `data/` folders are uploaded intact.
- Update the WhatsApp number (`255700000000`) across `assets/js/core/ui.js` and every page's WhatsApp link
  before real use.
- `fetch()` for JSON requires the site to be served over http(s) — opening `index.html` directly via
  `file://` will fail to load the catalog; use GitHub Pages or a local static server for testing.
