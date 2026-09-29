/* =========================================================
   cinema.js — the scroll-driven scenes.

   The page plays like a film as you scroll. Each scene is a
   GSAP ScrollTrigger timeline, and all of them are built inside
   one gsap.matchMedia() so they tear down and rebuild cleanly —
   on a breakpoint change, and on a language switch (text changes
   length, and Arabic runs the other way).

     00  opening titles   the poster drifts back as you leave it
     01  the premise      pinned: titles → card → phone → CTA
     02  the headline     pinned: the newspaper spins in, the
                          camera pushes in, subtitles translate
     03  the person       the bio lights up word by word
     04  the work         pinned: a film strip that runs sideways
     05  the toolkit      two marquee rows, scrubbed by scroll
     06  the credentials  tickets dealt onto the table
     07  the end?         credits

   Motion is opt-in: html.cine is only added when GSAP loaded
   and the visitor hasn't asked for reduced motion. Without it
   every scene falls back to its plain stacked layout (see
   css/cinema.css), so nothing is ever hidden behind an
   animation that can't run.
   ========================================================= */

const Cinema = (function () {
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enabled = hasGsap && !reduced;

  // Added now, while the scripts are still parsing, so the layered layouts
  // are in place before anything below the fold is ever painted.
  if (enabled) {
    document.documentElement.classList.add("cine");
    gsap.registerPlugin(ScrollTrigger);
    // a phone's URL bar showing/hiding resizes the viewport constantly;
    // re-measuring every pin on each of those makes the page jump
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  let mm = null;
  const rtl = () => document.documentElement.getAttribute("dir") === "rtl";
  const navH = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 84;

  // "Lights down": the nav and HUD dim while a dark scene fills the screen.
  // Each scene switches its own source, so one can't turn off the other's.
  const dark = new Set();
  function lights(source, isDark) {
    if (isDark) dark.add(source); else dark.delete(source);
    document.body.classList.toggle("lights-down", dark.size > 0);
  }

  /* ---------------- 00 · the poster drifts back ---------------- */
  function openingOut() {
    gsap.to("#poster .wpl-stage", {
      yPercent: -10, scale: 0.94, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---------------- 01 · the premise ----------------
     A port of the cinematic landing hero: the titles blur back, a deep
     card rises and fills the screen, the phone flies in with the numbers,
     then the card pulls back and leaves to reveal the call to action. */
  function premise(isMobile) {
    const sec = document.getElementById("premise");
    const q = gsap.utils.selector(sec);
    const card = q(".ch-card")[0];
    const counter = q(".ch-counter")[0];
    const target = Number(counter.getAttribute("data-count")) || 0;
    const dir = rtl() ? -1 : 1;
    const hiddenClip = rtl() ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

    // the titles arrive once, as the scene scrolls into view
    gsap.set(q(".ch-titles .scene-kicker, .ch-line-1"), { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
    gsap.set(q(".ch-line-2"), { clipPath: hiddenClip });
    gsap.timeline({ scrollTrigger: { trigger: sec, start: "top 70%", toggleActions: "play none none reverse" } })
      .to(q(".ch-titles .scene-kicker, .ch-line-1"), { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out", stagger: 0.08 })
      .to(q(".ch-line-2"), { duration: 1.4, clipPath: "inset(0 0% 0 0%)", ease: "power4.inOut" }, "-=1.0");

    gsap.set(q(".ch-copy, .ch-brand, .ch-mockup, .ch-badge, .ch-widget"), { autoAlpha: 0 });
    gsap.set(q(".ch-cta"), { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });
    gsap.set(q(".ch-ring-progress"), { strokeDashoffset: 377 });
    counter.textContent = "0";
    const count = { v: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => "+=" + (isMobile ? 3400 : 4400),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // dim the nav while the card fills the screen
        onUpdate: (self) => {
          const a = self.animation;
          const t = self.progress * a.duration();
          lights("premise", t >= a.labels.full - 0.6 && t < a.labels.pullback + 0.4);
        },
        onToggle: (self) => { if (!self.isActive) lights("premise", false); }
      }
    });

    tl.to([q(".ch-titles"), q(".ch-grid")], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
      .fromTo(card, { y: () => window.innerHeight + 200 }, { y: 0, ease: "power3.inOut", duration: 2 }, 0)
      .to(card, { width: "100%", height: "100%", borderRadius: 0, ease: "power3.inOut", duration: 1.5 })
      .addLabel("full")
      .fromTo(q(".ch-mockup"),
        { y: 300, z: -500, rotationX: 50, rotationY: -30 * dir, autoAlpha: 0, scale: 0.6 },
        { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8")
      .fromTo(q(".ch-widget"), { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
      .to(q(".ch-ring-progress"), { strokeDashoffset: 57, duration: 2, ease: "power3.inOut" }, "-=1.2")
      .to(count, { v: target, duration: 2, ease: "expo.out", onUpdate: () => { counter.textContent = Math.round(count.v); } }, "-=2.0")
      .fromTo(q(".ch-badge"), { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
      .fromTo(q(".ch-copy"), { x: -50 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
      .fromTo(q(".ch-brand"), { x: 50 * dir, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
      .to({}, { duration: 2.5 })
      .set(q(".ch-titles"), { autoAlpha: 0 })
      .set(q(".ch-cta"), { autoAlpha: 1 })
      .to({}, { duration: 1.5 })
      .to([q(".ch-mockup"), q(".ch-copy"), q(".ch-brand")], { scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05 })
      .to(card, {
        width: isMobile ? "92vw" : "85vw",
        height: isMobile ? "94%" : "88%",   // of the layer below the nav
        borderRadius: isMobile ? 32 : 40,
        ease: "expo.inOut", duration: 1.8
      }, "pullback")
      .to(q(".ch-cta"), { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
      .to(card, { y: () => -window.innerHeight - 300, ease: "power3.in", duration: 1.5 })
      .to({}, { duration: 0.8 });   // a beat on the call to action before it scrolls on

    return premisePointer(sec, card, q(".ch-phone")[0]);
  }

  // the card's sheen follows the pointer, and the phone leans toward it
  function premisePointer(sec, card, phone) {
    if (!window.matchMedia("(pointer: fine)").matches) return null;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        card.style.setProperty("--mouse-x", e.clientX - r.left + "px");
        card.style.setProperty("--mouse-y", e.clientY - r.top + "px");
        const xv = (e.clientX / window.innerWidth - 0.5) * 2;
        const yv = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(phone, { rotationY: xv * 12, rotationX: -yv * 12, ease: "power3.out", duration: 1.2, overwrite: "auto" });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }

  /* ---------------- 02 · the headline ----------------
     The newspaper spins in like the front page in an old film, then a
     camera pushes in on each beat from siteData.press — headline, photo,
     paragraphs — while its subtitle fades up. The scan is 1080 × 1350; the
     paper frame crops it at 1060 to lose the blank foot. */
  function press(isMobile) {
    const sec = document.getElementById("press");
    const q = gsap.utils.selector(sec);
    const paper = document.getElementById("press-paper");
    const stamp = q(".press-stamp")[0];
    const subs = q(".press-sub");
    const beats = I18N.data().press.beats;
    const SCAN_W = 1080;
    const MAX_SCALE = isMobile ? 3.2 : 2.6; // past this the scan goes soft

    // Where to put the paper so beat `i` fills the frame between the
    // letterbox bar and the subtitles. offsetWidth ignores transforms, so
    // this measures the paper's resting size whatever the camera is doing.
    function shot(i) {
      const f = beats[i].focus;
      const W = paper.offsetWidth, H = paper.offsetHeight;
      const vw = sec.clientWidth, vh = sec.clientHeight;
      const k = W / SCAN_W;
      const top = navH() + vh * 0.015 + 18;
      const availH = Math.max(160, vh - top - (vh * 0.09 + 26) - (isMobile ? 150 : 130));
      const availW = vw * (isMobile ? 0.92 : 0.86);
      const s = Math.min(MAX_SCALE, availW / (f.w * k), availH / (f.h * k));
      const tx = vw / 2;
      const ty = top + availH / 2;
      return {
        scale: s,
        x: tx - vw / 2 - (f.x * k - W / 2) * s,
        y: ty - vh / 2 - (f.y * k - H / 2) * s
      };
    }
    const cam = (i, extra) => Object.assign({
      scale: () => shot(i).scale,
      x: () => shot(i).x,
      y: () => shot(i).y
    }, extra);

    gsap.set(paper, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%", force3D: false });
    gsap.set(stamp, { xPercent: -50, yPercent: -50, rotation: -11, scale: 2.4, autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => "+=" + (beats.length * (isMobile ? 700 : 850) + 1400),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => lights("press", self.isActive)
      }
    });

    // the headline card clears first, then the paper spins up out of the dark
    tl.to(q(".press-head"), { autoAlpha: 0, y: -50, duration: 0.8, ease: "power2.in" }, 0.2)
      .fromTo(paper,
        { scale: 0.04, rotation: -900, x: 0, y: 0, autoAlpha: 0 },
        cam(0, { rotation: -2, autoAlpha: 1, duration: 2.2, ease: "power3.inOut", force3D: false }), 0.3)
      .to(q(".press-bar"), { scaleY: 1, duration: 1, ease: "power2.inOut" }, 1.0)
      .to(sec, { "--scrim": 1, duration: 1 }, 1.0)
      .to(subs[0], { autoAlpha: 1, duration: 0.4 }, 2.2)
      .addLabel("beat0");

    for (let i = 1; i < beats.length; i++) {
      tl.to(subs[i - 1], { autoAlpha: 0, duration: 0.3 }, "+=0.9")
        .to(paper, cam(i, { rotation: 0, duration: 1.4, ease: "power2.inOut", force3D: false }), "<")
        .to(subs[i], { autoAlpha: 1, duration: 0.4 }, ">-0.35")
        .addLabel("beat" + i);
    }

    tl.to(subs[beats.length - 1], { autoAlpha: 0, duration: 0.3 }, "+=0.9")
      .to(paper, cam(0, { rotation: -2, duration: 1.4, ease: "power2.inOut", force3D: false }), "<")
      .to(sec, { "--scrim": 0.5, duration: 1 }, "<")
      .to(stamp, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)" }, ">-0.25")
      .to(q(".press-cta"), { autoAlpha: 1, duration: 0.5 }, "<")
      .addLabel("final")
      .to({}, { duration: 1.2 });

    return null;
  }

  /* ---------------- 03 · the person ----------------
     Each word of the bio brightens as the paragraph scrolls through —
     read at the pace you scroll, like subtitles. */
  function about() {
    const words = document.querySelectorAll("#about-text .w");
    if (!words.length) return;
    gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: "#about-text", start: "top 85%", end: "bottom 40%", scrub: true }
    });
  }

  /* ---------------- 04 · the work ----------------
     On wide screens the projects become frames on a film strip, pinned
     and pulled sideways by the scroll. Narrow screens keep the grid. */
  function work(wide) {
    const sec = document.getElementById("work");
    if (!wide) return null;
    sec.classList.add("is-strip");
    const pin = sec.querySelector(".work-pin");
    const track = document.getElementById("projects-grid");
    const sign = rtl() ? 1 : -1;
    const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth);

    const move = gsap.to(track, {
      x: () => sign * dist(),
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => "+=" + dist(),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // each frame comes up into the light as it reaches the gate
    track.querySelectorAll(".project-card").forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0.35, scale: 0.92, y: 24 },
        {
          opacity: 1, scale: 1, y: 0, ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: move,
            start: rtl() ? "right 8%" : "left 92%",
            end: rtl() ? "right 45%" : "left 55%",
            scrub: true
          }
        });
    });

    return () => sec.classList.remove("is-strip");
  }

  /* ---------------- 05 · the toolkit ---------------- */
  function skills() {
    const trigger = { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.6 };
    gsap.fromTo("#marquee-track", { xPercent: 0 }, { xPercent: -16, ease: "none", scrollTrigger: trigger });
    gsap.fromTo("#marquee-track-2", { xPercent: -16 }, { xPercent: 0, ease: "none", scrollTrigger: Object.assign({}, trigger) });
  }

  /* ---------------- 06 · the credentials ----------------
     Tickets are dealt onto the table, alternately tilted. */
  function certs() {
    const tickets = gsap.utils.toArray(".ticket");
    if (!tickets.length) return;
    gsap.set(tickets, { autoAlpha: 0, y: 70 });
    ScrollTrigger.batch(tickets, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.fromTo(batch,
        { autoAlpha: 0, y: 70, rotation: (i) => (i % 2 ? 5 : -5) },
        { autoAlpha: 1, y: 0, rotation: 0, stagger: 0.12, duration: 0.9, ease: "back.out(1.4)", overwrite: true })
    });
  }

  /* ---------------- 07 · the credits roll ---------------- */
  function credits() {
    gsap.from("#credits-roll > div", {
      y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: "#credits-roll", start: "top 92%", toggleActions: "play none none reverse" }
    });
  }

  function build() {
    mm = gsap.matchMedia();
    mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)", wide: "(min-width: 900px)" }, (ctx) => {
      const { isMobile, wide } = ctx.conditions;
      const cleanups = [];
      openingOut();
      cleanups.push(premise(isMobile));
      cleanups.push(press(isMobile));
      about();
      cleanups.push(work(wide));
      skills();
      certs();
      credits();
      return () => cleanups.forEach((fn) => fn && fn());
    });
  }

  /* ---------------- the HUD ----------------
     Scene number and name, plus a timecode that runs with the scroll. It
     only reads the page, so it works with or without GSAP. */
  function initHud() {
    const hud = document.querySelector(".cine-hud");
    if (!hud) return;
    const scenes = Array.from(document.querySelectorAll("[data-scene]"));
    const elScene = document.getElementById("hud-scene");
    const elTitle = document.getElementById("hud-title");
    const elTc = document.getElementById("hud-tc");
    const RUNTIME = 7 * 60 + 12;   // it's a short film: 07:12
    const pad = (n) => String(n).padStart(2, "0");
    let current = -1;
    let queued = false;

    function update() {
      queued = false;
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      scenes.forEach((s) => {
        if (s.getBoundingClientRect().top <= mid) idx = Number(s.getAttribute("data-scene"));
      });
      if (idx !== current) {
        current = idx;
        elScene.textContent = "SC " + pad(idx);
        elTitle.textContent = I18N.t("scene." + idx);
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = (max > 0 ? window.scrollY / max : 0) * RUNTIME;
      elTc.textContent = "00:" + pad(Math.floor(t / 60)) + ":" + pad(Math.floor(t % 60)) + ":" + pad(Math.floor((t % 1) * 24));
      hud.classList.toggle("at-top", window.scrollY < 40);
    }
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    I18N.onChange(() => { current = -1; queue(); });
    update();
  }

  /* ---------------- public ---------------- */
  function init() {
    initHud();
    if (!enabled) return;
    build();
    // web fonts change every text measurement the pins were built on
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  // language switch: the content was just re-rendered, so rebuild every
  // scene against it, then put the reader back where they were
  function refresh() {
    if (!enabled || !mm) return;
    const y = window.scrollY;
    // reverting doesn't fire the scenes' toggle callbacks, so reset the
    // lights here; the rebuilt scenes switch them back on if they need to
    dark.clear();
    document.body.classList.remove("lights-down");
    mm.revert();
    build();
    ScrollTrigger.refresh();
    window.scrollTo(0, y);
  }

  return { init, refresh, enabled };
})();
