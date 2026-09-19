/* =========================================================
   Generative constellation background.
   Lightweight canvas particle field that drifts and links
   nearby nodes; gently reacts to the mouse. Pauses on hidden
   tabs and respects prefers-reduced-motion.
   ========================================================= */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, particles, dpr;
  const mouse = { x: null, y: null };
  const COLORS = ["#ec4899", "#fb7185", "#fbbf24", "#fda4af"];

  function isDark() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const count = Math.round((window.innerWidth * window.innerHeight) / 22000);
    particles = Array.from({ length: Math.min(count, 90) }, makeParticle);
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (Math.random() * 1.6 + 0.8) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    const linkDist = 130 * dpr;
    const lineAlpha = isDark() ? 0.12 : 0.08;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x * dpr;
        const dy = p.y - mouse.y * dpr;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 * dpr) {
          p.x += (dx / dist) * 0.6;
          p.y += (dy / dist) * 0.6;
        }
      }

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < linkDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = isDark() ? "#f9a8d4" : "#ec4899";
          ctx.globalAlpha = lineAlpha * (1 - d / linkDist);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  let raf;
  function loop() {
    step();
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!reduceMotion) {
      raf = requestAnimationFrame(loop);
    }
  });

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  resize();
  if (reduceMotion) {
    step();
  } else {
    raf = requestAnimationFrame(loop);
  }
})();
