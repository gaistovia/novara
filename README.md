# NOVARA — Premium Mobile Technology
### A GA Istovia Concept Demo

**Live target:** `https://gaistovia.github.io/novara/`

## Structure (matches required layout exactly)
```
novara/
├── index.html
├── compare.html
├── product.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest
├── .nojekyll
├── assets/
│   ├── css/
│   │   ├── style.css        (design tokens, layout, hero/story/catalog/product/search styling)
│   │   ├── components.css   (nav, cards, drawers, modal, footer — reused everywhere)
│   │   ├── animations.css   (reveal system, blur-reveal, page transitions, loader)
│   │   └── responsive.css   (shared breakpoints)
│   ├── js/
│   │   ├── main.js          (loader, nav, mobile menu, countdown, newsletter, FAQ)
│   │   ├── animations.js    (GSAP/Lenis motion layer, with automatic no-JS-lib fallback)
│   │   ├── cart.js          (cart / wishlist / compare state + localStorage)
│   │   ├── compare.js       (Comparison Studio logic)
│   │   ├── products.js      (data loading, product/accessory cards, product.html detail logic)
│   │   ├── search.js        (instant search overlay)
│   │   ├── filters.js       (catalog filters/sort + inline accessories section)
│   │   └── ui.js            (icons, toast, drawers, quick view modal)
│   ├── images/
│   │   ├── phones/          (21 files — one real SVG per phone color variant)
│   │   ├── accessories/     (14 files — one SVG per accessory)
│   │   ├── logos/           (novara-mark.svg)
│   │   ├── icons/           (favicon + manifest icons)
│   │   └── backgrounds/     (hero-grid.svg texture)
│   └── fonts/                (reserved — fonts currently loaded via Google Fonts CDN in style.css)
├── data/
│   ├── phones.json           (single source of truth for all 8 phones, incl. image paths)
│   └── accessories.json      (single source of truth for all 14 accessories)
└── README.md
```

## What changed from the previous broken export
The prior ZIP was missing most of `assets/` — likely dropped during export or upload. This version was
rebuilt from scratch with every file physically present, every path root-relative, and no per-page
`ASSET_BASE` indirection (every page now lives at the repo root, so paths are simply `assets/css/style.css`,
`data/phones.json`, etc. — identical from every page, nothing to get wrong).

Product images are no longer generated inline via JavaScript template strings — every phone color variant
and every accessory is now a real `.svg` file under `assets/images/`, referenced with normal `<img src>`
tags. This is what "every image path must be correct / every image must display" required, and it also
means the site still renders product art correctly even if JavaScript fails to execute for any reason.

## Verification performed before this export
- All 4 HTML pages pass strict tag-balance parsing (no unclosed/mismatched tags)
- All 8 JS files pass `node -c` syntax checks
- Both JSON data files and the manifest parse as valid JSON
- All 40 SVG image files parse as valid XML
- Every `href`/`src` in every HTML file resolves to a real file on disk (scripted check, zero missing)
- Every `url()` in every CSS file resolves to a real file on disk
- Every image path inside `phones.json` / `accessories.json` resolves to a real file on disk
- No references to `/mnt/user-data`, `/tmp`, `/home/claude`, or any other local/absolute path anywhere
- No duplicate element IDs on any page
- Every `onclick`/`oninput`/`onchange`/`onsubmit` handler used in markup has a matching function definition
- Full local static-server smoke test: every page and every asset returns HTTP 200

## Deploying
1. Push the contents of this folder to the root of the `novara` repository (or the branch/folder GitHub
   Pages serves from) — files must sit at the repo root, not inside an extra subfolder.
2. Enable GitHub Pages for that repo/branch.
3. `.nojekyll` is already included so GitHub doesn't try to process the `assets/` folder through Jekyll.
4. Update the WhatsApp number (`255700000000`) in `assets/js/ui.js` (the `WA_NUMBER` constant) and in the
   static `href="https://wa.me/255700000000"` links inside each HTML file, before real use.

## Adding a new phone
1. Add an entry to `data/phones.json` with an `images` array of paths.
2. Add the corresponding SVG file(s) under `assets/images/phones/`.
3. Add the URL to `sitemap.xml` (optional but recommended).
No HTML/CSS/JS changes required — `product.html?id=<new-id>` will render it automatically.
