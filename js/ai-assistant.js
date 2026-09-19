/* =========================================================
   laila.ai — a small rule-based assistant.
   No API key, no network call: everything runs client-side
   by scoring your message against keyword intents defined
   from siteData. Swap in a real LLM call later if you want —
   see `askRemote()` stub at the bottom.
   ========================================================= */

const LailaAI = (function () {
  function intents() {
    const skillNames = siteData.skills.map((s) => s.name).join(", ");
    const projectNames = siteData.projects.map((p) => p.title).join(", ");

    return [
      {
        name: "greeting",
        keywords: ["hi", "hello", "hey", "yo", "sup", "howdy"],
        reply: () =>
          `Hey! I'm a tiny AI that lives on ${siteData.name}'s site. Ask me who they are, what they build, or how to reach them.`
      },
      {
        name: "about",
        keywords: ["who", "about", "bio", "yourself", "background", "story"],
        reply: () => `${siteData.about}\n\nBased in ${siteData.location}, currently focused on: ${siteData.focus}.`
      },
      {
        name: "skills",
        keywords: ["skill", "skills", "tech", "stack", "know", "good at", "technolog", "language", "tools"],
        reply: () => `${siteData.name} works mainly with: ${skillNames}. Scroll to the "skills" section for the full breakdown with levels.`
      },
      {
        name: "projects",
        keywords: ["project", "projects", "work", "portfolio", "built", "made", "shipped", "app"],
        reply: () => `A few things ${siteData.name} has shipped: ${projectNames}. Check the "work" section for details and links.`,
        action: () => scrollToSection("work")
      },
      {
        name: "dosely",
        keywords: ["dosely", "pillo", "medication", "medicine app", "medicine scanner"],
        reply: () => `Dosely is an AI-powered medication safety app — scan a medicine and it reads the label via OCR, cross-checks verified databases, and checks it against your health profile for a safe / caution / not-safe verdict, explained by Pillo, its AI assistant. Built with Flutter and Firebase as a team project at University of Bahrain.`,
        action: () => scrollToSection("work")
      },
      {
        name: "pitch",
        keywords: ["how can laila help", "help us", "why hire", "why should we hire", "what can you do for us", "hire laila", "pitch me"],
        reply: () => `Laila brings solid engineering fundamentals (Java, JavaScript, Python, SQL), strong software design and testing habits, and genuine curiosity about AI — plus she's led a project team before and picks up new tools fast. If you need someone who cares about getting the details right, that's her pitch. Ask about her skills or projects for specifics.`
      },
      {
        name: "strengths",
        keywords: ["strength", "strengths", "superpower", "what are you great at", "greatest strength"],
        reply: () => `Attention to detail and a testing mindset — Laila likes taking things apart, in code and in medicine boxes apparently, to understand exactly how they work and where they might break.`
      },
      {
        name: "availability",
        keywords: ["available", "availability", "hiring", "internship", "open to work", "looking for a job", "job opportunity", "open to opportunities"],
        reply: () => `Laila graduated with a B.Sc. in Software Engineering from the University of Bahrain in September 2026, and is actively looking for graduate and entry-level roles. Best way to follow up is ${siteData.email} or WhatsApp.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "freelance",
        keywords: ["freelance", "freelancing", "contract work", "side project help", "can you build me"],
        reply: () => `For freelance or project-based work, reach out directly at ${siteData.email} or WhatsApp and describe what you need — Laila will let you know if it's a fit.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "remote",
        keywords: ["remote", "relocate", "relocation", "work from home", "onsite", "in person"],
        reply: () => `Laila is based in ${siteData.location} and open to remote or local opportunities — ask directly about relocation for anything further out.`
      },
      {
        name: "favoriteProject",
        keywords: ["favorite project", "favourite project", "proudest", "best project", "most proud"],
        reply: () => `Probably Dosely — turning "is this medicine safe for me?" into an actual working AI-powered answer, built with a team from scratch, is hard to top.`,
        action: () => scrollToSection("work")
      },
      {
        name: "leadership",
        keywords: ["leadership", "team player", "lead a team", "teamwork example", "led a project"],
        reply: () => `Yes — Laila led the team on the Library Management System project, and collaborated closely across every project listed, including a 3-person AI team for Dosely.`
      },
      {
        name: "testingDetail",
        keywords: ["testing experience", "manual testing", "black box", "white box", "qa experience", "quality assurance"],
        reply: () => `Testing is one of Laila's strongest interests — manual testing, static & dynamic testing, black-box and white-box methods, plus unit testing with JUnit and Maven.`
      },
      {
        name: "aiDetail",
        keywords: ["machine learning experience", "ai experience", "artificial intelligence experience", "ml experience"],
        reply: () => `Laila completed a "Learn & Build Machine Learning Models with Python" course on Coursera, and put AI into practice building Dosely — an AI + OCR medication safety scanner with a built-in chat assistant, Pillo.`,
        action: () => scrollToSection("work")
      },
      {
        name: "flutter",
        keywords: ["flutter", "mobile app", "mobile development", "ios app", "android app"],
        reply: () => `Yes — Flutter and Firebase power Dosely, Laila's AI medication-scanning mobile app.`
      },
      {
        name: "databaseDetail",
        keywords: ["database experience", "sql experience", "db design", "database design"],
        reply: () => `Laila designed the database structure and wrote SQL queries for the Charity Management System project, and lists SQL/MySQL among her core skills.`
      },
      {
        name: "gitDetail",
        keywords: ["git workflow", "version control experience", "github experience", "git experience"],
        reply: () => `Git & GitHub are part of Laila's everyday toolkit for version control across her projects.`
      },
      {
        name: "favoriteTech",
        keywords: ["favorite language", "favourite language", "favorite tech", "favorite tool"],
        reply: () => `Hard to pin down — but Java and JavaScript get the most love, going by her skill levels.`
      },
      {
        name: "doselySupervisor",
        keywords: ["supervisor", "who supervised", "advisor", "supervised by"],
        reply: () => `Dosely was supervised by Dr. Abdulla Ahmed Al-Asaadi at the University of Bahrain.`
      },
      {
        name: "doselyTeammates",
        keywords: ["teammates", "who worked with", "group members", "dosely team", "who else worked on dosely"],
        reply: () => `Dosely was a team project with Eman Yaser Ali Alasaadi and Noor Alhuda Nooraldin Mansoor, alongside Laila.`
      },
      {
        name: "graduation",
        keywords: ["graduate", "graduation", "when will you finish", "finish your degree", "when do you graduate", "did you graduate", "are you still a student"],
        reply: () => `Laila graduated in September 2026 with a B.Sc. in Software Engineering from the University of Bahrain, which she started in 09/2022. She finished with a ${siteData.education.gpa} GPA.`
      },
      {
        name: "howAiWorks",
        keywords: ["how do you work", "are you rule based", "how were you built", "how were you made", "are you an api"],
        reply: () => `I'm a small keyword-matching engine living entirely in this browser tab — no API calls, no data leaving this page. Laila built me as part of this site. Ask something and I'll do my best to match it.`
      },
      {
        name: "helpCommands",
        keywords: ["help", "what can i ask", "commands", "what can you answer", "what do you know"],
        reply: () => `Try asking about Laila's skills, projects, education, testing experience, how to reach her, or just say "surprise me". I'm listening for keywords, so plain questions work best.`
      },
      {
        name: "farewell",
        keywords: ["bye", "goodbye", "see you", "later", "farewell"],
        reply: () => `Thanks for stopping by! Feel free to reach out at ${siteData.email} — good luck out there.`
      },
      {
        name: "contact",
        keywords: ["contact", "email", "reach", "hire", "connect", "talk", "get in touch", "collab"],
        reply: () => `Best way to reach ${siteData.name} is ${siteData.email}, or WhatsApp at ${siteData.whatsapp}. There are also social links in the contact section below.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "whatsapp",
        keywords: ["whatsapp", "whats app", "phone", "number", "call", "text"],
        reply: () => `You can WhatsApp ${siteData.name} at ${siteData.whatsapp} — there's a WhatsApp button in the contact section too.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "resume",
        keywords: ["resume", "cv", "download"],
        reply: () => `You can grab the résumé using the download button in the About section.`
      },
      {
        name: "education",
        keywords: ["school", "university", "degree", "study", "studying", "education", "gpa", "college"],
        reply: () => `${siteData.name} holds a ${siteData.education.degree} from ${siteData.education.school} (${siteData.education.period}), graduating in September 2026 with a GPA of ${siteData.education.gpa}.`
      },
      {
        name: "courses",
        keywords: ["course", "courses", "certificate", "certification", "coursera", "aws", "training", "nvidia", "cuda", "mpi", "parallel computing"],
        reply: () => `Some training on record: ${siteData.courses.map((c) => (c.date ? `${c.name} — ${c.provider}, ${c.date}` : `${c.name} — ${c.provider}`)).join("; ")}.`
      },
      {
        name: "location",
        keywords: ["where", "based", "location", "live", "from"],
        reply: () => `${siteData.name} is based in ${siteData.location}.`
      },
      {
        name: "theme",
        keywords: ["dark mode", "light mode", "theme", "dark", "light"],
        reply: () => {
          toggleThemeFromAI();
          return `Done — flipped the theme for you. Try asking me to switch it back.`;
        }
      },
      {
        name: "joke",
        keywords: ["joke", "funny", "laugh"],
        reply: () => siteData.jokes[Math.floor(Math.random() * siteData.jokes.length)]
      },
      {
        name: "surprise",
        keywords: ["surprise", "easter egg", "secret", "fun"],
        reply: () => {
          if (typeof launchConfetti === "function") launchConfetti();
          return "🎉 Surprise! Try the Konami code somewhere on this page too: ↑ ↑ ↓ ↓ ← → ← → B A"
        }
      },
      {
        name: "sentience",
        keywords: ["real ai", "sentient", "conscious", "chatgpt", "llm", "gpt", "are you ai"],
        reply: () => "I'm honest labor, not a large language model — just a keyword matcher wearing a nice UI. Ask me something and I'll do my best."
      },
      {
        name: "thanks",
        keywords: ["thanks", "thank you", "cool", "nice", "awesome"],
        reply: () => "Anytime! Try 'surprise me' if you haven't yet."
      },
      {
        name: "jdMatch",
        keywords: ["job description", "match me against", "how well do i match", "does laila fit", "does laila match", "compare to this role", "skill match", "fit this role", "requirements for this role"],
        reply: (raw) => matchJD(raw) || `Paste a job description or a list of required skills and I'll scan it against Laila's actual stack — I also recognize Ruby, Go, Rust, Kotlin, Swift, TypeScript, and a bunch of others, even ones she doesn't know yet.`
      },
      {
        name: "weather",
        keywords: ["weather", "temperature", "raining", "is it hot", "weather in bahrain", "how hot is it", "climate there"],
        reply: () => getBahrainWeather()
      },
      {
        name: "voiceToggle",
        keywords: ["voice on", "voice off", "talk to me", "read replies out loud", "say it out loud", "enable voice", "disable voice", "stop talking", "speak to me"],
        reply: () => {
          const btn = document.getElementById("ai-voice-toggle");
          if (btn) btn.click();
          return `Voice toggled — watch the speaker icon in the header. If your browser supports speech synthesis, I'll start talking out loud.`;
        }
      },
      {
        name: "browserIntel",
        keywords: ["what do you know about me", "do you know anything about me", "what time is it for you", "time difference", "what time is it in bahrain", "read my mind", "know about my device", "my location", "guess where i am", "spy on me", "track me", "profile me"],
        reply: () => browserIntel()
      }
    ];
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
  }

  function toggleThemeFromAI() {
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.click();
  }

  // ---- 1. Real calculator — no keyword match needed, just math ----
  function tryMath(raw) {
    const cleaned = raw
      .replace(/what(?:’|')?s\b/gi, "")
      .replace(/what is\b/gi, "")
      .replace(/calculate|solve|compute|equals?/gi, "")
      .replace(/[?=]/g, "")
      .trim();
    if (!cleaned || !/^[\d\s+\-*/().%^]+$/.test(cleaned)) return null;
    if (!/[+\-*/%^]/.test(cleaned)) return null;
    try {
      const expr = cleaned.replace(/\^/g, "**");
      const result = Function('"use strict"; return (' + expr + ")")();
      if (typeof result !== "number" || !isFinite(result)) return null;
      return `🧮 ${cleaned} = ${result}`;
    } catch (e) {
      return null;
    }
  }

  // ---- 2. Job-description / skill matcher — reads whatever you paste ----
  function tokenMatches(lower, key) {
    if (/^[a-z0-9\s]+$/i.test(key)) {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp("\\b" + escaped + "\\b", "i").test(lower);
    }
    return lower.includes(key);
  }

  function matchJD(rawText) {
    const lower = rawText.toLowerCase();
    const known = siteData.techKnown.filter((t) => tokenMatches(lower, t.key));
    const other = siteData.techOther.filter((t) => tokenMatches(lower, t.key));
    if (known.length === 0 && other.length === 0) return null;

    const total = siteData.techKnown.length;
    const pct = Math.round((known.length / total) * 100);
    let msg = `🔍 Scanned that against Laila's stack — matched: ${known.length ? known.map((t) => t.label).join(", ") : "nothing yet"} (${known.length}/${total} tracked skills, ~${pct}% overlap).`;
    if (other.length) {
      msg += ` Also spotted ${other.map((t) => t.label).join(", ")} in there — not on her stack today, but she picks up new languages fast.`;
    }
    msg += ` Worth a real conversation — check the contact section.`;
    return msg;
  }

  // ---- 3. Live weather — a real fetch to a free, keyless API ----
  const WEATHER_CODES = {
    0: "clear sky", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
    45: "foggy", 48: "foggy", 51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 71: "light snow", 73: "snow", 75: "heavy snow",
    80: "rain showers", 81: "rain showers", 82: "violent showers",
    95: "thunderstorm", 96: "thunderstorm with hail", 99: "severe thunderstorm with hail"
  };

  async function getBahrainWeather() {
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=26.13&longitude=50.55&current_weather=true");
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const cw = data.current_weather;
      const desc = WEATHER_CODES[cw.weathercode] || "unusual weather";
      return `🌤️ Live right now in Bahrain (near Riffa): ${cw.temperature}°C, ${desc}, wind ${cw.windspeed} km/h. That's a real fetch to a live weather API, not a canned answer.`;
    } catch (e) {
      return "Couldn't reach the live weather feed just now — might be offline. Try again in a bit.";
    }
  }

  // ---- 4. Browser/device/timezone trick — real, disclosed, mostly permission-free ----
  function parseBrowser(ua) {
    if (/Edg\//.test(ua)) return "Edge";
    if (/OPR\//.test(ua)) return "Opera";
    if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
    if (/Firefox\//.test(ua)) return "Firefox";
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return "Safari";
    return "an unrecognized browser";
  }

  function parseOS(ua) {
    if (/Windows NT 10/.test(ua)) return "Windows 10/11";
    if (/Windows NT/.test(ua)) return "Windows";
    if (/Mac OS X/.test(ua)) return "macOS";
    if (/Android/.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Linux/.test(ua)) return "Linux";
    return "an unknown OS";
  }

  // Only fires when the visitor explicitly asks — triggers the browser's
  // native permission prompt, so nothing here is silent or hidden.
  function tryGeolocate() {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await res.json();
            const place = [data.city || data.locality, data.countryName].filter(Boolean).join(", ");
            resolve(place || null);
          } catch (e) {
            resolve(null);
          }
        },
        () => resolve(null),
        { timeout: 5000, maximumAge: 600000 }
      );
    });
  }

  async function browserIntel() {
    const now = new Date();
    const visitorTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let visitorTZ = "an unknown timezone";
    let bahrainTime = "unknown";
    try {
      visitorTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
      bahrainTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bahrain" });
    } catch (e) { /* ignore */ }

    const ua = navigator.userAgent;
    const browser = parseBrowser(ua);
    const os = parseOS(ua);
    const deviceType = /Mobi|Android/i.test(ua) ? "mobile" : (window.matchMedia("(pointer: coarse)").matches ? "touch device" : "desktop");
    const screenInfo = `${window.screen.width}×${window.screen.height}`;
    const viewportInfo = `${window.innerWidth}×${window.innerHeight}`;
    const lang = navigator.language || "an unknown language";
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} CPU cores` : null;
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    let ref = "a direct visit — no referrer";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ref; } catch (e) { /* ignore */ }
    const secondsHere = Math.max(1, Math.round(performance.now() / 1000));
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
    const visits = parseInt(localStorage.getItem("laila-visit-count") || "1", 10);

    const lines = [
      `⏱️ It's ${visitorTime} your time (${visitorTZ}) — ${bahrainTime} in Bahrain, where Laila is.`,
      `💻 ${browser} on ${os}, ${deviceType} — screen ${screenInfo}, viewport ${viewportInfo}.`,
      `🌐 Language: ${lang}${cores ? " · " + cores : ""} · you seem to prefer ${colorScheme} mode.`,
      `🔗 You got here via: ${ref}.`,
      `📜 ${secondsHere}s on this page so far, scrolled ${scrollPct}%.`
    ];
    if (visits > 1) lines.push(`👋 This looks like visit #${visits} from this browser — I remember, locally, on your device only.`);

    const place = await tryGeolocate();
    if (place) lines.push(`📍 And since you allowed it: you're near ${place}.`);

    lines.push(`\nAll of that is standard browser info (plus location only if you just approved the permission prompt) — nothing leaves this page or gets stored anywhere except that visit counter, which lives only in your browser's local storage.`);

    return lines.join("\n");
  }

  function respond(message) {
    const text = message.toLowerCase().trim();
    if (!text) return "Ask me something — try \"who is Laila\" or \"show me projects\".";

    const mathResult = tryMath(message);
    if (mathResult !== null) return mathResult;

    let best = null;
    let bestScore = 0;

    for (const intent of intents()) {
      let score = 0;
      for (const kw of intent.keywords) {
        if (text.includes(kw)) score += kw.split(" ").length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }

    if (best) {
      const reply = best.reply(message);
      if (best.action) best.action();
      return reply;
    }

    // Smart fallback: a long pasted block (e.g. a job posting) gets scanned
    // for tech keywords automatically, instead of just giving up.
    if (message.trim().split(/\s+/).length > 8) {
      const jd = matchJD(message);
      if (jd) return jd;
    }

    return `I didn't quite catch that. Try asking about ${siteData.name}'s skills, projects, or how to get in touch — paste a job description, ask me a math question, or say "surprise me".`;
  }

  // ---- Optional: wire this up to a real model later ----
  // async function askRemote(message) {
  //   const res = await fetch("/api/ask", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ message })
  //   });
  //   const data = await res.json();
  //   return data.reply;
  // }

  return { respond };
})();
