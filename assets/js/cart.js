/* =========================================================
   NOVARA — cart.js
   Cart / Wishlist / Compare persistence via localStorage.

   FUTURE-READY: Store.save() calls window.NovaraFuture.onStateChange
   if defined, so a real backend adapter can sync state server-side
   later without touching any page-level code.
   ========================================================= */

const Persist = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

const Store = {
  cart: Persist.get('novara_cart'),
  wishlist: Persist.get('novara_wishlist'),
  compareList: Persist.get('novara_compare'),

  save() {
    Persist.set('novara_cart', this.cart);
    Persist.set('novara_wishlist', this.wishlist);
    Persist.set('novara_compare', this.compareList);
    this._notify();
    if (window.NovaraFuture && typeof window.NovaraFuture.onStateChange === 'function') {
      window.NovaraFuture.onStateChange({ cart: this.cart, wishlist: this.wishlist, compare: this.compareList });
    }
  },

  addToCart(id) {
    const existing = this.cart.find(x => x.id === id);
    if (existing) existing.qty++; else this.cart.push({ id, qty: 1 });
    this.save();
  },
  removeFromCart(id) { this.cart = this.cart.filter(x => x.id !== id); this.save(); },
  changeQty(id, delta) {
    const item = this.cart.find(x => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) return this.removeFromCart(id);
    this.save();
  },
  cartCount() { return this.cart.reduce((a, c) => a + c.qty, 0); },

  toggleWishlist(id) {
    const idx = this.wishlist.indexOf(id);
    if (idx > -1) { this.wishlist.splice(idx, 1); this.save(); return false; }
    this.wishlist.push(id); this.save(); return true;
  },

  toggleCompare(id, max = 3) {
    const idx = this.compareList.indexOf(id);
    if (idx > -1) { this.compareList.splice(idx, 1); this.save(); return 'removed'; }
    if (this.compareList.length >= max) return 'full';
    this.compareList.push(id); this.save(); return 'added';
  },

  _listeners: [],
  onChange(fn) { this._listeners.push(fn); },
  _notify() { this._listeners.forEach(fn => fn()); },
};

/* Future-ready placeholders — not implemented, not wired up.
   A real backend integration would populate window.NovaraFuture with:
     signIn/signOut/currentUser()            (auth)
     pullRemoteWishlist/pushLocalWishlist()   (cross-device wishlist sync)
     trackOrder(orderId)                       (order tracking)
     getProfile/updateProfile()                (customer accounts)
     onStateChange(state)                      (backend persistence adapter) */
window.NovaraFuture = window.NovaraFuture || { onStateChange: null };
