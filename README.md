# pjaol.github.io

Root site for https://pjaol.github.io. Plain HTML, CSS and JS. No build step.

- `index.html` page content
- `assets/style.css` styles (Golden Record theme)
- `assets/app.js` pulsar map, mission clock, project grid, easter egg
- `assets/SlideMarks-Regular.woff2` SlideMarks webfont (SIL OFL 1.1) for the live demo

Project subsites (`/SlideMarks/`, `/safeflow/`) are served from their own repos and are not affected by this one.

Local preview: `python3 -m http.server 8000`

To add a project to the pulsar map edit `RAYS` in `assets/app.js`. To add a repo card edit `REPOS`.
