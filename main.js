/* Signal Nine — sample launch page behaviour.
   A real clock on the dial, a scroll-aware nav, a mobile menu and a sample form. */

(function () {
  "use strict";

  /* ---------- Nav state ---------- */

  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menuBtn = document.getElementById("menuBtn");
  var navList = document.getElementById("siteNav");
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", function () {
      var open = navList.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector(".sr").textContent = open ? "Close menu" : "Open menu";
    });
    navList.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      navList.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelector(".sr").textContent = "Open menu";
    });
  }

  /* ---------- The dial shows the actual time ---------- */

  var ticks = document.getElementById("ticks");
  var hourTicks = document.getElementById("hourTicks");
  var hourHand = document.getElementById("hourHand");
  var minuteHand = document.getElementById("minuteHand");
  var digital = document.getElementById("digital");
  var NS = "http://www.w3.org/2000/svg";

  function tick(cx, cy, r1, r2, angle) {
    var rad = (angle - 90) * (Math.PI / 180);
    var line = document.createElementNS(NS, "line");
    line.setAttribute("x1", (cx + Math.cos(rad) * r1).toFixed(1));
    line.setAttribute("y1", (cy + Math.sin(rad) * r1).toFixed(1));
    line.setAttribute("x2", (cx + Math.cos(rad) * r2).toFixed(1));
    line.setAttribute("y2", (cy + Math.sin(rad) * r2).toFixed(1));
    return line;
  }

  if (ticks && hourTicks) {
    for (var i = 0; i < 60; i += 1) {
      if (i % 5 === 0) continue;
      ticks.appendChild(tick(180, 196, 96, 102, i * 6));
    }
    for (var h = 0; h < 12; h += 1) {
      hourTicks.appendChild(tick(180, 196, 92, 104, h * 30));
    }
  }

  function setHands() {
    var now = new Date();
    var minutes = now.getMinutes() + now.getSeconds() / 60;
    var hours = (now.getHours() % 12) + minutes / 60;

    if (minuteHand) minuteHand.setAttribute("transform", "rotate(" + (minutes * 6).toFixed(2) + " 180 196)");
    if (hourHand) hourHand.setAttribute("transform", "rotate(" + (hours * 30).toFixed(2) + " 180 196)");

    if (digital) {
      var hh = String(now.getHours()).padStart(2, "0");
      var mm = String(now.getMinutes()).padStart(2, "0");
      digital.textContent = hh + ":" + mm + " local";
    }
  }

  setHands();
  setInterval(setHands, 15000);

  /* ---------- Sample form ---------- */

  var form = document.getElementById("orderForm");
  var email = document.getElementById("email");
  var error = document.getElementById("emailError");
  var fine = form ? form.querySelector(".fine") : null;

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        error.textContent = "That address looks incomplete — try name@example.com.";
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
      }
      error.textContent = "";
      email.removeAttribute("aria-invalid");
      email.value = "";
      if (fine) fine.textContent = "Reserved, in spirit. This sample sends nothing and charges nothing.";
    });
    email.addEventListener("input", function () {
      if (email.getAttribute("aria-invalid") === "true") {
        error.textContent = "";
        email.removeAttribute("aria-invalid");
      }
    });
  }

  /* Each GitHub Pages deploy is a standalone sample, so there is no gallery to return to. */
  if (location.hostname.endsWith(".github.io")) {
    var galleryLink = document.querySelector(".back-gallery");
    if (galleryLink) galleryLink.remove();
  }
})();
