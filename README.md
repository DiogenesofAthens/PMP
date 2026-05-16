# Prince of Mulberry Productions

Coming soon page for Prince of Mulberry Productions — a film production company named after the intersection of Prince St. and Mulberry St. in Nolita, New York.

**Live site:** https://www.princeofmulberry.com/ &nbsp;·&nbsp; **GitHub:** https://github.com/DiogenesofAthens/PMP

---

## Overview

The entire site is a single self-contained `index.html` file — no framework, no build step, no dependencies. Open it directly in a browser or deploy to Vercel as-is.

---

## Tech

- **Vanilla HTML / CSS / JS** — everything inline in one file
- **Canvas API** — film grain effect rendered at ~12fps via `requestAnimationFrame`
- **CSS** — radial + linear gradient vignette layered over the video background
- **Google Fonts** — Cormorant Garamond and Cormorant SC (italic, small caps, weights 300/400)

---

## Structure

Three z-index layers stacked on top of each other:

| z-index | Element | Purpose |
|---|---|---|
| 0 | `<video>` | Full-screen teaser, autoplay muted loop |
| 1 | `.vignette` | CSS gradient overlay darkening the edges |
| 2 | `#grain` canvas | JavaScript film grain at low opacity |
| 3 | `.ui` | Wordmark, "Coming Soon / MMXXVI", sound toggle, email form |

---

## Running Locally

Open `index.html` in any browser. No server required — the video is referenced as a relative path and will load from the same directory.

---

## Deployment

Deployed on Vercel as a static site. Settings: Framework = None, build/install/output fields all empty. `teaser_v1.mp4` is served directly from Vercel's CDN alongside the HTML file.
