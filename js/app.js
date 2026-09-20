/* =========================================================
   app.js — boot sequence, rendering, interactions.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderContent();
  initBootSequence();
  initCursor();
  initNav();
  initTheme();
  initTypedRole();
  initScrollReveal();
  initScrollProgress();
  initMarquee();
  initSkillBars();
  initAI();
  initKonami();
  initMisc();
  initVisitTracking();
  initSecretDoorway();
  initButterflies();
  initProjectModal();
});

/* ---------------- project case-study popup ----------------
   A project with a `details` object opens a popup instead of
   following its link. Every section inside `details` is optional,
   so other projects can get one by adding the data alone. */
function initProjectModal() {
  const overlay = document.getElementById("project-modal");
  const panel = document.getElementById("pm-body");
  const closeBtn = document.getElementById("pm-close");
  let lastFocused = null;

  document.getElementById("projects-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card) return;
    const project = siteData.projects[Number(card.dataset.project)];
    if (!project) return;

    // `link: "#"` is a placeholder, not a destination — following it would
    // scroll the page back to the top, so stop it whether or not there's a
    // case study to open in its place.
    if (!project.link || project.link === "#") e.preventDefault();

    if (!project.details) return; // real link — let it do its thing
    e.preventDefault();
    openModal(project);
  });

  function openModal(project) {
    lastFocused = document.activeElement;
    panel.innerHTML = buildProjectDetails(project);
    panel.scrollTop = 0;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    // pm-open hides the fixed nav / orb / progress bar so nothing can
    // overlap the popup, whatever the z-index situation is
    document.body.classList.add("pm-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    // pause first — clearing the HTML while a video plays can leave audio running
    panel.querySelectorAll("video").forEach((v) => v.pause());
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pm-open");
    document.body.style.overflow = "";
    panel.innerHTML = "";
    if (lastFocused) lastFocused.focus();
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}

function buildProjectDetails(p) {
  const d = p.details;
  const block = (title, inner) =>
    inner ? `<section class="pm-block"><h4 class="pm-h4">${title}</h4>${inner}</section>` : "";

  const videos = (d.videos || []).map((v) => `
    <figure class="pm-video">
      <video src="${v.src}" controls preload="metadata" playsinline></video>
      <figcaption>${escapeHtml(v.label)}${v.length ? ` · ${escapeHtml(v.length)}` : ""}</figcaption>
    </figure>
  `).join("");

  const overview = (d.overview || []).map((t) => `<p>${escapeHtml(t)}</p>`).join("");

  // one bullet list style, shared by `highlights` and any extra `sections`.
  // `ar` is an optional Arabic name — kept in its own rtl span so the bidi
  // algorithm can't flip brackets around it when it sits inside English text.
  const bullets = (list) => (list || []).map((h) => `
    <li>
      <span class="pm-hl-emoji">${h.emoji}</span>
      <div>
        <strong>${escapeHtml(h.title)}</strong>
        ${h.ar ? `<span class="pm-hl-ar" dir="rtl" lang="ar">${escapeHtml(h.ar)}</span>` : ""}
        <span>${escapeHtml(h.text)}</span>
      </div>
    </li>
  `).join("");

  const highlights = bullets(d.highlights);

  const stats = (d.stats || []).map((s) => `
    <div class="pm-stat"><b>${escapeHtml(s.value)}</b><span>${escapeHtml(s.label)}</span></div>
  `).join("");

  // free-form extra blocks, rendered with the same heading + bullet styling
  const sections = (d.sections || []).map((s) => {
    const intro = s.intro ? `<p>${escapeHtml(s.intro)}</p>` : "";
    const items = bullets(s.items);
    return block(s.title, `${intro}${items ? `<ul class="pm-highlights">${items}</ul>` : ""}`);
  }).join("");

  const steps = (d.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");

  const stack = (d.stack || []).map((g) => `
    <div class="pm-stack-group">
      <span class="pm-stack-label">${escapeHtml(g.group)}</span>
      <div class="pm-chips">${g.items.map((i) => `<span>${escapeHtml(i)}</span>`).join("")}</div>
    </div>
  `).join("");

  const team = (d.team || [])
    .map((m) => `<span class="pm-person">${escapeHtml(m)}</span>`).join("");

  const links = (d.links || []).map((l) =>
    `<a class="btn btn-primary btn-sm" href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.label)} ↗</a>`
  ).join("");

  return `
    <header class="pm-head">
      <span class="pm-emoji">${p.emoji}</span>
      <div>
        <h3 id="pm-title" class="pm-title">${escapeHtml(p.title)}</h3>
        ${d.tagline ? `<p class="pm-tagline">${escapeHtml(d.tagline)}</p>` : ""}
        ${d.role ? `<p class="pm-role">${escapeHtml(d.role)}</p>` : ""}
      </div>
    </header>
    <div class="pm-tags">${p.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
    ${links ? `<div class="pm-links">${links}</div>` : ""}
    ${videos ? `<div class="pm-videos">${videos}</div>` : ""}
    ${block("What it is", overview)}
    ${block("By the numbers", stats ? `<div class="pm-stats">${stats}</div>` : "")}
    ${block("What it does", highlights ? `<ul class="pm-highlights">${highlights}</ul>` : "")}
    ${block("How it works", steps ? `<ol class="pm-steps">${steps}</ol>` : "")}
    ${sections}
    ${block("Built with", stack ? `<div class="pm-stack">${stack}</div>` : "")}
    ${block("Team", team ? `<div class="pm-team">${team}</div>` : "")}
  `;
}

/* ---------------- ambient butterflies ---------------- */
function initButterflies() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const wingSvg = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 30 C20 6 2 10 6 26 C9 38 24 34 32 30 Z" fill="currentColor" opacity=".9"/>
    <path d="M32 30 C44 6 62 10 58 26 C55 38 40 34 32 30 Z" fill="currentColor" opacity=".9"/>
    <path d="M32 32 C22 50 6 54 8 44 C10 36 24 34 32 32 Z" fill="currentColor" opacity=".7"/>
    <path d="M32 32 C42 50 58 54 56 44 C54 36 40 34 32 32 Z" fill="currentColor" opacity=".7"/>
    <rect x="30" y="25" width="4" height="17" rx="2" fill="currentColor"/>
  </svg>`;

  const colors = ["var(--accent-1)", "var(--accent-2)", "var(--accent-3)", "var(--accent-4)"];
  const count = 7;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "butterfly";
    el.innerHTML = wingSvg;

    const size = 16 + Math.random() * 18;
    const top = 5 + Math.random() * 65;
    const duration = 16 + Math.random() * 14;
    const delay = -Math.random() * duration;

    el.style.setProperty("--by", top + "vh");
    el.style.setProperty("--bdur", duration + "s");
    el.style.setProperty("--bdelay", delay + "s");
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.color = colors[i % colors.length];

    document.body.appendChild(el);
  }
}

/* ---------------- visit tracking (local-only, powers the AI's "I remember you" line) ---------------- */
function initVisitTracking() {
  try {
    const count = parseInt(localStorage.getItem("laila-visit-count") || "0", 10) + 1;
    localStorage.setItem("laila-visit-count", String(count));
  } catch (e) { /* localStorage unavailable — silently skip */ }
}

/* ---------------- render data-driven content ---------------- */
function renderContent() {
  document.title = `${siteData.fullName || siteData.name} — Software Engineer`;
  document.getElementById("about-text").textContent = siteData.about;
  document.getElementById("about-location").textContent = siteData.location;
  document.getElementById("about-focus").textContent = siteData.focus;
  document.getElementById("about-status").textContent = siteData.status;
  document.getElementById("resume-link").href = siteData.resumeUrl;
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  // skills
  const skillsGrid = document.getElementById("skills-grid");
  skillsGrid.innerHTML = siteData.skills.map((s) => `
    <div class="skill-card">
      <div class="skill-top"><span class="skill-name">${escapeHtml(s.name)}</span><span class="skill-pct">${s.level}%</span></div>
      <div class="skill-bar"><div class="skill-fill" data-level="${s.level}"></div></div>
    </div>
  `).join("");

  // marquee
  const track = document.getElementById("marquee-track");
  const items = [...siteData.marquee, ...siteData.marquee]
    .map((m) => `<span>${escapeHtml(m)} ✦</span>`).join("");
  track.innerHTML = items;

  // projects — a card is only rendered as a link when there's actually
  // something behind it: a case study to open, or a real URL to visit.
  // Anything else is a plain div, so no visitor is invited to click a
  // "view project →" that can't go anywhere.
  const projectsGrid = document.getElementById("projects-grid");
  projectsGrid.innerHTML = siteData.projects.map((p, i) => {
    const hasUrl = p.link && p.link !== "#";
    const clickable = !!p.details || hasUrl;
    const inner = `
      ${p.badge ? `<span class="project-sticker"><span class="sticker-dot"></span>${escapeHtml(p.badge)}</span>` : ""}
      <span class="project-emoji">${p.emoji}</span>
      <h3 class="project-title">${escapeHtml(p.title)}</h3>
      <p class="project-desc">${escapeHtml(p.description)}</p>
      <div class="project-tags">${p.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
      ${clickable ? `<span class="project-link">${p.details ? "view case study →" : "view project →"}</span>` : ""}
    `;
    return clickable
      ? `<a class="project-card" href="${p.link}" target="${hasUrl ? "_blank" : "_self"}" rel="noopener" data-project="${i}">${inner}</a>`
      : `<div class="project-card is-static" data-project="${i}">${inner}</div>`;
  }).join("");

  // certifications — cards link out to the verification page when there is one
  const certsGrid = document.getElementById("certs-grid");
  certsGrid.innerHTML = siteData.courses.map((c) => {
    const body = `
      <span class="cert-emoji">${c.emoji}</span>
      <h3 class="cert-title">${escapeHtml(c.name)}</h3>
      <p class="cert-provider">${escapeHtml(c.provider)}</p>
      ${c.date ? `<span class="cert-date">${escapeHtml(c.date)}</span>` : ""}
      ${c.url ? `<span class="cert-link">verify ↗</span>` : ""}
    `;
    return c.url
      ? `<a class="cert-card" href="${c.url}" target="_blank" rel="noopener">${body}</a>`
      : `<div class="cert-card">${body}</div>`;
  }).join("");

  // contact links
  const contactLinks = document.getElementById("contact-links");
  contactLinks.innerHTML = siteData.social.map((s) => `
    <a href="${s.url}" target="_blank" rel="noopener">${iconFor(s.icon)} ${escapeHtml(s.label)}</a>
  `).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function iconFor(name) {
  const icons = {
    github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.75c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.58 2.34 1.13 2.91.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>',
    linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z"/></svg>',
    twitter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6 6-6zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z"/></svg>',
    mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    whatsapp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.23 8.25-8.23zm-4.53 4.6c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.16 1.72 2.7 4.23 3.68 2.08.83 2.5.66 2.96.62.45-.04 1.45-.6 1.65-1.17.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28-.25-.13-1.45-.72-1.68-.8-.22-.08-.39-.13-.55.13-.16.25-.63.8-.78.97-.14.16-.28.18-.53.06-.25-.13-1.06-.4-2.02-1.26-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.16-.25.24-.4.08-.16.04-.31-.02-.44-.06-.13-.55-1.36-.77-1.86-.2-.48-.4-.42-.55-.42h-.47z"/></svg>'
  };
  return icons[name] || "";
}

/* ---------------- boot sequence ---------------- */
function initBootSequence() {
  const screen = document.getElementById("boot-screen");
  const log = document.getElementById("boot-log");
  const replayBtn = document.getElementById("replay-boot");

  const lines = [
    { text: `> booting laila.OS v2.0...`, ok: false },
    { text: `> loading creativity modules...`, ok: true },
    { text: `> compiling ideas...`, ok: true },
    { text: `> calibrating vibe...`, ok: true },
    { text: `> waking up laila.ai assistant...`, ok: true },
    { text: `> welcome, ${siteData.name.toLowerCase()}.dev is ready.`, ok: false }
  ];

  let skipped = false;
  let running = false;

  function play() {
    running = true;
    skipped = false;
    log.innerHTML = "";
    screen.classList.remove("hidden");
    screen.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    typeLines(0);
  }

  function typeLines(i) {
    if (skipped) return finish();
    if (i >= lines.length) {
      setTimeout(finish, 500);
      return;
    }
    const { text, ok } = lines[i];
    let charIndex = 0;
    const lineEl = document.createElement("div");
    log.appendChild(lineEl);

    const typer = setInterval(() => {
      if (skipped) { clearInterval(typer); return finish(); }
      lineEl.textContent = text.slice(0, ++charIndex);
      if (charIndex >= text.length) {
        clearInterval(typer);
        if (ok) lineEl.innerHTML = text + ' <span class="ok">[OK]</span>';
        setTimeout(() => typeLines(i + 1), 180);
      }
    }, 16);
  }

  function finish() {
    running = false;
    screen.classList.add("hidden");
    screen.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    sessionStorage.setItem("laila-booted", "1");
  }

  function skip() {
    if (running) skipped = true;
  }

  document.addEventListener("keydown", skip, { once: false });
  screen.addEventListener("click", skip);

  replayBtn.addEventListener("click", play);

  if (!sessionStorage.getItem("laila-booted")) {
    play();
  } else {
    screen.classList.add("hidden");
    screen.setAttribute("aria-hidden", "true");
  }
}

/* ---------------- custom cursor ---------------- */
function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) {
    document.body.classList.add("no-custom-cursor");
    return;
  }
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  let rx = 0, ry = 0, mx = 0, my = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  }, { passive: true });

  (function lerpLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(lerpLoop);
  })();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, input, .project-card:not(.is-static), [data-open-ai]")) {
      ring.classList.add("hovering");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, input, .project-card:not(.is-static), [data-open-ai]")) {
      ring.classList.remove("hovering");
    }
  });
}

/* ---------------- nav / scroll cue ---------------- */
function initNav() {
  document.getElementById("scroll-cue").addEventListener("click", () => {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------------- theme toggle ---------------- */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  const saved = localStorage.getItem("laila-theme");
  if (saved) root.setAttribute("data-theme", saved);
  updateIcon();

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("laila-theme", next);
    updateIcon();
  });

  function updateIcon() {
    const isDark = root.getAttribute("data-theme") === "dark";
    icon.innerHTML = isDark
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

/* ---------------- typing role effect ---------------- */
function initTypedRole() {
  const el = document.getElementById("typed-role");
  const roles = siteData.roles;
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 1400);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
}

/* ---------------- scroll reveal ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
}

/* ---------------- scroll progress bar ---------------- */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + "%";
  }, { passive: true });
}

/* ---------------- marquee (just needs the animation, CSS handles it) --- */
function initMarquee() { /* content injected in renderContent() */ }

/* ---------------- skill bars fill on view ---------------- */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-fill");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level + "%";
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => io.observe(b));
}

/* ---------------- AI command palette ---------------- */
function initAI() {
  const overlay = document.getElementById("ai-overlay");
  const thread = document.getElementById("ai-thread");
  const form = document.getElementById("ai-form");
  const input = document.getElementById("ai-input");
  const chipsWrap = document.getElementById("ai-chips");
  const orb = document.getElementById("ai-orb");

  const suggestions = [
    "Who is Laila?",
    "How can Laila help us?",
    "Show me projects",
    "What's the weather in Bahrain?",
    "What time is it for you?",
    "What's 47 * 3?",
    "How do I contact you?",
    "Tell me a joke",
    "Surprise me"
  ];
  chipsWrap.innerHTML = suggestions.map((s) => `<button type="button">${s}</button>`).join("");

  let voiceOn = false;
  const voiceBtn = document.getElementById("ai-voice-toggle");
  const canSpeak = "speechSynthesis" in window;
  if (!canSpeak && voiceBtn) voiceBtn.style.display = "none";

  function speak(text) {
    if (!canSpeak || !voiceOn) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[🧮🔍🌤️🎉↑↓←→]/gu, "");
    const utter = new SpeechSynthesisUtterance(clean);
    window.speechSynthesis.speak(utter);
  }

  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      voiceOn = !voiceOn;
      voiceBtn.textContent = voiceOn ? "🔊" : "🔇";
      if (!voiceOn) window.speechSynthesis.cancel();
      else speak("Voice replies are on.");
    });
  }

  function open() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 200);
    if (!thread.dataset.greeted) {
      addMessage("bot", `Hey, I'm laila.ai. Ask me anything about ${siteData.name} — or tap a suggestion below.`);
      thread.dataset.greeted = "1";
    }
  }
  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  document.getElementById("ai-orb").addEventListener("click", open);
  document.getElementById("ask-ai-btn").addEventListener("click", open);
  document.querySelectorAll("[data-open-ai]").forEach((b) => b.addEventListener("click", open));
  document.getElementById("ai-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("open") ? close() : open();
    }
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  chipsWrap.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      handleUserMessage(e.target.textContent);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    input.value = "";
    handleUserMessage(val);
  });

  function handleUserMessage(text) {
    addMessage("user", text);
    const typingEl = addTyping();
    const delay = 450 + Math.random() * 500;
    setTimeout(() => {
      const reply = LailaAI.respond(text);
      Promise.resolve(reply).then((finalText) => {
        typingEl.remove();
        addMessage("bot", finalText);
        speak(finalText);
      });
    }, delay);
  }

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `ai-msg ${role}`;
    div.textContent = text;
    thread.appendChild(div);
    thread.scrollTop = thread.scrollHeight;
    return div;
  }

  function addTyping() {
    const div = document.createElement("div");
    div.className = "ai-msg bot typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    thread.appendChild(div);
    thread.scrollTop = thread.scrollHeight;
    return div;
  }
}

/* ---------------- secret doorway (type "vault" anywhere) ---------------- */
function initSecretDoorway() {
  const TRIGGER = "vault";
  let buffer = "";
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
    if (buffer === TRIGGER) {
      buffer = "";
      openSecretDoorway();
    }
  });
}

function openSecretDoorway() {
  document.body.classList.add("portal-open");
  setTimeout(() => { window.location.href = "vault.html"; }, 850);
}

/* ---------------- konami code + confetti ---------------- */
function initKonami() {
  const sequence = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let progress = 0;
  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === sequence[progress]) {
      progress++;
      if (progress === sequence.length) {
        progress = 0;
        launchConfetti();
        showToast("You found the secret code! 🎉");
      }
    } else {
      progress = key === sequence[0] ? 1 : 0;
    }
  });
}

function launchConfetti() {
  // pulled from the palette tokens so confetti matches whatever theme is on
  const css = getComputedStyle(document.documentElement);
  const colors = ["--accent-1", "--accent-2", "--accent-3", "--accent-4"]
    .map((t) => (css.getPropertyValue(t) || "").trim())
    .filter(Boolean);
  if (!colors.length) colors.push("#a77b36");
  const count = 90;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = 6 + Math.random() * 6;
    piece.style.width = size + "px";
    piece.style.height = size * 0.4 + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + "vw";
    const duration = 2.2 + Math.random() * 1.6;
    const rotation = Math.random() * 360;
    piece.style.transform = `rotate(${rotation}deg)`;
    piece.style.transition = `transform ${duration}s ease-in, top ${duration}s ease-in, opacity ${duration}s ease-in`;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.top = "110vh";
      piece.style.transform = `rotate(${rotation + 360}deg)`;
      piece.style.opacity = "0.2";
    });
    setTimeout(() => piece.remove(), duration * 1000 + 200);
  }
}

/* ---------------- toast ---------------- */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---------------- misc: smooth in-page nav ---------------- */
function initMisc() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
