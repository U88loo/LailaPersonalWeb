/* =========================================================
   cinema.js — the scroll-driven scenes.

   The page plays like a film as you scroll. Each scene is a
   GSAP ScrollTrigger timeline, and all of them are built inside
   one gsap.matchMedia() so they tear down and rebuild cleanly —
   on a breakpoint change, and on a language switch (text changes
   length, and Arabic runs the other way).

     00  opening titles   the poster drifts back as you leave it
     01  the person       the bio lights up word by word
     02  the headline     pinned: the newspaper spins in, the
                          camera pushes in, subtitles translate
     03  the work         pinned: the lights go down, a leader
                          counts in, the reel runs shot by shot
     04  the toolkit      two marquee rows, scrubbed by scroll
     05  the credentials  tickets dealt onto the table
     06  the end?         credits

   Plus the case-study popups: a roadmap or a model sample in
   one plays in as you scroll the popup (caseStudy below).

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

  /* ---------------- 01 · the person ----------------
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
    // left-anchored, like the CSS: only centred vertically
    gsap.set(stamp, { xPercent: 0, yPercent: -50, rotation: -11, scale: 2.4, autoAlpha: 0 });

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

  /* ---------------- 03 · the work ----------------
     A screening. The title's words rise as the scene arrives; then, pinned:
     the lights go down, a film leader counts 3 · 2 · 1, the projector
     flashes on, and the reel runs one project per shot, each frame wiping
     up into the gate while the sprocket holes advance. The index beside the
     screen follows along, and jumps to any shot.

     Without the room for a screening (narrow or short windows) the frames
     stay a grid, and each one develops in as it scrolls into view. */
  function work(reel) {
    const sec = document.getElementById("work");
    const q = gsap.utils.selector(sec);
    const title = q(".work-title")[0];
    const cards = q(".project-card");
    const pad = (i) => String(i + 1).padStart(2, "0");

    // Each word of the title rises out of its own mask, then a highlighter
    // swipes the last one. Split on spaces only: Arabic letters join within
    // a word, never across one.
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = "";
    words.forEach((w, i) => {
      const mask = document.createElement("span");
      const word = document.createElement("span");
      mask.className = "wt";
      word.className = "wt-in";
      word.textContent = w;
      mask.appendChild(word);
      title.appendChild(mask);
      if (i < words.length - 1) title.appendChild(document.createTextNode(" "));
    });
    const inner = q(".wt-in");
    // flattened, not restored: on a language switch the new title text is
    // already in place by the time this runs
    const unsplit = () => { title.textContent = title.textContent; };

    gsap.timeline({
      scrollTrigger: reel
        ? { trigger: sec, start: "top 75%", end: "top top", scrub: true }
        : { trigger: title, start: "top 92%", end: "top 45%", scrub: true }
    })
      .from(inner, { yPercent: 115, stagger: 0.15, duration: 1, ease: "power3.out" })
      .from(inner[inner.length - 1], { backgroundSize: "0% 100%", duration: 0.8, ease: "power1.inOut" }, ">-0.2");

    if (!reel) {
      // each frame develops upward as it scrolls in; the clip comes off
      // afterwards so it can't crop the card's shadow or its hover lift
      gsap.set(cards, { clipPath: "inset(100% 0% 0% 0% round 14px)" });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          clipPath: "inset(0% 0% 0% 0% round 14px)", stagger: 0.12, duration: 0.9, ease: "power3.out",
          overwrite: true, clearProps: "clipPath"
        })
      });
      return unsplit;
    }

    sec.classList.add("is-reel");
    const pin = q(".work-pin")[0];
    const room = q(".work-room")[0];
    const iris = q(".work-iris")[0];
    const head = q(".work-head")[0];
    const leader = q(".work-leader")[0];
    const nums = q(".leader-num");
    const stage = q(".work-stage")[0];
    const flash = q(".work-flash")[0];
    const sprockets = q(".work-sprockets");
    const list = q(".work-index")[0];
    const index = q(".work-index button");
    const counter = q(".work-counter")[0];
    const SPROCKET = 32;   // the pitch of the sprocket holes, in px (css/cinema.css)
    const UNIT = 360;      // px of scroll per second of the timeline
    const SHOT = 1.4;      // each project's share of the reel
    const shots = [];      // when each shot lands, in timeline seconds
    let st = null;
    let current = -2;

    gsap.set([room, stage, leader, nums], { autoAlpha: 0 });
    gsap.set(leader, { scale: 0.85 });
    gsap.set(sprockets, { backgroundPositionY: "0px" });
    gsap.set(cards, { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0% round 16px)" });

    // the index and the counter follow the playhead; the lights are down
    // from the moment the room goes dark until the scene unpins
    const DARK = 0.65;
    function sync() {
      const t = tl.time();
      let active = -1;
      shots.forEach((at, i) => { if (t >= at) active = i; });
      if (active !== current) {
        current = active;
        index.forEach((b, i) => {
          b.classList.toggle("is-active", i === active);
          if (i === active) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
        });
        counter.textContent = active < 0 ? "" : `${I18N.t("work.frame")} ${pad(active)} / ${pad(cards.length - 1)}`;
      }
      lights("work", !!st && st.isActive && t > DARK);
    }

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" }, onUpdate: sync });

    // the lights go down as an iris: the dark closes in from the edges and
    // swallows the title card, then eases off onto the room as eyes adjust
    tl.to(head, { autoAlpha: 0, scale: 0.9, duration: 1, ease: "power2.in" }, 0)
      .fromTo(iris, { "--iris": "110vmax" }, { "--iris": "-20vmax", duration: 1.1, ease: "power2.inOut" }, 0)
      .set(room, { autoAlpha: 1 }, 1.1)
      .to(iris, { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, 1.1);

    // the leader: three turns of the hand, one number a turn
    tl.to(leader, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.95)
      .to(q(".leader-hand"), { rotation: 1080, duration: 2.1, ease: "none" }, 1);
    nums.forEach((n, i) => {
      const at = 1 + i * 0.7;
      tl.set(n, { autoAlpha: 1 }, at)
        .from(n, { scale: 1.35, duration: 0.3, ease: "power2.out", immediateRender: false }, at);
      if (i < nums.length - 1) tl.set(n, { autoAlpha: 0 }, at + 0.7);
    });
    tl.to(leader, { autoAlpha: 0, scale: 1.12, duration: 0.35, ease: "power2.in" }, 3.1);

    // the projector comes on with a flash of white
    const ON = 3.3;
    tl.to(stage, { autoAlpha: 1, duration: 0.3, ease: "none" }, ON)
      .fromTo(flash, { opacity: 0 }, { opacity: 0.9, duration: 0.1, ease: "none" }, ON + 0.15)
      .to(flash, { opacity: 0, duration: 0.6, ease: "power2.out" }, ON + 0.25);

    // the reel: each frame wipes up into the gate and its contents rise in
    // after it, while the last one is pushed back into the dark behind it
    cards.forEach((card, i) => {
      const at = ON + 0.15 + i * SHOT;
      shots.push(at);
      tl.set(card, { autoAlpha: 1 }, at)
        .to(card, { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 0.75, ease: "power3.out" }, at)
        .from(card.querySelectorAll(".project-num, .project-emoji, .project-title, .project-desc, .project-tags, .project-link"),
          { y: 50, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" }, at + 0.1)
        .to(sprockets, { backgroundPositionY: -(i + 1) * 3 * SPROCKET + "px", duration: 0.75, ease: "power3.out" }, at);
      if (i > 0) tl.to(cards[i - 1], { scale: 0.9, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, at);
    });
    // hold the last frame for a beat before the scene moves on
    tl.to({}, { duration: 0.01 }, shots[shots.length - 1] + SHOT);

    st = ScrollTrigger.create({
      animation: tl,
      trigger: pin,
      start: "top top",
      end: () => "+=" + Math.round(tl.duration() * UNIT),
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onToggle: sync
    });

    // the index jumps to a shot once it has fully landed
    function jump(e) {
      const b = e.target.closest("[data-shot]");
      if (!b) return;
      const at = shots[Number(b.dataset.shot)] + 0.95;
      window.scrollTo({ top: st.start + (at / tl.duration()) * (st.end - st.start), behavior: "smooth" });
    }
    list.addEventListener("click", jump);

    return () => {
      list.removeEventListener("click", jump);
      lights("work", false);
      sec.classList.remove("is-reel");
      counter.textContent = "";
      index.forEach((b) => { b.classList.remove("is-active"); b.removeAttribute("aria-current"); });
      unsplit();
    };
  }

  /* ---------------- 04 · the toolkit ---------------- */
  function skills() {
    const trigger = { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.6 };
    gsap.fromTo("#marquee-track", { xPercent: 0 }, { xPercent: -16, ease: "none", scrollTrigger: trigger });
    gsap.fromTo("#marquee-track-2", { xPercent: -16 }, { xPercent: 0, ease: "none", scrollTrigger: Object.assign({}, trigger) });
  }

  /* ---------------- 05 · the credentials ----------------
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

  /* ---------------- 06 · the credits roll ---------------- */
  function credits() {
    gsap.from("#credits-roll > div", {
      y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: "#credits-roll", start: "top 92%", toggleActions: "play none none reverse" }
    });
  }

  /* ---------------- the case studies ----------------
     Not a scene, but cut from the same film. A case study that carries a
     build roadmap or a sample of the model's writing plays it in as it
     scrolls into view inside the popup: the roadmap fills up to the part
     on the bench, and the sample streams in word by word, the way the
     model writes it. The popup is its own scroller, so the triggers watch
     it rather than the page. Returns a cleanup for when the popup closes
     or rebuilds; without motion it does nothing and everything shows. */
  function caseStudy(panel, scroller) {
    if (!enabled) return () => {};
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(panel);
      const once = (trigger, start, tl) => ScrollTrigger.create({
        trigger, scroller, start, once: true, onEnter: () => tl.play()
      });

      const road = q(".pm-road")[0];
      if (road) {
        const gap = 0.09; // one step down the rail
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
        tl.from(q(".pm-road-fill"), { scaleX: 0, duration: 1.2, ease: "power3.inOut" }, 0)
          .from(q(".pm-road-node"), { scale: 0, duration: 0.4, stagger: gap, ease: "back.out(2.6)" }, 0.1)
          .from(q(".pm-road-line"), { scaleY: 0, duration: 0.3, stagger: gap, ease: "none" }, 0.2)
          // body and status alternate in document order, so half a gap each
          // keeps every pair together
          .from(q(".pm-road-body, .pm-road-status"), { autoAlpha: 0, y: 10, duration: 0.45, stagger: gap / 2 }, 0.1);
        once(q(".pm-road-meter")[0] || road, "top 90%", tl);
      }

      const words = q(".pm-sample-out .w");
      if (words.length) {
        // the caret's blink is a CSS opacity animation, which outranks an
        // inline opacity, so it's hidden by visibility (autoAlpha) instead
        const tl = gsap.timeline({ paused: true });
        tl.from(words, { opacity: 0, duration: 0.12, stagger: 0.03, ease: "none" })
          .from(q(".pm-sample-caret"), { autoAlpha: 0, duration: 0.01 });
        once(q(".pm-sample")[0], "top 80%", tl);
      }
    });
    return () => ctx.revert();
  }

  function build() {
    mm = gsap.matchMedia();
    // the screening needs a window wide enough for a two-column shot and
    // tall enough to show one whole
    mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)", reel: "(min-width: 900px) and (min-height: 620px)" }, (ctx) => {
      const { isMobile, reel } = ctx.conditions;
      const cleanups = [];
      openingOut();
      about();
      cleanups.push(press(isMobile));
      cleanups.push(work(reel));
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

  return { init, refresh, caseStudy, enabled };
})();
