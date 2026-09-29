/* ============================================================
   Lucky Mark Abitong — Portfolio
   Phase 4: mobile menu, scrollspy, header state,
            scroll-reveal, contact form handling
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year (auto-update) ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile menu toggle ---- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close after choosing a link
    menu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Close when clicking outside the menu
    document.addEventListener("click", function (e) {
      if (
        menu.classList.contains("is-open") &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close if window grows past mobile breakpoint
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Active-section highlight (scrollspy) ---- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ---- Scroll-reveal (skipped for reduced-motion users) ---- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealSelector = [
      ".section__title",
      ".section__intro",
      ".summary-text",
      ".skill-card",
      ".project",
      ".timeline__item",
      ".remote-card",
      ".education-item",
      ".languages",
      ".contact-link",
      ".contact-form",
    ].join(", ");

    var revealEls = document.querySelectorAll(revealSelector);

    // Stagger cards inside grids (capped so big lists don't wait forever)
    [".skills-grid", ".projects-list", ".remote-grid", ".education-list", ".contact-links"].forEach(
      function (sel) {
        var parent = document.querySelector(sel);
        if (!parent) return;
        Array.prototype.forEach.call(parent.children, function (child, i) {
          child.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
        });
      }
    );

    revealEls.forEach(function (el) {
      el.classList.add("reveal");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add("is-visible");
            // Remove stagger delay after reveal so hover transitions stay instant
            var delay = parseInt(el.style.transitionDelay, 10) || 0;
            window.setTimeout(function () {
              el.style.transitionDelay = "";
            }, 600 + delay);
            obs.unobserve(el); // reveal once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---- Contact form (Formspree via fetch) ---- */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.className = "form-status form-status--" + type;
    statusEl.textContent = message;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var action = form.getAttribute("action") || "";
      var btn = form.querySelector('button[type="submit"]');

      // Guard: Formspree ID not configured yet
      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        showStatus(
          "error",
          "This form isn't connected yet — email me directly at luckyabitong@gmail.com."
        );
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Bad response");
          showStatus("success", "Thanks — your message is on its way. I'll reply within 24 hours.");
          form.reset();
        })
        .catch(function () {
          showStatus(
            "error",
            "Something went wrong sending your message — please email luckyabitong@gmail.com instead."
          );
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Send Message";
          }
        });
    });
  }
})();
