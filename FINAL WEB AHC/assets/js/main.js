const navLinks = document.querySelector(".nav-links");
const menuBtn = document.querySelector("[data-menu]");
const yearNode = document.querySelector("[data-year]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function browserTheme() {
  return systemTheme.matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("dark", theme === "dark");
  document.body.setAttribute("data-theme", theme);
}

applyTheme(browserTheme());

systemTheme.addEventListener("change", () => {
  applyTheme(browserTheme());
});

if (yearNode) yearNode.textContent = new Date().getFullYear();

menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", navLinks?.classList.contains("open") ? "true" : "false");
});

navLinks?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

document.querySelectorAll("[data-count]").forEach(node => {
  const target = Number(node.dataset.count);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 55));
  const tick = () => {
    current += step;
    if (current >= target) {
      node.textContent = target.toLocaleString();
      return;
    }
    node.textContent = current.toLocaleString();
    requestAnimationFrame(tick);
  };
  tick();
});

const track = document.querySelector("[data-testimonial-track]");
let testimonialIndex = 0;

function moveTestimonials(direction) {
  if (!track) return;
  const cards = track.querySelectorAll(".testimonial");
  const visible = window.innerWidth < 780 ? 1 : window.innerWidth < 980 ? 2 : 3;
  const max = Math.max(0, cards.length - visible);
  testimonialIndex += direction;
  if (testimonialIndex > max) testimonialIndex = 0;
  if (testimonialIndex < 0) testimonialIndex = max;
  const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
  track.style.transform = `translateX(${-testimonialIndex * (cardWidth + 16)}px)`;
}

document.querySelector("[data-next]")?.addEventListener("click", () => moveTestimonials(1));
document.querySelector("[data-prev]")?.addEventListener("click", () => moveTestimonials(-1));

let testimonialTimer = setInterval(() => moveTestimonials(1), 5600);

window.addEventListener("resize", () => {
  testimonialIndex = 0;
  moveTestimonials(0);
});

track?.addEventListener("touchstart", () => clearInterval(testimonialTimer), { passive: true });
track?.addEventListener("touchend", () => {
  testimonialTimer = setInterval(() => moveTestimonials(1), 5600);
}, { passive: true });

const products = Array.from(document.querySelectorAll("[data-product]"));
const searchInput = document.querySelector("[data-search]");
const categorySelect = document.querySelector("[data-category]");

function filterProducts() {
  const query = (searchInput?.value || "").toLowerCase();
  const category = categorySelect?.value || "all";
  products.forEach(card => {
    const text = card.textContent.toLowerCase();
    const matchesText = text.includes(query);
    const matchesCategory = category === "all" || card.dataset.category === category;
    card.style.display = matchesText && matchesCategory ? "" : "none";
  });
}

searchInput?.addEventListener("input", filterProducts);
categorySelect?.addEventListener("change", filterProducts);

const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
const orderForm = document.querySelector("[data-order-form]");
const orderName = document.querySelector("[data-order-name]");
const orderQuantity = document.querySelector("[data-order-quantity]");
const orderNote = document.querySelector("[data-order-note]");

document.querySelectorAll("[data-order-product]").forEach(button => {
  button.addEventListener("click", () => {
    const product = button.dataset.orderProduct || button.closest("[data-product]")?.querySelector("h3")?.textContent || "Product";
    if (modalTitle) modalTitle.textContent = `Order ${product}`;
    if (modalText) modalText.textContent = "Enter the quantity you want. WhatsApp will open with your order message ready to send.";
    if (orderName) orderName.value = product;
    if (orderQuantity) {
      orderQuantity.value = "1";
      setTimeout(() => orderQuantity.focus(), 80);
    }
    if (orderNote) orderNote.value = "";
    modal?.classList.add("open");
  });
});

orderForm?.addEventListener("submit", event => {
  event.preventDefault();
  const product = orderName?.value || "Product";
  const quantity = Math.max(1, Number(orderQuantity?.value || 1));
  const note = orderNote?.value.trim();
  const messageLines = [
    "Hello Animal Healthcare Centre, I want to place an order.",
    `Product: ${product}`,
    `Quantity: ${quantity}`,
  ];
  if (note) messageLines.push(`Note: ${note}`);
  messageLines.push("Please confirm availability and price.");
  window.location.href = `https://wa.me/2348063463411?text=${encodeURIComponent(messageLines.join("\n"))}`;
});

document.querySelectorAll("[data-close-modal]").forEach(button => {
  button.addEventListener("click", () => modal?.classList.remove("open"));
});

modal?.addEventListener("click", event => {
  if (event.target === modal) modal.classList.remove("open");
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") modal?.classList.remove("open");
});

document.querySelectorAll("form:not([data-order-form])").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = encodeURIComponent("Hello Animal Healthcare Centre, I would like to make an enquiry.");
    window.location.href = `https://wa.me/2348063463411?text=${message}`;
  });
});
