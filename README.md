# NOVARA — Premium Mobile Technology
### A GA Istovia Concept Demo

## Overview
NOVARA is a premium flagship smartphone e-commerce concept built to demonstrate GA Istovia's ability to deliver Apple/Stripe/Linear-grade shopping experiences for the East African market — vanilla HTML/CSS/JS, zero build step, deployed on GitHub Pages.

**Industry:** Consumer Electronics / Mobile Technology Retail
**Market:** Tanzania / East Africa
**Live demo:** `gaistovia.github.io/novara/`

## Brand
- **Name:** NOVARA
- **Tagline:** "Technology worth obsessing over."
- **Identity:** Obsidian-jade dark mode with an emerald signal accent and champagne highlight, Space Grotesk display type paired with Inter body and JetBrains Mono for data/pricing.
- **Signature element:** The hero "orbit showcase" — a floating device suspended inside slow-rotating dashed rings with ambient emerald glow, echoing the precision of premium hardware photography without using real product photos.

## Features
- Dark-mode-first design system with glassmorphism, gradient glow, and orbit motion signature
- Catalog of 8 real flagship smartphones (Apple, Samsung, Google, Nothing, OnePlus, Xiaomi, Honor, Sony) rendered as original stylised SVG devices (no third-party photography — avoids trademark exposure on a fictional storefront)
- Live search, category/status filters, 5G & Dual SIM checkboxes, sort by price/rating
- Cart, Wishlist, and 3-way Compare — all persisted via `localStorage`
- Quick View modal and full product detail pages with tabs (Specs / Reviews / Shipping)
- WhatsApp-native ordering flow (cart checkout + per-product order links) — first-class for the East African market
- Flash-deal countdown timer, animated stat counters, testimonials, FAQ accordion
- Mobile: sticky bottom nav, off-canvas menu, floating WhatsApp button
- SEO: Organization / WebSite / FAQPage / Product / AggregateRating JSON-LD, OpenGraph, canonical tags, robots.txt, sitemap.xml

## Tech Stack
- HTML5, CSS3 (custom properties, no framework), vanilla JavaScript
- `IntersectionObserver` for scroll reveals and animated counters
- `localStorage` for cart/wishlist/compare state
- No build step — deploy the folder as-is to GitHub Pages

## Structure
```
novara/
├── index.html
├── product.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── assets/
│   ├── css/style.css
│   ├── css/animations.css
│   └── js/products.js
│   └── js/main.js
└── README.md
```

## Notes for deployment
- Ensure `.nojekyll` and the full `assets/` folder are uploaded intact to avoid GitHub Pages path issues.
- Update the WhatsApp number (`255700000000`) in `assets/js/main.js` and `product.html` before real use.
