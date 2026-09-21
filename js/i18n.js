/* =========================================================
   i18n.js — English ⇄ Arabic.

   Two halves, on purpose:

     · `ui`        the chrome — nav, buttons, headings, labels,
                   anything written into index.html or built by
                   app.js. Read with I18N.t("key").

     · siteDataAr  the content (js/data.ar.js), written as a
                   *sparse overlay* merged onto siteData. Only
                   translatable strings live there, so URLs,
                   emojis, skill levels, video paths and tech
                   names are never duplicated and can never
                   drift out of sync with the English original.

   Nothing reloads the page: every module reads through
   I18N.t() / I18N.data() and re-renders on I18N.onChange().
   ========================================================= */

const I18N = (function () {
  const STORE_KEY = "laila-lang";
  const SUPPORTED = ["en", "ar"];
  const RTL = ["ar"];

  let current = "en";
  let merged = null;          // cached en+ar merge, dropped on switch
  const listeners = [];

  /* ---------------- the chrome ---------------- */
  const ui = {
    en: {
      "doc.title": "{name} · Software Engineer",
      "doc.description":
        "Laila Haji's personal corner of the internet. Software engineering graduate focused on design, testing, and AI.",

      "nav.about": "about",
      "nav.work": "work",
      "nav.skills": "skills",
      "nav.certs": "certs",
      "nav.contact": "contact",
      "nav.ask": "ask laila.ai",
      "nav.askTitle": "Ask the assistant (Ctrl/Cmd + K)",
      "nav.theme": "Toggle theme",

      "lang.title": "العربية · read this page in Arabic",
      "lang.label": "ع",
      "lang.toast": "Switched to English.",

      "hero.eyebrow": "<hello world/>",
      "hero.greet": "Hi, I'm",
      "hero.iam": "I'm a",
      "hero.sub":
        "Software engineering graduate, fresh out of the University of Bahrain as of September 2026. I care about design, testing, and AI, and about building things that actually solve problems. This site is one of them; the assistant in the corner actually answers questions about me.",
      "hero.cta1": "see the work",
      "hero.cta2": "ask the AI about me →",
      "hero.tag1": "#solvesRealProblems",
      "hero.tag2": "#testEverything",
      "hero.tag3": "#AIcurious",
      "hero.scroll": "scroll",

      "kicker.about": "01 · about",
      "kicker.skills": "02 · skills",
      "kicker.work": "03 · selected work",
      "kicker.certs": "04 · certifications",
      "kicker.contact": "05 · contact",

      "about.lead":
        "I like software that feels a little <em>alive</em>: interfaces with personality, details you notice on the second visit, and code that's honest about what it's doing.",
      "about.resume": "download résumé ↓",

      "title.skills": "Tools I reach for",
      "title.work": "Things I've shipped",
      "title.certs": "Proof I did the reading",
      "title.contact": "Let's build something.",

      "contact.sub":
        "Fastest way in is the assistant: press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> and ask it for my email. Or just use the old-fashioned links below.",

      "footer.text": "Built with vibecoding energy in {year}. No frameworks were harmed.",
      "footer.replay": "replay boot sequence ↻",

      "card.caseStudy": "view case study →",
      "card.project": "view project →",
      "cert.verify": "verify ↗",

      "pm.close": "Close project details",
      "pm.whatItIs": "What it is",
      "pm.numbers": "By the numbers",
      "pm.whatItDoes": "What it does",
      "pm.howItWorks": "How it works",
      "pm.builtWith": "Built with",
      "pm.team": "Team",

      "boot.title": "laila.OS · boot log",
      "boot.hint": "press any key to skip",
      "boot.l1": "> booting laila.OS v2.0...",
      "boot.l2": "> loading creativity modules...",
      "boot.l3": "> compiling ideas...",
      "boot.l4": "> calibrating vibe...",
      "boot.l5": "> waking up laila.ai assistant...",
      "boot.l6": "> welcome, {name}.dev is ready.",

      "ai.orb": "Open AI assistant",
      "ai.dialog": "Laila AI assistant",
      "ai.title": "laila.ai",
      "ai.online": "● online",
      "ai.sub": 'ask me anything about Laila. Try "who is laila" or "surprise me"',
      "ai.placeholder": "Type a question and hit enter…",
      "ai.send": "send",
      "ai.close": "Close",
      "ai.voice": "Toggle spoken replies",
      "ai.greeting":
        "Hey, I'm laila.ai. Ask me anything about {name}, or tap a suggestion below.",
      "ai.voiceOn": "Voice replies are on.",

      "chip.who": "Who is Laila?",
      "chip.help": "How can Laila help us?",
      "chip.projects": "Show me projects",
      "chip.weather": "What's the weather in Bahrain?",
      "chip.time": "What time is it for you?",
      "chip.math": "What's 47 * 3?",
      "chip.contact": "How do I contact you?",
      "chip.joke": "Tell me a joke",
      "chip.surprise": "Surprise me",

      "toast.konami": "You found the secret code! 🎉"
    },

    ar: {
      "doc.title": "{name} · مهندسة برمجيات",
      "doc.description":
        "الركن الشخصي لليلى حاجي على الإنترنت. خريجة هندسة برمجيات مهتمة بالتصميم والاختبار والذكاء الاصطناعي.",

      "nav.about": "نبذة",
      "nav.work": "أعمالي",
      "nav.skills": "المهارات",
      "nav.certs": "الشهادات",
      "nav.contact": "تواصل",
      "nav.ask": "اسأل laila.ai",
      "nav.askTitle": "اسأل المساعد (Ctrl/Cmd + K)",
      "nav.theme": "تبديل السمة",

      "lang.title": "English · اقرأ الصفحة بالإنجليزية",
      "lang.label": "EN",
      "lang.toast": "تم التبديل إلى العربية.",

      "hero.eyebrow": "// مرحباً بالعالم",
      "hero.greet": "أهلاً، أنا",
      "hero.iam": "أنا",
      "hero.sub":
        "خريجة هندسة برمجيات من جامعة البحرين في سبتمبر 2026. يهمّني التصميم والاختبار والذكاء الاصطناعي، ويهمّني أن أبني أشياء تحلّ مشكلات حقيقية. وهذا الموقع واحد منها؛ فالمساعد في الزاوية يجيب فعلاً عن الأسئلة عنّي.",
      "hero.cta1": "شاهد الأعمال",
      "hero.cta2": "اسأل الذكاء الاصطناعي عنّي ←",
      "hero.tag1": "#حلول_حقيقية",
      "hero.tag2": "#اختبر_كل_شيء",
      "hero.tag3": "#فضول_تقني",
      "hero.scroll": "مرّر للأسفل",

      "kicker.about": "01 · نبذة",
      "kicker.skills": "02 · المهارات",
      "kicker.work": "03 · مختارات من الأعمال",
      "kicker.certs": "04 · الشهادات",
      "kicker.contact": "05 · تواصل",

      "about.lead":
        "أحبّ البرمجيات التي تبدو <em>حيّة</em> قليلاً: واجهات لها شخصية، وتفاصيل تلاحظها في الزيارة الثانية، وكود صادق بشأن ما يفعله.",
      "about.resume": "تحميل السيرة الذاتية ↓",

      "title.skills": "الأدوات التي أعمل بها",
      "title.work": "أشياء أطلقتها",
      "title.certs": "إثبات أنني قرأت الدرس",
      "title.contact": "لنبنِ شيئاً معاً.",

      "contact.sub":
        "أسرع طريق هو المساعد: اضغط <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> واسأله عن بريدي. أو استخدم الروابط التقليدية أدناه.",

      "footer.text": "بُني بطاقة الشغف في {year}. لم يُؤذَ أي إطار عمل.",
      "footer.replay": "إعادة تشغيل شاشة الإقلاع ↻",

      "card.caseStudy": "عرض دراسة الحالة ←",
      "card.project": "عرض المشروع ←",
      "cert.verify": "تحقّق ↗",

      "pm.close": "إغلاق تفاصيل المشروع",
      "pm.whatItIs": "ما هو",
      "pm.numbers": "بالأرقام",
      "pm.whatItDoes": "ماذا يفعل",
      "pm.howItWorks": "كيف يعمل",
      "pm.builtWith": "بُني باستخدام",
      "pm.team": "الفريق",

      "boot.title": "laila.OS · سجل الإقلاع",
      "boot.hint": "اضغط أي مفتاح للتخطي",
      "boot.l1": "> جارٍ إقلاع laila.OS v2.0...",
      "boot.l2": "> تحميل وحدات الإبداع...",
      "boot.l3": "> تجميع الأفكار...",
      "boot.l4": "> معايرة الأجواء...",
      "boot.l5": "> إيقاظ مساعد laila.ai...",
      "boot.l6": "> أهلاً بك، {name}.dev جاهز.",

      "ai.orb": "فتح المساعد الذكي",
      "ai.dialog": "مساعد ليلى الذكي",
      "ai.title": "laila.ai",
      "ai.online": "● متصل",
      "ai.sub": 'اسألني أي شيء عن ليلى. جرّب "من هي ليلى" أو "فاجئني"',
      "ai.placeholder": "اكتب سؤالك ثم اضغط Enter…",
      "ai.send": "إرسال",
      "ai.close": "إغلاق",
      "ai.voice": "تشغيل/إيقاف الردود المنطوقة",
      "ai.greeting":
        "أهلاً، أنا laila.ai. اسألني أي شيء عن {name}، أو اختر أحد الاقتراحات أدناه.",
      "ai.voiceOn": "الردود المنطوقة مفعّلة.",

      "chip.who": "من هي ليلى؟",
      "chip.help": "كيف يمكن لليلى أن تساعدنا؟",
      "chip.projects": "أرني المشاريع",
      "chip.weather": "كيف الطقس في البحرين؟",
      "chip.time": "كم الساعة عندك؟",
      "chip.math": "كم يساوي 47 × 3؟",
      "chip.contact": "كيف أتواصل معك؟",
      "chip.joke": "احكِ لي نكتة",
      "chip.surprise": "فاجئني",

      "toast.konami": "لقد وجدت الشيفرة السرية! 🎉"
    }
  };

  /* ---------------- lookup ---------------- */
  function t(key, vars) {
    const table = ui[current] || ui.en;
    let s = table[key];
    if (s === undefined) s = ui.en[key];
    if (s === undefined) return key;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    }
    return s;
  }

  /* ---------------- content overlay ----------------
     Merges siteDataAr onto siteData. Arrays merge by index, so
     an overlay entry only has to carry the keys it translates —
     everything it omits falls through to the English original. */
  function isPlainObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  function merge(base, over) {
    if (over === undefined || over === null) return base;
    if (Array.isArray(base)) {
      if (!Array.isArray(over)) return over;
      const len = Math.max(base.length, over.length);
      const out = [];
      for (let i = 0; i < len; i++) {
        out[i] = i < base.length ? merge(base[i], over[i]) : over[i];
      }
      return out;
    }
    if (isPlainObject(base)) {
      if (!isPlainObject(over)) return over;
      const out = {};
      Object.keys(base).forEach((k) => { out[k] = merge(base[k], over[k]); });
      Object.keys(over).forEach((k) => { if (!(k in out)) out[k] = over[k]; });
      return out;
    }
    return over;
  }

  function data() {
    if (current === "en") return siteData;
    if (typeof siteDataAr === "undefined") return siteData;
    if (!merged) merged = merge(siteData, siteDataAr);
    return merged;
  }

  /* ---------------- Arabic-aware text normalisation ----------------
     Used by the assistant's keyword matcher. Folds the spelling
     variants people actually type — hamza forms, ta marbuta,
     alif maqsura, tatweel and diacritics — so "احكِ لي نكتة" and
     "احكي لي نكته" both reach the same intent. A no-op for Latin
     beyond lowercasing. */
  function normalize(str) {
    return String(str)
      .toLowerCase()
      .replace(/[ً-ْٰـ]/g, "") // harakat + tatweel
      .replace(/[آأإٱ]/g, "ا") // آ أ إ ٱ → ا
      .replace(/ى/g, "ي")                      // ى → ي
      .replace(/ة/g, "ه")                      // ة → ه
      .replace(/ؤ/g, "و")                      // ؤ → و
      .replace(/ئ/g, "ي")                      // ئ → ي
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ---------------- DOM application ---------------- */
  const ATTR_MAP = {
    "data-i18n-title": "title",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-placeholder": "placeholder"
  };

  function applyDom(root) {
    const scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    // a handful of strings carry inline markup (<em>, <kbd>) — the
    // dictionary is ours, not user input, so innerHTML is safe here
    scope.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });

    Object.keys(ATTR_MAP).forEach((dataAttr) => {
      scope.querySelectorAll("[" + dataAttr + "]").forEach((el) => {
        el.setAttribute(ATTR_MAP[dataAttr], t(el.getAttribute(dataAttr)));
      });
    });
  }

  /* ---------------- switching ---------------- */
  function isRtl() { return RTL.indexOf(current) !== -1; }

  function stored() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* localStorage unavailable */ }
    return null;
  }

  function preferred() {
    const saved = stored();
    if (saved) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("ar") === 0 ? "ar" : "en";
  }

  function applyRootAttrs() {
    const root = document.documentElement;
    root.setAttribute("lang", current);
    root.setAttribute("dir", isRtl() ? "rtl" : "ltr");
  }

  function set(next, opts) {
    if (SUPPORTED.indexOf(next) === -1 || next === current) return;
    current = next;
    merged = null;
    try { localStorage.setItem(STORE_KEY, next); } catch (e) { /* ignore */ }
    applyRootAttrs();
    applyDom();
    listeners.forEach((fn) => fn(current));
    if (!opts || opts.silent !== true) {
      if (typeof showToast === "function") showToast(t("lang.toast"));
    }
  }

  function toggle() { set(current === "ar" ? "en" : "ar"); }

  function onChange(fn) { if (typeof fn === "function") listeners.push(fn); }

  function init() {
    current = preferred();
    applyRootAttrs();
    applyDom();
  }

  return {
    init, set, toggle, onChange,
    t, data, normalize, applyDom, isRtl,
    get lang() { return current; }
  };
})();
