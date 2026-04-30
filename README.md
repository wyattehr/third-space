# Third Space

Third Space is starting as a small shared text space. Anyone who opens the page can edit the same text box, and the server keeps the latest version in `data/space.json`.

## Run it

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## What this teaches

- `public/index.html` is the page structure.
- `public/styles.css` controls the visual design.
- `public/app.js` runs in the browser, loads the shared text, and saves edits.
- `server.js` serves the website and exposes the `/api/space` API.
- `data/space.json` is the first simple database.
- `public/` can be deployed as a static GitHub Pages site.

This is intentionally small. The next natural steps are user identity, community pages, real-time updates with WebSockets, and location-gated participation.

## GitHub deployment

The `public/` folder can be hosted on GitHub Pages as a static website. The browser will try the local Node API first, and if it is unavailable it falls back to local storage so the site remains interactive.

To deploy, push to `main` and let the workflow in `.github/workflows/deploy-pages.yml` publish the static `public/` site to GitHub Pages.
