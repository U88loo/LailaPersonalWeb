# laila.OS — personal site

A self-contained, no-build-step personal website. Open `index.html` directly
in a browser, or serve it with anything static.

## What's in here

- **Boot sequence** — a fake terminal boot log plays once per browser
  session on load (skip with any key). Replay it anytime from the footer.
- **Custom cursor** — a lagging ring + dot, disabled automatically on
  touch devices.
- **Generative background** — a lightweight canvas particle field that
  drifts and links nearby nodes, reacting subtly to the mouse.
- **laila.ai** — a floating command palette (press `Ctrl`/`Cmd + K`, click
  the orb bottom-right, or the "ask laila.ai" nav button). It's a
  rule-based keyword matcher, not a real model call — see
  `js/ai-assistant.js`. There's a commented `askRemote()` stub in that
  file if you want to wire it up to a real API later.
- **Konami code** — try `↑ ↑ ↓ ↓ ← → ← → B A` anywhere on the page.
- **Light/dark toggle** — top-right icon button; preference is remembered.

## Make it yours

Almost everything is in **`js/data.js`** — name, bio, location, email,
social links, skills, projects, and jokes. Edit that one file first.

Then:
- `siteData.resumeUrl` → point it at a real PDF.
- `siteData.social` → replace the placeholder URLs.
- `css/style.css` → the palette lives in the `:root` block at the top.

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
and chat bubbles), `--grad-orb` (the hero sphere), `--grad-vivid`
(decoration with no text on it).

Light mode = bone paper, navy ink. Dark mode inverts it. Components never
name a raw colour — they use the role tokens (`--ink`, `--surface`,
`--accent-1…4`, `--signal`, `--on-grad`, `--on-soft`), so changing a brand
colour in one place re-themes both modes, including the canvas particles
and the Konami confetti, which read the same tokens from JS.

## Structure

```
index.html          markup
css/style.css        all styling (light theme default, dark via [data-theme])
js/data.js            your content — edit this
js/particles.js       background canvas animation
js/ai-assistant.js    the assistant's "brain" (keyword intents)
js/app.js              rendering + all interactions
```

No dependencies, no npm install, no build step — just open the file.
