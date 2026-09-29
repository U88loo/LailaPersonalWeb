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
      "nav.press": "press",
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

      /* the opening poster (js/poster.js) — its big letters are drawn, so
         only the labels, the bubble and the button names translate */
      "open.title": "Laila Haji · Software Engineer",
      "open.cue": "scroll to begin",
      "poster.name": "PORTFOLIO",
      "poster.year": "2026",
      "poster.roleL": "SOFTWARE ENGINEER",
      "poster.roleR": "RIFFA, BAHRAIN",
      "poster.greeting": "HI, I'M LAILA!",
      "poster.signature": "LAI/LA",
      "poster.wave": "Wave hello",
      "poster.replay": "Replay the opening",
      "poster.waveAgain": "Wave again",
      "poster.dice": "Roll the dice, showing {n}",

      /* scene names, for the HUD in the corner */
      "scene.0": "opening titles",
      "scene.1": "the premise",
      "scene.2": "the headline",
      "scene.3": "the person",
      "scene.4": "the work",
      "scene.5": "the toolkit",
      "scene.6": "the credentials",
      "scene.7": "the end?",

      "kicker.premise": "scene 01 · the premise",
      "kicker.press": "scene 02 · the headline",
      "kicker.about": "scene 03 · the person",
      "kicker.work": "scene 04 · the work",
      "kicker.skills": "scene 05 · the toolkit",
      "kicker.certs": "scene 06 · the credentials",
      "kicker.contact": "scene 07 · the end?",

      "cine.line1": "Every system has a story.",
      "cine.line2": "This one is mine.",
      "cine.brand": "LAILA",
      "cine.appTitle": "Portfolio",
      "cine.metric": "K lines shipped",
      "cine.badge1": "In the news",
      "cine.badge1sub": "Akhbar Al Khaleej · Sep 2026",
      "cine.badge2": "Graduated",
      "cine.badge2sub": "B.Sc. Software Eng. · UoB",
      "cine.heading": "Software that ships to real people.",
      "cine.desc":
        "I'm <b>Laila</b>, a software engineering graduate from the University of Bahrain. I've built systems for a counselling clinic, a car-accessories shop and a herbs brand, and two of them are used every single day.",
      "cine.ctaTitle": "Roll the tape.",
      "cine.ctaDesc": "A front-page headline, four shipped systems, and the person behind them. Keep scrolling.",
      "cine.resumeSmall": "download the",
      "cine.resume": "Résumé",
      "cine.askSmall": "ask the assistant",

      "press.title": "It made the paper.",
      "press.stamp": "FEATURED",
      "press.caseStudy": "read the case study →",
      "press.open": "open the full clipping ↗",
      "press.translated": "subtitles translated from the Arabic",

      "about.lead":
        "I like software that feels a little <em>alive</em>: interfaces with personality, details you notice on the second visit, and code that's honest about what it's doing.",
      "about.resume": "download résumé ↓",

      "title.skills": "Tools I reach for",
      "title.work": "Things I've shipped",
      "title.certs": "Training and credentials",
      "title.contact": "Let's build something.",

      "work.hint": "keep scrolling, the reel moves sideways",
      "work.frame": "frame",

      "contact.sub":
        "Fastest way in is the assistant: press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> and ask it for my email. Or just use the old-fashioned links below.",
      "contact.tbc": "to be continued…",

      "credits.directed": "directed by",
      "credits.written": "written in",
      "credits.writtenVal": "HTML, CSS & plain JavaScript",
      "credits.motion": "motion",
      "credits.location": "filmed on location",
      "credits.cameo": "special appearance",

      "footer.text": "Built with vibecoding energy in {year}. No frameworks were harmed.",
      "footer.replay": "replay the opening ↻",

      "card.caseStudy": "view case study →",
      "card.project": "view project →",
      "cert.verify": "verify ↗",
      "cert.admit": "admit one",

      "pm.close": "Close project details",
      "pm.whatItIs": "What it is",
      "pm.numbers": "By the numbers",
      "pm.whatItDoes": "What it does",
      "pm.howItWorks": "How it works",
      "pm.builtWith": "Built with",
      "pm.team": "Team",

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
      "chip.press": "Was Laila in the news?",
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
      "nav.press": "الصحافة",
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

      "open.title": "ليلى حاجي · مهندسة برمجيات",
      "open.cue": "مرّر للبدء",
      "poster.name": "ملف الأعمال",
      "poster.year": "2026",
      "poster.roleL": "مهندسة برمجيات",
      "poster.roleR": "الرفاع، البحرين",
      "poster.greeting": "أهلاً، أنا ليلى!",
      "poster.signature": "LAI/LA",
      "poster.wave": "لوّح بالتحية",
      "poster.replay": "أعد تشغيل المقدمة",
      "poster.waveAgain": "لوّح مجدداً",
      "poster.dice": "ارمِ النرد، الوجه الحالي {n}",

      "scene.0": "المقدمة",
      "scene.1": "الفكرة",
      "scene.2": "العنوان الرئيسي",
      "scene.3": "الشخصية",
      "scene.4": "الأعمال",
      "scene.5": "العُدّة",
      "scene.6": "الاعتمادات",
      "scene.7": "النهاية؟",

      "kicker.premise": "المشهد 01 · الفكرة",
      "kicker.press": "المشهد 02 · العنوان الرئيسي",
      "kicker.about": "المشهد 03 · الشخصية",
      "kicker.work": "المشهد 04 · الأعمال",
      "kicker.skills": "المشهد 05 · العُدّة",
      "kicker.certs": "المشهد 06 · الاعتمادات",
      "kicker.contact": "المشهد 07 · النهاية؟",

      "cine.line1": "لكل نظام قصة.",
      "cine.line2": "وهذه قصتي.",
      "cine.brand": "ليلى",
      "cine.appTitle": "أعمالي",
      "cine.metric": "ألف سطر برمجي",
      "cine.badge1": "في الأخبار",
      "cine.badge1sub": "أخبار الخليج · سبتمبر 2026",
      "cine.badge2": "تخرّجت",
      "cine.badge2sub": "بكالوريوس هندسة برمجيات",
      "cine.heading": "برمجيات تصل إلى أناس حقيقيين.",
      "cine.desc":
        "أنا <b>ليلى</b>، خريجة هندسة برمجيات من جامعة البحرين. بنيت أنظمة لمركز إرشاد أسري، ولمحلّ إكسسوارات سيارات، ولعلامة أعشاب طبيعية، واثنان منها يُستخدمان كل يوم.",
      "cine.ctaTitle": "لنبدأ العرض.",
      "cine.ctaDesc": "عنوان في الجريدة، وأربعة أنظمة أُطلقت، والشخص الذي يقف خلفها. واصل التمرير.",
      "cine.resumeSmall": "تحميل",
      "cine.resume": "السيرة الذاتية",
      "cine.askSmall": "اسأل المساعد",

      "press.title": "وصل الخبر إلى الجريدة.",
      "press.stamp": "نُشر في الصحافة",
      "press.caseStudy": "اقرأ دراسة الحالة ←",
      "press.open": "افتح القصاصة كاملة ↗",
      "press.translated": "",

      "about.lead":
        "أحبّ البرمجيات التي تبدو <em>حيّة</em> قليلاً: واجهات لها شخصية، وتفاصيل تلاحظها في الزيارة الثانية، وكود صادق بشأن ما يفعله.",
      "about.resume": "تحميل السيرة الذاتية ↓",

      "title.skills": "الأدوات التي أعمل بها",
      "title.work": "أشياء أطلقتها",
      "title.certs": "التدريب والشهادات",
      "title.contact": "لنبنِ شيئاً معاً.",

      "work.hint": "واصل التمرير، الشريط يتحرّك جانبياً",
      "work.frame": "لقطة",

      "contact.sub":
        "أسرع طريق هو المساعد: اضغط <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> واسأله عن بريدي. أو استخدم الروابط التقليدية أدناه.",
      "contact.tbc": "يُتبَع…",

      "credits.directed": "إخراج",
      "credits.written": "كُتب بـ",
      "credits.writtenVal": "HTML وCSS وJavaScript خالصة",
      "credits.motion": "الحركة",
      "credits.location": "صُوّر في",
      "credits.cameo": "ظهور خاص",

      "footer.text": "بُني بطاقة الشغف في {year}. لم يُؤذَ أي إطار عمل.",
      "footer.replay": "أعد تشغيل المقدمة ↻",

      "card.caseStudy": "عرض دراسة الحالة ←",
      "card.project": "عرض المشروع ←",
      "cert.verify": "تحقّق ↗",
      "cert.admit": "تذكرة دخول",

      "pm.close": "إغلاق تفاصيل المشروع",
      "pm.whatItIs": "ما هو",
      "pm.numbers": "بالأرقام",
      "pm.whatItDoes": "ماذا يفعل",
      "pm.howItWorks": "كيف يعمل",
      "pm.builtWith": "بُني باستخدام",
      "pm.team": "الفريق",

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
      "chip.press": "هل ظهرت ليلى في الأخبار؟",
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
