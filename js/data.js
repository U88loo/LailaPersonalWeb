/* =========================================================
   siteData — EDIT ME
   This is the only file you should need to touch to make
   this site actually about you. Everything below is rendered
   dynamically by js/app.js and js/ai-assistant.js.
   ========================================================= */

const siteData = {
  name: "Laila",
  fullName: "Laila Mahmood Haji",
  initials: "L",

  roles: [
    "Software Engineer",
    "Design-Minded Builder",
    "Testing Enthusiast",
    "AI Explorer",
    "Problem Solver"
  ],

  about:
    "I'm a software engineering graduate who enjoys working with teams on projects " +
    "that actually solve problems. I'm especially drawn to design, testing, and " +
    "artificial intelligence — and how those three can work together in practical " +
    "ways. I like getting into the details: troubleshooting, testing ideas, and " +
    "learning from what goes wrong. I'm always looking to pick up new skills, even " +
    "outside my academic field or job scope.",

  location: "Riffa, Bahrain",
  focus: "B.Sc. Software Engineering, University of Bahrain — graduated September 2026. Exploring where design, testing, and AI overlap",
  status: "Currently building: things that (hopefully) don't break in testing 🧪",

  email: "Liihj323@gmail.com",
  resumeUrl: "assets/LailaHajiResume.pdf",

  education: {
    degree: "B.Sc. in Software Engineering",
    school: "University of Bahrain",
    period: "09/2022 - 09/2026",
    gpa: "3.44 / 4"
  },

  courses: [
    {
      emoji: "🔗",
      name: "Parallel Computing with MPI",
      provider: "University of Colorado Boulder (Coursera)",
      date: "May 2026",
      url: "https://coursera.org/verify/1PDQ08FBIV1N"
    },
    {
      emoji: "🧵",
      name: "Concurrent and Parallel Programming in Python",
      provider: "Packt (Coursera)",
      date: "May 2026",
      url: "https://coursera.org/verify/A76BUBP5A4GY"
    },
    {
      emoji: "⚡",
      name: "Fundamentals of Accelerated Computing with Modern CUDA C++",
      provider: "NVIDIA",
      date: "April 2026",
      url: "https://learn.nvidia.com/certificates?id=AeWgbO8rQTKF3g1XWB2Jmw"
    },
    {
      emoji: "🤖",
      name: "Learn & Build Machine Learning Models with Python",
      provider: "EDUCBA (Coursera)",
      date: "March 2026",
      url: "https://coursera.org/verify/15XCOM9O69A8"
    },
    {
      emoji: "☁️",
      name: "AWS Academy Cloud Foundations",
      provider: "AWS Academy",
      date: "",
      url: ""
    }
  ],

  whatsapp: "+973 3232 3768",

  // TODO: swap in your real GitHub handle
  social: [
    { label: "GitHub", url: "https://github.com/U88loo", icon: "github" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/laila-haji-31a6343bb", icon: "linkedin" },
    { label: "Email", url: "mailto:Liihj323@gmail.com", icon: "mail" },
    { label: "WhatsApp", url: "https://wa.me/97332323768", icon: "whatsapp" }
  ],

  skills: [
    { name: "JavaScript", level: 85 },
    { name: "Java", level: 88 },
    { name: "Python", level: 78 },
    { name: "C++ / C#", level: 75 },
    { name: "HTML & CSS", level: 90 },
    { name: "SQL / MySQL", level: 82 },
    { name: "UML & System Design", level: 85 },
    { name: "Software Testing (JUnit)", level: 80 }
  ],

  marquee: [
    "JavaScript", "Java", "Python", "C++", "C#", "Flutter", "HTML/CSS",
    "SQL & MySQL", "Git & GitHub", "UML & System Design", "Software Testing",
    "AWS Cloud", "Machine Learning", "CUDA", "MPI", "Parallel Computing"
  ],

  projects: [
    {
      emoji: "💊",
      title: "Dosely — AI Medication Safety Scanner",
      description: "Scan a medicine label and get an instant safe / caution / not-safe verdict, checked against your health profile and explained by Pillo, the AI assistant. Built with AI, OCR, Flutter, and Firebase.",
      tags: ["Flutter", "Firebase", "AI / OCR", "Team Project"],
      link: "#",

      // Having a `details` object turns the card into a case-study popup
      // instead of a link. Any other project can get one the same way —
      // every section below is optional.
      details: {
        tagline: "Smarter, safer medication — one scan at a time.",
        role: "Senior project · Team of three · University of Bahrain",
        overview: [
          "Ever stared at a medicine label and had no idea what you were reading? Dosely turns that confusion into clarity. Point your camera at any medication and the app reads the label, identifies the drug, and tells you what it treats, how to take it, what the side effects are, and whether it's safe alongside everything else you're already taking.",
          "It's more than a scanner. Dosely remembers your medical history, learns your routine, and keeps you on track with Pillo — an AI assistant that answers plain-language questions and makes sure a dose never gets missed."
        ],
        highlights: [
          { emoji: "📷", title: "Smart Scan", text: "Google ML Kit reads any prescription label via OCR, then Gemini checks it against your profile." },
          { emoji: "🛡️", title: "Interaction Shield", text: "Every new medication is cross-checked against your existing ones, flagging dangerous combinations before they happen." },
          { emoji: "⏰", title: "Schedule & Remind", text: "Custom dose schedules with timezone-aware push notifications." },
          { emoji: "💬", title: "Chat with Pillo", text: "Ask about side effects, timing, or a missed dose and get answers personalised to your medications." },
          { emoji: "🔒", title: "Private by default", text: "Conditions, allergies, and history stored securely in Firebase behind App Check." }
        ],
        steps: [
          "Build your profile — conditions, allergies, and current medicines.",
          "Scan your meds with the camera, prescription or over-the-counter.",
          "Get instant AI checks on interactions, dosage, and risk.",
          "Schedule and track doses, and stay consistent."
        ],
        stack: [
          { group: "Framework", items: ["Flutter", "Dart 3.10", "Provider", "Cupertino"] },
          { group: "AI / ML", items: ["Gemini AI", "Google ML Kit", "OCR"] },
          { group: "Backend", items: ["Firebase Auth", "Firestore", "Cloud Functions", "App Check", "Node.js 24"] }
        ],
        team: ["Eman Al-Asaadi", "Nooralhuda Mansoor", "Laila Haji"],
        videos: [
          { src: "assets/dosely.mp4", label: "App demo", length: "1:14" },
          { src: "assets/dosely-walkthrough.mp4", label: "Full walkthrough", length: "1:46" }
        ],
        links: [
          { label: "Visit the Dosely site", url: "https://u88loo.github.io/dosely-site/" }
        ]
      }
    },
    {
      emoji: "🏥",
      title: "Aisha Yateem Family Counselling Centre — Case Management System",
      description: "A full-stack platform for a clinic's social & family counseling services — patient intakes, case logs, appointments, staff messaging, and multilingual PDF/Word/Excel exports.",
      tags: ["React", "Node.js", "SQLite", "Full-Stack"],
      badge: "Live — in use",
      link: "#",

      details: {
        tagline: "One record per patient, in the language the clinic actually works in.",
        role: "Sole developer · Full stack + deployment · In production, on-premise",
        overview: [
          "A bilingual, Arabic-first clinical records and case management platform, built end to end for a social and psychological counselling clinic in Bahrain. It runs as a Windows service on the department's own server, used daily by clinical staff.",
          "Before it existed, the clinic ran on paper forms and scattered spreadsheets. Every patient moving through intake, triage, social services, psychological counselling and family counselling generated a different official form — each with its own layout, its own monthly reporting obligation, and its own unit keeping records nobody else could see.",
          "The system consolidates all of that into one record per patient with a full case timeline, and generates the clinic's real official documents straight out of the stored data. Written Arabic-first with right-to-left layout throughout, because that's the language the staff actually work in."
        ],
        stats: [
          { value: "53k", label: "lines of application code" },
          { value: "255", label: "JS / JSX source files" },
          { value: "47", label: "relational tables" },
          { value: "38", label: "REST route modules" },
          { value: "37", label: "Word document templates" },
          { value: "6", label: "staff roles" },
          { value: "3,150", label: "translation keys per locale" },
          { value: "100%", label: "offline — no cloud" }
        ],
        highlights: [
          { emoji: "🗂️", title: "Patient & case records", ar: "ملفات المرضى والحالات", text: "Central patient registry with CPR identity and demographics, plus a branching case timeline reconstructing every event in a patient's journey." },
          { emoji: "🧾", title: "Clinical unit files", ar: "الملف الاجتماعي والنفسي", text: "Structured, sectioned case files for social services, psychological counselling and family counselling — each with its own section schema and completeness tracking." },
          { emoji: "↗️", title: "Referrals", ar: "الإحالات", text: "Internal referrals between units plus external, psychological, family and legal-support referral forms, each with its own log and printable document." },
          { emoji: "📅", title: "Appointments & sessions", ar: "المواعيد والجلسات", text: "Booking with a guided session flow, attendance marking, status-reason capture, and missing-field prompts before a session can be closed out." },
          { emoji: "🎪", title: "Events calendar", ar: "الفعاليات", text: "Multi-doctor events, staff-submitted event requests with an approval path, and a month calendar view." },
          { emoji: "📥", title: "Intake & PDF import", ar: "استمارة طلب الخدمة", text: "Service-request intakes, including automatic field extraction from the clinic's exported Arabic Google Forms PDFs." },
          { emoji: "📊", title: "Case logs & reporting", ar: "الحالات اليومية والتقارير", text: "Per-unit daily case logs auto-seeded from attended appointments, monthly exports, unit reports, and a composite report builder over any date period." },
          { emoji: "📋", title: "Administrative logs", ar: "السجلات الإدارية", text: "Reception, management, maintenance, team follow-ups, task follow-ups and inter-agency coordination logs." },
          { emoji: "💬", title: "Internal messaging", ar: "المراسلات", text: "Real-time staff chat with direct and broadcast conversations, @mentions, reactions, typing indicators and live presence." },
          { emoji: "✅", title: "Shared task lists", ar: "المهام", text: "To-do lists attached to conversations, with per-role permissions over who can create, assign and complete items." },
          { emoji: "🛠️", title: "Custom form builder", ar: "استمارات مخصصة", text: "Staff define their own log tables — title, columns, and which roles may see them — which then behave like every built-in table." },
          { emoji: "🧮", title: "Consultant workspace", ar: "جداول الاستشاري", text: "An isolated spreadsheet environment with Excel-style formulas, for a consultant role that must never touch patient data." }
        ],
        sections: [
          {
            title: "Engineering highlights",
            items: [
              { emoji: "🔤", title: "Arabic PDF text extraction", text: "The clinic's intake forms arrive as Google Forms PDF exports whose text layer emits each answer before its question label, and stores Arabic as presentation-form code points in visual, mirrored order — so ordinary label matching finds nothing. A positional parser strips known boilerplate against raw glyph fragments, then applies NFKC normalisation and Farsi/Urdu letter folding to recover clean Arabic values and pre-fill the intake form for an admin to review." },
              { emoji: "🧮", title: "Spreadsheet formula engine", text: "The consultant workspace evaluates Excel-style formulas over a sparse cell map, resolving referenced cells on demand. A call-stack set tracks cells mid-evaluation, so circular references resolve to #REF! instead of recursing until the tab freezes." },
              { emoji: "🔁", title: "Self-healing schema migrations", text: "The database upgrades itself on every boot: ~40 idempotent migrations run in order, each guarded by a migrations ledger or by inspecting the table schema first, including full table rebuilds inside transactions to repair foreign keys SQLite cannot alter in place. A fresh install and a two-year-old database converge on the same schema with no manual step." },
              { emoji: "🚦", title: "Migration / request race elimination", text: "The HTTP listener only opens after migrations resolve, so a client reconnecting the instant the service restarts can never hit a query against a column that doesn't exist yet. A process-level rejection handler backs that up, so one unanticipated database error fails a single request instead of taking the server down for everyone." },
              { emoji: "📄", title: "Document generation", text: "37 official forms — social research reports, psychological case studies, referral letters, attendance certificates, monthly summaries — generated as Word documents from stored records, plus Excel and PDF export paths, all preserving right-to-left layout." },
              { emoji: "⏳", title: "Age-out alert ladder", text: "Patients age out of the clinic's care at 60. A monthly countdown starts at 59 years 6 months, where each milestone key embeds years and months so it re-alerts once a month on its own rather than being permanently dismissed — shared by the alerts endpoint and the notification feed from a single source of truth." },
              { emoji: "🟢", title: "Real-time presence", text: "Socket.IO connections authenticate with the same JWT as the REST API. Presence tracks a set of sockets per user rather than a boolean, so someone with three tabs open only shows offline once the last one closes; a personal room per user lets a brand-new conversation be pushed to a recipient before their client knows it exists." },
              { emoji: "🌐", title: "Network-agnostic frontend", text: "The client derives its API origin from the host the browser loaded it from, so the same build works on localhost, on a laptop's changing LAN IP, and on the department server with no rebuild or config edit. In production the backend serves the built frontend itself, collapsing the app to one origin and one port." }
            ]
          },
          {
            title: "Access control & audit",
            items: [
              { emoji: "👥", title: "Six-role model", text: "Director/supervisor, reception, triage, and two counselling units each see a different subset of the system, driven by role middleware and per-unit checks rather than by hiding UI. Individual capabilities can also be granted per staff member from an admin panel." },
              { emoji: "🚧", title: "Isolation by middleware, not by patching", text: "A sixth role — an external consultant — was added to a codebase whose 40+ route files all assumed any authenticated user was clinical staff. Rather than audit every one by hand, a path allowlist inside the single authentication middleware every protected route already passes through makes the consultant's token structurally incapable of reaching patient data, whichever route is called." },
              { emoji: "👁️", title: "Patient access audit trail", text: "Every time a staff member opens a patient record it's logged, with a five-minute de-duplication window so tab switches and refetches collapse into one entry — keeping the trail meaningful rather than flooded, and reviewable by the director from a dedicated page." },
              { emoji: "🎭", title: "Audited account switching", text: "The director can open the system as any staff account without their password, to see exactly what they see. Every switch writes a row to an impersonation log recording who acted as whom, and when." },
              { emoji: "🔑", title: "Credential handling", text: "Passwords are bcrypt-hashed and never returned by any endpoint; sessions are short-lived signed JWTs re-validated against the live user row on every request, so revoking or changing an account takes effect immediately rather than at token expiry." }
            ]
          },
          {
            title: "Data protection & backup",
            intro: "The clinic holds confidential case records on a machine in its own building, with no IT department behind it. Backups had to be automatic, encrypted at rest, and recoverable by a non-technical user.",
            items: [
              { emoji: "🔐", title: "Authenticated encryption", text: "Every file written to disk outside the live database — database snapshots, staff exports, patient exports — is encrypted with AES-256-GCM first. GCM was chosen over plain AES so tampering is detectable, not just unreadable: a modified backup fails its authentication tag instead of silently decrypting to corrupted records. Everything needed to decrypt travels inside the file; only the key lives outside it." },
              { emoji: "🌙", title: "Nightly, without anyone remembering", text: "A PowerShell installer registers a Windows Scheduled Task that runs the backup at 2:00 AM daily as SYSTEM, with start-when-available so a machine that was off at 2 AM still backs up when it returns." },
              { emoji: "🕰️", title: "Encrypted, timestamped snapshots", text: "Each run writes the full database to a timestamped encrypted file, so restore points accumulate rather than a single backup being overwritten by a bad night's data." },
              { emoji: "♻️", title: "A restore path a non-developer can follow", text: "A companion decrypt script turns any encrypted backup or export back into a usable file — a database to restore, or a spreadsheet to open in Excel — and tells the operator in plain language to delete the plaintext copy afterwards." },
              { emoji: "⚠️", title: "Honest about what it doesn't solve", text: "The installer finishes by warning that backups sitting on the same disk as the live data are lost with that disk, and that the encryption key must be kept somewhere separate — because without it, a backup file can never be opened again by anyone." }
            ]
          },
          {
            title: "Deployment & operations",
            items: [
              { emoji: "⚙️", title: "One-command installer", text: "A PowerShell script takes a bare Windows machine to a running system: verifies administrator rights and Node.js, refuses to continue while configuration still contains placeholder values, installs both dependency trees, builds the frontend, and registers the service. Safe to re-run — every step detects work already done and skips it." },
              { emoji: "🖥️", title: "Runs as a real Windows service", text: "Registered through NSSM with automatic start, so the system comes back on its own after every reboot and power cut with nobody logged in. Standard output and errors are captured to rotating 5 MB log files." },
              { emoji: "📘", title: "Written for the person who runs it", text: "The installer detects and prints the server's LAN address for staff, and hands over the exact firewall rule to run if they can't reach it. A plain-language deployment guide covers moving the system, keeping real data intact during updates, and day-to-day commands — written for a clinic administrator, not an engineer." },
              { emoji: "🔌", title: "Fully offline capable", text: "No cloud services, no external APIs, no internet dependency at runtime. Patient data never leaves the building — a requirement, not a limitation, for confidential health and social casework." }
            ]
          }
        ],
        stack: [
          { group: "Backend", items: ["Node.js", "Express 4", "ES modules", "SQLite", "Socket.IO", "JWT", "bcrypt", "Multer", "Node crypto"] },
          { group: "Frontend", items: ["React 18", "Vite 5", "Tailwind CSS", "React Router", "i18next", "Axios", "Socket.IO client"] },
          { group: "Documents", items: ["docx", "SheetJS / xlsx", "jsPDF", "jspdf-autotable", "pdf-parse", "html2canvas", "hot-formula-parser"] },
          { group: "Operations", items: ["PowerShell", "NSSM", "Windows Task Scheduler", "AES-256-GCM"] },
          { group: "Localisation", items: ["Arabic (primary)", "English", "Full RTL layout"] }
        ],
        videos: [
          { src: "assets/Video%20Project%204.mp4", label: "System walkthrough" }
        ]
      }
    },
    {
      emoji: "🔧",
      title: "YaldaAuto — Shop Management System",
      description: "Self-hosted system that runs a car-accessories and window-tinting shop end to end — stock with low-stock alerts, sales, customer balances, PDF invoices, and a workshop diary. Money is stored as integer minor units so no total passes through floating point, and the whole UI is localised in English, Arabic and Persian with full right-to-left layout.",
      tags: ["Node.js", "Express", "SQLite", "i18n / RTL"],
      badge: "Live — in use",
      link: "#"
    },
    {
      emoji: "📚",
      title: "Library Management System",
      description: "Java-based system to manage books, users, and borrowing records — led the team and tested core features.",
      tags: ["Java", "Team Lead", "Testing"],
      link: "#"
    },
    {
      emoji: "🚗",
      title: "Car Rental & Airline Management (SRS)",
      description: "Designed system requirements, GUI, and UML diagrams for a car rental platform, plus a full SRS for an airline reservation system.",
      tags: ["UML", "SRS", "System Design"],
      link: "#"
    },
    {
      emoji: "💾",
      title: "Charity Management System Database",
      description: "Designed the database structure and wrote SQL queries to manage charity records and relationships.",
      tags: ["SQL", "Database Design"],
      link: "#"
    },
    {
      emoji: "🌐",
      title: "Cruzer — Open-Source Car Rental",
      description: "Contributed frontend work and documentation to an open-source car rental site, including a responsive Help & FAQ system.",
      tags: ["Full-Stack", "Open Source", "Frontend"],
      link: "#"
    }
  ],

  // Used by the AI's job-description / skill matcher (see js/ai-assistant.js).
  // techKnown = things actually on Laila's resume. techOther = a much wider
  // pool of languages/frameworks the matcher can still *recognize* in pasted
  // text even though they're not her skills — so it can honestly say
  // "this JD also mentions Ruby / Go / Rust" instead of staying silent.
  techKnown: [
    { key: "javascript", label: "JavaScript" },
    { key: "java", label: "Java" },
    { key: "python", label: "Python" },
    { key: "c++", label: "C++" },
    { key: "c#", label: "C#" },
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "sql", label: "SQL" },
    { key: "mysql", label: "MySQL" },
    { key: "flutter", label: "Flutter" },
    { key: "node", label: "Node.js" },
    { key: "express", label: "Express" },
    { key: "sqlite", label: "SQLite" },
    { key: "git", label: "Git" },
    { key: "github", label: "GitHub" },
    { key: "uml", label: "UML" },
    { key: "testing", label: "Software Testing" },
    { key: "junit", label: "JUnit" },
    { key: "maven", label: "Maven" },
    { key: "aws", label: "AWS" },
    { key: "machine learning", label: "Machine Learning" },
    { key: "cuda", label: "CUDA" },
    { key: "mpi", label: "MPI" },
    { key: "parallel computing", label: "Parallel Computing" },
    { key: "concurrency", label: "Concurrency" },
    { key: "firebase", label: "Firebase" },
    { key: "ocr", label: "OCR" },
    { key: "json", label: "JSON" }
  ],
  techOther: [
    { key: "ruby", label: "Ruby" },
    { key: "ruby on rails", label: "Ruby on Rails" },
    { key: "golang", label: "Go" },
    { key: "rust", label: "Rust" },
    { key: "kotlin", label: "Kotlin" },
    { key: "swift", label: "Swift" },
    { key: "typescript", label: "TypeScript" },
    { key: "php", label: "PHP" },
    { key: "scala", label: "Scala" },
    { key: "dart", label: "Dart" },
    { key: "elixir", label: "Elixir" },
    { key: "haskell", label: "Haskell" },
    { key: "perl", label: "Perl" },
    { key: "matlab", label: "MATLAB" },
    { key: "objective-c", label: "Objective-C" },
    { key: "shell", label: "Shell" },
    { key: "bash", label: "Bash" },
    { key: "powershell", label: "PowerShell" },
    { key: "lua", label: "Lua" }
  ],

  jokes: [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "There are only 10 types of people: those who understand binary and those who don't.",
    "I told my computer I needed a break, and now it won't stop sending me KitKats.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "!false — it's funny because it's true."
  ]
};
