/* =========================================================
   NOVARA — animations.js
   Motion layer. GSAP/Lenis enhancements are ADDITIVE — every
   animated element still resolves to visible via the
   IntersectionObserver fallback if a CDN fails to load.
   ========================================================= */

/* ============ SCROLL REVEAL (baseline, always works) ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(el => revealObserver.observe(el));

window.observeReveal = function (root = document) {
  root.querySelectorAll('[data-reveal]:not(.in-view)').forEach(el => revealObserver.observe(el));
};

/* ============ BLUR REVEAL: GSAP ScrollTrigger if available, IO fallback otherwise ============ */
function initBlurReveal() {
  const targets = document.querySelectorAll('[data-blur-reveal]:not(.gsap-bound)');
  if (!targets.length) return;
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    targets.forEach((el, i) => {
      el.classList.add('gsap-bound');
      gsap.to(el, {
        opacity: 1, filter: 'blur(0px)', y: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        delay: Math.min(i * 0.04, 0.3),
      });
    });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('gsap-in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    targets.forEach(el => { el.classList.add('gsap-bound'); io.observe(el); });
  }
}
initBlurReveal();
window.reinitBlurReveal = initBlurReveal;

/* ============ ANIMATED COUNTERS ============ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString() + suffix; return; }
      el.textContent = cur.toLocaleString() + suffix;
      requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ============ MAGNETIC BUTTONS ============ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    if (window.gsap) gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
    else btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    if (window.gsap) gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    else btn.style.transform = '';
  });
});

/* ============ CARD TILT (mouse parallax on hover, desktop only) ============ */
if (window.matchMedia('(hover:hover) and (min-width:861px)').matches) {
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest?.('.product-card, .compare-slot');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg) translateY(-4px)`;
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest?.('.product-card, .compare-slot');
    if (card) card.style.transform = '';
  });
}

/* ============ AMBIENT CURSOR GLOW ============ */
if (window.matchMedia('(hover:hover) and (min-width:861px)').matches) {
  const glow = document.createElement('div');
  glow.className = 'ambient-glow';
  document.body.appendChild(glow);
  window.addEventListener('mousemove', (e) => {
    if (window.gsap) gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power2.out' });
    else glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  }, { passive: true });
}

/* ============ LENIS SMOOTH SCROLL (optional enhancement) ============ */
if (window.Lenis) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (window.gsap && window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
}

/* ============ LUXURY PAGE TRANSITIONS ============ */
document.addEventListener('DOMContentLoaded', () => {
  const pageTransition = document.getElementById('pageTransition');
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a');
    if (!a || !pageTransition) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
    e.preventDefault();
    pageTransition.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 480);
  });
});
