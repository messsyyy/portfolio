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
      ".tools-marquee",
      ".project",
      ".design-item",
      ".timeline__item",
      ".remote-card",
      ".education-item",
      ".languages",
      ".contact-link",
      ".contact-form",
    ].join(", ");

    var revealEls = document.querySelectorAll(revealSelector);

    // Stagger cards inside grids (capped so big lists don't wait forever)
    [".skills-grid", ".projects-list", ".design-grid", ".remote-grid", ".education-list", ".contact-links"].forEach(
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

  /* ---- Contact form (composes a mailto: and hands off to the mail app) ---- */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var CONTACT_EMAIL = "luckyabitong@gmail.com";

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.className = "form-status form-status--" + type;
    statusEl.textContent = message;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (form.elements.name.value || "").trim();
      var email = (form.elements.email.value || "").trim();
      var message = (form.elements.message.value || "").trim();

      if (!name || !email || !message) {
        showStatus("error", "Please fill in your name, email, and a short message.");
        return;
      }

      var subject = "Portfolio enquiry from " + name;
      var body =
        message +
        "\n\n---\n" +
        "From: " + name +
        "\nReply to: " + email;

      var href =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      showStatus(
        "success",
        "Opening your email app — press send there and I'll reply within 24 hours."
      );

      window.location.href = href;
    });
  }

  /* ---- Design gallery lightbox (open on click, arrows + Escape) ---- */
  var lightbox = document.getElementById("lightbox");

  if (lightbox) {
    var lbImg = document.getElementById("lightbox-img");
    var lbCaption = document.getElementById("lightbox-caption");
    var lbCounter = document.getElementById("lightbox-counter");
    var lbTriggers = Array.prototype.slice.call(
      document.querySelectorAll(".design-item__btn")
    );
    var lbIndex = 0;
    var lbLastFocused = null;

    function lbViewSrc(i) {
      return lbTriggers[i].getAttribute("data-full");
    }

    function lbRender() {
      var trigger = lbTriggers[lbIndex];
      lbImg.src = lbViewSrc(lbIndex);
      var thumb = trigger.querySelector("img");
      lbImg.alt = thumb ? thumb.alt : "";
      lbCaption.textContent = trigger.getAttribute("data-caption") || "";
      lbCounter.textContent = lbIndex + 1 + " / " + lbTriggers.length;
      // Preload the neighbours so next/prev feels instant
      [lbIndex + 1, lbIndex - 1].forEach(function (n) {
        var idx = (n + lbTriggers.length) % lbTriggers.length;
        new Image().src = lbViewSrc(idx);
      });
    }

    function lbOpen(i) {
      lbIndex = i;
      lbLastFocused = document.activeElement;
      lbRender();
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      // Double rAF so the browser paints the 0-opacity state before fading in
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lightbox.classList.add("is-open");
        });
      });
      var closeBtn = lightbox.querySelector(".lightbox__close");
      if (closeBtn) closeBtn.focus();
    }

    function lbClose() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        // Skip if reopened during the fade-out
        if (!lightbox.classList.contains("is-open")) {
          lightbox.hidden = true;
          lbImg.removeAttribute("src");
        }
      }, 250);
      if (lbLastFocused && lbLastFocused.focus) lbLastFocused.focus();
    }

    function lbStep(dir) {
      lbIndex = (lbIndex + dir + lbTriggers.length) % lbTriggers.length;
      lbRender();
    }

    lbTriggers.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        lbOpen(i);
      });
    });

    // Click on the dimmed backdrop (not the image) closes
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lbClose();
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", lbClose);
    lightbox
      .querySelector(".lightbox__nav--prev")
      .addEventListener("click", function () {
        lbStep(-1);
      });
    lightbox
      .querySelector(".lightbox__nav--next")
      .addEventListener("click", function () {
        lbStep(1);
      });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") {
        lbClose();
      } else if (e.key === "ArrowLeft") {
        lbStep(-1);
      } else if (e.key === "ArrowRight") {
        lbStep(1);
      } else if (e.key === "Tab") {
        // Keep keyboard focus inside the dialog while it's open
        var focusables = lightbox.querySelectorAll("button");
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
