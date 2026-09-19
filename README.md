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
- `css/style.css` → CSS variables at the top (`--accent-1` etc.) control
  the whole palette if you want a different vibe than pink/coral/gold.

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
