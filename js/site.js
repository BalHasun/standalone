// The Altenburg Foundation - site behaviour
// Image carousel: autoplay, arrows, swipe, keyboard focus, reduced-motion aware.

(() => {
  "use strict";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll('[aria-roledescription="carousel"]').forEach((carousel) => {
    const track = carousel.querySelector('.gallery-track');
    const viewport = carousel.querySelector('.gallery-viewport');
    const slides = Array.from(carousel.querySelectorAll('.gallery-slide'));
    const controls = carousel.querySelector('.gallery-controls');
    const buttons = controls ? Array.from(controls.querySelectorAll("button")) : [];
    const counter = controls?.querySelector("span") ?? null;
    if (!track || !viewport || slides.length < 2 || buttons.length < 2) return;

    let activeIndex = 0;
    let hovered = false;
    let focused = false;
    let manuallyPaused = false;
    let autoplayTimer = null;
    let resumeTimer = null;
    let pointerStart = null;

    const render = () => {
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      slides.forEach((slide, index) => slide.setAttribute("aria-hidden", index === activeIndex ? "false" : "true"));
      if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    };
    const stopAutoplay = () => {
      if (autoplayTimer !== null) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (reducedMotionQuery.matches || hovered || focused || manuallyPaused) return;
      autoplayTimer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % slides.length;
        render();
      }, 6000);
    };
    const pauseAfterInteraction = () => {
      manuallyPaused = true;
      stopAutoplay();
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        manuallyPaused = false;
        startAutoplay();
      }, 9000);
    };
    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      render();
      pauseAfterInteraction();
    };

    buttons[0].addEventListener("click", () => showSlide(activeIndex - 1));
    buttons[buttons.length - 1].addEventListener("click", () => showSlide(activeIndex + 1));
    carousel.addEventListener("mouseenter", () => { hovered = true; stopAutoplay(); });
    carousel.addEventListener("mouseleave", () => { hovered = false; startAutoplay(); });
    carousel.addEventListener("focusin", () => { focused = true; stopAutoplay(); });
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) { focused = false; startAutoplay(); }
    });
    viewport.addEventListener("pointerdown", (event) => {
      pointerStart = event.clientX;
      viewport.setPointerCapture?.(event.pointerId);
    });
    viewport.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1));
    });
    viewport.addEventListener("pointercancel", () => { pointerStart = null; });
    if (typeof reducedMotionQuery.addEventListener === "function") reducedMotionQuery.addEventListener("change", startAutoplay);
    else reducedMotionQuery.addListener(startAutoplay);
    render();
    startAutoplay();
  });
})();

// Fellows carousel: multi-card track, auto-rotates one card every 3s.
(() => {
  "use strict";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const AUTOPLAY_MS = 3000;
  const RESUME_MS = 9000;

  document.querySelectorAll("[data-fellows-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector(".fellows-viewport");
    const track = carousel.querySelector(".fellows-track");
    const controls = carousel.querySelector(".fellows-controls");
    const dotsWrap = carousel.querySelector("[data-fellows-dots]");
    const status = carousel.querySelector("[data-fellows-status]");
    const prevButton = carousel.querySelector("[data-fellows-prev]");
    const nextButton = carousel.querySelector("[data-fellows-next]");
    const cards = track ? Array.from(track.children) : [];
    if (!viewport || !track || cards.length < 2) return;

    let activeIndex = 0;
    let stops = 0;
    let hovered = false;
    let focused = false;
    let manuallyPaused = false;
    let autoplayTimer = null;
    let resumeTimer = null;
    let resizeTimer = null;
    let pointerStart = null;

    const perView = () => {
      const raw = parseFloat(getComputedStyle(carousel).getPropertyValue("--fellows-per-view"));
      const visible = Number.isFinite(raw) && raw >= 1 ? Math.round(raw) : 1;
      return Math.min(visible, cards.length);
    };

    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.textContent = "";
      for (let index = 0; index < stops; index += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show Fellows ${index + 1} of ${stops}`);
        dot.addEventListener("click", () => showSlide(index));
        dotsWrap.append(dot);
      }
    };

    const render = () => {
      const visible = perView();
      track.style.transform = `translateX(-${cards[activeIndex].offsetLeft - cards[0].offsetLeft}px)`;
      cards.forEach((card, index) => {
        const inView = index >= activeIndex && index < activeIndex + visible;
        card.querySelectorAll("a").forEach((link) => {
          if (inView) link.removeAttribute("tabindex");
          else link.setAttribute("tabindex", "-1");
        });
      });
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((dot, index) => {
          dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
        });
      }
      if (status) status.textContent = `Fellows ${activeIndex + 1} to ${Math.min(activeIndex + visible, cards.length)} of ${cards.length}`;
    };

    const layout = () => {
      const nextStops = Math.max(1, cards.length - perView() + 1);
      if (nextStops !== stops) {
        stops = nextStops;
        buildDots();
      }
      if (activeIndex > stops - 1) activeIndex = stops - 1;
      if (controls) controls.hidden = stops < 2;
      render();
    };

    const stopAutoplay = () => {
      if (autoplayTimer !== null) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (reducedMotionQuery.matches || hovered || focused || manuallyPaused || stops < 2) return;
      autoplayTimer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % stops;
        render();
      }, AUTOPLAY_MS);
    };
    const pauseAfterInteraction = () => {
      manuallyPaused = true;
      stopAutoplay();
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        manuallyPaused = false;
        startAutoplay();
      }, RESUME_MS);
    };
    const showSlide = (index) => {
      activeIndex = (index + stops) % stops;
      render();
      pauseAfterInteraction();
    };

    prevButton?.addEventListener("click", () => showSlide(activeIndex - 1));
    nextButton?.addEventListener("click", () => showSlide(activeIndex + 1));
    carousel.addEventListener("mouseenter", () => { hovered = true; stopAutoplay(); });
    carousel.addEventListener("mouseleave", () => { hovered = false; startAutoplay(); });
    carousel.addEventListener("focusin", () => { focused = true; stopAutoplay(); });
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) { focused = false; startAutoplay(); }
    });
    viewport.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; });
    viewport.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1));
    });
    viewport.addEventListener("pointercancel", () => { pointerStart = null; });
    window.addEventListener("resize", () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { layout(); startAutoplay(); }, 150);
    });
    if (typeof reducedMotionQuery.addEventListener === "function") reducedMotionQuery.addEventListener("change", startAutoplay);
    else reducedMotionQuery.addListener(startAutoplay);

    layout();
    startAutoplay();
  });
})();
