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
    { label: "GitHub", url: "#", icon: "github" },
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
      link: "#"
    },
    {
      emoji: "🏥",
      title: "Aisha Yateem Family Counselling Centre — Case Management System",
      description: "A full-stack platform for a clinic's social & family counseling services — patient intakes, case logs, appointments, staff messaging, and multilingual PDF/Word/Excel exports.",
      tags: ["React", "Node.js", "SQLite", "Full-Stack"],
      badge: "Live — in use",
      link: "#"
    },
    {
      emoji: "🔧",
      title: "YaldaAuto — Shop Management System",
      description: "Self-hosted system that runs a car-accessories and window-tinting shop end to end — stock with low-stock alerts, sales, customer balances, PDF invoices, and a workshop diary. Money is stored as integer minor units so no total passes through floating point, and the whole UI is localised in English, Arabic and Persian with full right-to-left layout.",
      tags: ["Node.js", "Express", "SQLite", "i18n / RTL"],
      badge: "Solo build",
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
