# laila.OS — personal site

A self-contained, no-build-step personal website. Open `index.html` directly
in a browser, or serve it with anything static.

## What's in here

The page plays like a short film as you scroll: an opening poster, then
seven scenes. A HUD in the corner shows the scene you're in and a
timecode that runs with the scroll.

| Scene | What happens |
|---|---|
| **00 · opening titles** | The waving poster (`js/poster.js`). A storm of capitals streams past and shutters away, the letters of **L [A] ILA / H [A] JI** roll into place like slot reels around one giant shared *A*, the labels decode, and a hand-inked character rises from the baseline and waves. Hover a letter to re-roll it, hover or click her to wave back (her eyes follow the pointer), click the dice to roll them, click the paper to throw letters, click the signature to replay the intro. She waves again whenever you scroll back up to her. |
| **01 · the premise** | Pinned and scrubbed: the titles blur back, a deep navy card rises and fills the screen, a phone flies in counting up to 74k lines shipped, then the card pulls back and leaves to reveal the call to action. The card's sheen and the phone follow the pointer. |
| **02 · the headline** | The *Akhbar Al Khaleej* clipping (21 September 2026) spins in like a front page in an old film, then a camera pushes in on the headline, the photo and the paragraphs while subtitles translate the Arabic. Ends on a *featured* stamp and a link to the case study. |
| **03 · the person** | The bio lights up word by word, at the pace you scroll. |
| **04 · the work** | A film strip, pinned and pulled sideways, one project per frame (sprocket holes included). Frames with a case study open it. Stacks into a grid on narrow screens. |
| **05 · the toolkit** | Skill bars plus two giant marquee rows scrubbed by the scroll. |
| **06 · the credentials** | Certificates as cinema tickets, dealt onto the table. |
| **07 · the end?** | Contact links, then end credits. "Replay the opening" rewinds the whole film. |

The nav and HUD dim ("lights down") while a dark scene fills the screen.

Motion is **opt-in**. `js/cinema.js` only adds `html.cine` — which
switches every scene to its layered, pinned layout — once GSAP has
loaded and the visitor hasn't asked for reduced motion. Without it each
scene falls back to a plain stacked layout, so nothing is ever hidden
behind an animation that can't run. Every scene is built inside one
`gsap.matchMedia()`, so a breakpoint change or a language switch tears
the whole film down and rebuilds it against the new layout, and the
reader stays where they were.

**Editing the newspaper scene:** each beat in `siteData.press.beats`
(`js/data.js`) is one camera move and one subtitle. `focus` is the
region the camera pushes in on, in pixels of the 1080 × 1350 scan
(`x`/`y` its centre, `w`/`h` its size). Add, remove or re-aim beats
there; the timeline is built from the list.

Also on the page:

- **Custom cursor** — a lagging ring + dot, disabled automatically on
  touch devices.
- **Generative background** — a lightweight canvas particle field that
  drifts and links nearby nodes, reacting subtly to the mouse, under a
  whisper of animated film grain.
- **laila.ai** — a floating command palette (press `Ctrl`/`Cmd + K`, click
  the orb bottom-right, or the "ask laila.ai" nav button). It's a
  rule-based keyword matcher, not a real model call — see
  `js/ai-assistant.js`. There's a commented `askRemote()` stub in that
  file if you want to wire it up to a real API later.
- **Konami code** — try `↑ ↑ ↓ ↓ ← → ← → B A` anywhere on the page.
- **Light/dark toggle** — top-right icon button; preference is remembered.
- **English / العربية** — the `ع` button in the nav switches the whole page,
  including full right-to-left layout and the assistant. See below.

## Languages

The site ships in English and Arabic. The toggle sets `lang` and `dir` on
`<html>` and re-renders in place — no reload, and the scroll position and
any open case study are kept. The choice is remembered in `localStorage`;
a first-time visitor whose browser asks for Arabic gets Arabic. A tiny
inline script in `<head>` applies the saved direction before first paint,
so there's no left-to-right flash.

Three pieces:

- **`js/i18n.js`** — the engine, plus the `ui` dictionary for the chrome
  (nav, buttons, headings, labels). Read with `I18N.t("key")`.
- **`js/data.ar.js`** — the Arabic content, written as a *sparse overlay*
  merged onto `siteData` key by key and array element by array element.
  It carries only translatable strings, so URLs, emojis, skill levels,
  video paths and technology names are never duplicated and can't drift.
  Leave a field out and the English one shows through.
- **`css/style.css`** — the `ARABIC / RTL` block at the bottom. Most of
  the mirroring is free, because the side-specific rules are written as
  logical properties (`inset-inline-*`, `padding-inline-*`,
  `border-end-*-radius`). The block holds only what those can't express:
  the Arabic typeface (IBM Plex Sans Arabic — neither Space Grotesk nor
  JetBrains Mono has Arabic glyphs), looser line-height, `direction: ltr`
  islands for version numbers and stat values, and the two keyframes
  whose `translateX` is physical rather than logical.

**Adding a language:** add a code to `SUPPORTED` (and `RTL` if it needs
it) in `js/i18n.js`, add a dictionary beside `ui.en`, and add a data
overlay like `js/data.ar.js`. Nothing else has to change.

The assistant is bilingual too. Each intent in `js/ai-assistant.js` carries
`keywords`/`keywordsAr` and `reply`/`replyAr`. Matching always scans both
keyword pools, so an Arabic question is understood while the page is in
English and vice versa — only the answer follows the current language.
Arabic input is folded through `I18N.normalize()` first, which collapses
the hamza / ta-marbuta / alif-maqsura spellings people actually type, so
`احكِ لي نكتة` and `احكي لي نكته` reach the same intent. The calculator
accepts Arabic-Indic digits and `×` / `÷`.

## Make it yours

Almost everything is in **`js/data.js`** — name, bio, location, email,
social links, skills, projects, and jokes. Edit that one file first.

Then:
- `siteData.resumeUrl` → point it at a real PDF.
- `siteData.social` → replace the placeholder URLs.
- `js/data.ar.js` → the Arabic of whatever you changed. Only the fields
  you want translated; the rest falls through to `js/data.js`.
- `css/style.css` → the palette lives in the `:root` block at the top.

Both `index.html` and the `?v=` query strings on its `<script>`/`<link>`
tags are cache-busters — bump the number after editing a JS or CSS file
so browsers fetch the new copy.

## Palette

A formal, low-saturation system — one dominant neutral pair, one accent,
one status colour:

| | Hex | RGB | Job |
|---|---|---|---|
| Navy | `#13232F` | 19, 35, 47 | the ink; the ground in dark mode |
| Bone | `#F4F2ED` | 244, 242, 237 | the paper — warm off-white, never stark |
| White | `#FFFFFF` | 255, 255, 255 | cards, so they lift off the paper |
| Brass | `#A77B36` | 167, 123, 54 | the single accent, used sparingly |
| Sage | `#3F6B52` | 63, 107, 82 | status only — "live / in progress" |

Every other value is a step on one of two ramps: the cool one runs navy →
slate (`--navy-950` … `--navy-300`), the warm one brass → pale brass. Mid
steps are fills; the darker steps (`-700`, `-800`) are what text uses, so
nothing pale ever ends up carrying small type.

The formality comes from restraint rather than from the hues: saturation
stays low, the accent appears in small doses (kickers, links, rules,
dots), and **gradients only ever move within one family** — a tonal
shift, never a rainbow. There are four, split by how much contrast
whatever sits on top needs: `--grad` (headings), `--grad-cta` (buttons
and chat bubbles), `--grad-orb` (lit spheres), `--grad-vivid`
(decoration with no text on it).

Light mode = bone paper, navy ink. Dark mode inverts it. Components never
name a raw colour — they use the role tokens (`--ink`, `--surface`,
`--accent-1…4`, `--signal`, `--on-grad`, `--on-soft`), so changing a brand
colour in one place re-themes both modes, including the canvas particles
and the Konami confetti, which read the same tokens from JS.

## Structure

```
index.html            markup — one <section data-scene> per scene
css/style.css         base styling: tokens, nav, buttons, dialogs (light default,
                      dark via [data-theme], RTL via [dir]); vault.html uses it too
css/cinema.css        the scenes, the poster and the HUD — static layout by
                      default, layered/pinned under html.cine
js/data.js            your content — edit this
js/data.ar.js         the Arabic overlay on top of it
js/i18n.js            language engine + the UI string dictionary
js/particles.js       background canvas animation
js/ai-assistant.js    the assistant's "brain" (bilingual keyword intents)
js/poster.js          scene 00, the waving poster — every glyph drawn in code
js/cinema.js          scenes 01–07: the GSAP ScrollTrigger timelines + the HUD
js/app.js             rendering + all interactions
js/vendor/            GSAP 3.15 + ScrollTrigger, vendored (see below)
assets/               résumé, project videos, the newspaper clipping
```

Load order matters: GSAP → `data.js` → `data.ar.js` → `i18n.js` → the
rest, and `I18N.init()` runs before any rendering. `cinema.js` must load
before `app.js`, which calls `Poster.mount()` and then `Cinema.init()`
once the content is rendered.

No npm install, no build step — just open the file. The one library,
GSAP (free under its [standard license](https://gsap.com/standard-license)),
is vendored in `js/vendor/` rather than pulled from a CDN, so the site
still works offline and from `file://`. To update it, replace the two
files with the ones from a newer `gsap` package's `dist/` folder and bump
their `?v=`.
