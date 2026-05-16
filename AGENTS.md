# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project

**Prince of Mulberry Productions** — a coming-soon page for a film production company named after the intersection of Prince St. and Mulberry St. in the Nolita neighborhood of New York City.

## Stack

This is a single-file static site — no framework, no build step, no dependencies. The entire site is `index.html`. Open it directly in a browser or deploy to Vercel as-is.

## Architecture

`index.html` is self-contained: inline CSS, inline JavaScript, and a Google Fonts import. The page has three layers stacked via `z-index`:

1. **`<video>`** (z-index 0) — `teaser_v1.mp4` plays full-screen, autoplayed muted, looping
2. **`.vignette`** (z-index 1) — a CSS radial + linear gradient overlay that darkens the edges
3. **`#grain` canvas** (z-index 2) — JavaScript renders random noise at ~12fps via `requestAnimationFrame` to simulate film grain (`mix-blend-mode: overlay`, low opacity)
4. **`.ui`** (z-index 3) — the actual UI: wordmark (top center), "Coming Soon / MMXXVI" (center), sound toggle + email form (bottom)

The sound toggle flips `video.muted` and swaps two inline SVG icons. The email form has no backend — submission disables the inputs and changes the button label to "Thank You".

## Fonts

Cormorant Garamond (italic, weight 300/400) and Cormorant SC (small caps, weight 300/400) loaded from Google Fonts. These are the only two typefaces used throughout.

## Deployment

Hosted on Vercel as a static site. Settings: Framework = None, build/install/output fields all empty. `teaser_v1.mp4` is served directly from Vercel's CDN.

## What's not wired up yet

- Email capture has no backend. To activate it, connect the form to a service (e.g. Resend, Mailchimp, ConvertKit) and add a `fetch` call in `handleSignup()`.
- No favicon yet.
