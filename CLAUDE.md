# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **static portfolio website** for Lamis GHOUALMI (Ph.D. in Computer Science) hosted on GitHub Pages. It is based on the "Prologue" template by HTML5 UP. There is no build system — all files are served directly as-is.

## No Build Process

- No package manager, no npm/yarn, no bundler (webpack, Vite, etc.)
- No SASS compilation (a `/assets/sass/` directory exists but is not actively compiled — edit `assets/css/main.css` directly)
- To preview locally, open `index.html` in a browser or use any static file server (e.g., `python -m http.server 8080`)
- Deployment is automatic via GitHub Pages on push to `main`

## Architecture

**Single-page layout** with a sticky sidebar (desktop) / hamburger menu (mobile):

- `index.html` — the entire site: Intro, About, Portfolio, and Contact sections
- Project detail pages (`Covid19.html`, `CustomerAnalysis.html`, `MarketingData.html`, `MexicoRestaurantRating.html`, `Teaching.html`) are standalone HTML files linked from the portfolio section in `index.html`
- `indexReferance.html` — unused original template reference; do not modify

**JavaScript stack** (all jQuery-based):
- `assets/js/main.js` — site initialization: breakpoint setup, page-load animation, nav scroll behavior, mobile panel toggle
- `assets/js/util.js` — jQuery plugins: `navList()`, `panel()`, `placeholder()`, `prioritize()`
- Third-party (minified, do not edit): `jquery.min.js`, `jquery.scrollex.min.js`, `jquery.scrolly.min.js`, `browser.min.js`, `breakpoints.min.js`

**CSS:**
- `assets/css/main.css` — all custom styles (~8000 lines); custom flexbox grid, responsive breakpoints, animations
- `assets/css/fontawesome-all.min.css` — Font Awesome icons (minified, do not edit)

**Responsive breakpoints** (defined in `main.css` and referenced in `main.js`):
- `wide`: 961–1880px
- `normal`: 961–1620px
- `narrow`: 961–1320px
- `narrower`: 737–960px
- `mobile`: ≤736px

## Key Patterns

- Navigation links (`#top`, `#about`, `#portfolio`, `#contact`) use jQuery Scrolly for smooth scrolling and jQuery Scrollex to highlight the active nav item
- The contact form in `index.html` is commented out; re-enabling it requires a backend service (the README suggests formspree.io)
- Analytics: Clicky Analytics script is embedded at the bottom of `index.html`
- Images live in `/images/`; Font Awesome webfonts live in `assets/webfonts/`
- License: CC-BY-3.0 — the HTML5 UP attribution in the footer of `index.html` must be kept
