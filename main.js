/* Signal Nine — sample launch page behaviour.
   A live local-time watch, a scroll-aware nav, a mobile menu and a sample form. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) root.classList.add("has-motion");

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
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !navList.classList.contains("is-open")) return;
      navList.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelector(".sr").textContent = "Open menu";
      menuBtn.focus();
    });
  }

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

  /* ---------- Local-time watch ---------- */

  var watchZone = document.getElementById("watchZone");
  var watchClock = document.getElementById("watchClock");
  var watchHint = document.getElementById("watchHint");
  var hourHand = document.getElementById("hourHand");
  var minuteHand = document.getElementById("minuteHand");
  var timeFormatter;
  var zoneName = "Local";

  try {
    timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || zoneName;
  } catch (error) {
    timeFormatter = null;
  }

  if (watchZone) watchZone.textContent = zoneName.replace(/_/g, " ");
  if (watchHint && reduceMotion) watchHint.textContent = "Live local time";

  function paintTime() {
    var now = new Date();
    var seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    var minutes = now.getMinutes() + seconds / 60;
    var hours = (now.getHours() % 12) + minutes / 60;

    if (hourHand) hourHand.style.setProperty("--rot", (hours * 30).toFixed(3) + "deg");
    if (minuteHand) minuteHand.style.setProperty("--rot", (minutes * 6).toFixed(3) + "deg");

    if (watchClock) {
      var label = timeFormatter
        ? timeFormatter.format(now)
        : now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
      if (watchClock.textContent !== label) {
        watchClock.textContent = label;
        watchClock.setAttribute("datetime", now.toISOString());
      }
    }
  }

  if (reduceMotion) {
    paintTime();
    window.setInterval(paintTime, 1000);
  } else {
    (function tick() {
      paintTime();
      window.requestAnimationFrame(tick);
    })();
  }

  /* ---------- Motion layer ---------- */

  var motionReady = root.classList.contains("has-motion") && "IntersectionObserver" in window;

  function revealAll(selector, stagger) {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;
    if (!motionReady) {
      nodes.forEach(function (node) { node.classList.add("is-in"); });
      return;
    }
    nodes.forEach(function (node, index) {
      node.classList.add("will-reveal");
      node.style.setProperty("--reveal-i", String(index % (stagger || 6)));
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px" });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  revealAll(".press, .overview > *, .feature-head, .feature-grid article, .inwild-head, .plates figure, .specs-copy, .spec-list div, .order-copy > *, .order-form, .footer > *", 6);

  if (motionReady) {
    var hero = document.querySelector(".hero");
    var watchStage = document.getElementById("watchStage");
    var watchTilt = document.querySelector(".watch-tilt");
    var watchSpin = document.querySelector(".watch-spin");

    if (hero && watchTilt) {
      hero.addEventListener("pointermove", function (event) {
        var rect = hero.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        watchTilt.style.setProperty("--tilt-y", (x * 30).toFixed(2) + "deg");
        watchTilt.style.setProperty("--tilt-x", (-y * 24).toFixed(2) + "deg");
        watchTilt.style.setProperty("--move-x", (x * 26).toFixed(1) + "px");
        watchTilt.style.setProperty("--move-y", (y * 18).toFixed(1) + "px");
        hero.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(1) + "%");
        hero.style.setProperty("--my", ((y + 0.5) * 100).toFixed(1) + "%");
      });
      hero.addEventListener("pointerleave", function () {
        watchTilt.style.setProperty("--tilt-y", "0deg");
        watchTilt.style.setProperty("--tilt-x", "0deg");
        watchTilt.style.setProperty("--move-x", "0px");
        watchTilt.style.setProperty("--move-y", "0px");
      });
    }

    if (watchStage && watchSpin) {
      watchStage.addEventListener("click", function () {
        if (watchStage.classList.contains("is-spinning")) return;
        watchStage.classList.add("is-spinning");
        watchStage.addEventListener("animationend", function done() {
          watchStage.classList.remove("is-spinning");
          watchStage.removeEventListener("animationend", done);
        });
      });
    }

    var rail = document.createElement("div");
    rail.className = "time-rail";
    rail.setAttribute("aria-hidden", "true");
    rail.innerHTML = "<span></span>";
    document.body.appendChild(rail);

    var railBar = rail.firstChild;
    var railTicking = false;
    function updateRail() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      railBar.style.transform = "scaleY(" + ratio.toFixed(4) + ")";
      railTicking = false;
    }
    function requestRail() {
      if (railTicking) return;
      railTicking = true;
      window.requestAnimationFrame(updateRail);
    }
    updateRail();
    window.addEventListener("scroll", requestRail, { passive: true });
    window.addEventListener("resize", requestRail);

    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll("#siteNav a[href^='#']"));
    if (sections.length && navLinks.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
      sections.forEach(function (section) { spy.observe(section); });
    }

    if (form) {
      form.addEventListener("submit", function () {
        if (email && email.getAttribute("aria-invalid") === "true") return;
        form.classList.add("is-done");
      });
    }

  }

  /* Each GitHub Pages deploy is a standalone sample, so there is no gallery to return to. */
  if (location.hostname.endsWith(".github.io")) {
    var galleryLink = document.querySelector(".back-gallery");
    if (galleryLink) galleryLink.remove();
  }
})();
