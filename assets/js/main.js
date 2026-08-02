/* =========================================================
   NOVARA — main.js
   App shell, loaded on every page: loader, nav scroll,
   mobile menu, deal countdown, newsletter, static FAQ.
   ========================================================= */

/* ============ LOADER ============ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader && loader.classList.add('hide'), 700);
});

/* ============ NAV SCROLL ============ */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============ MOBILE MENU ============ */
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
burger?.addEventListener('click', () => { mobileMenu.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); });
mobileMenuClose?.addEventListener('click', () => { mobileMenu.classList.remove('open'); burger?.setAttribute('aria-expanded', 'false'); });
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ============ MOBILE BOTTOM NAV ACTIVE STATE ============ */
document.querySelectorAll('.mobile-bottom-nav a[data-page]').forEach(a => {
  a.classList.toggle('active', a.dataset.page === document.body.dataset.page);
});

/* ============ DEAL COUNTDOWN (index.html) ============ */
function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  let target = localStorage.getItem('novara_deal_end');
  if (!target || parseInt(target, 10) < Date.now()) {
    target = Date.now() + 1000 * 60 * 60 * 30;
    localStorage.setItem('novara_deal_end', target);
  }
  target = parseInt(target, 10);
  function tick() {
    const diff = Math.max(0, target - Date.now());
    el.querySelector('.h').textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
    el.querySelector('.m').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    el.querySelector('.s').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}
startCountdown();

/* ============ NEWSLETTER ============ */
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('You are subscribed! Watch your inbox for exclusive drops.');
  e.target.reset();
});

/* ============ STATIC FAQ (index.html ships FAQ markup at load time) ============ */
document.addEventListener('DOMContentLoaded', () => bindFaqAccordion(document));
