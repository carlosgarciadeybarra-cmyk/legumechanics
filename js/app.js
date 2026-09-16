const LM = (() => {
  const currency = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

  const products = {
    "pea-protein": {
      id: "pea-protein",
      image: "img/pea-protein-final.png",
      name: "Pea Protein Powder",
      price: 29.99,
      subtitle: "23 g protein per dose · Leucine optimized"
    }
  };

  const CART_KEY = "lm_cart_v2";

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(item => products[item.id] && Number.isFinite(item.qty) && item.qty > 0);
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(productId) {
    if (!products[productId]) return;
    const cart = loadCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.qty += 1;
    else cart.push({ id: productId, qty: 1 });
    saveCart(cart);
    if (document.getElementById("lm-mini-cart")) openMiniCart();
  }

  function buyNow(productId) {
    if (!products[productId]) return;
    saveCart([{ id: productId, qty: 1 }]);
    window.location.href = "checkout.html";
  }

  function cartCount() {
    return loadCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function cartTotal() {
    return loadCart().reduce((sum, item) => sum + products[item.id].price * item.qty, 0);
  }

  function renderMiniCart() {
    const container = document.getElementById("lm-mini-cart-items");
    const totalEl = document.getElementById("lm-mini-cart-total");
    if (!container || !totalEl) return;
    const cart = loadCart();
    container.innerHTML = "";
    if (!cart.length) {
      container.innerHTML = '<p class="lm-cart-empty">Tu carrito está vacío.</p>';
      totalEl.textContent = currency(0);
      return;
    }
    cart.forEach(item => {
      const p = products[item.id];
      const row = document.createElement("div");
      row.className = "lm-mini-cart-item";
      row.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="lm-mini-cart-copy"><strong>${p.name}</strong><span>${p.subtitle}</span><span>Cantidad: ${item.qty}</span></div>
        <strong>${currency(p.price * item.qty)}</strong>`;
      container.appendChild(row);
    });
    totalEl.textContent = currency(cartTotal());
  }

  function openMiniCart() {
    const panel = document.getElementById("lm-mini-cart");
    if (!panel) return;
    renderMiniCart();
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closeMiniCart() {
    const panel = document.getElementById("lm-mini-cart");
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  function updateCartBadge() {
    const el = document.getElementById("lm-cart-count");
    if (el) el.textContent = cartCount();
  }

  function renderYear() {
    const el = document.getElementById("lm-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function renderCheckout() {
    const container = document.getElementById("lm-checkout-items");
    const totalEl = document.getElementById("lm-checkout-total");
    if (!container || !totalEl) return;
    const cart = loadCart();
    container.innerHTML = "";
    if (!cart.length) {
      container.innerHTML = '<p class="lm-cart-empty">Tu carrito está vacío. <a href="productos.html">Volver al producto</a></p>';
      totalEl.textContent = currency(0);
      return;
    }
    cart.forEach(item => {
      const p = products[item.id];
      const row = document.createElement("div");
      row.className = "lm-checkout-item";
      row.innerHTML = `<div><strong>${p.name}</strong><span>x${item.qty}</span></div><strong>${currency(p.price * item.qty)}</strong>`;
      container.appendChild(row);
    });
    totalEl.textContent = currency(cartTotal());
  }

  function attachCheckoutFormHandler() {
    const form = document.querySelector(".lm-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Pedido de demostración completado. El siguiente paso es conectar la pasarela de pago real.");
    });
  }

  function init() {
    renderYear();
    updateCartBadge();
    renderCheckout();
    attachCheckoutFormHandler();
    const mini = document.getElementById("lm-mini-cart");
    if (mini) mini.addEventListener("click", e => { if (e.target === mini) closeMiniCart(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return { addToCart, buyNow, openMiniCart, closeMiniCart };
})();
window.LM = LM;
