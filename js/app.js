// Sencillo "mini backend" en el navegador para productos y carrito

const LM = (() => {
  const currency = (n) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

  const products = {
    "pea-protein": {
      id: "pea-protein",
      image: "img/proteina.png",
      name: "Pea Protein Power",
      tag: "Preentreno",
      subtitle: "20 g de proteína · 0% lactosa",
      price: 24.9,
      badge: "Ideal antes o después de entrenar",
      details:
        "Proteína de guisante de alta calidad con perfil aminoacídico optimizado para deportistas. Energía limpia y saciante.",
      metaLeft: "750 g · 25 servicios aprox.",
      metaRight: "Vegano · Sin azúcares añadidos",
    },
    "energy-bar": {
      id: "energy-bar",
      image: "img/barrita.png",
      name: "Energy Bar",
      tag: "Energía",
      subtitle: "10 g de proteína · Liberación progresiva",
      price: 2.5,
      badge: "Ideal durante el entreno",
      details:
        "Barrita a base de legumbres y avena para mantener tu energía estable durante sesiones largas y exigentes.",
      metaLeft: "Unidad · Packs disponibles",
      metaRight: "Sin aceite de palma",
    },
    "recovery-doybag350": {
      id: "recovery-doybag350",
      image: "img/doybag350.png",
      name: "Recovery Gummies",
      tag: "Recuperación",
      subtitle: "Electrolitos · Antioxidantes",
      price: 14.9,
      badge: "Perfecto post-entreno",
      details:
        "Gummies formuladas para reponer minerales y apoyar la recuperación tras entrenos intensos, con sabor ligero y textura suave.",
      metaLeft: "60 doybag350 por bote",
      metaRight: "Sin gelatina animal",
    },
    "pack-legumechanics": {
      id: "pack-legumechanics",
      image: "img/pack-family.png",
      name: "Pack Legumechanics",
      tag: "Pack",
      subtitle: "Preentreno + energía + recuperación",
      price: 39.9,
      badge: "Mejor relación valor / precio",
      details:
        "Incluye Pea Protein Power, Energy Bar y Recovery Gummies para cubrir preentreno, durante y postentreno.",
      metaLeft: "3 productos",
      metaRight: "Ideal como suscripción mensual",
    },
  };

  const CART_KEY = "lm_cart_v1";

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(productId) {
    const cart = loadCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    saveCart(cart);
    alert("Producto añadido al carrito");
  }

  function buyNow(productId) {
    const cart = [{ id: productId, qty: 1 }];
    saveCart(cart);
    window.location.href = "checkout.html";
  }

  function cartCount() {
    return loadCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function cartTotal() {
    const cart = loadCart();
    let total = 0;
    for (const item of cart) {
      const p = products[item.id];
      if (!p) continue;
      total += p.price * item.qty;
    }
    return total;
  }

  function renderMiniCart() {
    const container = document.getElementById("lm-mini-cart-items");
    const totalEl = document.getElementById("lm-mini-cart-total");
    if (!container || !totalEl) return;

    const cart = loadCart();
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = '<p style="font-size:13px;color:#9ca3af;">Tu carrito está vacío.</p>';
      totalEl.textContent = currency(0);
      return;
    }

    for (const item of cart) {
      const p = products[item.id];
      if (!p) continue;
      const row = document.createElement("div");
      row.className = "lm-mini-cart-item";
      row.innerHTML = `
        <div>
          <strong>${p.name}</strong>
          <div style="font-size:12px;color:#9ca3af;">Cantidad: ${item.qty}</div>
        </div>
        <div>${currency(p.price * item.qty)}</div>
      `;
      container.appendChild(row);
    }

    totalEl.textContent = currency(cartTotal());
  }

  function openMiniCart() {
    const panel = document.getElementById("lm-mini-cart");
    if (!panel) return;
    renderMiniCart();
    panel.classList.add("is-open");
  }

  function closeMiniCart() {
    const panel = document.getElementById("lm-mini-cart");
    if (!panel) return;
    panel.classList.remove("is-open");
  }

  function updateCartBadge() {
    const el = document.getElementById("lm-cart-count");
    if (!el) return;
    el.textContent = cartCount();
  }

  function renderYear() {
    const el = document.getElementById("lm-year");
    if (!el) return;
    el.textContent = new Date().getFullYear();
  }

  function renderProductsGrid() {
    const grid = document.getElementById("lm-products-grid");
    if (!grid) return;

    const productOrder = ["bote500","doybag350","barrita"];
    grid.innerHTML = "";

    for (const id of productOrder) {
      const p = products[id];
      if (!p) continue;
      const card = document.createElement("article");
      card.className = "lm-product-card";
      card.innerHTML = `
        <div class="lm-product-thumb">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="lm-product-tag">${p.tag}</div>
        <h2 class="lm-product-name">${p.name}</h2>
        <p class="lm-product-sub">${p.subtitle}</p>
        <div style="margin:8px 0;">
          <span class="lm-product-price">${currency(p.price)}</span>
          <span class="lm-product-badge">${p.badge}</span>
        </div>
        <p class="lm-product-sub">${p.details}</p>
        <div class="lm-product-meta">
          <span>${p.metaLeft}</span>
          <span>${p.metaRight}</span>
        </div>
        <div class="lm-product-actions">
          <button class="lm-btn-sm lm-btn-orange">Añadir al carrito</button>
          <button class="lm-btn-sm lm-btn-outline">Compra ya</button>
        </div>
      `;
      const [btnAdd, btnBuy] = card.querySelectorAll("button");
      btnAdd.addEventListener("click", () => addToCart(id));
      btnBuy.addEventListener("click", () => buyNow(id));
      grid.appendChild(card);
    }
  }

  function renderCheckout() {
    const container = document.getElementById("lm-checkout-items");
    const totalEl = document.getElementById("lm-checkout-total");
    if (!container || !totalEl) return;

    const cart = loadCart();
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML =
        '<p style="font-size:13px;color:#9ca3af;">Tu carrito está vacío. Vuelve a la página de productos para elegir tus suplementos.</p>';
      totalEl.textContent = currency(0);
      return;
    }

    for (const item of cart) {
      const p = products[item.id];
      if (!p) continue;
      const row = document.createElement("div");
      row.className = "lm-checkout-item";
      row.innerHTML = `
        <div>
          <strong>${p.name}</strong>
          <div style="font-size:12px;color:#9ca3af;">x${item.qty}</div>
        </div>
        <div>${currency(p.price * item.qty)}</div>
      `;
      container.appendChild(row);
    }

    totalEl.textContent = currency(cartTotal());
  }

  function attachCheckoutFormHandler() {
    const form = document.querySelector(".lm-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Pedido de demostración completado. Cuando conectemos Stripe, este paso procesará el pago real."
      );
    });
  }

  function init() {
    renderYear();
    updateCartBadge();
    renderProductsGrid();
    renderCheckout();
    attachCheckoutFormHandler();

    // Cerrar mini carrito haciendo clic fuera
    const mini = document.getElementById("lm-mini-cart");
    if (mini) {
      mini.addEventListener("click", (e) => {
        if (e.target === mini) closeMiniCart();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    addToCart,
    buyNow,
    openMiniCart,
    closeMiniCart,
  };
})();

// Exponer globalmente
window.LM = LM;
