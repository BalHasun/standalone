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
