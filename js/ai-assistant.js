/* =========================================================
   laila.ai — a small rule-based assistant.
   No API key, no network call: everything runs client-side
   by scoring your message against keyword intents defined
   from siteData. Swap in a real LLM call later if you want —
   see `askRemote()` stub at the bottom.

   Bilingual. Every intent carries two keyword pools and two
   replies:

     keywords / reply      English
     keywordsAr / replyAr  Arabic

   Matching always scans BOTH pools, so an Arabic question is
   understood while the page is in English and vice versa; only
   the *answer* follows I18N.lang. Arabic input is folded through
   I18N.normalize() first, which collapses the hamza / ta-marbuta
   / alif-maqsura spellings people actually type, so "احكِ لي نكتة"
   and "احكي لي نكته" land on the same intent.
   ========================================================= */

const LailaAI = (function () {
  const isAr = () => typeof I18N !== "undefined" && I18N.lang === "ar";
  const D = () => (typeof I18N !== "undefined" ? I18N.data() : siteData);
  const listSep = () => (isAr() ? "، " : ", ");

  function intents() {
    const d = D();
    const skillNames = d.skills.map((s) => s.name).join(listSep());
    const projectNames = d.projects.map((p) => p.title).join(listSep());

    return [
      {
        name: "greeting",
        keywords: ["hi", "hello", "hey", "yo", "sup", "howdy"],
        keywordsAr: ["مرحبا", "السلام عليكم", "اهلا", "صباح الخير", "مساء الخير"],
        reply: () =>
          `Hey! I'm a tiny AI that lives on ${d.name}'s site. Ask me who they are, what they build, or how to reach them.`,
        replyAr: () =>
          `أهلاً! أنا ذكاء اصطناعي صغير يعيش في موقع ${d.name}. اسألني من هي، وماذا تبني، وكيف تصل إليها.`
      },
      {
        name: "about",
        keywords: ["who", "about", "bio", "yourself", "background", "story"],
        keywordsAr: ["من هي", "عن ليلى", "نبذة", "سيرتها", "خلفيتها", "عرفني عليها"],
        reply: () => `${d.about}\n\nBased in ${d.location}, currently focused on: ${d.focus}.`,
        replyAr: () => `${d.about}\n\nمقيمة في ${d.location}، وتركّز حالياً على: ${d.focus}.`
      },
      {
        name: "skills",
        keywords: ["skill", "skills", "tech", "stack", "know", "good at", "technolog", "language", "tools"],
        keywordsAr: ["مهارات", "المهارات", "التقنيات", "لغات البرمجة", "ماذا تتقن", "خبراتها", "أدوات"],
        reply: () => `${d.name} works mainly with: ${skillNames}. Scroll to the "skills" section for the full breakdown with levels.`,
        replyAr: () => `تعمل ${d.name} أساساً بـ: ${skillNames}. مرّر إلى قسم "المهارات" لترى التفصيل الكامل مع المستويات.`
      },
      {
        name: "projects",
        keywords: ["project", "projects", "work", "portfolio", "built", "made", "shipped", "app"],
        keywordsAr: ["مشاريع", "المشاريع", "أعمالها", "أرني المشاريع", "ماذا بنت", "معرض الأعمال"],
        reply: () => `A few things ${d.name} has shipped: ${projectNames}. Check the "work" section for details and links.`,
        replyAr: () => `بعض ما أطلقته ${d.name}: ${projectNames}. اطّلع على قسم "أعمالي" للتفاصيل والروابط.`,
        action: () => scrollToSection("work")
      },
      {
        name: "dosely",
        keywords: ["dosely", "pillo", "medication", "medicine app", "medicine scanner"],
        keywordsAr: ["دوزلي", "بيلو", "ماسح الدواء", "تطبيق الدواء", "سلامة الأدوية"],
        reply: () => `Dosely is an AI-powered medication safety app: scan a medicine and it reads the label via OCR, cross-checks verified databases, and checks it against your health profile for a safe / caution / not-safe verdict, explained by Pillo, its AI assistant. Built with Flutter and Firebase as a team project at University of Bahrain.`,
        replyAr: () => `Dosely تطبيق لسلامة الأدوية يعمل بالذكاء الاصطناعي: صوّر الدواء فيقرأ الملصق عبر التعرّف الضوئي على الحروف، ويقارنه بقواعد بيانات موثوقة وبملفك الصحي ليعطيك حكماً: آمن / احذر / غير آمن، يشرحه Pillo المساعد الذكي. بُني بـ Flutter وFirebase كمشروع جماعي في جامعة البحرين.`,
        action: () => scrollToSection("work")
      },
      {
        name: "pitch",
        keywords: ["how can laila help", "help us", "why hire", "why should we hire", "what can you do for us", "hire laila", "pitch me"],
        keywordsAr: ["أن تساعدنا", "تساعدنا", "لماذا نوظف", "ماذا تقدم لنا", "لماذا نختارها", "لماذا نعينها"],
        reply: () => `Laila brings solid engineering fundamentals (Java, JavaScript, Python, SQL), strong software design and testing habits, and genuine curiosity about AI, plus she's shipped production systems end to end on her own and picks up new tools fast. If you need someone who cares about getting the details right, that's her pitch. Ask about her skills or projects for specifics.`,
        replyAr: () => `تجمع ليلى أساسيات هندسية متينة (Java وJavaScript وPython وSQL)، وعادات قوية في تصميم البرمجيات واختبارها، وفضولاً حقيقياً تجاه الذكاء الاصطناعي، إضافة إلى أنها أطلقت أنظمة إنتاجية كاملة بمفردها وتلتقط الأدوات الجديدة بسرعة. إن كنت تبحث عمّن يهتم بضبط التفاصيل، فهذه هي. اسأل عن مهاراتها أو مشاريعها للتفاصيل.`
      },
      {
        name: "strengths",
        keywords: ["strength", "strengths", "superpower", "what are you great at", "greatest strength"],
        keywordsAr: ["نقاط القوة", "أقوى ما لديها", "قوتها", "ميزتها", "ما الذي تتقنه"],
        reply: () => `Attention to detail and a testing mindset. Laila likes taking things apart, in code and in medicine boxes apparently, to understand exactly how they work and where they might break.`,
        replyAr: () => `الاهتمام بالتفاصيل وعقلية الاختبار. تحبّ ليلى تفكيك الأشياء، في الكود وفي علب الأدوية على ما يبدو، لتفهم بالضبط كيف تعمل وأين قد تنكسر.`
      },
      {
        name: "availability",
        keywords: ["available", "availability", "hiring", "internship", "open to work", "looking for a job", "job opportunity", "open to opportunities"],
        keywordsAr: ["متاحة للعمل", "تبحث عن عمل", "توظيف", "فرصة عمل", "تدريب داخلي", "هل تعمل حالياً", "وظيفة"],
        reply: () => `Laila graduated with a B.Sc. in Software Engineering from the University of Bahrain in September 2026, and is actively looking for graduate and entry-level roles. Best way to follow up is ${d.email} or WhatsApp.`,
        replyAr: () => `تخرّجت ليلى ببكالوريوس هندسة البرمجيات من جامعة البحرين في سبتمبر 2026، وتبحث فعلياً عن وظائف للخريجين والمبتدئين. أفضل طريقة للمتابعة هي ${d.email} أو واتساب.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "freelance",
        keywords: ["freelance", "freelancing", "contract work", "side project help", "can you build me"],
        keywordsAr: ["عمل حر", "فريلانس", "مشروع خاص", "هل تبني لي", "تطوير مشروع"],
        reply: () => `For freelance or project-based work, reach out directly at ${d.email} or WhatsApp and describe what you need, and Laila will let you know if it's a fit.`,
        replyAr: () => `للعمل الحر أو المشاريع المستقلة، تواصل مباشرة عبر ${d.email} أو واتساب واشرح ما تحتاجه، وستخبرك ليلى إن كان مناسباً.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "remote",
        keywords: ["remote", "relocate", "relocation", "work from home", "onsite", "in person"],
        keywordsAr: ["عن بعد", "الانتقال للعمل", "من المنزل", "حضوري", "الانتقال لبلد آخر"],
        reply: () => `Laila is based in ${d.location} and open to remote or local opportunities. Ask directly about relocation for anything further out.`,
        replyAr: () => `ليلى مقيمة في ${d.location} ومنفتحة على الفرص عن بُعد أو المحلية. للانتقال إلى مكان أبعد، اسأل مباشرة.`
      },
      {
        name: "favoriteProject",
        keywords: ["favorite project", "favourite project", "proudest", "best project", "most proud"],
        keywordsAr: ["أفضل مشروع", "المشروع المفضل", "أكثر مشروع", "الأكثر فخراً", "تفتخر به"],
        reply: () => `Probably Dosely. Turning "is this medicine safe for me?" into an actual working AI-powered answer, built with a team from scratch, is hard to top.`,
        replyAr: () => `على الأرجح Dosely. تحويل سؤال "هل هذا الدواء آمن لي؟" إلى إجابة فعلية تعمل بالذكاء الاصطناعي، بُنيت مع فريق من الصفر، أمر يصعب التفوّق عليه.`,
        action: () => scrollToSection("work")
      },
      {
        name: "leadership",
        keywords: ["leadership", "team player", "lead a team", "teamwork example", "led a project"],
        keywordsAr: ["قيادة", "قيادة فريق", "عمل جماعي", "قادت فريقاً", "روح الفريق"],
        reply: () => `Both ways. Dosely was a three-person team at the University of Bahrain, built closely together end to end. The Aisha Yateem clinic system, YaldaAuto and the Library Management System she designed, built and shipped on her own — two of them are in daily production use.`,
        replyAr: () => `بالطريقتين. كان Dosely مشروعاً لفريق من ثلاثة أشخاص في جامعة البحرين، بُني بتعاون وثيق من البداية إلى النهاية. أما نظام مركز عائشة يتيم وYaldaAuto ونظام إدارة المكتبة فقد صمّمتها وبنتها وأطلقتها بمفردها، واثنان منها قيد الاستخدام اليومي الفعلي.`
      },
      {
        name: "testingDetail",
        keywords: ["testing experience", "manual testing", "black box", "white box", "qa experience", "quality assurance"],
        // bare "اختبار" covers "الاختبار" / "خبرتها في الاختبار" / "اختبارات"
        keywordsAr: ["اختبار", "الاختبار اليدوي", "الصندوق الأسود", "ضمان الجودة", "اختبار البرمجيات"],
        reply: () => `Testing is one of Laila's strongest interests: manual testing, static & dynamic testing, black-box and white-box methods, plus unit testing with JUnit and Maven.`,
        replyAr: () => `الاختبار من أقوى اهتمامات ليلى: الاختبار اليدوي، والاختبار الساكن والديناميكي، وأسلوبا الصندوق الأسود والأبيض، إضافة إلى اختبار الوحدات بـ JUnit وMaven.`
      },
      {
        name: "aiDetail",
        keywords: ["machine learning experience", "ai experience", "artificial intelligence experience", "ml experience"],
        keywordsAr: ["خبرة في الذكاء الاصطناعي", "تعلم الآلة", "خبرتها في الذكاء", "تعلّم الآلة"],
        reply: () => `Laila completed a "Learn & Build Machine Learning Models with Python" course on Coursera, and put AI into practice building Dosely, an AI + OCR medication safety scanner with a built-in chat assistant, Pillo.`,
        replyAr: () => `أكملت ليلى دورة "تعلّم وبناء نماذج تعلُّم الآلة بلغة Python" على Coursera، وطبّقت الذكاء الاصطناعي عملياً في بناء Dosely، ماسح سلامة الأدوية بالذكاء الاصطناعي والتعرّف الضوئي على الحروف، مع مساعد محادثة مدمج هو Pillo.`,
        action: () => scrollToSection("work")
      },
      {
        name: "flutter",
        keywords: ["flutter", "mobile app", "mobile development", "ios app", "android app"],
        keywordsAr: ["فلاتر", "تطبيق جوال", "تطوير الجوال", "تطبيق أيفون", "تطبيق أندرويد"],
        reply: () => `Yes. Flutter and Firebase power Dosely, Laila's AI medication-scanning mobile app.`,
        replyAr: () => `نعم. يعمل Dosely، تطبيق ليلى لمسح الأدوية بالذكاء الاصطناعي، على Flutter وFirebase.`
      },
      {
        name: "databaseDetail",
        keywords: ["database experience", "sql experience", "db design", "database design"],
        keywordsAr: ["قواعد البيانات", "تصميم قاعدة بيانات", "خبرة في sql"],
        reply: () => `Laila designed the database structure and wrote SQL queries for the Charity Management System project, and lists SQL/MySQL among her core skills.`,
        replyAr: () => `صمّمت ليلى بنية قاعدة البيانات وكتبت استعلامات SQL لمشروع نظام إدارة الجمعيات الخيرية، وتُدرِج SQL/MySQL ضمن مهاراتها الأساسية.`
      },
      {
        name: "gitDetail",
        keywords: ["git workflow", "version control experience", "github experience", "git experience"],
        keywordsAr: ["جيت هب", "التحكم بالإصدارات", "خبرة في git"],
        reply: () => `Git & GitHub are part of Laila's everyday toolkit for version control across her projects.`,
        replyAr: () => `Git وGitHub جزء من عدّة ليلى اليومية للتحكم بالإصدارات في كل مشاريعها.`
      },
      {
        name: "favoriteTech",
        keywords: ["favorite language", "favourite language", "favorite tech", "favorite tool"],
        keywordsAr: ["اللغة المفضلة", "التقنية المفضلة", "الأداة المفضلة"],
        reply: () => `Hard to pin down, but Java and JavaScript get the most love, going by her skill levels.`,
        replyAr: () => `يصعب التحديد، لكن Java وJavaScript تحظيان بالنصيب الأكبر، بحسب مستويات مهاراتها.`
      },
      {
        name: "doselySupervisor",
        keywords: ["supervisor", "who supervised", "advisor", "supervised by"],
        keywordsAr: ["المشرف", "من أشرف", "الدكتور المشرف"],
        reply: () => `Dosely was supervised by Dr. Abdulla Ahmed Al-Asaadi at the University of Bahrain.`,
        replyAr: () => `أشرف على Dosely الدكتور عبدالله أحمد الأسعدي في جامعة البحرين.`
      },
      {
        name: "doselyTeammates",
        keywords: ["teammates", "who worked with", "group members", "dosely team", "who else worked on dosely"],
        keywordsAr: ["زملاء الفريق", "من عمل معها", "أعضاء الفريق", "فريق dosely"],
        reply: () => `Dosely was a team project with Eman Yaser Ali Alasaadi and Noor Alhuda Nooraldin Mansoor, alongside Laila.`,
        replyAr: () => `كان Dosely مشروعاً جماعياً مع إيمان ياسر علي الأسعدي ونور الهدى نورالدين منصور، إلى جانب ليلى.`
      },
      {
        name: "graduation",
        keywords: ["graduate", "graduation", "when will you finish", "finish your degree", "when do you graduate", "did you graduate", "are you still a student"],
        keywordsAr: ["تخرج", "متى تخرجت", "هل تخرجت", "ما زالت طالبة", "أنهت دراستها"],
        reply: () => `Laila graduated in September 2026 with a B.Sc. in Software Engineering from the University of Bahrain, which she started in 09/2022. She finished with a ${d.education.gpa} GPA.`,
        replyAr: () => `تخرّجت ليلى في سبتمبر 2026 ببكالوريوس هندسة البرمجيات من جامعة البحرين، والتي بدأتها في 09/2022. وأنهتها بمعدل تراكمي ${d.education.gpa}.`
      },
      {
        name: "howAiWorks",
        keywords: ["how do you work", "are you rule based", "how were you built", "how were you made", "are you an api"],
        keywordsAr: ["كيف تعمل", "كيف بُنيت", "هل أنت قائم على كلمات مفتاحية", "هل أنت واجهة برمجية"],
        reply: () => `I'm a small keyword-matching engine living entirely in this browser tab: no API calls, no data leaving this page. Laila built me as part of this site. Ask something and I'll do my best to match it.`,
        replyAr: () => `أنا محرّك صغير لمطابقة الكلمات المفتاحية يعيش بالكامل داخل نافذة المتصفح هذه: بلا استدعاءات لواجهات برمجية، وبلا أي بيانات تغادر الصفحة. بنتني ليلى كجزء من هذا الموقع. اسألني شيئاً وسأبذل جهدي لمطابقته.`
      },
      {
        name: "helpCommands",
        keywords: ["help", "what can i ask", "commands", "what can you answer", "what do you know"],
        keywordsAr: ["ماذا يمكنني أن أسأل", "الأوامر", "ماذا تعرف", "ماذا يمكنك أن تفعل"],
        reply: () => `Try asking about Laila's skills, projects, education, testing experience, how to reach her, or just say "surprise me". I'm listening for keywords, so plain questions work best.`,
        replyAr: () => `جرّب السؤال عن مهارات ليلى، أو مشاريعها، أو دراستها، أو خبرتها في الاختبار، أو كيفية الوصول إليها، أو قل ببساطة "فاجئني". أنا أنصت للكلمات المفتاحية، لذا الأسئلة المباشرة تعمل أفضل.`
      },
      {
        name: "farewell",
        keywords: ["bye", "goodbye", "see you", "later", "farewell"],
        keywordsAr: ["وداعا", "مع السلامة", "إلى اللقاء", "باي"],
        reply: () => `Thanks for stopping by! Feel free to reach out at ${d.email}. Good luck out there.`,
        replyAr: () => `شكراً لمرورك! لا تتردد في التواصل عبر ${d.email}. بالتوفيق.`
      },
      {
        name: "contact",
        keywords: ["contact", "email", "reach", "hire", "connect", "talk", "get in touch", "collab"],
        keywordsAr: ["تواصل", "أتواصل", "البريد الإلكتروني", "إيميل", "كيف أصل إليها", "التعاون"],
        reply: () => `Best way to reach ${d.name} is ${d.email}, or WhatsApp at ${d.whatsapp}. There are also social links in the contact section below.`,
        replyAr: () => `أفضل طريقة للوصول إلى ${d.name} هي ${d.email}، أو واتساب على ${d.whatsapp}. وهناك أيضاً روابط التواصل في قسم "تواصل" أدناه.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "whatsapp",
        keywords: ["whatsapp", "whats app", "phone", "number", "call", "text"],
        keywordsAr: ["واتساب", "واتس اب", "رقم الهاتف", "اتصال هاتفي"],
        reply: () => `You can WhatsApp ${d.name} at ${d.whatsapp}. There's a WhatsApp button in the contact section too.`,
        replyAr: () => `يمكنك مراسلة ${d.name} على واتساب: ${d.whatsapp}. وهناك زر واتساب في قسم "تواصل" أيضاً.`,
        action: () => scrollToSection("contact")
      },
      {
        name: "resume",
        keywords: ["resume", "cv", "download"],
        keywordsAr: ["السيرة الذاتية", "تحميل السيرة"],
        reply: () => `You can grab the résumé using the download button in the About section.`,
        replyAr: () => `يمكنك تحميل السيرة الذاتية من زر التحميل في قسم "نبذة".`
      },
      {
        name: "education",
        keywords: ["school", "university", "degree", "study", "studying", "education", "gpa", "college"],
        // "معدل" rather than "المعدل" so "معدلها التراكمي" matches too
        keywordsAr: ["الجامعة", "الدراسة", "الشهادة الجامعية", "التخصص", "معدل", "التراكمي", "تعليمها"],
        reply: () => `${d.name} holds a ${d.education.degree} from ${d.education.school} (${d.education.period}), graduating in September 2026 with a GPA of ${d.education.gpa}.`,
        replyAr: () => `تحمل ${d.name} ${d.education.degree} من ${d.education.school} (${d.education.period})، وتخرّجت في سبتمبر 2026 بمعدل تراكمي ${d.education.gpa}.`
      },
      {
        name: "courses",
        keywords: ["course", "courses", "certificate", "certification", "coursera", "aws", "training", "nvidia", "cuda", "mpi", "parallel computing"],
        keywordsAr: ["دورات", "الدورات", "شهادات", "الشهادات", "كورسيرا", "دورة تدريبية", "الحوسبة المتوازية"],
        reply: () => `Some training on record: ${d.courses.map((c) => (c.date ? `${c.name} · ${c.provider}, ${c.date}` : `${c.name} · ${c.provider}`)).join("; ")}.`,
        replyAr: () => `بعض ما هو مسجَّل من تدريب: ${d.courses.map((c) => (c.date ? `${c.name} · ${c.provider}، ${c.date}` : `${c.name} · ${c.provider}`)).join("؛ ")}.`
      },
      {
        name: "location",
        keywords: ["where", "based", "location", "live", "from"],
        keywordsAr: ["أين تقيم", "أين تسكن", "مكانها", "من أي بلد", "أين تعيش"],
        reply: () => `${d.name} is based in ${d.location}.`,
        replyAr: () => `${d.name} مقيمة في ${d.location}.`
      },
      {
        name: "theme",
        keywords: ["dark mode", "light mode", "theme", "dark", "light"],
        keywordsAr: ["الوضع الداكن", "الوضع الفاتح", "السمة", "المظهر", "الثيم"],
        reply: () => {
          toggleThemeFromAI();
          return `Done. Flipped the theme for you. Try asking me to switch it back.`;
        },
        replyAr: () => {
          toggleThemeFromAI();
          return `تم. بدّلت السمة لك. جرّب أن تطلب مني إعادتها.`;
        }
      },
      {
        name: "language",
        keywords: ["speak arabic", "in arabic", "switch to arabic", "arabic version", "speak english", "in english", "switch to english", "translate this page", "change language"],
        keywordsAr: ["بالعربية", "بالعربي", "تكلم عربي", "غير اللغة", "بالإنجليزية", "ترجم الصفحة"],
        // same handler both ways — it confirms in whichever language it
        // just switched TO, which is the one the visitor asked for
        reply: () => switchLanguage(),
        replyAr: () => switchLanguage()
      },
      {
        name: "joke",
        keywords: ["joke", "funny", "laugh"],
        keywordsAr: ["نكتة", "مزحة", "أضحكني", "شيء مضحك"],
        reply: () => d.jokes[Math.floor(Math.random() * d.jokes.length)],
        replyAr: () => d.jokes[Math.floor(Math.random() * d.jokes.length)]
      },
      {
        name: "surprise",
        keywords: ["surprise", "easter egg", "secret", "fun"],
        keywordsAr: ["فاجئني", "مفاجأة", "أسرار", "شيء ممتع"],
        reply: () => {
          if (typeof launchConfetti === "function") launchConfetti();
          return "🎉 Surprise! Try the Konami code somewhere on this page too: ↑ ↑ ↓ ↓ ← → ← → B A";
        },
        replyAr: () => {
          if (typeof launchConfetti === "function") launchConfetti();
          return "🎉 مفاجأة! جرّب شيفرة كونامي في أي مكان على هذه الصفحة أيضاً: ↑ ↑ ↓ ↓ ← → ← → B A";
        }
      },
      {
        name: "sentience",
        keywords: ["real ai", "sentient", "conscious", "chatgpt", "llm", "gpt", "are you ai"],
        keywordsAr: ["ذكاء اصطناعي حقيقي", "هل أنت واعٍ", "شات جي بي تي", "نموذج لغوي", "هل أنت ذكاء اصطناعي"],
        reply: () => "I'm honest labor, not a large language model, just a keyword matcher wearing a nice UI. Ask me something and I'll do my best.",
        replyAr: () => "أنا شغل يدوي صادق، لا نموذج لغوي كبير، مجرد مطابِق كلمات مفتاحية يرتدي واجهة أنيقة. اسألني شيئاً وسأبذل جهدي."
      },
      {
        name: "thanks",
        keywords: ["thanks", "thank you", "cool", "nice", "awesome"],
        keywordsAr: ["شكرا", "ممتاز", "رائع", "جميل"],
        reply: () => "Anytime! Try 'surprise me' if you haven't yet.",
        replyAr: () => "في أي وقت! جرّب \"فاجئني\" إن لم تفعل بعد."
      },
      {
        name: "jdMatch",
        keywords: ["job description", "match me against", "how well do i match", "does laila fit", "does laila match", "compare to this role", "skill match", "fit this role", "requirements for this role"],
        keywordsAr: ["وصف وظيفي", "الوصف الوظيفي", "هل تناسب هذه الوظيفة", "متطلبات الوظيفة", "قارن بالوظيفة"],
        reply: (raw) => matchJD(raw) || `Paste a job description or a list of required skills and I'll scan it against Laila's actual stack. I also recognize Ruby, Go, Rust, Kotlin, Swift, TypeScript, and a bunch of others, even ones she doesn't know yet.`,
        replyAr: (raw) => matchJD(raw) || `الصق وصفاً وظيفياً أو قائمة بالمهارات المطلوبة وسأفحصها مقابل تقنيات ليلى الفعلية. وأتعرّف أيضاً على Ruby وGo وRust وKotlin وSwift وTypeScript وغيرها، حتى ما لا تتقنه بعد.`
      },
      {
        name: "weather",
        keywords: ["weather", "temperature", "raining", "is it hot", "weather in bahrain", "how hot is it", "climate there"],
        keywordsAr: ["الطقس", "درجة الحرارة", "كم الحرارة", "تمطر", "الطقس في البحرين"],
        reply: () => getBahrainWeather(),
        replyAr: () => getBahrainWeather()
      },
      {
        name: "voiceToggle",
        keywords: ["voice on", "voice off", "talk to me", "read replies out loud", "say it out loud", "enable voice", "disable voice", "stop talking", "speak to me"],
        keywordsAr: ["تشغيل الصوت", "إيقاف الصوت", "تكلم معي", "اقرأ الردود بصوت", "توقف عن الكلام"],
        reply: () => {
          const btn = document.getElementById("ai-voice-toggle");
          if (btn) btn.click();
          return `Voice toggled. Watch the speaker icon in the header. If your browser supports speech synthesis, I'll start talking out loud.`;
        },
        replyAr: () => {
          const btn = document.getElementById("ai-voice-toggle");
          if (btn) btn.click();
          return `بدّلت الصوت. راقب أيقونة السمّاعة في الأعلى. إن كان متصفحك يدعم تركيب الكلام، سأبدأ بالحديث بصوت مسموع.`;
        }
      },
      {
        name: "browserIntel",
        keywords: ["what do you know about me", "do you know anything about me", "what time is it for you", "time difference", "what time is it in bahrain", "read my mind", "know about my device", "my location", "guess where i am", "spy on me", "track me", "profile me"],
        keywordsAr: ["كم الساعة", "ماذا تعرف عني", "فرق التوقيت", "الوقت في البحرين", "جهازي", "أين أنا", "تجسس علي"],
        reply: () => browserIntel(),
        replyAr: () => browserIntel()
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

  // Switch first, THEN compose the confirmation, so it comes back in the
  // language the visitor just asked for rather than the one they left.
  function switchLanguage() {
    if (typeof I18N !== "undefined") I18N.toggle();
    return isAr()
      ? `تم — بدّلت لغة الصفحة بالكامل. وزر ع / EN في الشريط العلوي يعيدها متى شئت.`
      : `Done — the whole page just switched language. The ع / EN button in the top bar flips it back any time.`;
  }

  // ---- 1. Real calculator — no keyword match needed, just math ----
  // Accepts Arabic-Indic digits, the Arabic decimal separator, × and ÷, and
  // the usual Arabic ways of asking ("كم يساوي…", "احسب…").
  function toAsciiDigits(s) {
    return String(s)
      .replace(/[٠-٩]/g, (dg) => String(dg.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (dg) => String(dg.charCodeAt(0) - 0x06F0));
  }

  function tryMath(raw) {
    const cleaned = toAsciiDigits(raw)
      .replace(/٫/g, ".")            // Arabic decimal separator
      .replace(/٬/g, "")             // Arabic thousands separator
      .replace(/[×✕]/g, "*")
      .replace(/[÷]/g, "/")
      .replace(/[−–—]/g, "-")
      .replace(/(\d)\s*[xX]\s*(\d)/g, "$1*$2")
      .replace(/كم\s*يساوي|كم\s*يبلغ|ما\s*ناتج|ما\s*هو\s*ناتج|احسب|أحسب|اوجد|أوجد|ناتج/g, "")
      .replace(/what(?:’|')?s\b/gi, "")
      .replace(/what is\b/gi, "")
      .replace(/calculate|solve|compute|equals?/gi, "")
      .replace(/[?=؟]/g, "")
      .trim();
    if (!cleaned || !/^[\d\s+\-*/().%^]+$/.test(cleaned)) return null;
    if (!/[+\-*/%^]/.test(cleaned)) return null;
    try {
      const expr = cleaned.replace(/\^/g, "**");
      const result = Function('"use strict"; return (' + expr + ")")();
      if (typeof result !== "number" || !isFinite(result)) return null;
      // LRM either side: the expression is read left-to-right even when the
      // surrounding message bubble is Arabic
      return `🧮 ‎${cleaned} = ${result}‎`;
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
    // techKnown/techOther are deliberately untranslated: a job description is
    // matched on its Latin technology names whichever language the page is in
    const known = siteData.techKnown.filter((t) => tokenMatches(lower, t.key));
    const other = siteData.techOther.filter((t) => tokenMatches(lower, t.key));
    if (known.length === 0 && other.length === 0) return null;

    const total = siteData.techKnown.length;
    const pct = Math.round((known.length / total) * 100);

    if (isAr()) {
      let msg = `🔍 فحصتُ ذلك مقابل تقنيات ليلى. المطابق: ${known.length ? known.map((t) => t.label).join("، ") : "لا شيء حتى الآن"} (${known.length}/${total} من المهارات المتتبَّعة، تداخل بنحو ${pct}%).`;
      if (other.length) {
        msg += ` ولاحظتُ أيضاً ${other.map((t) => t.label).join("، ")} هناك. ليست ضمن تقنياتها اليوم، لكنها تلتقط اللغات الجديدة بسرعة.`;
      }
      msg += ` يستحق الأمر محادثة حقيقية: راجع قسم "تواصل".`;
      return msg;
    }

    let msg = `🔍 Scanned that against Laila's stack. Matched: ${known.length ? known.map((t) => t.label).join(", ") : "nothing yet"} (${known.length}/${total} tracked skills, ~${pct}% overlap).`;
    if (other.length) {
      msg += ` Also spotted ${other.map((t) => t.label).join(", ")} in there. Not on her stack today, but she picks up new languages fast.`;
    }
    msg += ` Worth a real conversation: check the contact section.`;
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

  const WEATHER_CODES_AR = {
    0: "سماء صافية", 1: "صافية غالباً", 2: "غائمة جزئياً", 3: "غائمة",
    45: "ضباب", 48: "ضباب", 51: "رذاذ خفيف", 53: "رذاذ", 55: "رذاذ كثيف",
    61: "مطر خفيف", 63: "مطر", 65: "مطر غزير", 71: "ثلج خفيف", 73: "ثلج", 75: "ثلج كثيف",
    80: "زخات مطر", 81: "زخات مطر", 82: "زخات عنيفة",
    95: "عاصفة رعدية", 96: "عاصفة رعدية مع بَرَد", 99: "عاصفة رعدية شديدة مع بَرَد"
  };

  async function getBahrainWeather() {
    const ar = isAr();
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=26.13&longitude=50.55&current_weather=true");
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const cw = data.current_weather;
      if (ar) {
        const desc = WEATHER_CODES_AR[cw.weathercode] || "طقس غير معتاد";
        return `🌤️ مباشرةً الآن في البحرين (قرب الرفاع): ${cw.temperature} درجة مئوية، ${desc}، والرياح ${cw.windspeed} كم/س. وهذا جلب حقيقي من واجهة طقس حيّة، لا إجابة معلّبة.`;
      }
      const desc = WEATHER_CODES[cw.weathercode] || "unusual weather";
      return `🌤️ Live right now in Bahrain (near Riffa): ${cw.temperature}°C, ${desc}, wind ${cw.windspeed} km/h. That's a real fetch to a live weather API, not a canned answer.`;
    } catch (e) {
      return ar
        ? "تعذّر الوصول إلى تغذية الطقس الحيّة الآن. ربما تكون متوقفة. جرّب بعد قليل."
        : "Couldn't reach the live weather feed just now. It might be offline. Try again in a bit.";
    }
  }

  // ---- 4. Browser/device/timezone trick — real, disclosed, mostly permission-free ----
  function parseBrowser(ua) {
    if (/Edg\//.test(ua)) return "Edge";
    if (/OPR\//.test(ua)) return "Opera";
    if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
    if (/Firefox\//.test(ua)) return "Firefox";
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return "Safari";
    return isAr() ? "متصفح غير معروف" : "an unrecognized browser";
  }

  function parseOS(ua) {
    if (/Windows NT 10/.test(ua)) return "Windows 10/11";
    if (/Windows NT/.test(ua)) return "Windows";
    if (/Mac OS X/.test(ua)) return "macOS";
    if (/Android/.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Linux/.test(ua)) return "Linux";
    return isAr() ? "نظام تشغيل غير معروف" : "an unknown OS";
  }

  // Only fires when the visitor explicitly asks — triggers the browser's
  // native permission prompt, so nothing here is silent or hidden.
  function tryGeolocate() {
    const localityLanguage = isAr() ? "ar" : "en";
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localityLanguage}`);
            const data = await res.json();
            const place = [data.city || data.locality, data.countryName].filter(Boolean).join(isAr() ? "، " : ", ");
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
    const ar = isAr();
    const locale = ar ? "ar-BH-u-nu-latn" : "en-US";
    const now = new Date();
    const timeOpts = { hour: "2-digit", minute: "2-digit" };

    let visitorTime = now.toLocaleTimeString(locale, timeOpts);
    let visitorTZ = ar ? "منطقة زمنية غير معروفة" : "an unknown timezone";
    let bahrainTime = ar ? "غير معروف" : "unknown";
    try {
      visitorTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
      bahrainTime = now.toLocaleTimeString(locale, Object.assign({ timeZone: "Asia/Bahrain" }, timeOpts));
    } catch (e) { /* ignore */ }

    const ua = navigator.userAgent;
    const browser = parseBrowser(ua);
    const os = parseOS(ua);
    const deviceType = /Mobi|Android/i.test(ua)
      ? (ar ? "هاتف" : "mobile")
      : (window.matchMedia("(pointer: coarse)").matches
        ? (ar ? "جهاز لمسي" : "touch device")
        : (ar ? "حاسوب مكتبي" : "desktop"));
    const screenInfo = `${window.screen.width}×${window.screen.height}`;
    const viewportInfo = `${window.innerWidth}×${window.innerHeight}`;
    const lang = navigator.language || (ar ? "لغة غير معروفة" : "an unknown language");
    const cores = navigator.hardwareConcurrency
      ? (ar ? `${navigator.hardwareConcurrency} نواة معالجة` : `${navigator.hardwareConcurrency} CPU cores`)
      : null;
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const colorScheme = dark ? (ar ? "الداكن" : "dark") : (ar ? "الفاتح" : "light");
    let ref = ar ? "زيارة مباشرة، بلا مُحيل" : "a direct visit, no referrer";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ref; } catch (e) { /* ignore */ }
    const secondsHere = Math.max(1, Math.round(performance.now() / 1000));
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
    const visits = parseInt(localStorage.getItem("laila-visit-count") || "1", 10);

    const lines = ar ? [
      `⏱️ الساعة ${visitorTime} بتوقيتك (${visitorTZ})، و${bahrainTime} في البحرين حيث ليلى.`,
      `💻 ${browser} على ${os}، ${deviceType}. الشاشة ${screenInfo}، ونافذة العرض ${viewportInfo}.`,
      `🌐 اللغة: ${lang}${cores ? " · " + cores : ""} · ويبدو أنك تفضّل الوضع ${colorScheme}.`,
      `🔗 وصلت إلى هنا عبر: ${ref}.`,
      `📜 ${secondsHere} ثانية على هذه الصفحة حتى الآن، وقد مرّرت ${scrollPct}%.`
    ] : [
      `⏱️ It's ${visitorTime} your time (${visitorTZ}), and ${bahrainTime} in Bahrain, where Laila is.`,
      `💻 ${browser} on ${os}, ${deviceType}. Screen ${screenInfo}, viewport ${viewportInfo}.`,
      `🌐 Language: ${lang}${cores ? " · " + cores : ""} · you seem to prefer ${colorScheme} mode.`,
      `🔗 You got here via: ${ref}.`,
      `📜 ${secondsHere}s on this page so far, scrolled ${scrollPct}%.`
    ];

    if (visits > 1) {
      lines.push(ar
        ? `👋 يبدو أن هذه الزيارة رقم ${visits} من هذا المتصفح. أتذكّر ذلك محلياً، على جهازك وحده.`
        : `👋 This looks like visit #${visits} from this browser. I remember, locally, on your device only.`);
    }

    const place = await tryGeolocate();
    if (place) {
      lines.push(ar
        ? `📍 وبما أنك سمحت بذلك: أنت قرب ${place}.`
        : `📍 And since you allowed it: you're near ${place}.`);
    }

    lines.push(ar
      ? `\nكل ما سبق معلومات متصفح قياسية (إضافة إلى الموقع فقط إن كنت قد وافقت على طلب الإذن للتو). لا شيء منها يغادر هذه الصفحة أو يُخزَّن في أي مكان، عدا عدّاد الزيارات الذي يعيش في التخزين المحلي لمتصفحك وحده.`
      : `\nAll of that is standard browser info (plus location only if you just approved the permission prompt). Nothing leaves this page or gets stored anywhere except that visit counter, which lives only in your browser's local storage.`);

    return lines.join("\n");
  }

  function norm(s) {
    return typeof I18N !== "undefined" ? I18N.normalize(s) : String(s).toLowerCase().trim();
  }

  const LATIN_ONLY = /^[\x20-\x7E]+$/;

  /* Does `needle` (already normalised) occur in `text` (already normalised)?

     Arabic matches as a plain substring — JS word boundaries are defined on
     ASCII word characters, so \b never fires between two Arabic letters and
     would break every Arabic keyword.

     Short Latin keywords have to be whole words. Without that, "yo" matches
     "you" and "hi" matches "this", which is why "How do I contact you?" —
     one of the suggestion chips — used to be answered with a greeting.
     Keywords longer than four characters still match as prefixes, so
     "project" catches "projects" and "technolog" catches "technologies". */
  function keywordHit(text, needle) {
    if (!LATIN_ONLY.test(needle)) return text.includes(needle);
    const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("\\b" + esc + (needle.length <= 4 ? "\\b" : ""), "i").test(text);
  }

  function respond(message) {
    const ar = isAr();
    const text = norm(message);
    if (!text) {
      return ar
        ? "اسألني شيئاً. جرّب \"من هي ليلى\" أو \"أرني المشاريع\"."
        : "Ask me something. Try \"who is Laila\" or \"show me projects\".";
    }

    const mathResult = tryMath(message);
    if (mathResult !== null) return mathResult;

    let best = null;
    let bestScore = 0;

    // both pools always: an Arabic question still works on the English page
    for (const intent of intents()) {
      let score = 0;
      const pools = [intent.keywords || [], intent.keywordsAr || []];
      for (const pool of pools) {
        for (const kw of pool) {
          const needle = norm(kw);
          if (needle && keywordHit(text, needle)) score += needle.split(" ").length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }

    if (best) {
      const fn = (ar && best.replyAr) ? best.replyAr : best.reply;
      const reply = fn(message);
      if (best.action) best.action();
      return reply;
    }

    // Smart fallback: a long pasted block (e.g. a job posting) gets scanned
    // for tech keywords automatically, instead of just giving up.
    if (message.trim().split(/\s+/).length > 8) {
      const jd = matchJD(message);
      if (jd) return jd;
    }

    return ar
      ? `لم ألتقط ذلك تماماً. جرّب السؤال عن مهارات ${D().name} أو مشاريعها أو كيفية التواصل معها. أو الصق وصفاً وظيفياً، أو اسألني مسألة حسابية، أو قل "فاجئني".`
      : `I didn't quite catch that. Try asking about ${D().name}'s skills, projects, or how to get in touch. Paste a job description, ask me a math question, or say "surprise me".`;
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
