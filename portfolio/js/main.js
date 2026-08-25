/**
 * Comportamiento compartido en todas las páginas:
 * - Menú hamburguesa (mobile)
 * - Resaltar el link de navegación activo según la página actual
 * - Animación "reveal" al hacer scroll (IntersectionObserver)
 * - Filtro de categorías en Portafolio (si existe en la página)
 */
document.addEventListener("DOMContentLoaded", () => {
  // ── Menú móvil ────────────────────────────────────────────────
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");

  if (hamburger && drawer) {
    hamburger.addEventListener("click", () => {
      const isOpen = drawer.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ── Cerrar el drawer móvil al elegir una sección ────────────────
  document.querySelectorAll(".mobile-drawer a").forEach((link) => {
    link.addEventListener("click", () => {
      drawer && drawer.classList.remove("is-open");
      hamburger && hamburger.classList.remove("is-open");
    });
  });

  // ── Scrollspy: resalta el link de la sección visible ────────────
  const navLinks = document.querySelectorAll(".nav-link, .mobile-drawer a");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((sec) => spy.observe(sec));
  }

  // ── Reveal on scroll ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ── Filtro de proyectos (Portafolio) ────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("[data-category]");

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
});
