# Lucky Mark Abitong — Portfolio Website

Single-page static portfolio for **Lucky Mark M. Abitong**, targeting Executive Assistant / remote administrative roles with US, UK, and AU employers.

## Stack

- Plain **HTML / CSS / JavaScript** — no build step
- **"Dark Quiet" editorial theme** — #101012 canvas, #ECECEA type, Inter Tight thin display, hairline borders, pill buttons
- Hosted on **GitHub Pages**

## Structure

```
portfolio/
├── index.html          # All sections, semantic HTML
├── css/style.css       # Mobile-first, responsive styles
├── js/main.js          # Mobile menu, smooth scroll, scrollspy
├── assets/             # Resume PDF, screenshots, favicon
└── README.md
```

## Sections

1. Hero (headline, contact links, CTAs)
2. Professional Summary
3. Skills
4. AI-Assisted Projects
5. Experience
6. Remote Work Setup
7. Education
8. Contact

## Run locally

Open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repo (e.g. `portfolio`)
2. Repo → **Settings → Pages → Source: Deploy from a branch**
3. Branch: `main` / root → **Save**
4. Live at `https://<your-username>.github.io/portfolio/`

## Build phases

- [x] Phase 1 — Setup & skeleton (nav, sections, placeholders)
- [x] Phase 2 — Content (real copy from resume, outcomes, dates)
- [x] Phase 3 — Styling polish
- [x] Phase 4 — Interactivity (scroll-reveal, menu behavior, Formspree-ready form)
  - [ ] **Manual step:** create a free form at [formspree.io](https://formspree.io), replace `YOUR_FORM_ID` in `index.html`
- [x] Phase 5 — Assets (resume PDF, favicon, OG image, project mockups)
  - `assets/resume_Lucky_Mark_Abitong.pdf` — exported from your DOCX
  - `assets/favicon.png`, `assets/og-image.png` — regenerate with `gen_images.ps1` (workspace root) if you change your headline
- [ ] Phase 6 — Deploy to GitHub Pages
