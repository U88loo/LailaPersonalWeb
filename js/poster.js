/* =========================================================
   poster.js — the opening titles.

   A no-build, no-framework port of the "waving portfolio
   landing" poster. A storm of condensed capitals streams
   across the screen and shutters away, every letter of the
   headline rolls into place like a slot reel, the giant shared
   letter lands last and the poster thumps. Then the rules draw,
   the labels decode, the dice slide in, and a hand-inked
   character rises from the baseline and waves.

   The headline reads  L [A] ILA / H [A] JI  — two rows sharing
   one giant letter, with the character standing in the gap.

   Hover a letter and it re-rolls. Hover or click the character
   and she waves back (her eyes follow the pointer). Click the
   dice to roll them, click the paper to throw letters, click
   the signature to replay the intro. Everything is drawn here —
   no fonts, images or packages. Colours come from the palette
   tokens in css/style.css, so both themes just work.
   ========================================================= */

const Poster = (function () {
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---------------- glyphs ----------------
     Monoline condensed capitals, drawn as centre-line paths and
     stroked with square caps, so every letter fills its [0,w] × [0,h]
     box exactly at any stroke weight. Round letters are stadiums. */
  const WIDE = { A: 1.04, M: 1.3, N: 1.04, Q: 1.02, V: 1.04, W: 1.44, X: 1.02 };

  function glyphWidth(ch, w, s) {
    if (ch === "I") return s;
    if (ch === " ") return w * 0.5;
    return w * (WIDE[ch] || 1);
  }

  function glyphPath(ch, w, h, s) {
    const i = s / 2;
    const x0 = i, x1 = w - i, y0 = i, y1 = h - i;
    const xm = w / 2, ym = h / 2;
    const bw = x1 - x0, bh = y1 - y0;
    const r = bw / 2;
    const c = Math.min(bw * 0.62, bh / 4);
    const q = (...parts) =>
      parts.map((p) => (typeof p === "number" ? String(Math.round(p * 10) / 10) : p)).join(" ");
    const arc = (rad, sweep, x, y) => q("A", rad, rad, 0, 0, sweep, x, y);
    const stadium = q("M", x0, y0 + r) + arc(r, 1, x1, y0 + r) + q("L", x1, y1 - r) + arc(r, 1, x0, y1 - r) + "Z";
    const open = q("M", x1, y0 + r) + arc(r, 0, x0, y0 + r) + q("L", x0, y1 - r) + arc(r, 0, x1, y1 - r);
    const bowl = (yb) => {
      const k = Math.min(c, (yb - y0) / 2);
      return q("M", x0, y1, "L", x0, y0, "L", x1 - k, y0) + arc(k, 1, x1, y0 + k) +
        q("L", x1, yb - k) + arc(k, 1, x1 - k, yb) + q("L", x0, yb);
    };
    switch (ch) {
      case "A": {
        const ay = y0 + bh * 0.64;
        const t = (y1 - ay) / bh;
        return q("M", x0, y1, "L", xm, y0, "L", x1, y1, "M", x0 + (xm - x0) * t, ay, "L", x1 - (x1 - xm) * t, ay);
      }
      case "B": {
        const yb = y0 + bh * 0.47;
        const xt = x1 - s * 0.4;
        const ct = Math.min(c, (yb - y0) / 2, xt - x0);
        const cb = Math.min(c, (y1 - yb) / 2, bw);
        return (
          q("M", x0, yb, "L", xt - ct, yb) + arc(ct, 0, xt, yb - ct) + q("L", xt, y0 + ct) + arc(ct, 0, xt - ct, y0) +
          q("L", x0, y0, "L", x0, y1, "L", x1 - cb, y1) + arc(cb, 0, x1, y1 - cb) + q("L", x1, yb + cb) + arc(cb, 0, x1 - cb, yb) +
          q("L", x0, yb)
        );
      }
      case "C": return open;
      case "D": {
        const k = Math.min(bw * 0.75, bh / 2);
        return q("M", x0, y0, "L", x1 - k, y0) + arc(k, 1, x1, y0 + k) + q("L", x1, y1 - k) + arc(k, 1, x1 - k, y1) + q("L", x0, y1) + "Z";
      }
      case "E": return q("M", x1, y0, "L", x0, y0, "L", x0, y1, "L", x1, y1, "M", x0, ym, "L", x1 - bw * 0.12, ym);
      case "F": return q("M", x1, y0, "L", x0, y0, "L", x0, y1, "M", x0, ym - bh * 0.02, "L", x1 - bw * 0.12, ym - bh * 0.02);
      case "G": return open + q("L", x1, ym + bh * 0.04, "L", xm, ym + bh * 0.04);
      case "H": return q("M", x0, y0, "L", x0, y1, "M", x1, y0, "L", x1, y1, "M", x0, ym, "L", x1, ym);
      case "I": return q("M", xm, y0, "L", xm, y1);
      case "J": return q("M", x1, y0, "L", x1, y1 - r) + arc(r, 1, x0, y1 - r) + q("L", x0, y1 - r - bh * 0.06);
      case "K": return q("M", x0, y0, "L", x0, y1, "M", x1, y0, "L", x0, y0 + bh * 0.62, "M", x0 + bw * 0.28, y0 + bh * 0.47, "L", x1, y1);
      case "L": return q("M", x0, y0, "L", x0, y1, "L", x1, y1);
      case "M": return q("M", x0, y1, "L", x0, y0, "L", xm, y0 + bh * 0.55, "L", x1, y0, "L", x1, y1);
      case "N": return q("M", x0, y1, "L", x0, y0, "L", x1, y1, "L", x1, y0);
      case "O": return stadium;
      case "P": return bowl(y0 + bh * 0.52);
      case "Q": return stadium + q("M", xm + bw * 0.1, y1 - bh * 0.16, "L", x1 + s * 0.2, y1 + s * 0.3);
      case "R": return bowl(y0 + bh * 0.5) + q("M", x0 + bw * 0.42, y0 + bh * 0.5, "L", x1, y1);
      case "S": return q("M", x1, y0 + r) + arc(r, 0, x0, y0 + r) + q("C", x0, ym - bh * 0.02, x1, ym + bh * 0.02, x1, y1 - r) + arc(r, 1, x0, y1 - r);
      case "T": return q("M", x0, y0, "L", x1, y0, "M", xm, y0, "L", xm, y1);
      case "U": return q("M", x0, y0, "L", x0, y1 - r) + arc(r, 0, x1, y1 - r) + q("L", x1, y0);
      case "V": return q("M", x0, y0, "L", xm, y1, "L", x1, y0);
      case "W": {
        const k = bw * 0.24;
        return q("M", x0, y0, "L", x0 + k, y1, "L", xm, y0 + bh * 0.3, "L", x1 - k, y1, "L", x1, y0);
      }
      case "X": return q("M", x0, y0, "L", x1, y1, "M", x1, y0, "L", x0, y1);
      case "Y": return q("M", x0, y0, "L", xm, ym - bh * 0.04, "L", x1, y0, "M", xm, ym - bh * 0.04, "L", xm, y1);
      case "Z": return q("M", x0, y0, "L", x1, y0, "L", x0, y1, "L", x1, y1);
      default: return "";
    }
  }

  /* ---------------- layout ----------------
     Two rows sharing one giant letter. Left rows hug the giant
     letter; right rows start after the character's gap. */
  const LH = 230;       // letter height
  const LW = 115;       // base letter width
  const LS = 22;        // stroke
  const LGAP = 30;      // letter spacing
  const ROWGAP = 20;
  const GW = 220;       // giant letter base width
  const GS = 42;        // giant stroke
  const MARGIN = 100;
  const CHAR_GAP = 520; // room between the giant letter and the right rows
  const TOP = 100;

  const cleanRow = (s) => String(s || "").toUpperCase().replace(/[^A-Z ]/g, "").trim();

  function rowWidth(str) {
    let t = 0;
    [...str].forEach((ch, i) => { t += glyphWidth(ch, LW, LS) + (i ? LGAP : 0); });
    return t;
  }

  function layoutPoster(left, giant, right, compact) {
    // Tall containers get a tighter gap and a smaller character, so the
    // poster can fill a phone's width instead of floating in the middle.
    const margin = compact ? 30 : MARGIN;
    const charGap = compact ? 390 : CHAR_GAP;
    const charScale = compact ? 0.84 : 1;
    const l = [cleanRow(left[0]), cleanRow(left[1])];
    const r = [cleanRow(right[0]), cleanRow(right[1])];
    const g = cleanRow(giant).replace(/ /g, "").slice(0, 1) || "O";
    const lw = Math.max(rowWidth(l[0]), rowWidth(l[1]));
    const rw = Math.max(rowWidth(r[0]), rowWidth(r[1]));
    const cells = [];
    const place = (str, x0, row) => {
      let x = x0;
      for (const ch of str) {
        const w = glyphWidth(ch, LW, LS);
        if (ch !== " ") cells.push({ ch, x, y: TOP + row * (LH + ROWGAP), w, h: LH, s: LS, row, giant: false });
        x += w + LGAP;
      }
    };
    l.forEach((row, i) => place(row, margin + lw - rowWidth(row), i));
    const gx = margin + lw + (lw ? LGAP : 0);
    const gw = g === "I" ? GS : GW * (WIDE[g] || 1);
    const gapStart = gx + gw;
    const rx = gapStart + charGap;
    r.forEach((row, i) => place(row, rx, i));
    cells.push({ ch: g, x: gx, y: TOP, w: gw, h: LH * 2 + ROWGAP, s: GS, row: 0, giant: true });
    const width = rx + rw + margin;
    return { cells, width, height: 700, margin, charScale, gapStart, charX: gapStart + charGap * 0.36 };
  }

  const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Arabic letters for decoding Arabic labels, so the scramble stays in-script
  const AR = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
  const hash = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const num = (n) => String(Math.round(n * 10) / 10);

  // Intro timeline, ms. css/cinema.css carries the same beats.
  const SCRAMBLE_AT = 2650;
  const WAVE_AT = 4950;
  const READY_AT = 7000;
  const WAVE_MS = 1500;

  /* ---------------- state ---------------- */
  let root = null;
  let stage = null;
  let opts = null;
  let L = null;
  let compact = false;
  let playing = false;
  let ready = false;
  let waving = false;
  let rolls = [];
  let lastRoll = [];
  let dice = [2, 1];
  let timers = [];
  let rafs = [];
  let frame = 0;
  let burstId = 0;
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function later(fn, ms) {
    const id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }
  function clearAll() {
    timers.forEach(clearTimeout);
    timers = [];
    rafs.forEach(cancelAnimationFrame);
    rafs = [];
  }

  /* ---------------- markup ---------------- */
  function letterPool() {
    return L.cells.map((c) => c.ch).join("") || "ABC";
  }

  function cellMarkup(c, i, roll, intro, delay) {
    const pad = c.s;
    const pitch = c.h + c.s * 2 + 24;
    const n = roll > 0 ? 6 : c.giant ? 14 : 10;
    const base = c.giant ? GW : LW;
    const rolling = intro || roll > 0;
    let reel = "";
    if (rolling) {
      for (let k = 1; k < n; k++) {
        const ch = AZ[Math.floor(hash(i * 131 + roll * 977 + k * 53) * 26)];
        const w = Math.min(glyphWidth(ch, base, c.s), c.w * 1.25);
        reel += `<path transform="translate(${num((c.w - w) / 2)} ${num(-k * pitch)})" d="${glyphPath(ch, w, c.h, c.s)}"/>`;
      }
    }
    const style = `--dist:${(n - 1) * pitch}px;--delay:${roll > 0 ? 0 : delay}s;--dur:${roll > 0 ? "0.7s" : c.giant ? "0.85s" : "1s"}`;
    return (
      `<g class="wpl-cell${c.giant ? " wpl-giant" : ""}" data-i="${i}">` +
        `<rect x="${num(c.x)}" y="${num(c.y)}" width="${num(c.w)}" height="${num(c.h)}" fill="transparent"/>` +
        `<svg x="${num(c.x - pad)}" y="${num(c.y - pad)}" width="${num(c.w + pad * 2)}" height="${num(c.h + pad * 2)}" ` +
          `viewBox="${num(-pad)} ${num(-pad)} ${num(c.w + pad * 2)} ${num(c.h + pad * 2)}" overflow="hidden">` +
          `<g class="wpl-reel${rolling ? " is-rolling" : ""}" style="${style}" fill="none" stroke-width="${c.s}" stroke-linecap="square" stroke-miterlimit="4">` +
            `<path d="${glyphPath(c.ch, c.w, c.h, c.s)}"/>${reel}` +
          `</g>` +
        `</svg>` +
      `</g>`
    );
  }

  function ruleMarkup(key, y, mid, delay) {
    const dots = mid ? 3 : 2;
    let s = `<g class="wpl-rule" data-rule="${key}" data-y="${y}">` +
      `<path class="wpl-draw wpl-rule-line" pathLength="1" d="M 0 ${y} L 0 ${y}" stroke-width="3" style="animation-delay:${delay}s"/>`;
    for (let k = 0; k < dots; k++) {
      s += `<circle class="wpl-dot" cx="0" cy="${y}" r="6.5" style="animation-delay:${delay + k * 0.35}s"/>`;
    }
    return s + "</g>";
  }

  function pips(n) {
    const m = {
      1: [[0, 0]],
      2: [[-1, -1], [1, 1]],
      3: [[-1, -1], [0, 0], [1, 1]],
      4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
      5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
      6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
    };
    return m[n] || m[1];
  }

  function pipsMarkup(v, rolled) {
    return `<g class="wpl-pips${rolled ? " is-rolled" : ""}">` +
      `<rect x="10" y="8" width="76" height="76" fill="none"/>` +
      pips(v).map(([px, py]) => `<circle cx="${48 + px * 20}" cy="${46 + py * 20}" r="7.5"/>`).join("") +
      `</g>`;
  }

  function cornerMarkup(k) {
    const lines = [108, 124, 140]
      .map((v) => `<path class="wpl-corner-line" d="M 0 ${v} L ${v} ${v} L ${v} 0" fill="none" stroke-width="2"/>`)
      .join("");
    return `<button type="button" class="wpl-corner ${k ? "wpl-corner-r" : "wpl-corner-l"}" data-die="${k}" aria-label="${escAttr(I18N.t("poster.dice", { n: dice[k] }))}">` +
      `<svg viewBox="0 0 170 170" aria-hidden="true">${lines}<rect class="wpl-die" x="0" y="0" width="92" height="92"/>${pipsMarkup(dice[k], false)}</svg>` +
      `</button>`;
  }

  function signatureMarkup(lines) {
    const H = 26, S = 3.6, G = 4;
    const rows = lines.map((line) => {
      const chars = [...line.replace(/[^A-Z ]/g, "")];
      let x = 0;
      const items = chars.map((ch) => {
        const w = glyphWidth(ch, 15, S);
        const it = { ch, x, w };
        x += w + G;
        return it;
      });
      return { items, width: Math.max(0, x - G) };
    });
    const widest = Math.max(1, ...rows.map((r) => r.width));
    const k = Math.min(1, 80 / widest);
    const ys = rows.length > 1 ? [30, 66] : [48];
    let n = 0;
    let s = `<svg viewBox="-10 -18 140 140" aria-hidden="true">` +
      `<path class="wpl-draw wpl-ink-acc" pathLength="1" d="M 60 8 C 96 6 116 30 114 62 C 112 96 88 114 58 112 C 26 110 6 88 8 58 C 10 28 30 10 66 12" fill="none" stroke-width="4" stroke-linecap="round" style="animation-delay:3s"/>`;
    rows.forEach((row, ri) => {
      s += `<g transform="translate(${num(60 - (row.width * k) / 2)} ${num(ys[ri] - (H * k) / 2)}) scale(${num(k * 100) / 100})">`;
      row.items.forEach((it) => {
        const j = n++;
        const rot = (hash(j * 7 + 3) - 0.5) * 16;
        const dy = (hash(j * 11 + 5) - 0.5) * 5;
        s += `<path class="wpl-draw wpl-ink-acc" pathLength="1" transform="translate(${num(it.x)} ${num(dy)}) rotate(${num(rot)} ${num(it.w / 2)} ${H / 2})" ` +
          `d="${glyphPath(it.ch, it.w, H, S)}" fill="none" stroke-width="${S}" stroke-linecap="round" stroke-linejoin="round" style="animation-delay:${num(3.2 + j * 0.07)}s"/>`;
      });
      s += `</g>`;
    });
    ["M 110 2 L 118 -8", "M 118 16 L 130 11", "M 100 -2 L 101 -14"].forEach((d, i) => {
      s += `<path class="wpl-draw wpl-ink-acc" pathLength="1" d="${d}" stroke-width="4" stroke-linecap="round" style="animation-delay:${num(3.8 + i * 0.08)}s"/>`;
    });
    return s + `</svg>`;
  }

  function stormMarkup() {
    const letters = letterPool();
    const pool = letters + letters + AZ;
    let s = `<div class="wpl-storm" aria-hidden="true">`;
    for (let row = 0; row < 7; row++) {
      let x = 0;
      const half = [];
      for (let k = 0; k < 34; k++) {
        const ch = pool[Math.floor(hash(row * 97 + k * 13) * pool.length)];
        const w = glyphWidth(ch, 62, 12);
        half.push({ ch, x, w });
        x += w + 26;
      }
      const span = x;
      const dir = row % 2 ? "r" : "l";
      const tone = row % 3 === 2 ? "wpl-s-ink" : "wpl-s-acc";
      const hollow = row % 3 !== 0;
      let glyphs = "";
      [0, span].forEach((off) => {
        half.forEach((g) => {
          const d = glyphPath(g.ch, g.w, 140, 12);
          glyphs += `<g transform="translate(${num(off + g.x)} 0)"><path class="${tone}" d="${d}" stroke-width="12"/>` +
            (hollow ? `<path class="wpl-s-paper" d="${d}" stroke-width="5"/>` : "") + `</g>`;
        });
      });
      s += `<div class="wpl-srow" data-dir="${dir}" style="animation-delay:${num(row * 0.04 * 100) / 100}s, ${num((1.25 + row * 0.06) * 100) / 100}s">` +
        `<svg class="wpl-strip" data-dir="${dir}" viewBox="0 -6 ${num(span * 2)} 152" style="animation-duration:${4.6 + (row % 3) * 1.5}s" fill="none" stroke-linecap="square" stroke-miterlimit="4">${glyphs}</svg>` +
        `</div>`;
    }
    return s + `</div>`;
  }

  /* ---------------- the character ----------------
     Local frame 0 0 460 600; the bottom edge is the baseline she rises
     from. Rig pivots (mirrored in the CSS transform-origins): tilt and
     breathe at the feet (205, 600), shoulder (288, 248), elbow (348, 346),
     wrist (392, 216), neck (203, 200). A hijab and a long abaya-style
     robe, sleeves to the wrist. */
  function characterMarkup() {
    const K = "wpl-k";   // ink fill
    const P = "wpl-p";   // paper fill
    const torso =
      "M 120 240 C 134 222 166 213 202 213 C 240 213 272 221 290 238 C 300 285 298 345 292 392 C 288 440 292 478 300 520 L 110 520 C 116 478 118 440 114 392 C 108 345 108 285 120 240 Z";
    // a sleeve: a paper edge first, then the ink cloth, so it reads on top
    // of the ink robe behind it
    const sleeve = (d, w) =>
      `<path class="wpl-sp" d="${d}" fill="none" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path class="wpl-sk" d="${d}" fill="none" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const fingers = ["M 388 170 L 380 116", "M 399 166 L 399 106", "M 410 168 L 418 112", "M 419 178 L 434 136", "M 382 192 L 352 170"];
    const hijab =
      "M 209 16 C 252 16 282 46 284 96 C 286 140 278 172 268 196 C 284 210 298 226 304 252 " +
      "C 252 274 158 274 106 252 C 112 226 128 210 146 198 C 136 172 130 140 132 98 C 134 48 166 16 209 16 Z";
    const face =
      "M 160 92 C 158 142 172 180 206 184 C 240 182 258 150 258 100 C 258 64 236 46 208 46 C 180 46 162 64 160 92 Z";
    const brow =
      "M 150 104 C 150 60 178 38 209 38 C 242 38 268 60 268 104 C 252 80 234 68 209 68 C 184 68 164 80 150 104 Z";

    return (
      `<g class="wpl-rise"><g class="wpl-tilt"><g class="wpl-breathe">` +
        // the robe, shoulders to hem, with a front seam and a trim of accent
        `<path class="${K}" d="M 116 505 L 298 505 L 310 640 L 104 640 Z"/>` +
        `<path class="${K}" d="${torso}"/>` +
        `<path class="wpl-sp" d="M 204 262 L 207 640" stroke-width="3" fill="none"/>` +
        `<path class="wpl-sa" d="M 214 280 L 216 640" stroke-width="3" fill="none" stroke-dasharray="2 12" stroke-linecap="round"/>` +

        // her right arm, folded across the waist
        sleeve("M 118 384 C 140 410 168 428 190 436", 34) +
        `<circle class="wpl-k" cx="204" cy="440" r="24"/>` +
        `<circle class="wpl-p" cx="204" cy="440" r="20"/>` +
        `<path class="wpl-sk" d="M 206 426 C 214 430 218 438 216 448 M 196 446 C 202 452 210 454 216 450" fill="none" stroke-width="3" stroke-linecap="round"/>` +
        `<path class="wpl-sk" d="M 124 250 C 110 300 106 345 112 382" fill="none" stroke-width="50" stroke-linecap="round"/>` +
        `<path class="wpl-sp" d="M 144 282 C 136 320 134 350 138 376" fill="none" stroke-width="2.5" stroke-linecap="round"/>` +

        // the waving arm
        `<g class="wpl-uarm">` +
          `<g class="wpl-farm">` +
            sleeve("M 350 350 L 386 232", 34) +
            `<path class="wpl-sa" d="M 381 250 L 388 228" stroke-width="40"/>` +
            `<g class="wpl-hand">` +
              `<ellipse class="${K}" cx="400" cy="180" rx="31" ry="35" transform="rotate(12 400 180)"/>` +
              fingers.map((d) => `<path class="wpl-sk" d="${d}" stroke-width="24" stroke-linecap="round"/>`).join("") +
              `<ellipse class="${P}" cx="400" cy="180" rx="27" ry="31" transform="rotate(12 400 180)"/>` +
              fingers.map((d) => `<path class="wpl-sp" d="${d}" stroke-width="16" stroke-linecap="round"/>`).join("") +
              `<path class="wpl-sk" d="M 392 196 C 400 202 410 200 416 192 M 394 150 L 394 164 M 405 148 L 405 162" fill="none" stroke-width="2.5" stroke-linecap="round"/>` +
            `</g>` +
          `</g>` +
          `<path class="wpl-sk" d="M 288 250 C 312 280 330 310 344 340" fill="none" stroke-width="50" stroke-linecap="round"/>` +
          `<path class="wpl-sp" d="M 282 294 C 296 316 306 334 314 350" fill="none" stroke-width="2.5" stroke-linecap="round"/>` +
        `</g>` +

        `<g class="wpl-head">` +
          `<g class="wpl-look">` +
            // hijab, then the face inside it, then the band across the brow
            `<path class="${K}" d="${hijab}"/>` +
            `<path class="wpl-sp" d="${hijab}" fill="none" stroke-width="3"/>` +
            `<path class="${P}" d="${face}"/>` +
            `<path class="wpl-sk" d="${face}" fill="none" stroke-width="4"/>` +
            `<path class="${K}" d="${brow}"/>` +
            `<path class="wpl-sa" d="M 156 96 C 170 78 188 70 209 70 C 232 70 250 78 262 96" fill="none" stroke-width="4" stroke-linecap="round"/>` +
            // cloth folds
            `<path class="wpl-sp" d="M 178 28 C 198 20 226 20 248 30 M 146 150 C 150 178 160 194 176 204 M 160 214 C 190 230 232 230 262 212" fill="none" stroke-width="2.5" stroke-linecap="round"/>` +
            `<g class="wpl-brows">` +
              `<path class="wpl-sk" d="M 178 94 C 185 90 194 90 201 93 M 219 93 C 226 90 236 90 243 94" fill="none" stroke-width="4" stroke-linecap="round"/>` +
            `</g>` +
            `<g class="wpl-eyes"><g class="wpl-pupils">` +
              `<circle class="${K}" cx="190" cy="112" r="5.2"/>` +
              `<circle class="${K}" cx="231" cy="112" r="5.2"/>` +
            `</g></g>` +
            `<path class="wpl-sk wpl-lashes" d="M 181 107 L 176 103 M 240 107 L 245 103" fill="none" stroke-width="2.5" stroke-linecap="round"/>` +
            `<path class="wpl-sk wpl-happy" d="M 182 115 Q 189 106 196 115 M 224 115 Q 231 106 238 115" fill="none" stroke-width="3.5" stroke-linecap="round"/>` +
            `<ellipse class="wpl-blush" cx="180" cy="140" rx="10" ry="6"/>` +
            `<ellipse class="wpl-blush" cx="242" cy="140" rx="10" ry="6"/>` +
            `<path class="wpl-sk" d="M 213 120 C 211 130 208 138 214 141 C 218 143 222 141 224 139" fill="none" stroke-width="3.2" stroke-linecap="round"/>` +
            `<path class="wpl-sk wpl-smile" d="M 196 156 C 206 164 222 164 234 155" fill="none" stroke-width="3.5" stroke-linecap="round"/>` +
            `<path class="wpl-k wpl-grin" d="M 195 154 C 206 172 226 170 236 152 Z" stroke-width="3" stroke-linejoin="round"/>` +
          `</g>` +
        `</g>` +
      `</g></g></g>`
    );
  }

  function bubbleMarkup() {
    const greeting = I18N.t("poster.greeting");
    const k = L.charScale;
    const charLeft = L.charX - 205 * k;
    const bubbleW = Math.max(160, greeting.length * 19 + 48);
    const x = charLeft + 372 * k;
    return `<g class="wpl-bubble" aria-hidden="true">` +
      `<path class="wpl-bubble-shape" d="M ${num(x)} 20 h ${num(bubbleW)} v 56 h ${num(-(bubbleW - 34))} l -30 22 l 6 -22 h -10 Z" stroke-width="4" stroke-linejoin="round"/>` +
      `<text class="wpl-label wpl-bubble-text" x="${num(x + bubbleW / 2)}" y="58" text-anchor="middle">${esc(greeting)}</text>` +
      `</g>`;
  }

  function signatureLines() {
    const sig = I18N.t("poster.signature");
    return sig.toUpperCase().split("/").slice(0, 2);
  }

  function stageMarkup(intro) {
    const k = L.charScale;
    const charLeft = L.charX - 205 * k;
    const cells = L.cells.map((c, i) => {
      const delay = c.giant ? 1.75 : 1 + (c.x / L.width) * 0.55 + c.row * 0.1;
      return cellMarkup(c, i, rolls[i] || 0, intro, Math.round(delay * 1000) / 1000);
    }).join("");

    return (
      `<svg class="wpl-poster" viewBox="0 0 ${num(L.width)} ${L.height}" preserveAspectRatio="xMidYMid meet">` +
        `<g class="wpl-par-lines" aria-hidden="true">` +
          `<text class="wpl-label" data-label="name" x="${L.margin}" y="73"></text>` +
          `<text class="wpl-label" data-label="year" x="${num(L.width - L.margin)}" y="73" text-anchor="end"></text>` +
          ruleMarkup("top", 62, true, 2.55) +
          `<text class="wpl-label" data-label="roleL" x="${L.margin}" y="663"></text>` +
          `<text class="wpl-label" data-label="roleR" x="${num(L.width - L.margin)}" y="663" text-anchor="end"></text>` +
          ruleMarkup("bottom", 652, false, 2.75) +
        `</g>` +
        `<g class="wpl-par-letters" aria-hidden="true">${cells}</g>` +
        `<g class="wpl-par-char">` +
          `<svg x="${num(charLeft)}" y="${num(605 - 600 * k)}" width="${num(460 * k)}" height="${num(600 * k)}" viewBox="0 0 460 600" overflow="hidden">` +
            `<g class="wpl-char" role="button" tabindex="0" aria-label="${escAttr(I18N.t("poster.wave"))}">${characterMarkup()}</g>` +
          `</svg>` +
        `</g>` +
        `<g class="wpl-bubble-slot"></g>` +
      `</svg>` +
      (intro ? stormMarkup() : "") +
      cornerMarkup(0) + cornerMarkup(1) +
      `<button type="button" class="wpl-sign" aria-label="${escAttr(I18N.t(intro || opts.intro ? "poster.replay" : "poster.waveAgain"))}">${signatureMarkup(signatureLines())}</button>`
    );
  }

  /* ---------------- labels ---------------- */
  function labelTexts() {
    return {
      name: I18N.t("poster.name"),
      year: I18N.t("poster.year"),
      roleL: I18N.t("poster.roleL"),
      roleR: I18N.t("poster.roleR")
    };
  }

  // Measure the finished labels, then lay the rules into the space between
  // them. Measuring beats estimating: the Arabic face is a different width.
  function layoutRules() {
    const svg = stage.querySelector(".wpl-poster");
    if (!svg) return;
    const texts = labelTexts();
    const width = {};
    svg.querySelectorAll("[data-label]").forEach((el) => {
      const key = el.getAttribute("data-label");
      const current = el.textContent;
      el.textContent = texts[key];
      try { width[key] = el.getComputedTextLength(); } catch (e) { width[key] = texts[key].length * 21.6; }
      el.textContent = current;
    });
    const place = (key, a, b) => {
      const g = svg.querySelector(`[data-rule="${key}"]`);
      if (!g) return;
      const y = Number(g.getAttribute("data-y"));
      const ok = b - a >= 40;
      g.style.display = ok ? "" : "none";
      if (!ok) return;
      g.querySelector(".wpl-rule-line").setAttribute("d", `M ${num(a)} ${y} L ${num(b)} ${y}`);
      const dots = g.querySelectorAll(".wpl-dot");
      const xs = dots.length === 3 ? [a, (a + b) / 2, b] : [a, b];
      dots.forEach((d, i) => d.setAttribute("cx", num(xs[i])));
    };
    place("top", L.margin + width.name + 26, L.width - L.margin - width.year - 26);
    place("bottom", L.margin + width.roleL + 26, L.width - L.margin - width.roleR - 26);
  }

  function setLabels(final) {
    const texts = labelTexts();
    stage.querySelectorAll("[data-label]").forEach((el) => {
      el.textContent = final ? texts[el.getAttribute("data-label")] : "";
    });
  }

  function scramble(el, text, startAt) {
    const alphabet = /[؀-ۿ]/.test(text) ? AR : AZ;
    const t0 = performance.now();
    let last = 0;
    const tick = (now) => {
      const t = now - t0 - startAt;
      if (t >= (text.length - 1) * 30 + 320) {
        el.textContent = text;
        return;
      }
      if (t >= 0 && now - last > 45) {
        last = now;
        let s = "";
        for (let i = 0; i < text.length && t >= i * 30; i++) {
          const ch = text[i];
          s += ch === " " || t > i * 30 + 320 ? ch : alphabet[(Math.random() * alphabet.length) | 0];
        }
        el.textContent = s;
      }
      rafs.push(requestAnimationFrame(tick));
    };
    rafs.push(requestAnimationFrame(tick));
  }

  /* ---------------- build ---------------- */
  function build(withIntro) {
    clearAll();
    // their removal timers were just cleared, so take them with us
    root.querySelectorAll(".wpl-burst").forEach((b) => b.remove());
    waving = false;
    playing = !!withIntro && opts.intro && !reduced();
    ready = !playing;
    root.setAttribute("data-intro", !opts.intro ? "off" : playing ? "on" : "done");
    L = layoutPoster(opts.lettersLeft, opts.giantLetter, opts.lettersRight, compact);
    stage.innerHTML = stageMarkup(playing);
    layoutRules();

    if (playing) {
      setLabels(false);
      const t = labelTexts();
      const at = { name: SCRAMBLE_AT, year: SCRAMBLE_AT + 250, roleL: SCRAMBLE_AT + 150, roleR: SCRAMBLE_AT + 400 };
      stage.querySelectorAll("[data-label]").forEach((el) => {
        const key = el.getAttribute("data-label");
        scramble(el, t[key], at[key]);
      });
      later(wave, WAVE_AT);
      later(() => {
        ready = true;
        root.setAttribute("data-intro", "done");
        const storm = stage.querySelector(".wpl-storm");
        if (storm) storm.remove();
      }, READY_AT);
    } else {
      setLabels(true);
    }
  }

  /* ---------------- interactions ---------------- */
  function wave() {
    if (waving || !stage) return;
    waving = true;
    const ch = stage.querySelector(".wpl-char");
    const slot = stage.querySelector(".wpl-bubble-slot");
    if (ch) ch.classList.add("is-waving");
    if (slot) slot.innerHTML = bubbleMarkup();
    later(() => {
      waving = false;
      if (ch) ch.classList.remove("is-waving");
      if (slot) slot.innerHTML = "";
    }, WAVE_MS);
  }

  function reroll(i) {
    if (!ready || reduced()) return;
    const now = performance.now();
    if (now - (lastRoll[i] || 0) < 750) return;
    lastRoll[i] = now;
    rolls[i] = (rolls[i] || 0) + 1;
    const old = stage.querySelector(`.wpl-cell[data-i="${i}"]`);
    if (!old) return;
    const holder = document.createElementNS(SVGNS, "svg");
    holder.innerHTML = cellMarkup(L.cells[i], i, rolls[i], false, 0);
    old.replaceWith(holder.firstElementChild);
  }

  function rollDie(k) {
    let v = dice[k];
    while (v === dice[k]) v = 1 + ((Math.random() * 6) | 0);
    dice[k] = v;
    const btn = stage.querySelector(`[data-die="${k}"]`);
    if (!btn) return;
    btn.setAttribute("aria-label", I18N.t("poster.dice", { n: v }));
    const old = btn.querySelector(".wpl-pips");
    const holder = document.createElementNS(SVGNS, "svg");
    holder.innerHTML = pipsMarkup(v, true);
    old.replaceWith(holder.firstElementChild);
  }

  function replay() {
    rolls = [];
    lastRoll = [];
    root.querySelectorAll(".wpl-burst").forEach((b) => b.remove());
    if (opts.intro && !reduced()) build(true);
    else wave();
  }

  function burst(e) {
    const r = root.getBoundingClientRect();
    const letters = letterPool();
    const el = document.createElement("div");
    el.className = "wpl-burst";
    el.setAttribute("aria-hidden", "true");
    el.style.left = e.clientX - r.left + "px";
    el.style.top = e.clientY - r.top + "px";
    let html = "";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
      const d = 50 + Math.random() * 90;
      const ch = letters[(Math.random() * letters.length) | 0];
      const dx = Math.cos(a) * d;
      const dy = Math.sin(a) * d - 24;
      const rot = (Math.random() - 0.5) * 260;
      html += `<svg class="wpl-bit" viewBox="-3 -3 26 38" style="--dx:${num(dx)}px;--dy:${num(dy)}px;--rot:${num(rot)}deg">` +
        `<path class="${i % 3 ? "wpl-s-acc" : "wpl-s-ink"}" d="${glyphPath(ch, glyphWidth(ch, 14, 3.4), 32, 3.4)}" fill="none" stroke-width="3.4" stroke-linecap="square"/></svg>`;
    }
    el.innerHTML = html;
    root.appendChild(el);
    const id = ++burstId;
    el.dataset.id = id;
    // keep at most six bursts on screen
    const all = root.querySelectorAll(".wpl-burst");
    if (all.length > 6) all[0].remove();
    later(() => el.remove(), 1100);
  }

  function onMove(e) {
    if (reduced() || e.pointerType === "touch") return;
    const px = e.clientX, py = e.clientY;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = root.getBoundingClientRect();
      const k = (v, d) => Math.max(-1, Math.min(1, v / d));
      root.style.setProperty("--wpl-mx", (((px - r.left) / r.width) * 2 - 1).toFixed(3));
      root.style.setProperty("--wpl-my", (((py - r.top) / r.height) * 2 - 1).toFixed(3));
      const head = stage.querySelector(".wpl-head");
      if (!head) return;
      const h = head.getBoundingClientRect();
      const dx = px - (h.left + h.width / 2);
      const dy = py - (h.top + h.height / 2);
      root.style.setProperty("--wpl-ex", (k(dx, 260) * 4.5).toFixed(2));
      root.style.setProperty("--wpl-ey", (k(dy, 260) * 3.5).toFixed(2));
      root.style.setProperty("--wpl-hr", (k(dx, 700) * 7).toFixed(2));
    });
  }

  function onLeave() {
    ["--wpl-mx", "--wpl-my", "--wpl-ex", "--wpl-ey", "--wpl-hr"].forEach((v) => root.style.setProperty(v, "0"));
  }

  function bind() {
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    root.addEventListener("pointerdown", (e) => {
      if (reduced()) return;
      if (e.target.closest("button, .wpl-char, .wpl-cell")) return;
      burst(e);
    });

    // pointerover + a relatedTarget check = pointerenter, delegated
    root.addEventListener("pointerover", (e) => {
      const cell = e.target.closest(".wpl-cell");
      if (cell && !(e.relatedTarget && cell.contains(e.relatedTarget))) {
        reroll(Number(cell.getAttribute("data-i")));
      }
      const ch = e.target.closest(".wpl-char");
      if (ch && !(e.relatedTarget && ch.contains(e.relatedTarget)) && ready && e.pointerType !== "touch") {
        wave();
      }
    });

    root.addEventListener("click", (e) => {
      const die = e.target.closest("[data-die]");
      if (die) return rollDie(Number(die.getAttribute("data-die")));
      if (e.target.closest(".wpl-sign")) return replay();
      if (e.target.closest(".wpl-char")) return wave();
    });

    root.addEventListener("keydown", (e) => {
      if (!e.target.closest(".wpl-char")) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        wave();
      }
    });

    // Tall (portrait) containers get the compact layout.
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        if (!width || !height) return;
        const next = width / height < 0.9;
        if (next !== compact) {
          compact = next;
          build(false);
        }
      }).observe(root);
    }

    // She waves again whenever you scroll back up to her.
    if (typeof IntersectionObserver !== "undefined") {
      let left = false;
      new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio < 0.25) left = true;
        else if (entry.intersectionRatio > 0.6 && left && ready) {
          left = false;
          wave();
        }
      }, { threshold: [0, 0.25, 0.6, 1] }).observe(root);
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  const escAttr = esc;

  /* ---------------- public ---------------- */
  function mount(el, options) {
    root = el;
    opts = Object.assign({
      lettersLeft: ["L", "H"],
      giantLetter: "A",
      lettersRight: ["ILA", "JI"],
      intro: true
    }, options || {});
    root.classList.add("wpl-root");
    root.setAttribute("dir", "ltr"); // the poster is drawn geometry, not text
    root.innerHTML = `<div class="wpl-stage"></div>`;
    stage = root.querySelector(".wpl-stage");
    compact = root.clientHeight ? root.clientWidth / root.clientHeight < 0.9 : false;
    bind();
    // only play the intro if the poster is actually on screen — a reload
    // halfway down the page shouldn't run it out of sight
    build(window.scrollY < window.innerHeight * 0.5);
    // the label face may arrive after first paint; re-measure once it does
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutRules);
  }

  // language switch: rebuild in place, without replaying the intro
  function refresh() {
    if (root) build(false);
  }

  return { mount, refresh, replay, wave };
})();
